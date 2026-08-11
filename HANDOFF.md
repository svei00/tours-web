# HANDOFF — Sandoval Tours

**Sitio de marketing para operador de tours en Puerto Vallarta.**

Este documento es la única fuente de verdad para la implementación. Está escrito para
que una sesión fresca de IA (sin acceso a la conversación de arquitectura) pueda
construir el sitio completo sin preguntar nada más.

- **Arquitectura:** cerrada (Opus, agosto 2026)
- **Implementación:** Sonnet 5, sesión nueva
- **Repo:** `D:\repos\tours-web`
- **Estado:** listo para Fase A del build

---

## ÍNDICE

1. [Contexto del negocio](#1-contexto-del-negocio)
2. [Reglas de trabajo (leer antes de tocar nada)](#2-reglas-de-trabajo)
3. [Principios de diseño y lista de prohibiciones](#3-principios-de-diseño)
4. [Stack y decisiones técnicas con justificación](#4-stack-y-decisiones-técnicas)
5. [Modelo de contenido (CMS)](#5-modelo-de-contenido)
6. [Arquitectura del sitio](#6-arquitectura-del-sitio)
7. [Design tokens — fuente de verdad](#7-design-tokens)
8. [Plan técnico de SEO](#8-plan-técnico-de-seo)
9. [Performance e imágenes](#9-performance-e-imágenes)
10. [Analítica](#10-analítica)
11. [Páginas legales](#11-páginas-legales)
12. [Estructura de carpetas](#12-estructura-de-carpetas)
13. [Estilo de código](#13-estilo-de-código)
14. [Secuencia de construcción](#14-secuencia-de-construcción)
15. [Textos para el cliente](#15-textos-para-el-cliente)
16. [Pendientes y dependencias del cliente](#16-pendientes-y-dependencias)

---

## 1. CONTEXTO DEL NEGOCIO

**Sandoval Tours** — operador/intermediario de tours turísticos en Puerto Vallarta y
Bahía de Banderas, Jalisco, México.

**Modelo de negocio: es un BROKER.** No es dueño de los barcos ni de las lanchas.
Revende y coordina tours operados por terceros. Esto tiene tres consecuencias
arquitectónicas que aparecen a lo largo del documento:

- El esquema del CMS necesita una entidad `Partner` (operador aliado) opcional por tour.
- Las fotos probablemente pertenecen a los operadores aliados, no al cliente — hay un
  flujo de permisos por escrito que debe resolverse antes del lanzamiento.
- El posicionamiento correcto NO es "somos dueños de la flota" sino **"sabemos cuáles
  valen la pena"**. Curaduría y conocimiento local. Esa es la historia que debe contar
  la copy.

**Catálogo inicial (6 tours):**

| Tour | Tipo |
|---|---|
| Barco Pirata | Embarcación / show |
| Ánimas – Arcos – Colomitos – Madagascar | Lancha / playas |
| Cascadas El Edén | Naturaleza / río |
| Islas Marietas | Lancha / snorkel |
| Parque Acuático Splash Inn | Parque de terceros |
| Yelapa | Lancha / pueblo |

> Verificar la ortografía exacta de "Madagascar" con el cliente — el volante original
> dice "Magadascar", probablemente un error de dedo.

**Posicionamiento y precio.** Precios en MXN, rango accesible (referencias del volante:
$100 MXN por persona en el parque acuático, $800 MXN todo incluido en el tour de
Ánimas). Venta impulsada por promociones. **No es un operador de lujo.**

Esto define la estética: **premium en el oficio, no en el lujo.** Fotografía real,
tipografía con carácter, mucho espacio en blanco, carga rápida, precios visibles y
honestos. NO: dorados, serifas elegantes, lenguaje de "experiencias a medida",
"concierge", "bespoke". El objetivo visual es un outfitter local bien hecho, no un
resort.

**Canal de conversión: WhatsApp.** No hay formulario de reserva, no hay carrito, no hay
pasarela de pago. Toda la conversión ocurre por WhatsApp. Dos números activos. Esto es
central en el diseño, no un detalle: el botón de WhatsApp es el elemento más importante
de cada página.

**Público:** turismo nacional mexicano + turistas de EE.UU. y Canadá (Puerto Vallarta es
destino internacional). De ahí el requisito bilingüe.

**Este sitio también es la plantilla base** para futuros clientes de Svei. La estructura
(esquema, SEO, pipeline de imágenes, i18n, tokens) es reutilizable; el **aspecto visual
se rehace por cliente**. Ver §7 para el mecanismo de re-tematización.

---

## 2. REGLAS DE TRABAJO

### Git — IMPORTANTE, esto sobrescribe cualquier otra instrucción

**NO crear ramas. Nunca. Por ningún motivo.**

Trabajar siempre directamente en `main`. No crear ramas por fase, ni por spike, ni "por
seguridad". El brief original de arquitectura pedía una rama por fase; **esa instrucción
queda anulada** por preferencia explícita y permanente del desarrollador.

- No hacer `commit` sin que Svei lo pida explícitamente en el momento.
- No hacer `push`, `merge` ni `deploy` sin una autorización nueva y específica. Una
  aprobación previa no se hereda a la siguiente acción.
- Al terminar un bloque de trabajo: dejar los cambios listos y **sugerir el mensaje de
  commit** para que Svei lo pegue.
- El mensaje sugerido **nunca** lleva el footer de "Co-Authored-By: Claude" ni
  "Generated with Claude Code", y **nunca** usa comillas dobles (Svei envuelve el mensaje
  en comillas dobles en la terminal; una comilla doble interna lo rompe). Usar comillas
  simples o apóstrofes.

GitHub aquí cumple una sola función: poder regresar a una versión anterior si algo se
rompe.

### Flujo de aprobación

Proponer antes de implementar cambios grandes. Svei quiere crítica honesta, no
validación automática. Si algo en este documento está mal o hay una mejor forma de
hacerlo, decirlo.

### `reference/`

La carpeta `reference/` contiene el volante promocional actual del cliente. **Va en
`.gitignore`.** Es material de terceros usado como contexto interno, no un activo del
proyecto, y no debe subirse a un repo público.

---

## 3. PRINCIPIOS DE DISEÑO

El objetivo declarado es que el sitio se vea **premium y que NO parezca plantilla ni
hecho por IA**. Estos diez principios son la traducción operativa de ese objetivo.

**1. Una fotografía domina la pantalla.** Los mejores sitios de turismo dejan que una
sola imagen se adueñe del viewport. El volante actual del cliente hace lo contrario:
doce fotos peleándose en un collage. La densidad visual se lee como barato; la
contención se lee como confianza.

**2. Romper la retícula a propósito.** Este es el punto más importante de la lista. Los
sitios generados por IA usan *padding idéntico, radio de borde idéntico, alturas de
tarjeta idénticas* en todas partes, y la página queda plana. La solución no cuesta nada:
una tarjeta que abarca dos columnas, una imagen que se sale del contenedor, bloques de
texto que no empiezan todos en el mismo margen. **Nunca una fila de tres tarjetas
iguales.**

**3. La tipografía es una decisión, no un default.** Inter por default es una de las
señales más reconocibles de sitio autogenerado. Ver §7.

**4. Fotos tratadas con criterio, no solo "buenas".** Lo que hace que un set de fotos se
sienta curado no es la calidad individual sino la **coherencia**: mismo tratamiento de
color, mismo contraste, como si las hubiera tomado la misma mano. Un preset de Lightroom
aplicado a toda la biblioteca logra esto.

**5. Movimiento con intención, poco.** Unas cuantas micro-interacciones bien elegidas se
leen como oficio; que todo se mueva se lee como plantilla. Respetar
`prefers-reduced-motion`.

**6. Precio y datos concretos al frente.** Este cliente compite por valor. Esconder el
precio detrás de "consultar" es un gesto de marca de lujo que aquí resta. Precio,
duración, qué incluye y punto de encuentro visibles antes del clic.

**7. Señales de confianza visibles, nunca colapsadas.** Un broker que no es dueño de las
lanchas necesita más confianza, no menos. Reseñas al frente, operador aliado nombrado
abiertamente (pendiente de confirmar con el cliente), años operando.

**8. Una sola acción de conversión, en todos lados, imposible de no ver.** WhatsApp.
Barra fija en móvil, presente en cada tarjeta y cada página de detalle, con mensaje
prellenado.

**9. Mobile-first de verdad.** El artefacto de referencia es un volante de WhatsApp; esta
audiencia vive en el celular. CTA al alcance del pulgar, video vertical como formato de
primera clase, barra de contacto fija.

**10. El espacio en blanco es un material.** Los operadores de presupuesto amontonan
porque sienten que cada pixel debe vender. El espacio es lo que comunica que al negocio
le va bien.

### LISTA DE PROHIBICIONES — no construir nada de esto

**Hábitos del volante actual que hay que romper:**

- Collages de muchas fotos pequeñas
- Barras de etiqueta sólidas con texto en mayúsculas encima de las imágenes
- Texto promocional rotado tipo "sticker"
- Números de teléfono en rojo como elemento de diseño
- **Texto promocional quemado dentro de los archivos de imagen** — las promociones son
  datos, van en un componente editable
- Cian brillante con texto blanco encima (no alcanza contraste; por eso el volante
  necesita tipografía tan pesada)

**Señales de "hecho por IA" — evitar explícitamente:**

- Tipografía Inter por default
- Filas uniformes de tres tarjetas con el mismo radio y el mismo padding en todo el sitio
- Fotografía de stock de cualquier tipo
- **Cualquier imagen, ilustración o ícono generado por IA** — regla dura del cliente
- Copy vaga: "Descubre experiencias inolvidables", "Tu viaje comienza aquí". Esta
  fraseología genérica es una de las señales principales, precisamente porque encaja en
  cualquier negocio
- El stack por default: hero → tres tarjetas de features → testimonios → precios → CTA

**Clichés de sitios de turismo:**

- Video de fondo a pantalla completa con autoplay (destruye datos móviles y LCP)
- Parallax porque sí
- Un mapa mundial con pines, para un negocio que opera en una sola bahía

---

## 4. STACK Y DECISIONES TÉCNICAS

| Decisión | Elección | Justificación |
|---|---|---|
| Framework | **Next.js (App Router)** | Confirmado por el cliente. Server Components por default mantienen el JS bajo |
| CMS | **Sanity** | Ver abajo |
| Hosting | **Vercel** (tier gratuito) | Pareja natural de Next.js, óptimo para CWV |
| i18n | **next-intl** | Enrutamiento por locale + segmentos traducidos |
| Video | **Embeds de YouTube** | Ver abajo |
| Analítica | **GA4** vía `@next/third-parties` | Carga diferida correcta de fábrica |
| Traducción | **DeepL API (tier gratuito)** vía función serverless | Ver §5 |
| Dominio | `.com` o `.com.mx` vía Namecheap o Cloudflare | Registrador confiable, precio honesto |

### Por qué Sanity

**Presupuesto: cero pesos.** El cliente no tiene dinero para infraestructura; su
presupuesto va a publicidad, no a hosting.

Sanity es la única opción de tier gratuito que incluye **a la vez** una interfaz de
edición hospedada **y un CDN de imágenes con transformaciones al vuelo** (recorte,
conversión de formato, calidad, todo por parámetros de URL). Para un sitio de turismo
saturado de fotos y sin presupuesto de infraestructura, ese segundo punto es la
diferencia entre gratis y necesitar un servicio de imágenes de pago.

**Alternativas descartadas y por qué:**

- **Payload** — mejor propiedad de los datos a largo plazo (vive en el repo, base de
  datos propia), pero necesita una instancia de Postgres y almacenamiento de archivos, y
  los tiers gratuitos de esos son la parte frágil. Una base de datos suspendida un
  domingo es el teléfono de Svei sonando, no el de Vercel. **Revisar si aparece
  presupuesto.**
- **Strapi** — necesita un servidor; el hosting gratuito para eso es frágil.
- **Decap / Tina (basados en git)** — verdaderamente gratis, pero subir fotos desde un
  celular hacia git es mala experiencia, infla el repo, y el cliente necesitaría cuenta
  de GitHub. Incompatible con el requisito duro de independencia del cliente.
- **Storyblok** — segundo lugar real. Su edición visual gusta mucho a clientes no
  técnicos. Considerar si la ergonomía de edición resulta ser más importante que la
  ergonomía de desarrollo.

**Riesgos aceptados y su mitigación:**

- Las cuotas del tier gratuito son reales. Una campaña viral en Facebook podría disparar
  el consumo de ancho de banda de assets. **Verificar los límites vigentes al momento de
  construir** — no asumir cifras. Documentar la ruta de upgrade.
- El contenido vive en la nube de Sanity. Mitigación: `sanity dataset export` programado
  como ritual de respaldo, documentado para Svei.

### Por qué embeds de YouTube y no video nativo

El cliente tiene los videos en su celular y no tiene presupuesto de almacenamiento. La
subida nativa requiere CDN, que requiere dinero que no existe.

**Flujo:** el cliente abre un canal de YouTube, sube desde el celular (público o no
listado), pega la liga en el CMS.

**El detalle que casi siempre se pasa por alto: un celular graba en vertical.** Un video
vertical dentro de un embed 16:9 estándar deja barras negras a los lados y se ve barato,
lo cual pelea directamente contra el objetivo estético. Por eso `videoEmbed` tiene un
campo `orientation` obligatorio, y por eso existe la tira de video vertical tipo reels
como sección propia.

**Siempre con fachada de clic para reproducir.** Un embed crudo de YouTube descarga más
de un megabyte antes de que el visitante decida siquiera ver algo.

---

## 5. MODELO DE CONTENIDO

### Reglas que sigue el esquema

1. **Lo que no depende del idioma se guarda una sola vez.** Precio, duración, fotos,
   ubicación, teléfono: un solo valor para ambos idiomas. Solo las palabras se duplican.
2. **El inglés cae de vuelta al español cuando está vacío.** El sitio nunca renderiza un
   campo en blanco. Jamás.
3. **Las traducciones automáticas quedan marcadas.** El booleano `enIsMachineDraft` pasa
   a `false` en cuanto un humano edita el campo, para poder ver qué falta revisar.
4. **La validación bloquea la entrada mala, no la advierte.** Una foto de baja resolución
   no se puede guardar. Esta es la única defensa real contra el problema de calidad
   fotográfica.
5. **Nada importante se quema dentro de una imagen.** Precios y promociones son datos.

### Objetos reutilizables

**`localeString` / `localeText` / `localeBlock`**

```
{
  es: string          // requerido
  en: string          // opcional
  enIsMachineDraft: boolean   // true si vino del botón de traducir
}
```

**`richImage`**

```
{
  asset: image          // hotspot activado
  alt: localeString     // REQUERIDO (accesibilidad + SEO)
  caption: localeString // opcional
}
```

**`videoEmbed`**

```
{
  youtubeUrl: string                        // validado con regex de YouTube
  title: localeString
  orientation: 'horizontal' | 'vertical'    // REQUERIDO
  customThumbnail: image                    // opcional
}
```

### Documento: `tour`

| Campo | Tipo | Notas |
|---|---|---|
| `title` | localeString | Requerido |
| `slug` | slug localizado | Auto desde el título, editable. ES y EN separados |
| `shortDescription` | localeText, máx 160 | Sirve también como meta description |
| `longDescription` | localeBlock | Texto enriquecido |
| `heroImage` | richImage | Requerido. **Mínimo 2400px lado largo** |
| `gallery` | richImage[] | Mínimo 4, advierte por debajo de 8. **Mínimo 1600px** |
| `videos` | videoEmbed[] | Opcional |
| `priceAmount` | number | |
| `priceCurrency` | 'MXN' \| 'USD' | Default MXN |
| `priceUnit` | localeString | "por persona" |
| `priceNote` | localeString | "aplican términos y restricciones" |
| `durationHours` | number | |
| `departureTimes` | string | |
| `meetingPoint` | localeString | |
| `meetingPointMapUrl` | url | Liga a Google Maps |
| `includes` | localeString[] | Qué incluye |
| `excludes` | localeString[] | Qué no incluye |
| `whatToBring` | localeString[] | Qué llevar |
| `minAge` | number | Opcional |
| `suitability` | localeString | Opcional |
| `tags` | reference[] → `tag` | |
| `operator` | reference → `partner` | Opcional — el caso broker |
| `whatsappMessage` | localeString | Autogenerado del título, editable |
| `featured` | boolean | Elegible para el carrusel del home |
| `displayOrder` | number | |
| `visible` | boolean | **"Mostrar en el sitio"** |
| `seo` | object | `metaTitle`, `metaDescription`, `ogImage` — todos opcionales |

### Documento: `review`

| Campo | Tipo | Notas |
|---|---|---|
| `authorName` | string | Requerido |
| `authorLocation` | string | "Guadalajara, México" — sube credibilidad |
| `source` | 'google' \| 'tripadvisor' \| 'facebook' \| 'whatsapp' \| 'directo' | |
| `sourceUrl` | url | Liga a la reseña real cuando exista |
| `rating` | number 1–5 | |
| `quote` | **text plano, NO localizado** | Tal como la persona lo escribió |
| `language` | 'es' \| 'en' | Define el atributo `lang` del bloque |
| `date` | date | |
| `relatedTour` | reference → `tour` | Opcional |
| `visible` | boolean | **"Mostrar en el sitio"** |
| `featured` | boolean | Aparece en el home |

> **El botón de traducir está DESACTIVADO en este tipo de documento.** Traducir el
> testimonio de alguien cambia lo que esa persona dijo. Además, las reseñas en idiomas
> mezclados son en sí mismas una señal de confianza: demuestran clientes internacionales
> reales.

> **Riesgo:** los testimonios escritos a mano son fáciles de inventar y los lectores lo
> perciben. Nombres reales, fuentes reales y una liga al perfil de Google son lo que los
> mantiene creíbles.

### Documento: `partner`

| Campo | Tipo | Notas |
|---|---|---|
| `name` | string | |
| `description` | localeString | Opcional |
| `logo` | image | Opcional |
| `showPublicly` | boolean | Decisión de transparencia — pendiente del cliente |
| `photoPermissionOnFile` | boolean | ¿Hay permiso por escrito? |
| `permissionNote` | text | Dónde está guardado ese permiso |

Los últimos dos campos convierten el tema de derechos de autor en una lista de
verificación que vive dentro del CMS.

### Documento: `promotion`

`title`, `description`, `badgeText`, `appliesTo` (referencias a tours, o todos),
`startDate`, `endDate`, `visible`.

**Las promociones se ocultan solas cuando pasa `endDate`.** Una "oferta por tiempo
limitado" que sigue ahí ocho meses después destruye la confianza, y esperar que el
cliente se acuerde de quitarla es esperar demasiado.

### Documento: `tag`

`name` (localeString), `slug`, `description` (localeString, para las páginas de
categoría), `visible`.

### Singleton: `siteSettings` — el panel del cliente

- **Contacto:** `whatsappPrimary`, `whatsappSecondary`, `phones[]`, `email`
- **Dirección:** calle, ciudad, estado, CP, país, y `geo` (lat/lng) — los dos últimos
  son necesarios para el schema de LocalBusiness
- `openingHours`
- **`googleBusinessProfileUrl`**
- `facebookUrl`, `instagramUrl`, `tiktokUrl`
- `heroHeadline` (localeString), `heroSubheadline` (localeString)
- `heroSlides` (richImage[], máximo 5)
- `reviewsSectionVisible` (boolean) — interruptor de la sección completa
- `defaultSeo`

### Singleton: `brand` — el panel de Svei, no anunciado al cliente

`businessName`, `logo`, `logoDark`, `primaryColor` (hex con selector de color),
`accentColor`, `headlineFont` (lista curada), `bodyFont` (lista curada), `radiusScale`,
`favicon`.

**La escala completa de color se DERIVA del hex primario en build, nunca se guarda.** Eso
es lo que hace que pegar un hex re-tematice el sitio entero de forma segura. Ver §7.

> **Sobre "oculto":** en el tier gratuito, ocultar probablemente signifique *no decirle al
> cliente que existe* más que control real de permisos. Verificar qué controles de rol
> incluye el plan gratuito vigente. Para este modelo de amenaza es suficiente: el riesgo
> es que el cliente ponga el sitio feo, no un atacante.

### Validación que BLOQUEA (no advierte)

| Regla | Mensaje |
|---|---|
| Hero por debajo de 2400px lado largo | Rechazado, con instrucciones en español de cómo mandar fotos sin comprimir |
| Imagen de galería por debajo de 1600px | Rechazado |
| Falta alt en español | Rechazado |
| `shortDescription` con más de 160 caracteres | Rechazado |
| URL de YouTube que no cumple el patrón | Rechazado |
| Menos de 4 imágenes en la galería | No se puede publicar |

### El botón de traducir

Un botón en el Studio manda el campo en español a la API de DeepL y llena el campo en
inglés, marcándolo como `enIsMachineDraft: true`. El cliente puede editarlo o dejarlo.

- La llave de API **no puede vivir en el navegador**. Va detrás de una función
  serverless en Vercel (`/api/translate`), tier gratuito.
- El tier gratuito de DeepL es enorme comparado con seis tours.
- **La UI debe mostrar visiblemente el estado de "borrador automático"** hasta que un
  humano edite el campo.
- **Desactivado en el tipo `review`.**

> **Advertencia realista:** la traducción automática maneja bien las descripciones
> factuales (duración, qué incluye, punto de encuentro) y mal la **voz de venta**. Los
> titulares y los nombres de tours necesitan pasada humana. En la práctica esa persona es
> Svei, una vez, en el lanzamiento. Presupuestar una hora.

### UX del Studio para un cliente no técnico

- **Todas las etiquetas y descripciones en español.**
- Cuatro secciones en la barra lateral: **Tours · Reseñas · Promociones · Configuración**.
  `brand` deliberadamente ausente de esa estructura.
- Previsualizaciones de documento con miniatura del hero y una insignia de
  visible/oculto, para poder escanear la lista y ver de inmediato qué está publicado.
- El interruptor se llama **"Mostrar en el sitio: Sí / No"**, en lugar de depender del
  draft/publish nativo de Sanity, que es un concepto más que el cliente tendría que
  aprender.

---

## 6. ARQUITECTURA DEL SITIO

### Mapa de páginas

Todas las rutas viven bajo `/[locale]`, con `es` como default.

| Ruta (es / en) | Propósito |
|---|---|
| `/es` · `/en` | Home |
| `/es/tours` · `/en/tours` | Listado, filtrable por tag |
| `/es/tours/[slug]` · `/en/tours/[slug]` | Detalle del tour — la página que vende |
| `/es/tours/categoria/[tag]` · `/en/tours/category/[tag]` | Página de categoría. Valor SEO real: es lo que posiciona para "tours en lancha Puerto Vallarta" |
| `/es/nosotros` · `/en/about` | La historia de curaduría del broker |
| `/es/contacto` · `/en/contact` | Contacto |
| `/es/resenas` · `/en/reviews` | Todas las reseñas |
| `/es/privacidad` · `/en/privacy` | Aviso de privacidad — requerido |
| `/es/terminos` · `/en/terms` | Términos y condiciones |
| `/sitemap.xml`, `/robots.txt` | Generados |
| `/studio` | Sanity Studio embebido |

**Los segmentos de ruta se traducen, no solo los slugs.** `next-intl` maneja esto con un
mapa de pathnames (unas quince líneas), y significa que el sitio en inglés no tiene
palabras en español en sus URLs. Los slugs se autogeneran por idioma; el cliente nunca
los toca.

**La página `/resenas` se oculta sola del menú y del sitemap cuando hay menos de seis
reseñas visibles.** Una página de reseñas con tres entradas es peor que no tenerla.

### Decisión del carrusel del hero

**Autoplay: sí, 6 segundos — con el mensaje quieto.**

El click-through de los carruseles hero es notoriamente bajo, y la abrumadora mayoría de
la interacción cae en la primera diapositiva. Un carrusel hero es un mal dispositivo de
*navegación* pero uno bueno de *atmósfera* — y atmósfera es exactamente lo que necesita
transmitir en tres segundos una bahía llena de playas, cascadas y lanchas.

De ahí la regla que importa: **el titular y el CTA NO cambian entre diapositivas.** Un
llamado a la acción que se sustituye debajo del cursor del usuario es una de las formas
más confiables de matar una conversión. Las imágenes rotan; el mensaje y el botón de
WhatsApp se quedan quietos.

Especificaciones:
- Pausa en hover, focus y touch
- Autoplay **desactivado por completo** bajo `prefers-reduced-motion`
- Los dots son botones reales: clicables, alcanzables por teclado, `aria-current` en el
  activo
- La primera diapositiva carga con `priority`; el resto en lazy
- Máximo 5 diapositivas

### Layout del home — la asimetría

**Nunca aparece una fila de tres tarjetas iguales.** El ritmo es:

```
Hero a sangre completa (carrusel, dots, titular estático)
Trust strip (años operando · nº de tours · reseñas · liga a Google)
Tours destacados   [ 7 columnas ][ 5 columnas ]
Tours destacados   [ 5 columnas ][ 7 columnas ]   ← el peso se invierte
Tira de video vertical 9:16 — se sale del contenedor por la derecha
Reseñas            [ 4 columnas ][ 8 columnas ]
Footer
```

Esa alternancia 7/5 → 5/7 no cuesta nada construirla y es la diferencia entre "diseñado"
y "generado". Codificarla como presets de layout nombrados (`featureLeft`,
`featureRight`) para que sea una decisión reutilizable.

### Árbol de componentes

```
RootLayout — locale, <html lang>, fuentes, variables CSS de marca
├── SiteHeader — logo · nav · LanguageSwitcher · WhatsAppButton
├── main
└── SiteFooter — contacto · liga a GBP · redes · legal
    └── StickyWhatsAppBar (solo móvil)

Home
├── HeroCarousel        → CarouselDots, HeroOverlay
├── TrustStrip
├── FeaturedTours       → TourCard (alternancia 7/5)
├── CurationSection     — la historia del broker
├── VerticalVideoStrip  → YouTubeFacade
├── PromoBanner         — condicional, con auto-expiración
├── ReviewsBand         → ReviewCard
└── ContactCTA

/tours
├── TagFilterBar
├── TourGrid → TourCard
└── EmptyState

/tours/[slug]
├── TourHero            — a sangre, título, precio, duración
├── TourGallery         → Lightbox
├── TourDescription     → Prose
├── TourFacts           — incluye · no incluye · qué llevar · punto de encuentro
├── TourVideos          → YouTubeFacade
├── OperatorNote        — condicional a showPublicly
├── TourReviews         — filtradas por relatedTour
├── RelatedTours
└── StickyBookingBar    — precio + WhatsApp, fija en móvil

Primitivos
Button · Badge · Section · Container · Heading · Prose · RichImage
YouTubeFacade · Rating · LocaleLink · LanguageSwitcher · Reveal · ShareButtons
```

---

## 7. DESIGN TOKENS

**Archivo único de fuente de verdad: `src/config/brand.ts`.** Todo lo demás lo
referencia. Ningún otro archivo escribe a mano un color, un tamaño o un espaciado.

### Colores

Solo **dos hexadecimales son entradas**:

```ts
primary: '#0C5D63'   // Deep Pacific
accent:  '#E4572E'   // Sunset Coral
```

Valores semánticos fijos:

```ts
ink:      '#14201F'   // texto — casi negro con matiz verde
sand:     '#F6F1E9'   // fondo de página
white:    '#FFFFFF'   // tarjetas
muted:    '#6B7B79'   // captions, bordes, estados desactivados
whatsapp: '#25D366'   // RESERVADO — solo el CTA de WhatsApp, nada más
```

Tonos derivados del primario, solo como referencia (los genera la función, no se
escriben a mano): `trench: '#063C41'` para footer, nav y overlays sobre imagen.

**Decisiones de color que hay que respetar:**

- **Fondo arena, no blanco puro.** `#FFFFFF` como fondo de página es la señal más fuerte
  de "plantilla". Un blanco cálido se lee como dirigido de arte y hace que las
  fotografías se vean mejor, porque dejan de competir con un fondo más brillante que
  ellas.
- **Teal profundo, no el cian del volante.** Misma familia, así que sigue sintiéndose el
  mismo negocio, pero lo bastante oscuro y saturado para cargar texto blanco con
  contraste AA completo. El cian del volante no puede hacerlo; por eso esas barras
  necesitan tipografía tan pesada.
- **El verde de WhatsApp está reservado.** Aparece solo en el CTA de WhatsApp. Eso le da
  reconocibilidad instantánea a la acción principal de conversión.
- Coral y ámbar (`#F2A93B`) se ganan su lugar **solo** en precios y promociones.

### La función de derivación — el mecanismo de re-tematización

`src/lib/colors/derive-palette.ts` toma el hex primario y genera:

- La escala completa 50–900
- Los estados `hover` y `active`
- **El color de primer plano (blanco o negro) elegido automáticamente midiendo
  contraste**

**Si un hex pegado no alcanza 4.5:1 sobre una superficie de botón, el build falla con un
mensaje que lo explica.** Esa es la barandilla que hace seguro poner la perilla de
re-tematización en manos propias a las 2 de la mañana. Sin ella, pegar un amarillo
brillante produce botones ilegibles y un sitio roto en silencio.

### Tipografía

```ts
headline: 'Fraunces'
body:     'Figtree'
```

Ambas gratuitas (SIL OFL), ambas auto-hospedadas vía `next/font` — sin petición externa y
sin layout shift.

Fraunces es la elección deliberada anti-Inter: una serif variable con calidez y carácter
real, y crucialmente **no** Playfair Display, que se ha usado tanto en diseño de viajes y
bodas que hoy se lee como plantilla en sí misma. Figtree debajo es amigable y muy legible
sin competir.

Alternativa conservadora si Fraunces resulta demasiado carácter una vez puesta:
**Source Sans 3**.

Escala fluida, todo con `clamp()`:

```
display   clamp(2.75rem, 6vw,   5rem)
h1        clamp(2.25rem, 4.5vw, 3.5rem)
h2        clamp(1.75rem, 3vw,   2.5rem)
h3        clamp(1.375rem, 2vw,  1.75rem)
bodyLg    1.125rem
body      1rem
small     0.875rem
caption   0.8125rem
```

### Espaciado

Base 4px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`

Padding de sección fluido: `clamp(4rem, 10vw, 10rem)`

### Radios — deliberadamente diferenciados

Esta es la corrección directa a la señal de "mismo radio en todos lados":

```
none  0px     imágenes que van a sangre
sm    4px     insignias
md    10px    botones
lg    20px    tarjetas
pill  999px   tags, botón de WhatsApp
```

### Movimiento

```
fast 150ms · base 250ms · slow 450ms
easing: cubic-bezier(0.22, 1, 0.36, 1)
```

Toda transición vive detrás de una guarda de `prefers-reduced-motion`.

### Layout

Contenedor 1280px, variante ancha 1600px, retícula de 12 columnas. La asimetría se
codifica como presets nombrados.

### Sombras: una sola

Una elevación suave para tarjetas levantadas. El contraste entre arena y blanco hace la
mayor parte del trabajo de separación, lo que mantiene la página plana y moderna en vez
de sopa de sombras estilo 2015.

---

## 8. PLAN TÉCNICO DE SEO

### Metadata

`generateMetadata` por ruta. Plantilla de título: `%s | Sandoval Tours`. Las páginas de
tour toman el título y `shortDescription` (por eso está limitada a 160 caracteres). Las
imágenes de Open Graph salen del hero del tour vía el CDN de Sanity a 1200×630.

### hreflang — hacerlo bien

Cada página emite `es-MX`, `en` y `x-default` apuntando a español, con canonical
auto-referencial por locale.

**Las etiquetas deben ser recíprocas.** Si la página en español apunta a la inglesa pero
no al revés, Google ignora todo el conjunto. Esta es la parte que más comúnmente se
arruina en un sitio bilingüe.

### JSON-LD

**Sí:**
- **`TravelAgency`** para el negocio — el tipo correcto para un broker, mejor que
  `LocalBusiness` genérico. Debe coincidir con el Perfil de Empresa en Google carácter
  por carácter.
- **`TouristTrip`** por tour, con `offers` cargando precio, moneda y disponibilidad.
- **`BreadcrumbList`** en páginas de tour y de categoría.

**No — y aquí está el porqué:**
- **`Review` / `AggregateRating` sobre el negocio.** Google restringe el marcado de
  reseñas que un negocio muestra sobre sí mismo en su propio sitio. Mostrar testimonios
  está bien; marcarlos para perseguir estrellas arriesga una acción manual. *Verificar la
  redacción vigente de la política al construir — la ruta conservadora es correcta de
  cualquier forma.*
- **`FAQPage`.** Google restringió los resultados enriquecidos de FAQ a sitios
  gubernamentales y de salud en 2023. El marcado ya no vale prácticamente nada para un
  operador de tours.
- **`SearchAction`.** No hay buscador en el sitio. No declarar funciones que no existen.

### Botones de compartir — el límite, declarado explícitamente

**El botón de Facebook es un botón de compartir.** Abre Facebook con la página
precargada para que el visitante la publique. **NO publica automáticamente en la página
del cliente** — eso requiere acceso a la Graph API de Meta, revisión de app y manejo de
tokens, complejidad injustificada en este alcance.

Implementación: `https://www.facebook.com/sharer/sharer.php?u={url}` más etiquetas Open
Graph correctas.

**Agregar también un botón de compartir por WhatsApp** (`https://wa.me/?text={texto+url}`).
Para esta audiencia va a rendir bastante más que el de Facebook, y es el mismo trabajo.

### Perfil de Empresa en Google

- Liga prominente en el footer y en la página de contacto.
- **Consistencia NAP:** el nombre, dirección y teléfono del sitio deben coincidir
  **exactamente** con los del perfil de Google, carácter por carácter. Este es el detalle
  de SEO local con más impacto y el más fácil de arruinar.
- El schema de `TravelAgency` debe reflejar los mismos datos.
- La página de contacto lleva **una imagen estática de mapa que liga a Google Maps**, no
  un iframe embebido. Un mapa embebido es de lo más pesado que se le puede poner a una
  página, y desharía todo el presupuesto de performance por una función con la que casi
  nadie interactúa.

### sitemap.xml y robots.txt

Generados desde Sanity: solo documentos con `visible: true`, ambos locales con sus
alternates. `/resenas` queda excluida cuando hay menos de seis reseñas visibles.

---

## 9. PERFORMANCE E IMÁGENES

### Presupuesto de Core Web Vitals

| Métrica | Objetivo | Lo que la decide |
|---|---|---|
| LCP | **< 2.0s** | La imagen del hero, siempre. `priority` + preload + AVIF |
| INP | < 200ms | El carrusel y el lightbox son el único JS de cliente real |
| CLS | < 0.1 | Aspect ratio reservado en cada imagen; fuentes auto-hospedadas |
| JS inicial | < 120KB comprimido | Server Components por default; `'use client'` es la excepción |
| Imagen hero | < 200KB | Después de convertir a AVIF |

**La mayor ganancia disponible: la fachada de YouTube.** Un embed crudo descarga más de
un megabyte antes de que el visitante decida ver algo.

### Estrategia de imágenes

El CDN de Sanity hace el trabajo pesado a costo cero. Un loader personalizado de
`next/image` apunta ahí con:

```
?w={width}&auto=format&q=75&fit=max
```

`auto=format` es la ganancia gratuita: sirve AVIF o WebP según el header `Accept` del
navegador, sin paso de build y sin costo de almacenamiento. Combinado con el LQIP
integrado de Sanity para placeholders borrosos y los datos de hotspot para recortes
dirigidos, **una sola foto subida sirve correctamente al hero, a la tarjeta y a la
galería sin que el cliente recorte nada**.

`sizes` explícito por componente — deletreado aquí para que no haya que adivinar:

```
Hero            100vw
Destacado 7col  (max-width: 768px) 100vw, 58vw
Destacado 5col  (max-width: 768px) 100vw, 42vw
Grid de tarjetas (max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw
Miniatura galería (max-width: 768px) 50vw, 25vw
Video vertical  (max-width: 768px) 60vw, 20vw
```

---

## 10. ANALÍTICA

GA4 a través de `@next/third-parties`, que lo carga diferido y correctamente de fábrica.

**Eventos personalizados** — ninguno de estos se dispara automáticamente y cada uno es
una señal de conversión:

| Evento | Parámetros |
|---|---|
| `whatsapp_click` | `tour_name`, `location` (card / detail / sticky / footer) |
| `tour_view` | `tour_name`, `locale` |
| `gallery_open` | `tour_name` |
| `video_play` | `tour_name`, `orientation` |
| `share_click` | `network`, `tour_name` |

### La convención de UTM — sin esto, todo el ejercicio falla

El tráfico de Facebook sin etiquetar cae en "direct" y se difumina con el orgánico. El
objetivo declarado del cliente —separar tráfico orgánico del de anuncios— **no se cumple
sin esto**. Cada publicación promocionada necesita su liga etiquetada:

```
?utm_source=facebook&utm_medium=paid&utm_campaign=marietas-agosto
?utm_source=instagram&utm_medium=paid&utm_campaign=marietas-agosto
?utm_source=whatsapp&utm_medium=social&utm_campaign=lista-difusion
?utm_source=google&utm_medium=organic   ← esto NO se etiqueta, Google lo hace solo
```

Entregar al cliente la hoja de una página con esta convención. Ver §15.

---

## 11. PÁGINAS LEGALES

### Aviso de privacidad

**Esto no es una política de privacidad genérica.** Bajo la **LFPDPPP**, un negocio
mexicano que recaba datos personales necesita un **aviso de privacidad** con contenidos
obligatorios definidos por ley.

Secciones requeridas:

1. **Identidad y domicilio del responsable** — nombre legal completo y domicilio fiscal
2. **Datos personales que se recaban** — nombre, teléfono, correo, y los datos de
   navegación por analítica
3. **Finalidades del tratamiento** — separando primarias (atender la solicitud del tour)
   de secundarias (promociones, si aplica)
4. **Transferencias a terceros** — aquí entran los operadores aliados a quienes se pasan
   los datos de la reserva. **Para un broker esta sección no es opcional.**
5. **Medios para ejercer derechos ARCO** — acceso, rectificación, cancelación, oposición:
   a qué correo se escribe y en cuánto tiempo se responde
6. **Uso de cookies y tecnologías de rastreo** — GA4, y el pixel de Meta si algún día se
   instala
7. **Cómo se comunicarán los cambios al aviso**

> **El texto legal vinculante debe venir del cliente o de Svei.** El borrador de §15 es un
> punto de partida estructural, no asesoría legal. Svei es Contador Público y conoce este
> terreno mejor que la fuente de este documento.

Menciones específicas del sitio que el aviso debe cubrir: cookies de analítica de GA4, y
que contactar por WhatsApp inicia una conversación en una plataforma de terceros.

### Términos y condiciones

El volante ya promete "aplican términos y restricciones", así que eso necesita existir en
algún lado. Secciones a cubrir:

- **Que los tours son operados por terceros** y cuál es el rol de Sandoval Tours como
  intermediario. **Para un broker esta es la sección más importante del documento.**
- Reservas y confirmación (por WhatsApp)
- Formas de pago y anticipos
- Política de cancelación, del cliente y del operador
- Cancelaciones por clima — habitual en tours de lancha
- Edad mínima y restricciones de salud
- Qué está y qué no está incluido
- Limitación de responsabilidad
- Que los precios pueden cambiar sin previo aviso

### Aviso de cookies

**Aprobado: aviso ligero, no bloqueante.**

México no impone una barrera de consentimiento bloqueante estilo GDPR, y un modal que
bloquea daña la conversión de forma medible. El aviso es una franja discreta que liga al
aviso de privacidad, con GA4 cargando normalmente. Se descarta y no vuelve.

Si algún día corre anuncios apuntados específicamente a Europa, revisar esta decisión.

---

## 12. ESTRUCTURA DE CARPETAS

Carpetas en minúsculas y kebab-case. Sin espacios, sin acentos, sin caracteres
especiales en nombres de archivo.

```
tours-web/
├── HANDOFF.md
├── .gitignore              ← incluye reference/
├── reference/              ← volante del cliente, NO se sube
├── public/
├── sanity/
│   ├── sanity.config.ts
│   ├── desk-structure.ts
│   ├── schemas/
│   │   ├── documents/
│   │   │   ├── tour.ts
│   │   │   ├── review.ts
│   │   │   ├── tag.ts
│   │   │   ├── partner.ts
│   │   │   ├── promotion.ts
│   │   │   ├── site-settings.ts
│   │   │   └── brand.ts
│   │   └── objects/
│   │       ├── locale-string.ts
│   │       ├── locale-text.ts
│   │       ├── locale-block.ts
│   │       ├── rich-image.ts
│   │       └── video-embed.ts
│   └── lib/
│       ├── image-validation.ts
│       └── translate-action.ts
└── src/
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── tours/
    │   │   │   ├── page.tsx
    │   │   │   ├── [slug]/page.tsx
    │   │   │   └── categoria/[tag]/page.tsx
    │   │   ├── nosotros/page.tsx
    │   │   ├── contacto/page.tsx
    │   │   ├── resenas/page.tsx
    │   │   ├── privacidad/page.tsx
    │   │   └── terminos/page.tsx
    │   ├── api/translate/route.ts
    │   ├── studio/[[...tool]]/page.tsx
    │   ├── sitemap.ts
    │   └── robots.ts
    ├── components/
    │   ├── layout/
    │   ├── home/
    │   ├── tour/
    │   ├── review/
    │   └── ui/
    ├── config/
    │   └── brand.ts          ← FUENTE DE VERDAD
    ├── lib/
    │   ├── colors/derive-palette.ts
    │   ├── sanity/{client,queries,image-loader}.ts
    │   ├── seo/{metadata,json-ld}.ts
    │   └── analytics/events.ts
    ├── i18n/
    │   ├── routing.ts
    │   └── messages/{es,en}.json
    └── styles/globals.css
```

---

## 13. ESTILO DE CÓDIGO

- **Funciones pequeñas de propósito único.** Una función hace una cosa.
- **Comentarios explicativos estilo "profesor de salón de clases".** El código debe poder
  debuggearse en una sesión fresca de IA sin contexto previo. Explicar el *por qué*, no
  el *qué*.
- **Nombres en lenguaje natural, descriptivos.** `calculateAccessibleForegroundColor`, no
  `calcFg`.
- **Prohibidos los patrones ingeniosos-pero-crípticos.** Si hay que pensarlo dos veces
  para leerlo, se reescribe.
- **Archivos chicos, arquitectura modular, separación de responsabilidades.**
- Carpetas en minúsculas kebab-case. Sin espacios, acentos ni caracteres especiales.
- Server Components por default. `'use client'` es la excepción y se justifica con un
  comentario.

---

## 14. SECUENCIA DE CONSTRUCCIÓN

Cada fase debe quedar funcionando y verificada antes de pasar a la siguiente.

| # | Fase | Criterio de terminado |
|---|---|---|
| A | Scaffold + tokens + fuentes | Cambiar `primaryColor` en `brand.ts` re-tematiza el sitio entero; el build falla si el hex no alcanza AA |
| B | Esquema de Sanity + Studio | El cliente puede crear un tour completo en ambos idiomas; una foto de 800px es rechazada |
| C | Shell de layout | Header, footer, barra fija de WhatsApp, cambio de idioma funcionando en ambos locales |
| D | Listado y detalle de tours | Las páginas que venden. Galería, WhatsApp con mensaje prellenado, videos con fachada |
| E | Home | Carrusel, asimetría 7/5, trust strip, tira de video vertical |
| F | Reseñas y promociones | Interruptores de visibilidad; auto-expiración de promos |
| G | SEO | Metadata, hreflang recíproco, JSON-LD, sitemap, robots |
| H | Analítica | GA4 + los cinco eventos personalizados |
| I | Páginas legales | Aviso de privacidad, términos, franja de cookies |
| J | Pasada de performance | Lighthouse en móvil; cumplir el presupuesto de §9 |

**Empezar por A y no avanzar hasta que la perilla de re-tematización funcione.** Es el
requisito que convierte esto en plantilla reutilizable, y si se deja para el final se
descubre que medio código tiene colores escritos a mano.

---

## 15. TEXTOS PARA EL CLIENTE

Textos listos para reenviar. En español, porque el lector es el cliente.

### 15.1 — Solicitud de fotos

```
Hola. Para que la página se vea profesional necesito las fotos originales,
no las que ya circulan por WhatsApp. Te explico qué necesito:

1. Mínimo 8 fotos por tour. Entre más, mejor.

2. Que sean grandes: al menos 2400 píxeles de lado largo para las fotos
   principales. Si las tomaste con celular en buena luz y no las has
   reenviado por WhatsApp, normalmente ya cumplen.

3. De cada lugar importante, mándame una horizontal y una vertical.
   El sitio necesita las dos.

4. MUY IMPORTANTE: no me las mandes como foto normal por WhatsApp,
   porque WhatsApp las comprime y pierden calidad. Mándalas de una
   de estas formas:
   - Por WhatsApp usando el clip > Documento (no > Galería)
   - O súbelas a Google Drive y me compartes la liga
   - O por WeTransfer

5. Sin marcas de agua, sin texto encima, sin stickers y sin filtros.
   Las necesito limpias. Los precios y las promociones los vamos a poner
   en la página, no dentro de la imagen, para que tú los puedas cambiar
   cuando quieras sin pedirle nada a nadie.

6. Y lo más importante de todo: necesito que las fotos sean tuyas, o que
   tengas permiso por escrito de quien las tomó. Una página web es
   pública y aparece en Google. Si usamos fotos de otro operador o
   sacadas de internet, el dueño puede reclamar, y el reclamo te llega
   a ti, no a mí. Si hay fotos que te pasó un operador aliado, dime
   cuáles y te paso el texto para pedirle el permiso.
```

### 15.2 — Permiso al operador aliado

El cliente reenvía esto a cada operador. El objetivo es **una respuesta por escrito que
se pueda guardar** — es un registro, no un contrato.

```
Hola [nombre]. Estoy haciendo la página web de mi agencia y me gustaría
incluir el tour de [nombre del tour] que ustedes operan.

¿Me podrías mandar fotos en buena calidad y confirmarme por este mismo
medio que puedo usarlas en mi sitio web y en mis redes sociales?

Con que me contestes algo así me sirve:

"Autorizo a Sandoval Tours a usar las fotografías que le compartimos
en su sitio web y redes sociales para promocionar nuestros tours.
[Nombre] — [Empresa] — [Fecha]"

Gracias.
```

**Guardar captura o respaldo de cada respuesta.** Un mensaje de WhatsApp diciendo que sí
es muchísimo mejor que nada, y es proporcional al tamaño de este proyecto. No es una
licencia redactada por abogado.

### 15.3 — SEO orgánico vs. anuncios pagados

El cliente está confundido sobre esto. Reenviarle el texto tal cual:

```
Son CUATRO cosas distintas, con presupuestos distintos:

1. SEO ORGÁNICO — es la página web que estamos haciendo.
   Los clics son gratis. Es lento: entre 3 y 6 meses para ver
   resultados reales. No se paga nada por aparecer.

2. GOOGLE ADS — anuncios pagados en Google. Es instantáneo pero
   se paga por cada clic. Es una cuenta aparte y un presupuesto
   aparte. NO es la página web.

3. META ADS (Facebook / Instagram) — anuncios pagados en redes.
   También instantáneo, también se paga, también cuenta aparte
   y presupuesto aparte. NO es la página web.

4. PERFIL DE EMPRESA EN GOOGLE (Google Business Profile) — es
   GRATIS. Es lo que sale del lado derecho con el mapa, las fotos
   y las estrellas cuando alguien busca "tours en Puerto Vallarta".

Y esto es lo importante: para búsquedas locales como esa, el
PERFIL GRATIS DE GOOGLE mueve más la aguja que la página web.
La página web lo respalda y le da credibilidad, pero el perfil
es el que aparece primero.
```

### 15.4 — Cómo crear el Perfil de Empresa en Google

El cliente **no lo tiene**. Es gratis y es lo de mayor impacto que puede hacer esta
semana.

```
Antes que cualquier anuncio pagado, necesitas esto — y es GRATIS.

Se llama PERFIL DE EMPRESA EN GOOGLE (Google Business Profile).
Es lo que aparece con mapa, fotos, horarios y estrellas cuando
alguien busca "tours en Puerto Vallarta".

POR QUÉ IMPORTA MÁS QUE LA PÁGINA WEB AL PRINCIPIO:
Cuando un turista busca desde su celular, Google le muestra PRIMERO
el mapa con los negocios cercanos, y hasta abajo los resultados
normales. Si no estás en ese mapa, no existes para esa búsqueda,
aunque tengas la mejor página del mundo.

CÓMO SE HACE (30 a 40 minutos, una sola vez):

1. Entra a google.com/business con tu correo de Gmail
2. Pon el nombre exacto del negocio: Sandoval Tours
3. Categoría: Operador turístico o Agencia de viajes
4. Domicilio y zona de servicio (Puerto Vallarta y alrededores)
5. Teléfono y WhatsApp — los MISMOS que van a ir en la página
6. Google te manda un código para verificar, por correo postal,
   teléfono o video. SIN VERIFICAR NO SIRVE DE NADA.
7. Sube tus mejores fotos, mínimo 10
8. Pon horarios reales

Y LO MÁS IMPORTANTE DESPUÉS: PIDE RESEÑAS.
Cada cliente que termina un tour contento, pídele que deje su reseña
en Google. Las estrellas en el mapa son lo que hace que te elijan a
ti y no al de junto. Esas mismas reseñas las vamos a poder mostrar
en la página web.

UN DETALLE TÉCNICO QUE IMPORTA MUCHO:
El nombre, la dirección y el teléfono tienen que quedar EXACTAMENTE
IGUAL en Google y en la página web. Si en un lado dice "Sandoval Tours"
y en el otro "Sandoval Tours PV", Google los puede tomar como dos
negocios distintos y te resta posiciones.
```

### 15.5 — Borrador estructural del aviso de privacidad

**Punto de partida, no asesoría legal.** Svei o el cliente deben validar y completar los
campos entre corchetes.

```
AVISO DE PRIVACIDAD

1. RESPONSABLE
[Nombre legal completo], con domicilio en [domicilio fiscal completo],
es responsable del tratamiento de sus datos personales.

2. DATOS QUE RECABAMOS
Cuando usted nos contacta por WhatsApp, teléfono o correo, podemos
recabar: nombre, número telefónico, correo electrónico, y los datos
de la reserva (fecha, número de personas, tour de interés).
Adicionalmente, nuestro sitio web recaba datos de navegación mediante
herramientas de analítica (páginas visitadas, tiempo de permanencia,
origen del tráfico).

3. FINALIDADES
Primarias (necesarias):
 - Atender su solicitud de información
 - Gestionar y confirmar su reserva
 - Coordinar con el operador que presta el servicio
Secundarias (puede oponerse):
 - Enviarle promociones y ofertas

4. TRANSFERENCIAS
Para prestar el servicio contratado transferimos sus datos de reserva
a los operadores turísticos que ejecutan cada tour. Esta transferencia
es necesaria para la prestación del servicio.

5. DERECHOS ARCO
Usted puede solicitar el Acceso, Rectificación, Cancelación u Oposición
al tratamiento de sus datos escribiendo a [correo electrónico].
Responderemos en un plazo máximo de [20] días hábiles.

6. COOKIES Y RASTREO
Este sitio utiliza cookies de Google Analytics para medir el tráfico.
Puede deshabilitarlas desde la configuración de su navegador.
Contactarnos por WhatsApp inicia una conversación en una plataforma
de terceros sujeta a sus propias políticas.

7. CAMBIOS AL AVISO
Cualquier cambio a este aviso se publicará en esta misma página.

Última actualización: [fecha]
```

### 15.6 — Hoja de UTM

```
CÓMO ETIQUETAR TUS LIGAS PARA SABER QUÉ FUNCIONA

Si mandas la liga de tu página "pelona", Google Analytics no puede
saber de dónde vino la gente y todo se revuelve. Pégale esto al final:

Publicación pagada en Facebook:
tusitio.com/es/tours?utm_source=facebook&utm_medium=paid&utm_campaign=NOMBRE

Publicación pagada en Instagram:
tusitio.com/es/tours?utm_source=instagram&utm_medium=paid&utm_campaign=NOMBRE

Lista de difusión de WhatsApp:
tusitio.com/es/tours?utm_source=whatsapp&utm_medium=social&utm_campaign=NOMBRE

Cambia NOMBRE por algo que identifique la campaña, en minúsculas y sin
acentos. Ejemplo: marietas-agosto

NO le pongas nada a las ligas normales que compartes de boca en boca
ni a los resultados de búsqueda de Google — esos Google los identifica
solo.
```

---

## 16. PENDIENTES Y DEPENDENCIAS

### Bloqueantes para el lanzamiento

| # | Pendiente | Responsable | Notas |
|---|---|---|---|
| 1 | **Fotografía real, alta resolución, con derechos** | Cliente | **Riesgo número uno del proyecto.** Ver abajo |
| 2 | Permisos por escrito de operadores aliados | Cliente | Texto en §15.2 |
| 3 | Crear y verificar el Perfil de Empresa en Google | Cliente | Texto en §15.4 |
| 4 | Texto legal del aviso de privacidad y términos | Svei / cliente | Borrador en §15.5 |
| 5 | Canal de YouTube creado, videos subidos | Cliente | |
| 6 | Reseñas existentes recopiladas | Cliente | De Google, Facebook, WhatsApp |
| 7 | Decisión sobre transparencia de operadores aliados | Cliente | Campo `showPublicly` ya está en el esquema |
| 8 | Datos legales: nombre fiscal, domicilio, horarios | Cliente | Necesarios para el schema y el aviso |

### El riesgo número uno, dicho sin rodeos

**La fotografía es la restricción que amarra este proyecto, no el código.**

Ninguno de los principios de §3 sobrevive si el cliente entrega imágenes comprimidas por
WhatsApp. Cifras publicadas por proveedores de software de reservaciones ponen el impacto
de la fotografía profesional en el orden de un 60% más de reservas, con recomendación de
8 o más fotos en alta resolución por tour — **descontar fuertemente los porcentajes
específicos**, vienen de empresas que venden a operadores. Pero la dirección es
inequívoca y coincide con lo que se observa en el volante actual.

**Recomendación: tratar la sesión de fotos como una dependencia de lanzamiento, no como
un extra.** Para un broker, esto puede significar pedir formalmente los originales en
alta resolución a cada operador aliado — lo que además resuelve el problema de derechos
en la misma conversación.

Si el cliente no puede o no quiere hacerlo, **avisar antes de construir la Fase E**: un
layout diseñado para imágenes a sangre completa falla feo con archivos fuente de 900px,
y habría que rediseñar con otro criterio.

### Decisiones abiertas menores

- Verificar la ortografía de "Madagascar" en el nombre del tour
- Confirmar si hay precios diferenciados por adulto/menor o descuentos de grupo
- Confirmar si los tours tienen días fijos de salida
- Verificar los límites vigentes del tier gratuito de Sanity al momento de construir
- Verificar la política vigente de Google sobre marcado de reseñas propias

---

*Fin del documento. Arquitectura cerrada. Listo para implementación.*
