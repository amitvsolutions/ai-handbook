# NOTES.md — Flagged items for your review

Emerging/ambiguous terms are written accurately and conservatively in the handbook.
Where specifics are not yet standardized, they are flagged here rather than invented.

## Emerging / ambiguous terms — RESOLVED per user (2026-07-19)
- **ACP (Agent Communication Protocol)** — describe the *category/intent* accurately; mention
  IBM's ACP as a notable example; explicitly state wire formats are still converging and DO NOT
  declare a single standard. (ch12) ✔ direction confirmed
- **A2A (Agent-to-Agent)** — anchor to **Google's A2A** as the reference spec, framed against
  MCP/ACP. (ch13) ✔
- **A2UI (Agent-to-UI)** — keep conceptual/forward-looking, clearly flagged as emerging. ✔
- **Context Ontology** — covered under ch14 (context engineering) as enterprise knowledge
  modeling; avoid over-precise claims. ✔

## New emerging-term flags (append as encountered while authoring)
- **ch12 ACP authored (2026-07-19):** Written as an *emerging category/intent* for agent-to-agent
  communication, with **IBM's ACP** named as the notable reference implementation. The chapter
  explicitly states that wire formats are **still converging** and does **not** declare a single
  winning standard. It also notes overlap/relationship with Google's A2A (ch13). Please confirm the
  framing is acceptable; if a specific ACP spec becomes dominant later, this chapter should be
  revisited.
- **ch13 A2A:** will be anchored to **Google's A2A** as the reference spec (Agent Cards, tasks,
  peer messaging) and framed against MCP (tools) and ACP (category).
- **ch14 Context Ontology (2026-07-19):** covered conservatively as *enterprise knowledge modeling
  applied to context selection* — entities/relationships that keep retrieval coherent. Explicitly NOT
  presented as a single prescriptive standard.
- **ch20 A2UI (2026-07-19):** mentioned only in the closing "road ahead" as an **emerging,
  still-forming idea** (agents generating/driving UIs directly), clearly flagged as forward-looking
  rather than a settled specification, per your guidance. Revisit if/when a concrete standard emerges.

## Pre-launch accuracy skim (2026-07-19) — fast-moving chapters
Re-verified every concrete protocol/spec claim in ch11, ch12, ch13, ch14, ch18, ch20.
**No claims were changed — all already accurate or explicitly framed as emerging.** Summary:
- **ch11 MCP:** MCP described as a real open standard introduced by **Anthropic, late 2024**, JSON-RPC
  transport, client/server with tools/resources/prompts, growing multi-vendor client adoption in 2025.
  This matches the current public record; safe to state as a standard.
- **ch12 ACP:** kept as an **emerging category**, IBM's ACP named as a notable example, "wire formats
  still converging", explicit "not a ratified standard" callout. No winner declared. ✔
- **ch13 A2A:** anchored to **Google's A2A (2025)**, Agent Cards + task lifecycle + JSON-RPC 2.0 over
  HTTP + SSE, noted as "moved toward open governance / vendor-neutral stewardship" with a caveat that
  field names may still change. Matches public record (A2A announced 2025, later placed under
  vendor-neutral governance). ✔
- **ch14 context ontology:** treated as a modeling aid, "not a single prescriptive standard". ✔
- **ch18 security:** hedged correctly — "prompt injection can't be fully prevented", blast-radius
  framing, OWASP LLM Top 10 referenced as a category, no "unhackable" claims. ✔
- **ch20 A2UI:** only in the closing outlook, explicitly "emerging, still-forming idea … forward-looking
  rather than settled". ✔

**Please double-check (fast-moving, may drift):** the exact governance/stewardship status and wire-format
maturity of ACP (IBM) and A2A (Google) — these continue to evolve; the chapters are hedged so they stay
correct, but revisit if you want to name a specific foundation/'spec version' explicitly.

## Pre-launch polish changes (2026-07-19) — what I changed this pass
Accuracy: **no prose/claim changes** (see skim above). Everything else was additive/QA:
- **Bug fix — theme persistence (functional):** every page hard-codes `data-theme="dark"` and
  `currentTheme()` read that attribute *before* localStorage, so a chosen theme was lost on every
  navigation. Added a tiny anti-flash inline `<head>` script that applies the saved
  `exponential-ai-theme` before paint. Verified in-browser: toggle → navigate → theme persists,
  no flash. (No CSS/logic rewrite.)
- **Search improvement:** added a per-chapter keyword/acronym map (`SEARCH_KW` in app.js) so nav
  search finds topics by term/acronym (e.g. `rag`→Ch07, `mcp`→Ch11, `llm`→Ch05) that the titles
  alone didn't match.
- **SEO/social:** added `<title>` (already present) + Open Graph + Twitter Card meta to all 22
  pages, referencing one shared banner `assets/og-banner.png` (1200×630, generated with Pillow,
  no network). og:image uses site-relative paths so it works on any static host — README documents
  swapping to an absolute URL once a domain is chosen (some crawlers require absolute).
- **Deployment:** added `README.md` (local run + Netlify/Vercel/GitHub Pages/Cloudflare Pages
  steps, "no build step / no server" note), plus `netlify.toml`, `vercel.json`, and `.nojekyll`.

**Please double-check:** og:image previews on Slack/X/Facebook — they generally need an *absolute*
URL; the relative path is correct for the site itself but you may want the one-line find/replace in
README after you pick a domain.

