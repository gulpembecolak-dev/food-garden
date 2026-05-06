# Food Garden — Health Dashboard (VC2)

An interactive web app where personal health data is presented and contextualized for two example users (Walter & Ann). Built for the *Visual Communication 2 — Health App* assignment.

**Live demo:** _add Netlify URL after first deploy_

## Stack

- **React 19** + **Vite 8** (no TypeScript, no SWC plugin — Oxc default)
- **react-router-dom 7** with `HashRouter` (Netlify-friendly, no SPA redirect needed)
- **lucide-react** icons
- Plain CSS with custom properties — no Tailwind, no UI library

## Features

- Two seeded user profiles (**Walter**, **Ann**) with editable personal data (age, gender, weight, height, activity, goal); daily targets recalculated live via the Mifflin–St Jeor equation
- Four pages: **Home** (dashboard + stats + recommendation), **Log meal** (4-step flow with mock AI scan), **Insights** (filterable charts + Journal drawer), **Profile** (switcher + form)
- Reusable component library in `src/components/ui/` — `Card`, `Button`, `Chip`, `Stat`
- Custom data viz built in CSS/SVG — macro progress rows, daily hydration bars, mood × energy stacked bars, scatter plot
- `localStorage`-persisted Journal scoped per user
- Mobile-first, responsive at `>768px` (2-col) and `>1024px` (sidebar layout)

## Scripts

```bash
npm install   # install dependencies
npm run dev   # start dev server on http://localhost:5173
npm run lint  # run ESLint over the source tree
npm run build # production build into ./dist
npm run preview # preview the production build locally
```

## Deploy to Netlify

1. Push the repo to GitHub.
2. In Netlify: **Add new site → Import from Git → choose this repo**.
3. Netlify auto-detects the `netlify.toml` in the root:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. The site lives at `https://<chosen-name>.netlify.app/`.

Hash routing is used (`#/log`, `#/insights`, …), so no server-side SPA fallback is required.

## Project structure

```
src/
├── App.jsx                  shell: SideNav + main + BottomNav
├── main.jsx                 root with HashRouter + UserProvider
├── index.css                design tokens (colors, radii, spacing) + global resets
├── components/
│   ├── ui/                  Card, Button, Chip, Stat + ui.css
│   ├── BottomNav, SideNav   navigation
│   ├── Recommendation       personalized tip card
│   ├── Journal, JournalDrawer, Journal.css
│   └── Plants               SVG plant illustrations per macro
├── context/
│   ├── UserContext.jsx      provider + useUser() hook
│   └── userData.js          seeded profiles + calcTargets (BMR)
├── hooks/
│   └── useJournal.js        localStorage-backed entry list
└── pages/
    ├── Home, LogMeal, Insights, Profile (.jsx + .css)
```

## Reflection

See [`REFLECTION.md`](./REFLECTION.md) — covers UI/UX patterns, design system application, responsive choices, vibe coding workflow, and improvement points (in Dutch, per the assignment).
