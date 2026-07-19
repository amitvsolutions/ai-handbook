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

## Open decisions for you
- Git: kept as a **local git repo** with commits after skeleton and after each chapter (per your
  "keep committing" instruction). No remote/PR configured yet — tell me if you want a PR.
- Font pairing default: **Sora** (headings) + **Inter** (body) + **JetBrains Mono** (code), all Google Fonts.

(Will append here as more items arise during chapter authoring.)
