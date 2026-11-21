# abhishek-patil-portfolio

Personal portfolio of Abhishek Patil, full stack engineer: a 3D, motion-rich site with work case studies, experience, about and contact pages.

## Tech stack

- React 19 + TypeScript (strict)
- Vite
- React Three Fiber (Three.js) for the 3D hero
- Motion for UI animation
- Plain CSS with theme variables (light and dark)

## Getting started

Use Node.js 22.12 or later and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. In Windows PowerShell, use `npm.cmd` instead of `npm` if script execution is restricted.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` type-checks the project and creates the production build in `dist/`.
- `npm run preview` serves the production build locally (run `build` first).
- `npm run lint` checks the project with Oxlint.

## Content

Content lives in `src/content.ts`: profile, links, experience, projects, skills and page copy. Components only read from it. Values that start with `TODO:` are treated as unset and hidden until you fill them in.

## Deployment

On Vercel, use the Vite preset with `npm run build` and the `dist` output directory. The included `vercel.json` lets every route (e.g. `/work/kuber`) load directly.
