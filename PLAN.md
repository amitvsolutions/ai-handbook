# PLAN.md — Exponential AI Handbook

Reconciled plan for a premium, multi-chapter, static enterprise AI handbook.
Company throughout: **Exponential AI** (a global retail enterprise).

Authority order (per your message): **your chat message → Book2 → Book1.**
- Book2 = authoritative for STRUCTURE + deliverable format (20 files, folder layout).
- Book1 = authoritative for CONTENT philosophy, per-chapter section template, writing style.

---

## 1. Deliverable structure (from Book2 — authoritative)

```
AI-Handbook/
  index.html                 # landing: hero, story overview, chapter grid, progress, search
  PLAN.md                    # this file
  NOTES.md                   # flagged ambiguous/emerging terms for your review
  assets/
    style.css                # layout, theme (dark/light), glassmorphism, typography
    animations.css           # transitions, timeline, hover, reveal animations
    app.js                   # nav, theme toggle, search, progress tracker, accordions
    icons/                   # any local svg/icon assets (Font Awesome via CDN otherwise)
  chapters/
    01_history.html ... 20_future.html
```

Allowed CDNs only: **Mermaid.js, Font Awesome, Google Fonts, Prism.js.** No frameworks, no build step.
(Prism.js added per approved adjustment #4 — used for code syntax highlighting instead of a hand-written highlighter.)
Opens by double-clicking `index.html` (see §6 for the one server caveat).

---

## 2. Reconciled chapter list — Book1 story mapped onto Book2's 20 files

Book2 fixes the 20 filenames and their ORDER. Book1 supplies a ~15-step Exponential AI
storyline. Below, each Book2 chapter is assigned its story beat so the narrative stays
continuous (each chapter recaps the previous and transitions to the next).

| #  | File                         | Topic                     | Exponential AI story beat (Book1 mapping)                                   |
|----|------------------------------|---------------------------|-------------------------------------------------------------------------|
| 01 | 01_history.html              | History / AI evolution    | Employees do everything manually; the pre-AI enterprise + AI evolution  |
| 02 | 02_machine_learning.html     | Machine Learning          | ML predicts demand & customer churn (Book1 step 2)                       |
| 03 | 03_deep_learning.html        | Deep Learning             | DL recognizes product images (Book1 step 3)                             |
| 04 | 04_transformers.html         | Transformers  *(sample)*  | The architecture that made language understanding possible              |
| 05 | 05_llms.html                 | Large Language Models      | LLMs answer employee/customer questions (Book1 step 4)                  |
| 06 | 06_prompt_engineering.html   | Prompt Engineering         | Getting reliable answers; prompt vs context framing                    |
| 07 | 07_rag.html                  | RAG                        | Hallucinations appear (step 5) → RAG connects model to Exponential AI data (step 6) |
| 08 | 08_agents.html               | AI Agents                  | The AI needs to *act*, not just answer; single agents + tool calling    |
| 09 | 09_agentic_ai.html           | Agentic AI                 | Multiple agents collaborate; agentic dev workflows (steps 9–10)         |
| 10 | 10_langgraph.html            | LangGraph / orchestration  | Orchestrating long-running, stateful multi-agent workflows              |
| 11 | 11_mcp.html                  | Model Context Protocol     | Standardizing tool/API access (Book1 step 7–8: company APIs → MCP)      |
| 12 | 12_acp.html                  | Agent Communication Protocol | Enterprise policy/governance layer for agent comms *(emerging — NOTES)*|
| 13 | 13_a2a.html                  | Agent-to-Agent (A2A)       | Agents discover & delegate to other agents *(A2UI flagged — NOTES)*     |
| 14 | 14_context_engineering.html  | Context Engineering        | Ontology aligns enterprise knowledge (Book1 step 13)                    |
| 15 | 15_guardrails.html           | Guardrails                 | Safety, policy enforcement become necessary (step 11)                   |
| 16 | 16_token_economics.html      | Token Economics            | Cost/token optimization (steps 12/14)                                   |
| 17 | 17_ai_harness.html           | AI Harness / Evaluations   | Harness evaluates quality; offline+online evals (step 12)              |
| 18 | 18_ai_security.html          | AI Security                | Prompt injection, identity, policy engine defenses                     |
| 19 | 19_ai_native_engineering.html| AI-Native Engineering      | Exponential AI becomes AI-native; digital workforce (step 15)              |
| 20 | 20_future.html               | Future                     | Autonomous enterprise; what happens next                              |

---

## 3. Per-chapter section template (from Book1 "EVERY CHAPTER MUST INCLUDE")

Every chapter renders these sections, in this order:

1. Story recap (where Exponential AI left off) + Introduction
2. Why this technology exists
3. Problem statement
4. Historical evolution
5. Internal architecture
6. How it works (step-by-step execution)
7. Real-world analogy / Enterprise example / Software-engineering analogy
8. ASCII diagram
9. Mermaid diagram
10. Comparison table
11. Advantages
12. Disadvantages
13. Best practices
14. Anti-patterns
15. Interview questions
16. Architect notes ("Think Like an Architect")
17. Common mistakes
18. Decision tree
19. Checklist
20. Quiz (knowledge check)
21. Summary
22. Transition to next chapter

**Three explanation levels are REQUIRED in every conceptual chapter** (adjustment #2):
Level 1 simple / Level 2 engineering / Level 3 architect.

**Definition of Done (per chapter):** all 22 sections above present AND substantive +
≥1 Mermaid diagram, ≥1 ASCII diagram, ≥1 comparison table, ≥1 decision tree, ≥1 quiz;
correct nav + progress-tracker links; works in both themes; no console errors.
**Depth floor (adjustment #3):** each chapter ≥ ~2,500 words; every major section is
multi-paragraph prose; no single-sentence stubs.

---

## 4. Shared components (built ONCE in assets, reused everywhere)

- **Theme**: dark/light toggle, persisted in `localStorage`; CSS custom properties.
- **Layout**: responsive (mobile→desktop), glassmorphism cards, beautiful typography (Google Fonts).
- **Sticky nav**: chapter list, current-chapter highlight, keyboard-navigable.
- **Progress tracker**: marks chapters visited/completed (localStorage), shown on index + chapters.
- **Search**: client-side filter over chapter titles/keywords.
- **Accordions**: keyboard-accessible expand/collapse for long sections.
- **Syntax highlighting**: **Prism.js via CDN** (or plain `<pre><code>` styled with CSS). No hand-written highlighter (adjustment #4).
- **Mermaid**: initialized once, theme-aware.
- **Accessibility**: semantic HTML5, alt text, aria attributes, focus states, contrast in both themes.

---

## 5. Conflicts found (Book1 vs Book2) + how resolved

1. **MCP placement.** Book1's story introduces MCP early (step 8, right after RAG/APIs and
   *before* multi-agent). Book2 lists MCP at chapter 11 (after agents, agentic AI, LangGraph).
   → **Resolved:** follow Book2 file order (MCP = ch11), BUT per adjustment #1 narrative
   continuity outranks strict topic order. Ch08–ch11 recaps/transitions will *honestly* bridge
   the gap — acknowledging that Exponential AI felt the pain of ad-hoc tool wiring during the agent
   chapters and that MCP is the standardization that resolves it — rather than pretending ch11
   naturally follows ch10. Same honest-bridge treatment for context engineering at ch14.
2. **Guardrails / Harness / Token / Ontology ordering.** Book1 story order is
   guardrails → harness → ontology → token. Book2 order is context_engineering(14) →
   guardrails(15) → token_economics(16) → ai_harness(17). → **Resolved:** follow Book2 order.
3. **Chapter count.** Book1 outlines ~15 story steps; Book2 mandates 20 chapters. → **Resolved:**
   expand to 20 per Book2, mapping the 15 beats across 20 chapters (see §2); extra chapters
   (prompt engineering, ACP, A2A, context engineering, security, future) draw on Book1's
   evolution list and Book2's "beyond your list" topics.
4. **Company name.** Book1 offers examples (GlobalRetail/PUMA/Nova Enterprise); Book2 and your
   message say **Exponential AI**. → **Resolved:** Exponential AI everywhere (your message wins).
5. **Sample chapter.** Your message names `chapters/04_transformers.html` as the quality bar.
   → Sample chapter = ch04 Transformers.

---

## 6. Tech constraints & the server caveat

- Vanilla HTML5/CSS3/JS only; allowed CDNs = Mermaid, Font Awesome, Google Fonts.
- Target: **opens by double-clicking `index.html`.** To guarantee this, chapters are
  self-contained pages (no `fetch()`/ES-module imports across files that `file://` blocks).
  Shared assets are linked via relative `<link>`/`<script src>` which work under `file://`.
- **If** we later choose to load chapter content via `fetch` (we will NOT by default), a local
  server is required: `python -m http.server` then open `http://localhost:8000`. Noted here so
  the double-click requirement is preserved.

---

## 6b. Approved adjustments (from your review)

1. **Narrative continuity outranks strict topic order.** Keep Book2 file order, but where the
   causal story is strained (esp. MCP@ch11, context engineering@ch14) the recap + transition
   must *genuinely* bridge the gap — no pretending the order is naturally causal. The
   "why was this invented" thread stays unbroken.
2. **Three explanation levels required** in every conceptual chapter (not "where useful").
3. **Depth floor:** ≥ ~2,500 words/chapter, multi-paragraph prose, no stubs, all 22 sections substantive.
4. **Prism.js via CDN** for code highlighting (or styled `<pre><code>`); no custom highlighter.
5. **ch04 sample = gold standard**; every other chapter must match its bar.

## 7. Build sequence (your 3-step process)

1. **PLAN.md (this file) → STOP for review.**  ← we are here
2. Build skeleton (index.html + assets/style.css + animations.css + app.js) and ONE finished
   sample chapter `chapters/04_transformers.html` → STOP for review.
3. After sample approval, build remaining 19 chapters ONE AT A TIME, committing after each,
   reusing shared assets + template, keeping the Exponential AI story continuous.

Ambiguous/emerging terms (ACP, A2A, A2UI, context ontology, etc.) → written accurately and
flagged in `NOTES.md` for your review; no invented confident specifics.
