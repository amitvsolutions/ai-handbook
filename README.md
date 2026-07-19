# Exponential AI — The AI Evolution, Told as One Story

A free, premium, multi-chapter **enterprise AI architecture handbook**, delivered as a
fully static website. It follows one fictional global retailer, **Exponential AI**, from a
manual enterprise all the way to an autonomous, AI-native organization — across 20 connected
chapters plus a glossary.

- **20 chapters** + a searchable **glossary** (`chapters/21_glossary.html`)
- Dark / light themes (persisted), sticky sidebar nav, client-side search, reading-progress
  tracker, glassmorphism, responsive layout
- Mermaid diagrams, ASCII diagrams, comparison tables, decision trees, and interactive quizzes
- Three explanation levels per concept (Simple / Engineering / Architect)
- A visual **story-arc timeline** on the home page and **cross-chapter "Related" links**
- A **print stylesheet** so any chapter exports cleanly to PDF
- SEO + Open Graph / Twitter Card tags on every page for nice link previews

## Run it locally

It is **100% static** — no build step and no server required.

- **Simplest:** double-click `index.html` (opens under `file://`).
- **Recommended (for correct link-preview crawling and clean relative paths):**

  ```bash
  # from the project root
  python -m http.server 8000
  # then open http://localhost:8000
  ```

> Nothing in this project uses `fetch()` or ES modules, so a server is **not** required to
> read the handbook. The only reasons to use one are (a) social crawlers that need absolute
> URLs, and (b) if you later switch to fetching chapter fragments.

## Dependencies

Only the allowed CDNs, loaded at runtime (no bundling):

- **Mermaid.js** — diagrams
- **Prism.js** — code syntax highlighting
- **Font Awesome** — icons
- **Google Fonts** — Sora / Inter / JetBrains Mono

If opened offline, the site still works and degrades gracefully (system fonts, plain code
blocks, un-rendered Mermaid source) with **no console errors**.

## Deploy as a free static site

The repository root is the site root — deploy the whole folder as-is. No build command is
needed; set the **publish/output directory to the project root** and leave the build command
empty.

### Netlify
- Drag-and-drop the folder at <https://app.netlify.com/drop>, **or** connect the repo with:
  - Build command: *(none)*
  - Publish directory: `.`
- A `netlify.toml` is included with these settings.

### Vercel
- Import the repo at <https://vercel.com/new>.
  - Framework preset: **Other**
  - Build command: *(none)* · Output directory: `.`
- A `vercel.json` is included.

### GitHub Pages
- Push to GitHub, then **Settings → Pages → Deploy from a branch**, select your branch and
  the `/ (root)` folder. Site publishes at `https://<user>.github.io/<repo>/`.
- A `.nojekyll` file is included so Pages serves all files (including `assets/`) verbatim.

### Cloudflare Pages
- Create a Pages project from the repo:
  - Build command: *(none)* · Build output directory: `/`

## Social preview image (optional)

Link previews use `assets/og-banner.png` via **relative** `og:image` paths so they work on any
host. Some crawlers (Slack, X/Twitter, Facebook) prefer an **absolute** URL. After you pick a
domain, optionally make the previews bullet-proof with a one-line find/replace across the HTML,
e.g.:

```bash
# replace the two relative og-banner references with your absolute URL
grep -rl 'assets/og-banner.png' . --include='*.html' | xargs sed -i \
  's#\(\.\./\)\?assets/og-banner.png#https://YOUR-DOMAIN/assets/og-banner.png#g'
```

## Project layout

```
index.html                 # home page: hero, story arc timeline, chapter grid
assets/
  style.css                # theme, layout, components, print stylesheet
  animations.css
  app.js                   # nav, theme, search, progress, related links, glossary filter
  og-banner.png            # shared social-share image (1200x630)
chapters/
  01_history.html … 20_future.html
  21_glossary.html         # searchable glossary (reference page; not counted in progress)
PLAN.md                    # reconciled plan and resolved spec conflicts
NOTES.md                   # emerging-term framing + accuracy notes
```

## License / usage

A free learning resource. "Exponential AI" is a fictional company used purely for teaching.
