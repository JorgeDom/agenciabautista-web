# Handoff: Agencia Bautista landing page

Running log of the work on this repo: where things stand, how to work here, and what changed in
each session. Read sections 1 to 4 before touching anything; add to section 7 when you finish.

> **This repo is public** (`github.com/JorgeDom/agenciabautista-web`, checked 2026-10-06). This file
> is written to be safe to commit: no client messages, no personal details beyond what the live
> site already shows. Keep it that way, and see the warning about the team draft in section 4.

Last updated: 2026-10-07 (session 3). Written by Claude (AI assistant) at Jorge's request.

## 1. Where things stand

- **Live:** `https://agenciabautista-web.pages.dev` serves commit `7a2a634` (2026-10-06).
- **Not committed, not deployed** (working tree on `main`, built and checked locally; Jorge wants
  it published once he has reviewed it):
  1. Session 2: "E.A.S." removed except in the footer; big-screen scaling; the team section.
  2. Session 3: the client's answers applied, the founding year corrected to 1977, the Rubros
     section (formerly Clientes) redesigned, and the team section hidden everywhere.
- **Still waiting on the client (Mateo Bautista, the agency's manager):**
  - Which port to show for "Chaco", and whether there are other main ports beyond the four he named.
  - The group photo (no date; they want a good photo of everyone first).
  - The confirmed number of years in business ("50" stays fixed until then; with 1977 as the
    founding year the computed figure would be 49).
  - Whether the new number (0995) 683-696 also takes WhatsApp, and whose it is.
  - Whether Quiénes somos should name the founder, now that the team goes without names.
- Jorge has not yet reviewed the big-screen scaling on a real large monitor.

## 2. The repo

| Path | What it is |
|---|---|
| `v3/` | **The live site.** Astro 7, static output, no UI framework. Everything below refers to it. |
| `index.html`, `main.js`, `styles.css`, `assets/` | First design variant. Not deployed, not maintained. |
| `v2/` | Second design variant. Not deployed, not maintained. |
| `v3/src-images/`, `v3/globe-36.gif` | Original images and video that the optimised assets were made from. |

The old variants still contain old copy (including "E.A.S." and the wrong founding year, 1976).
Leave them alone unless Jorge asks.

**Deploy.** Pushing to `main` publishes: the push of `7a2a634` was live about 40 seconds later.
The Cloudflare Pages settings are not visible from the repo; `astro.config.mjs` expects a
`SITE_URL` environment variable there until the real domain (`agenciabautista.com.py`) is connected.

**Files that matter (under `v3/`):**

| File | Why |
|---|---|
| `src/data/site.ts` | All copy and data: contact details, the `WHATSAPP` constant, `ports`, `team`, `media`. |
| `src/data/paraguaymap.ts` | Build-time map of Paraguay (d3-geo + world-atlas); ships as plain SVG paths. |
| `src/styles/global.css` | Design tokens, shared pieces, and the big-screen scaling rule. |
| `src/scripts/scroll.ts` | The one scroll loop every animated section registers with (`onScroll`). |
| `src/components/*.astro` | One file per section, each with its own markup, script and scoped styles. |
| `public/_headers` | Cache and security headers for Cloudflare Pages. |

Page order: Hero, Quiénes somos (map), Servicios, ¿Por qué elegirnos?, Proceso, [Nuestro equipo,
hidden], Rubros (`Sectors.astro`, anchor `#sectores`), Contacto + footer.

## 3. How to work here

**Run and check**

- `cd v3`, then `npm run dev` (port 4321) or `npm run build` (output in `v3/dist`).
- Start every session with `git fetch` and check for "behind". On 2026-10-06 the local clone was
  one commit behind GitHub, so local and live looked different until it was pulled.
- Astro refuses to start a second dev server for the same project. If one is already running,
  use it, or run `npx astro preview --port <free port>` against a build. If you start one
  yourself, stop it before handing back, or Jorge's own `npm run dev` fails with "Another astro
  dev server is already running" (happened on 2026-10-07).
- Changes so far were checked with screenshots from headless Chrome (puppeteer-core driving the
  installed Chrome, scripts kept outside the repo) at 390, 1440, 1920, 2560 and 3840px wide.
  Scroll-driven sections need captures at several scroll positions, not one.
- Only Chrome has been tested. Safari and Firefox have not.

**Known traps**

- **Stale styles in the dev server.** Twice on 2026-10-06 a long-running `astro dev` kept
  serving a component's old stylesheet after the file changed (new HTML, old CSS). Saving the file
  again or restarting the server fixes it. The production build was never affected. If a section
  looks wrong only in dev, suspect this first.
- **Windows.** Do not edit files through PowerShell 5.1: it corrupts accented characters. The
  "LF will be replaced by CRLF" warnings from git are harmless.
- **Desktop to phone without reload.** Sections switch behaviour at 900px. When adding scroll
  effects, clear inline styles when the mode changes (see `measure()` in `Services.astro`).

**Conventions that are easy to break**

- **Copy lives in `site.ts`**, not in components. Dates are computed from `FOUNDED` (1977, corrected
  on 2026-10-07), except the years in business: `YEARS_IN_BUSINESS` is fixed at 50 by client request.
- **Each of these appears once on the page, by client request:** the tagline "Confianza que cruza
  fronteras" and "1977" (both in the hero headline), and "50 años" (Quiénes somos paragraph).
  Do not reintroduce them elsewhere. `og-image.jpg` (link previews) also carries the tagline and
  the year baked in: rebuild it whenever either changes (recipe in section 6).
- **The section about sectors is "Rubros", not "Clientes"**: no client is named anywhere.
- **"E.A.S." appears only in the footer** (`site.legal`). Everywhere else use `site.name`.
- **The map shows coverage, not routes.** No arcs, no foreign ports. Ports come from the `ports`
  array in `site.ts`; a format example is in the comment above it.
- **Sizes: rem if it should grow on big screens, px if it should not.** The root font-size scales
  above 1600px (rule in `global.css`), so type, header, buttons, icons and container sizes are in
  rem. Hairlines, breakpoints and phone-only values stay in px.
- **The team section is hidden everywhere** (`showTeam = team.published` in `site.ts`). Set
  `published: true` to show it, nav link included. To preview it locally, flip that flag and
  don't commit the flip.
- **WhatsApp links are built in `site.ts`**: `whatsappWith(text)` for the main buttons, and
  `sectorWhatsapp(name)` for the Rubros cards (the approved greeting plus "para el rubro …").
- Commit messages follow the existing style (`feat:` / `fix:` summary, then a bulleted body).
  Jorge had the `Co-Authored-By` line removed from `7a2a634`; leave it out unless he says
  otherwise. Show him the message first, and commit and push only when he asks.

## 4. Open items

| Item | Status | Where |
|---|---|---|
| Ports on the map | Three added (2026-10-07); Chaco pending | Encarnación, Ciudad del Este, Puerto Falcón are on the map; Asunción's ports are represented by the office pin. Add the Chaco point when the client names it. `ports` in `site.ts`. |
| Team section | Hidden; design approved by Jorge | The client wants the group photo **without names** for now, so names were removed from the code. When the photo arrives, the panel needs reworking into photo-only (it was designed with the list on the right). `team` in `site.ts`, `Team.astro`. |
| Group photo | No date | Landscape, good resolution. The site goes ahead without it. Path goes in `team.photo`. |
| Team names and titles | On hold | Not published for now. The founder's title ("Fundador y director · Despachante de Aduanas") was approved as is, for when names appear. |
| Big-screen scaling | Built, not reviewed on a real large monitor | `global.css`. It also changes 1920px slightly (see session 2). |
| Globe sharpness on very large screens | Known, minor | A 480px animation shown at up to about 550px at 2560 wide. Recipe in section 6. |
| Sector images | Heavy | Six PNGs, about 10 MB in total (they were WebP, about 0.6 MB). Lazy-loaded. |
| WhatsApp number | Temporary, confirmed by the client | The manager's own line until the agency has a corporate number: `WHATSAPP` in `site.ts`. |
| "50 años" | Fixed at 50 by client request | He will confirm the figure. Note the page now says "desde 1977", which makes 49 in 2026; the two will look inconsistent to a careful reader until he confirms. `YEARS_IN_BUSINESS` in `site.ts`. |
| New phone (0995) 683-696 | Added; WhatsApp unknown | It sits under "Teléfonos / WhatsApp". Ask the client whether it takes WhatsApp. |
| NCM chapters on the Rubros cards | Shown, not confirmed by the client | Typical HS/NCM chapters for each sector's goods (`ncm` in `sectors`). Ask the client to confirm. |
| Per-rubro WhatsApp message | New, not shown to the client | The approved greeting plus "para el rubro …". Mention it to the client. |
| River on the map | Hand-traced, approximate | `RIVER` in `paraguaymap.ts`. |

> **No team names in the repo.** The repo is public and the client does not want names published
> yet, so the names were removed from `site.ts` on 2026-10-07. Keep them out of anything committed
> until he says otherwise; Jorge has the list.

## 5. Client questionnaire

Drafted 2026-10-06 for Jorge to send to the client, modelled on the one he sent Barreto y
Asociados. **Sent, and answered by the client on 2026-10-07**: summary of the answers right after
the questionnaire text.

The team's names are left out of this copy because the repo is public (see section 4). The
version Jorge sent lists them under each area in question 3, and question 4 asks about the accents
on two of the names.

```text
ACTUALIZACIÓN DEL SITIO WEB: CAMBIOS REALIZADOS Y CONSULTAS

Ya están publicados los cambios de la primera ronda. Hay otros que están hechos pero todavía sin publicar, y para terminar necesito confirmar algunos datos con ustedes.


CAMBIOS YA PUBLICADOS

1. ¿Quiénes somos?: se reemplazó el texto por el que me enviaron y se quitó de esa sección la frase «Confianza que cruza fronteras desde 1976.».
2. Repeticiones: «Confianza que cruza fronteras», «1976» y «50 años» ahora aparecen una sola vez cada uno. Los dos primeros quedaron en el título principal y el tercero en «¿Quiénes somos?». Se quitaron el bloque «Desde 1976 / Trayectoria 50 años» y el sello de «50 años».
3. Mapa: ya no muestra Miami, Santos, Montevideo ni Iquique, ni líneas de rutas. Ahora muestra el Paraguay con la sede en Asunción. Falta marcar los puertos (consulta 1).
4. ¿Por qué elegirnos?: se agregó el globo animado al lado de la lista.
5. Contacto: se agregaron los botones de WhatsApp, correo e Instagram, y el correo mateo.bautista@agenciabautista.com.py. El botón de WhatsApp abre el chat con un mensaje ya escrito.


CAMBIOS HECHOS, TODAVÍA SIN PUBLICAR

6. Se quitó «E.A.S.» de todo el sitio, salvo del pie de página.
7. Pantallas grandes: el sitio ahora aprovecha mejor el ancho en monitores grandes.
8. Nuestro equipo (propuesta): una sección nueva con la foto grupal y el equipo listado por área. No se publica hasta que ustedes la aprueben (consultas 3 a 7).


CONSULTAS

Mapa

1. ¿Me pueden enviar la lista de puertos y aduanas que cubren? Con el nombre de cada uno alcanza; yo los ubico en el mapa. Si son muchos, ¿prefieren mostrar todos o solo los principales?
2. Debajo del mapa dice «Con sede en Asunción, cubrimos todos los puertos del país.». ¿Está bien así?

Nuestro equipo (propuesta)

3. Sé que los cargos todavía no están definidos. Por eso la propuesta lista a las personas por área, sin cargo individual; solo Dirección lleva cargo. Quedaría así:
   - Dirección: [los dos nombres, con sus cargos]
   - Comercio exterior: [cuatro nombres]
   - Administración y coordinación: [un nombre]
   ¿Les parece bien publicarlo así? Si prefieren no publicar el listado por ahora, la alternativa es dejar solo una línea en «¿Quiénes somos?» que nombre a Alfredo Bautista como fundador, director y despachante, y agregar la foto grupal más adelante.
4. ¿Los nombres están bien escritos? ¿[dos de los nombres] llevan tilde? ¿Alguien lleva título (Lic., Ing., Abg.)?
5. El cargo de Alfredo quedó como «Fundador y director · Despachante de Aduanas». ¿Lo dejamos así o prefieren otra forma, por ejemplo «CEO»?
6. Las áreas quedaron como «Dirección», «Comercio exterior» y «Administración y coordinación». ¿Están bien esos nombres?
7. ¿Cuándo podrían enviarme la foto grupal? Lo ideal es una foto horizontal, en buena resolución, con el equipo ubicado hacia la izquierda de la imagen, porque el lado derecho se funde con el listado.

Otros

8. Para no repetir «50 años», el primer punto de «¿Por qué elegirnos?» ahora dice «Experiencia comprobada en importación y exportación». ¿Está bien así?
9. El botón de WhatsApp abre el chat con el (0981) 407-826 y con este mensaje: «Hola, quisiera saber más sobre los servicios y solicitar un presupuesto.». ¿Dejamos ese número hasta que tengan uno corporativo? ¿El mensaje está bien?
10. El botón de correo escribe a operaciones@agenciabautista.com.py, y el correo de Mateo figura al lado. ¿Está bien así, o prefieren que el botón escriba a otro correo?
11. El texto dice «50 años de trayectoria». El sitio calcula ese número a partir de 1976, así que en enero de 2027 pasaría a decir «51». ¿Lo dejamos así o prefieren que quede fijo en 50?

Los puntos 6 y 7 no dependen de sus respuestas. Con la lista de puertos, la foto y sus respuestas sobre el equipo, publico lo que falta.
```

Where each answer lands in the code:

| Question | Change it in |
|---|---|
| 1 | `ports` in `site.ts` (name + [longitude, latitude]) |
| 2 | `about.caption` in `site.ts` |
| 3 to 6 | `team` in `site.ts`; `published: true` ships the section. The fallback is one sentence added to `about` |
| 7 | the photo into `v3/public/img/`, its path in `team.photo` |
| 8 | `reasons` in `site.ts` |
| 9 | `WHATSAPP` and `WHATSAPP_TEXT` at the top of `site.ts` |
| 10 | `emails` in `site.ts` (the first one gets the button) |
| 11 | `about.lead` in `site.ts` (replace `{years}` with a fixed number) |

### Answers (received 2026-10-07)

Paraphrased from the client's reply. Applied on 2026-10-07 (session 3), except the points marked
**open**.

| # | Answer | What it means for the site |
|---|---|---|
| 1 | Show the main ports, not all of them. They have people in every port. Named: Asunción ("all" of them there), Encarnación, Ciudad del Este, the Chaco and Puerto Falcón, "and several more". | Add those markers. **Open:** which place in the Chaco, whether "several more" means other main ones, and how to show "all of Asunción" (one marker for the city's ports, or each terminal). |
| 2 | The caption is fine. | No change. |
| 3 | Keep the group photo, **without names for now**. | Team section becomes photo-only. Names come out of the code. Not stated whether the alternative (one line naming the founder in Quiénes somos) is wanted: **open**. |
| 4 | Not answered (moot while no names are shown). | None. |
| 5 | Keep the founder's title as it is. | Only used if names appear later. |
| 6 | Not answered (moot while no names are shown). | None. |
| 7 | No date for the photo. They want a good photo of everyone; go ahead without it and add it later. | Nothing to publish in the team section until the photo arrives. |
| 8 | The reworded reason is fine. | No change. |
| 9 | Keep the manager's number for WhatsApp until there is a corporate one. New message: «Hola, ¿cómo están? Me gustaría conocer un poco más sobre sus servicios.» (avoids asking for a quote straight away). Remove (0981) 402-038 from the phone list and add +595 995 683696. | `WHATSAPP_TEXT` and `phones` in `site.ts`. **Open:** whose the new number is and whether it takes WhatsApp (the label says "Teléfonos / WhatsApp"). |
| 10 | The button stays on operaciones@ (the office's main inbox). The manager's address is for people who want to reach him directly; he handles this area and customer service. | No change. |
| 11 | Fix it at 50 for now; he will confirm the years. | `about.lead`: a fixed 50 instead of the computed value. |

## 6. Recipes

**Globe animation** (`public/img/globo.webp`, `globo-quieto.webp`), made from `v3/globe-36.gif`
(800×600, 165 frames, white lines on flat blue `rgb(5,106,201)`) with `sharp`:

1. Resize the animated GIF to 640px wide and take the centre 480×480 of every frame.
2. Alpha per pixel from the red channel: `a = (R - 14) / 236`, zero below 0.05, then `a^0.7`;
   fade alpha to zero over the outer 10% of the radius.
3. Colour every pixel `rgb(8,120,186)` (the `--sky-d` token) with that alpha.
4. Save as animated WebP: quality 25, alphaQuality 25, effort 6, 40 ms per frame, loop forever.
5. The still is frame 1 as a single WebP at quality 80.

A larger version (600px) came out at about 2.8 MB against 1.6 MB for this one.

**Link-preview image** (`public/og-image.jpg`, 1200×630), rebuilt on 2026-10-07 for the 1977
correction. An HTML page rendered by headless Chrome and saved as JPEG (quality 86, mozjpeg):

- Background: hero frame `public/hero/lg/028.webp`, `background-size: cover`.
- Shade: left-to-right `rgba(4,20,41,.78)` → transparent at 70%, plus darkening at top and bottom.
- White logo (`public/img/logo-agencia-bautista.png`) at left 60px, top 58px, 62px tall; a 2px
  dashed rule `rgba(143,210,248,.45)` at top 146px, 65px in from each side.
- Headline "Confianza / que cruza / fronteras" in Archivo 850, 76px, line-height .93,
  font-stretch 125%, letter-spacing -.02em, at left 63px, top 300px.
- "Despacho aduanero en Asunción, **desde 1977**." in Instrument Sans 25px at left 66px, top 532px,
  the bold part in `#4DB8F4`.
- "25°16′S 57°38′O" in Saira Stencil One 15px, letter-spacing .14em, `#B4C6DB`, right 65px, top 549px.

## 7. Session log

Newest first. One entry per working session: what was asked, what changed, and its status.

### 2026-10-07, session 3: NOT committed

Asked for: record the client's answers and apply them; hide the team section; redesign the
Clientes cards (the client found them "medio triste"), with Jorge's two reference cards as the
direction; reword the section around sectors instead of clients; correct the founding year to 1977;
then publish.

- **Handoff.** Added the questionnaire (section 5, no team names) and the client's answers.
- **Client answers applied** (`site.ts`): new WhatsApp greeting; phone list is now (0981) 407-826
  and (0995) 683-696 (402-038 removed); "50 años" fixed via `YEARS_IN_BUSINESS`; map ports
  Encarnación, Ciudad del Este, Puerto Falcón (label above, so it clears the Asunción pin).
- **Founding year 1977.** `FOUNDED` changed; the hero, container codes and link-preview alt follow
  automatically. `og-image.jpg` rebuilt with "desde 1977" (recipe in section 6).
- **Team.** Names removed from `site.ts`; the section and its nav link are hidden everywhere
  (`showTeam = team.published`), not just in the build.
- **Rubros (was Clientes).** Heading "Rubros que atendemos" with a new lede; the dotted list of
  sectors removed (the cards carry it); nav link renamed "Rubros". Cards redesigned after Jorge's
  references: portrait cards with the existing product renders large and cropped by the card edge
  under a spotlight, name and goods top-left (a "Rubro 01" kicker was tried and removed at Jorge's
  request), and a frosted bar with the NCM
  chapters and a white "Consultar" button that opens WhatsApp about that sector. Motion: cards
  rise in left to right, products drift with a slow parallax as the card crosses the screen, and
  lift on hover. Three columns on desktop, two on tablets, a swipeable row on phones. No new
  images were needed.
- **Checked:** production build (no "1976" left, team absent, E.A.S. only in the footer, all eight
  WhatsApp links and both phone links correct); screenshots of the map, contact, hero and Rubros
  at 390, 1440 and 2560 wide. Not checked: Safari, Firefox, real phones.
- Files: `site.ts`, `Header.astro`, `Sectors.astro`, `public/og-image.jpg`, this file.

### 2026-10-06, session 2 (afternoon): NOT committed

Asked for: remove "E.A.S." except in the footer; a team section proposal modelled on the Barreto
y Asociados site; a better layout on 4K screens.

- **E.A.S.** `about.lead` now uses `site.name`. `site.legal` is used by the footer only.
- **Team section (draft).** New `Team.astro` between Proceso and Clientes, plus an "Equipo" nav
  link, both behind `showTeam`. People are listed by area (Dirección, Comercio exterior,
  Administración y coordinación) so nobody needs a job title; only the two the client named
  carry one. First built as photo-left / list-right, then, at Jorge's request, as one panoramic
  panel: the photo covers the left 70% and fades into blue, the list sits over the blue. On
  scroll the photo wipes open and the names cascade in. The photo is a lighter-blue placeholder.
- **Big-screen scaling.** Above 1600px wide the root font-size and the content column grow with
  the screen (20px root and about 1800px of content at 2560; levels off near 3840). Sizes that
  must follow were moved from px to rem in `global.css`, `Header`, `Hero`, `Services`, `Why` and
  `Contact`. Below 1600px nothing changes. At 1920 the content goes from 1200px to about 1400px
  and type from 16px to about 17px; Jorge was told and can ask for the growth to start later.
- Files: `global.css`, `site.ts`, `index.astro`, `Header.astro`, `Hero.astro`, `Services.astro`,
  `Why.astro`, `Contact.astro`, new `Team.astro`, this file.

### 2026-10-06, session 1 (morning): shipped as `7a2a634`

Asked for: a round of client feedback, then several follow-ups the same morning.

- **Quiénes somos.** Paragraph replaced with the client's wording; quote and the
  Desde / Trayectoria / Sede stat block removed.
- **Repeated copy.** Tagline, "1976" and "50 años" reduced to one appearance each. The rotating
  seal in ¿Por qué elegirnos? was removed for this reason and its first reason reworded. Also
  removed from the meta description.
- **Map.** World map with routes replaced by a Paraguay map: neighbours named, Río Paraguay,
  Asunción pin, zoom-out on scroll, ports from a data array. `worldmap.ts` renamed to
  `paraguaymap.ts`. Page HTML went from about 230 KB to about 45 KB.
- **¿Por qué elegirnos?** Spinning globe alone in the left column (GIF converted to a transparent
  WebP, 6.8 MB to 1.6 MB), heading and reasons on the right.
- **Contacto.** WhatsApp, email and Instagram as round icon buttons; WhatsApp opens with a
  prefilled message and uses a single `WHATSAPP` constant; a second e-mail address added. The
  Instagram row in the details column was added and then removed at Jorge's request (the icon
  button stays).
- **Fix.** Servicios containers stayed hidden when a desktop-width page was narrowed to phone
  width without reloading. This bug was already on the live site.
- **Local clone was one commit behind GitHub** (`6e72500`), which is why Clientes looked different
  locally. It was fast-forwarded before this work was committed.

### Before this log (from `git log`)

| Commit | Date | Summary |
|---|---|---|
| `6e72500` | 2026-10-01 | Footer/nav logo parity, bigger Clientes grid, nav jumps land past pinned scenes |
| `d168e27` | 2026-10-01 | SEO basics: link previews, robots.txt, sitemap, headers |
| `aa9fca7` | 2026-10-01 | Stacked-container Servicios, simpler Clientes, mobile fixes |
| `b700e1b` | 2026-09-30 | Mobile hero motion reworked; header isolated from other scenes |
| `f5dc319` | 2026-09-30 | Landing page, three design variants |

## 8. Keeping this file current

At the end of a session: add an entry at the top of section 7 (date, what was asked, what
changed, files, and whether it was committed and deployed), update section 1 and the table in
section 4, and change the "Last updated" date. Record what was verified and how, and say plainly
what was not checked.
