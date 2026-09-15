# Ilo — Personal Portfolio

A responsive, pixel/game-themed personal portfolio built with **Tailwind CSS** and **vanilla JavaScript**.

## Pages

- `index.html` — Landing page
- `about.html` — About / character sheet
- `projects.html` — Projects with filter tabs + pop-up detail modal
- `contact.html` — Contact form with validation

## JavaScript Features

1. **Dark mode toggle** — switches theme, remembers your choice (localStorage)
2. **Mobile menu toggle** — hamburger menu for small screens
3. **Project filter** — filter project cards by category (Security / Web / Design)
4. **Contact form validation** — checks name, email format, and message before "sending"

(Bonus: pop-up modal on each project card, showing full details + Preview/GitHub links.)

## Folder Structure

```
portfolio/
├── index.html
├── about.html
├── projects.html
├── contact.html
├── css/
│   └── output.css       (compiled Tailwind CSS — do not edit directly)
├── js/
│   └── script.js         (all JavaScript features)
├── src/
│   └── input.css         (Tailwind source — edit THIS, then rebuild)
├── package.json
└── package-lock.json
```

## How to Edit Styles

This project uses the **Tailwind CLI**, not a CDN. If you change `src/input.css` or add new
utility classes in the HTML, you must rebuild:

```bash
npm install
npx @tailwindcss/cli -i src/input.css -o css/output.css
```

Add `--watch` at the end to rebuild automatically while you work:

```bash
npx @tailwindcss/cli -i src/input.css -o css/output.css --watch
```

## Deploy

### Option A — GitHub Pages
1. Create a new repository on GitHub and push this whole folder to it.
2. Go to the repo's **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/root`.
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/`.

### Option B — Vercel
1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new and import that repository.
3. Framework preset: **Other** (it's static HTML, no build step needed since `css/output.css` is already built).
4. Deploy — Vercel gives you a live `.vercel.app` link.

**Important:** make sure `css/output.css` is committed to the repository (it's not ignored by `.gitignore`) since GitHub Pages/Vercel just serve static files and won't run the Tailwind build for you.