## Hand-drawn ("Excalidraw") diagrams (2026-07-19)
Rendering-only change — **no diagram definitions were rewritten**; only how they render.
- **Mermaid `look:"handDrawn"`** enabled in `initMermaid()` (assets/app.js). This requires
  Mermaid **v11**, so the CDN pin was upgraded `mermaid@10.9.1` → `mermaid@11.6.0` on all 22 pages.
  Uses `theme:"base"` + tuned `themeVariables` so sketch strokes stay on-palette and legible in
  **both** dark and light themes.
- **Handwritten diagram font:** added **Caveat** (Google Fonts) to the existing fonts `<link>` on
  all pages; set as Mermaid `fontFamily` for consistent sketchy text.
- **Line-break fix (render layer):** authored diagrams embed line breaks as literal `<br/>` inside
  `.mermaid`. The old code captured source via `textContent`, which silently dropped `<br/>` and
  merged words (e.g. "plane"+"guardrails"). New `readMermaidSource()` converts `<br>`→newline and
  decodes entities before handing source to Mermaid, so multi-line labels render correctly. No
  diagram text was edited.
- **favicon:** added root `favicon.ico` to remove the only remaining console entry (a harmless
  `/favicon.ico` 404) — console is now fully clean.
- **Verified (real Chrome over `python -m http.server`):** all **40** Mermaid diagrams parse in v11
  (`mermaid.parse` → 0 failures); hand-drawn rendering confirmed on flowcharts, decision trees,
  state diagrams, and subgraph/cylinder topologies in **both themes**, desktop + 400px mobile;
  console clean; all CDN resources 200 (mermaid 11.6.0, Caveat font). ASCII `<pre>` diagrams left
  unchanged as required.
- Trade-off note: kept Mermaid's built-in hand-drawn mode (rough.js under the hood) rather than
  redrawing 40 diagrams as Excalidraw exports — zero content risk, no build step, allowed CDNs only.

## Frontier chapter (Ch 23) — uncertainty flags for your review
This is the highest-risk chapter (fast-moving field + training cutoff). Everything is framed as
**"emerging / debated / as of early 2026"** with explicit **maturity ratings** (deploy-now /
experimental / speculative) and a **"prepare, don't predict / no-regret moves"** stance. No specific
product names, benchmark numbers, company claims, or dated events were invented. Please double-check
the following claim *categories*, all of which will drift over time:

- **Accelerators / silicon:** GPUs described as the deploy-now workhorse; TPUs/custom accelerators as
  widely-used datacentre parts; NPUs as increasingly deploy-now for on-device inference. These are
  stable, well-established categories — but the competitive/compute-race specifics move constantly and
  are deliberately kept generic.
- **Neuromorphic computing:** rated **research / experimental** as of early 2026. No maturity claim
  beyond "not mainstream."
- **World models:** rated **experimental** (active research direction). No claims about specific
  systems or capabilities.
- **Embodied AI / robotics:** rated **experimental for general tasks** (narrow wins exist). Avoided
  any claim of general embodied autonomy being production-ready.
- **Multimodal:** rated **mixed — parts deploy-now, frontiers experimental.** Kept qualitative.
- **On-device / edge AI:** rated **increasingly deploy-now for modest models.** Qualitative only.
- **Energy / efficiency:** framed as a **deploy-now pressure/trend**, no specific figures.
- **AGI / ASI:** framed as **genuinely debated** — no consensus on definition or timeline; explicitly
  avoided predicting dates and avoided stating it as settled either way.

All maturity ratings are the author's honest read and are labelled as debatable in-text ("ratings are
as of early 2026 and will change"). If any category has materially shifted since the cutoff, update the
two comparison tables in §10 and the ASCII map in §08 of `chapters/23_frontier.html`.

## New operational chapters (Ch 20–22) — scope boundaries (no-duplication rule)
Enforced strict, non-overlapping lanes with explicit handoff callouts in each chapter:
- **Ch 20 AI SDLC — owns** methodology (framing, data, experimentation, eval-driven iteration, roles,
  how the AI lifecycle differs from spec-driven software SDLC). **Does not cover** deploy mechanics or
  production ops — explicitly hands those to Ch 21 / Ch 22.
- **Ch 21 AIOps — owns** build & ship (CI/CD for models+prompts, environments, versioning/registries,
  packaging/serving, canary/blue-green/shadow/rollback, release governance). **Does not cover** overall
  methodology (Ch 20) or post-live monitoring/incidents (Ch 22).
- **Ch 22 AI-SRE — owns** operate (observability incl. quality & cost signals, SLI/SLO/error budgets,
  alerting, incident response/runbooks, on-call, drift/silent-degradation, DR/failover). **Does not
  cover** building/shipping (Ch 21) or methodology (Ch 20).
- A **shared 3-act lifecycle diagram** (AI SDLC → AIOps → AI-SRE, with a feedback edge) appears in all
  three chapters with the current act highlighted, so readers see they are complementary stages of one
  lifecycle.

## Renumbering (Option A, per your confirmation)
Inserted 20 SDLC / 21 AIOps / 22 AI-SRE / 23 Frontier; renamed `20_future.html`→`24_future.html` and
`21_glossary.html`→`25_glossary.html`. Finale (Autonomous Enterprise) remains **last** teaching
chapter (24); glossary (25) stays excluded from the progress count. Registry, ARC, RELATED, SEARCH_KW,
index story-arc, counts, and all cross-links/recaps/transitions rewired end-to-end.

## Open decisions for you
- Git: kept as a **local git repo** with commits after skeleton and after each chapter (per your
  "keep committing" instruction). No remote/PR configured yet — tell me if you want a PR.
- Font pairing default: **Sora** (headings) + **Inter** (body) + **JetBrains Mono** (code), all Google Fonts.

(Will append here as more items arise during chapter authoring.)
