# Reflectie — Food Garden Health App (VC2)

## 1. UI- en UX-patronen

**Navigatie.** Op mobiel een bottom nav (vier tabs), op desktop een sticky side nav met dezelfde routes plus een profielwisselaar bovenaan. Hetzelfde mentale model in twee verschijningen — de gebruiker hoeft niets nieuws te leren bij wisseling van apparaat.

**Datavisualisatie.** Bewust gemixt op type:
- *Donut* (Insights) voor één samenvattende score (Nutrition Balance).
- *Area chart* in SVG voor trends over tijd (hydratatie per dag).
- *Horizontale bar chart* voor categorische verdeling (locatie waar gebruiker eet).
- *Vertical progress bar* voor cumulatieve voortgang (hydratatie op Home).
- *Stat-tegels* met progress fill voor doel-vs-werkelijk (kalorieën / eiwit).

**Interactie.**
- Profielwisselaar als segmented control in Profile + side nav — direct, één klik.
- Tijdsfilters in Insights wisselen werkelijk de dataset (`TAB_DATA`-objecten in `Insights.jsx`), niet alleen de actieve stijl.
- Sliders en dropdowns in Profile triggeren live herberekening van dagelijkse doelen via `calcTargets` in `userData.js`.
- Hover/active states + `:focus-visible` ring voor keyboard navigation.

**Personalisatie.** De `Recommendation`-component leest de actieve user en zijn doelen, en geeft een contextuele tip (laag op water → drink eerst; spierdoel met te weinig eiwit → log een eiwitmaaltijd). Dit toont concreet hoe data wordt *geïnterpreteerd*, niet alleen *getoond*.

## 2. Toepassing van het design system

Centraal in `src/index.css` als CSS custom properties:
- Kleurtokens: `--bg-color`, `--surface-color`, `--surface-highlight`, `--text-primary/secondary`, `--primary-color` + macro-betekeniskleuren (`--color-protein`, `--color-carbs`, etc.).
- Radii (`--radius-sm/md/lg/full`) en spacing (`--spacing-xs..xl`).
- Animatie: één gedeelde `fadeIn` keyframe.

Daarbovenop een kleine herbruikbare componentlaag in `src/components/ui/`:
- `Card` met `variant` (surface, glass, accent) en `padding` props.
- `Button` met `variant` (primary, secondary, ghost, outline) en `size`.
- `Stat` met geïntegreerde progress bar.
- `Chip` voor selecteerbare keuzes.

Elke component leest tokens uit de design-system-variabelen, zodat een themeswitch in de root alle componenten meeneemt. De gebruikersaccent-kleur (`user.accent`) wordt door de avatar, side-nav, en bar-chart gelezen — Walter is amber, Ann is emerald — wat per profiel een herkenbare visuele identiteit geeft.

## 3. Keuzes in responsive design

- **Mobile-first.** Alle pagina-CSS start vanuit kleine schermen; desktop overrides staan in `@media (min-width: 768px)` en `@media (min-width: 1024px)` blokken.
- **Twee breekpunten, drie ervaringen.**
  - `< 768px`: enkele kolom, bottom nav, horizontale scroll voor de drie samenvattingskaarten in Insights.
  - `≥ 768px`: 2-koloms layout in Profile en Insights cards.
  - `≥ 1024px`: side nav verschijnt, bottom nav verbergt (`display: none`), `app-content` verbreedt naar 1180px, Home wordt een 12-koloms grid met `grid-template-areas`.
- **Geen `max-width: 480px` lock.** De originele app was hard gelimiteerd op mobile-formaat; die lock is opgeheven in `App.jsx` en `index.css` zodat desktop daadwerkelijk de ruimte gebruikt.
- **Touch-friendly targets.** Knoppen, chips en tabs minimaal 40px hoog; sliders met grote thumb (18px+).

## 4. Vibe coding workflow

Iteratief gewerkt in korte cycli:
1. Eerst de brief naast de bestaande code gelegd en gap-analyse gemaakt (geen desktop, geen profielen, geen kilometerdata-koppeling).
2. Een `UserContext` opgezet met twee voorbeelden (Walter & Ann) en de afgeleide doelen via Mifflin-St Jeor — eerst de data, dan de UI.
3. Per pagina: lokale wijziging → `vite` HMR → meteen visueel checken → corrigeren. Geen lange tussenfase van plannen.
4. Component-extractie pas toen er drie keer hetzelfde patroon (card met header, knopvarianten, stat-tile) terugkwam — niet preventief.
5. ESLint + `vite build` als gates aan het eind, om regressies te vangen.

De brief, de gebruikersbehoefte en de DOM stonden tegelijk open; aanpassingen waren klein en frequent in plaats van grote refactors achteraf.

## 5. Verbeterpunten

- **Echte image recognition voor "scan meal".** Nu een 1.5s mock; integratie met een echte API (bijv. een vision endpoint) is een logische volgende stap.
- **Persistente data.** State leeft in geheugen — een hard refresh wist alles. `localStorage` of een lichte backend zou het profielen-experiment realistischer maken.
- **Meer granulaire grafieken in Insights.** De huidige tabs kiezen tussen geseede datasets; een echte tijdreeks per maaltijd zou rijker zijn.
- **Toegankelijkheid verder.** `aria-label` is toegevoegd op icoonknoppen en de hydratatiebar; een volledige audit (screen reader testflow, kleurcontrast op `text-secondary`) is nog niet gedaan.
- **Componenten verder consolideren.** `LogMeal` heeft nog inline portion-slider en mood-grid die als `Slider` en `Toggle Group` componenten herbruikbaar gemaakt kunnen worden.
- **Animatie-discipline.** De plant-animaties in `Home.css` zijn rijk maar zwaar; op desktop kunnen ze met `prefers-reduced-motion` worden uitgezet.
