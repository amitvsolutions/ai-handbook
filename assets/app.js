/* ==========================================================================
   Exponential AI Handbook — shared application logic
   Vanilla JS only. Works under file:// (no fetch, no modules).
   Responsibilities: chapter registry, theme toggle, sidebar nav, search,
   progress tracker, reading-progress bar, accordions, Mermaid + Prism init.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Chapter registry (single source of truth for nav + progress) ---- */
  var CHAPTERS = [
    { n: 1,  file: "01_history.html",              title: "The Pre-AI Enterprise",      icon: "fa-landmark" },
    { n: 2,  file: "02_machine_learning.html",     title: "Machine Learning",           icon: "fa-chart-line" },
    { n: 3,  file: "03_deep_learning.html",        title: "Deep Learning",              icon: "fa-network-wired" },
    { n: 4,  file: "04_transformers.html",         title: "Transformers",               icon: "fa-bolt" },
    { n: 5,  file: "05_llms.html",                 title: "Large Language Models",      icon: "fa-comments" },
    { n: 6,  file: "06_prompt_engineering.html",   title: "Prompt Engineering",         icon: "fa-keyboard" },
    { n: 7,  file: "07_rag.html",                  title: "Retrieval-Augmented Gen.",   icon: "fa-book-open" },
    { n: 8,  file: "08_agents.html",               title: "AI Agents",                  icon: "fa-robot" },
    { n: 9,  file: "09_agentic_ai.html",           title: "Agentic AI",                 icon: "fa-people-group" },
    { n: 10, file: "10_langgraph.html",            title: "LangGraph & Orchestration",  icon: "fa-diagram-project" },
    { n: 11, file: "11_mcp.html",                  title: "Model Context Protocol",     icon: "fa-plug" },
    { n: 12, file: "12_acp.html",                  title: "Agent Communication Proto.", icon: "fa-tower-broadcast" },
    { n: 13, file: "13_a2a.html",                  title: "Agent-to-Agent (A2A)",       icon: "fa-handshake" },
    { n: 14, file: "14_context_engineering.html",  title: "Context Engineering",        icon: "fa-layer-group" },
    { n: 15, file: "15_guardrails.html",           title: "Guardrails",                 icon: "fa-shield-halved" },
    { n: 16, file: "16_token_economics.html",      title: "Token Economics",            icon: "fa-coins" },
    { n: 17, file: "17_ai_harness.html",           title: "AI Harness & Evaluations",   icon: "fa-flask-vial" },
    { n: 18, file: "18_ai_security.html",          title: "AI Security",                icon: "fa-user-shield" },
    { n: 19, file: "19_ai_native_engineering.html",title: "AI-Native Engineering",      icon: "fa-industry" },
    { n: 20, file: "20_future.html",               title: "The Autonomous Enterprise",  icon: "fa-rocket" }
  ];

  /* ---- Reference pages (nav only; NOT part of the 20-chapter progress) ---- */
  var GLOSSARY = { file: "21_glossary.html", n: 21, title: "Glossary", icon: "fa-book" };

  /* ---- One-word story-arc phase per chapter (index timeline) ---- */
  var ARC = {
    1: "Manual", 2: "Learn", 3: "Perceive", 4: "Attend", 5: "Language",
    6: "Steer", 7: "Ground", 8: "Act", 9: "Plan", 10: "Orchestrate",
    11: "Connect", 12: "Communicate", 13: "Collaborate", 14: "Focus", 15: "Bound",
    16: "Afford", 17: "Measure", 18: "Defend", 19: "Build", 20: "Autonomy"
  };

  /* ---- Related chapters (data-driven cross-links, 2–4 per chapter) ---- */
  var RELATED = {
    1: [2, 3, 20], 2: [1, 3, 4], 3: [2, 4, 5], 4: [3, 5, 6], 5: [4, 6, 7],
    6: [5, 7, 14], 7: [6, 14, 8, 17], 8: [7, 9, 10, 15], 9: [8, 10, 11],
    10: [9, 8, 11], 11: [10, 12, 13], 12: [11, 13, 9], 13: [11, 12, 9],
    14: [7, 6, 16, 15], 15: [8, 18, 17], 16: [14, 17, 5], 17: [15, 16, 18],
    18: [15, 17, 11], 19: [17, 15, 20], 20: [19, 15, 9, 1]
  };

  /* ---- Extra search keywords/acronyms so nav search finds topics by term ---- */
  var SEARCH_KW = {
    1: "history manual pre-ai spreadsheets rules baseline",
    2: "ml supervised regression classification features",
    3: "dl neural network cnn rnn backpropagation vision",
    4: "attention self-attention bert gpt encoder decoder",
    5: "llm gpt tokens context window scaling inference",
    6: "prompt few-shot zero-shot chain of thought cot system prompt",
    7: "rag retrieval embeddings vector database chunking reranking grounding hallucination",
    8: "agents tools function calling react loop",
    9: "agentic multi-agent planning delegation supervisor",
    10: "langgraph orchestration state graph workflow",
    11: "mcp model context protocol tools resources json-rpc",
    12: "acp agent communication protocol interoperability",
    13: "a2a agent-to-agent agent card tasks google",
    14: "context engineering ontology window memory compression",
    15: "guardrails safety moderation validation human-in-the-loop",
    16: "token economics cost latency pricing budget caching",
    17: "harness eval evaluation testing benchmark llm-as-judge",
    18: "security prompt injection owasp exfiltration least privilege",
    19: "ai-native engineering verification tests ci review",
    20: "future autonomous enterprise a2ui roadmap"
  };

  var LS_THEME = "exponential-ai-theme";
  var LS_PROGRESS = "exponential-ai-progress"; // JSON array of completed chapter numbers

  var doc = document;
  var root = doc.documentElement;
  var ROOT_PREFIX = root.getAttribute("data-root") || ""; // "" on index, "../" in chapters/
  var CURRENT = parseInt(root.getAttribute("data-chapter") || "0", 10); // 0 = index

  /* -------------------------- utilities -------------------------------- */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(LS_PROGRESS);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveProgress(arr) {
    try { localStorage.setItem(LS_PROGRESS, JSON.stringify(arr)); } catch (e) {}
  }
  function chapterByNum(n) {
    return CHAPTERS.filter(function (c) { return c.n === n; })[0];
  }
  function markComplete(n) {
    if (!n || !chapterByNum(n)) return; // reference pages (e.g. glossary) don't count
    var p = loadProgress();
    if (p.indexOf(n) === -1) { p.push(n); saveProgress(p); }
  }

  /* --------------------------- theme ---------------------------------- */
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    try { return localStorage.getItem(LS_THEME) || "dark"; } catch (e) { return "dark"; }
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(LS_THEME, theme); } catch (e) {}
    var btns = $all("[data-theme-toggle]");
    btns.forEach(function (b) {
      var icon = $("i", b);
      if (icon) icon.className = "fa-solid " + (theme === "dark" ? "fa-sun" : "fa-moon");
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      b.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
    initMermaid(theme); // re-render diagrams with theme colors
  }
  function toggleTheme() {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  }

  /* --------------------------- Mermaid -------------------------------- */
  var mermaidBusy = false;
  function initMermaid(theme) {
    if (typeof window.mermaid === "undefined") return;
    if (mermaidBusy) return; // avoid overlapping renders (theme toggle spam)
    var conf = {
      startOnLoad: false,
      securityLevel: "loose",
      theme: theme === "dark" ? "dark" : "default",
      themeVariables: { fontFamily: "Inter, system-ui, sans-serif" }
    };
    try { window.mermaid.initialize(conf); } catch (e) {}
    // Re-render: restore original source into .mermaid nodes, then run.
    var nodes = $all(".mermaid");
    if (!nodes.length) return;
    nodes.forEach(function (el) {
      if (!el.getAttribute("data-src")) el.setAttribute("data-src", el.textContent.trim());
      el.removeAttribute("data-processed");
      el.innerHTML = el.getAttribute("data-src");
    });
    mermaidBusy = true;
    try {
      var done = function () { mermaidBusy = false; };
      if (window.mermaid.run) {
        // mermaid v10 returns a promise; swallow render errors so they don't
        // surface as uncaught rejections (diagram issues remain visible in-page).
        Promise.resolve(window.mermaid.run({ nodes: nodes })).then(done, done);
      } else if (window.mermaid.init) {
        window.mermaid.init(undefined, nodes);
        done();
      } else { done(); }
    } catch (e) { mermaidBusy = false; }
  }

  /* --------------------------- sidebar nav ---------------------------- */
  function buildNav() {
    var list = $("[data-nav-list]");
    if (!list) return;
    var progress = loadProgress();
    var html = "";
    CHAPTERS.forEach(function (c) {
      var done = progress.indexOf(c.n) !== -1;
      var active = c.n === CURRENT;
      var num = c.n < 10 ? "0" + c.n : "" + c.n;
      html +=
        '<li class="nav-item' + (active ? " is-active" : "") + '" data-nav-search="' +
          (c.n + " " + c.title + " " + (SEARCH_KW[c.n] || "")).toLowerCase() + '">' +
          '<a class="nav-link" href="' + ROOT_PREFIX + "chapters/" + c.file + '"' +
            (active ? ' aria-current="page"' : "") + '>' +
            '<span class="nav-num">' + num + '</span>' +
            '<i class="fa-solid ' + c.icon + ' nav-ico" aria-hidden="true"></i>' +
            '<span class="nav-title">' + c.title + '</span>' +
            '<span class="nav-check' + (done ? " is-done" : "") + '" aria-hidden="true">' +
              (done ? '<i class="fa-solid fa-circle-check"></i>' : "") + "</span>" +
          "</a></li>";
    });
    // Reference section — glossary (not counted in the 20-chapter progress)
    var gActive = CURRENT === GLOSSARY.n;
    html +=
      '<li class="nav-item nav-item--ref' + (gActive ? " is-active" : "") + '" data-nav-search="21 glossary reference terms definitions">' +
        '<a class="nav-link" href="' + ROOT_PREFIX + "chapters/" + GLOSSARY.file + '"' +
          (gActive ? ' aria-current="page"' : "") + '>' +
          '<span class="nav-num">§</span>' +
          '<i class="fa-solid ' + GLOSSARY.icon + ' nav-ico" aria-hidden="true"></i>' +
          '<span class="nav-title">' + GLOSSARY.title + '</span>' +
          '<span class="nav-check" aria-hidden="true"></span>' +
        "</a></li>";
    list.innerHTML = html;
  }

  /* --------------------------- search --------------------------------- */
  function wireSearch() {
    var input = $("[data-nav-search-input]");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      $all("[data-nav-search]").forEach(function (li) {
        var hit = !q || li.getAttribute("data-nav-search").indexOf(q) !== -1;
        li.style.display = hit ? "" : "none";
      });
    });
  }

  /* --------------------- glossary page filter ------------------------- */
  function wireGlossary() {
    var input = $("[data-glossary-search]");
    if (!input) return;
    var terms = $all(".glossary-term");
    var groups = $all(".glossary-group");
    var empty = $("[data-glossary-empty]");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var anyVisible = false;
      terms.forEach(function (t) {
        var hit = !q || (t.getAttribute("data-term") || "").indexOf(q) !== -1;
        t.classList.toggle("is-hidden", !hit);
        if (hit) anyVisible = true;
      });
      groups.forEach(function (g) {
        var visible = $all(".glossary-term", g).some(function (t) {
          return !t.classList.contains("is-hidden");
        });
        g.style.display = visible ? "" : "none";
      });
      if (empty) empty.hidden = anyVisible;
    });
  }

  /* ------------------ progress bar (sidebar summary) ------------------ */
  function updateProgressSummary() {
    var p = loadProgress();
    var pct = Math.round((p.length / CHAPTERS.length) * 100);
    var bar = $("[data-progress-bar]");
    var label = $("[data-progress-label]");
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = p.length + " / " + CHAPTERS.length + " chapters";
  }

  /* ------------------ reading progress (scroll) ---------------------- */
  function wireReadingBar() {
    var bar = $("[data-reading-bar]");
    if (!bar) return;
    function onScroll() {
      var h = doc.documentElement;
      var scrolled = h.scrollTop || doc.body.scrollTop;
      var height = h.scrollHeight - h.clientHeight;
      var pct = height > 0 ? (scrolled / height) * 100 : 0;
      bar.style.width = pct + "%";
      if (pct > 92) markComplete(CURRENT); // finished reading -> complete
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------- accordions ----------------------------- */
  function wireAccordions() {
    $all("[data-accordion]").forEach(function (acc) {
      var btn = $(".accordion-header", acc);
      var panel = $(".accordion-panel", acc);
      if (!btn || !panel) return;
      var open = acc.getAttribute("data-open") === "true";
      function set(state) {
        acc.classList.toggle("is-open", state);
        btn.setAttribute("aria-expanded", state ? "true" : "false");
        panel.hidden = !state;
      }
      set(open);
      btn.addEventListener("click", function () { set(!acc.classList.contains("is-open")); });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(!acc.classList.contains("is-open")); }
      });
    });
  }

  /* --------------------------- quizzes -------------------------------- */
  function wireQuizzes() {
    $all("[data-quiz]").forEach(function (quiz) {
      $all(".quiz-option", quiz).forEach(function (opt) {
        opt.addEventListener("click", function () {
          var q = opt.closest("[data-question]");
          if (!q) return;
          $all(".quiz-option", q).forEach(function (o) { o.classList.remove("is-correct", "is-wrong"); });
          var correct = opt.getAttribute("data-correct") === "true";
          opt.classList.add(correct ? "is-correct" : "is-wrong");
          var fb = $(".quiz-feedback", q);
          if (fb) {
            fb.textContent = correct ? "Correct. " + (q.getAttribute("data-explain") || "")
                                     : "Not quite — try again.";
            fb.className = "quiz-feedback " + (correct ? "is-correct" : "is-wrong");
          }
        });
      });
    });
  }

  /* --------------------------- mobile nav ----------------------------- */
  function wireMobileNav() {
    var toggle = $("[data-nav-toggle]");
    var sidebar = $("[data-sidebar]");
    var scrim = $("[data-scrim]");
    if (!toggle || !sidebar) return;
    function set(open) {
      sidebar.classList.toggle("is-open", open);
      if (scrim) scrim.classList.toggle("is-visible", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function () { set(!sidebar.classList.contains("is-open")); });
    if (scrim) scrim.addEventListener("click", function () { set(false); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  /* ----------------------- prev/next chapter -------------------------- */
  function wirePrevNext() {
    var wrap = $("[data-prevnext]");
    if (!wrap || !CURRENT) return;
    var prev = CHAPTERS.filter(function (c) { return c.n === CURRENT - 1; })[0];
    var next = CHAPTERS.filter(function (c) { return c.n === CURRENT + 1; })[0];
    var html = "";
    if (prev) html += '<a class="pn-link pn-prev" href="' + ROOT_PREFIX + "chapters/" + prev.file +
      '"><span class="pn-dir"><i class="fa-solid fa-arrow-left"></i> Previous</span><span class="pn-title">' +
      prev.n + ". " + prev.title + "</span></a>";
    else html += '<a class="pn-link pn-prev" href="' + ROOT_PREFIX +
      'index.html"><span class="pn-dir"><i class="fa-solid fa-arrow-left"></i> Home</span><span class="pn-title">Handbook overview</span></a>';
    if (next) html += '<a class="pn-link pn-next" href="' + ROOT_PREFIX + "chapters/" + next.file +
      '"><span class="pn-dir">Next <i class="fa-solid fa-arrow-right"></i></span><span class="pn-title">' +
      next.n + ". " + next.title + "</span></a>";
    wrap.innerHTML = html;
  }

  /* --------------------- related chapters (cross-links) --------------- */
  function wireRelated() {
    if (!CURRENT || CURRENT > CHAPTERS.length) return; // chapters only
    var rel = RELATED[CURRENT];
    if (!rel || !rel.length) return;
    var pn = $("[data-prevnext]");
    if (!pn) return;
    var cards = rel.map(function (n) {
      var c = chapterByNum(n);
      if (!c) return "";
      var num = n < 10 ? "0" + n : "" + n;
      return '<a class="related-link" href="' + ROOT_PREFIX + "chapters/" + c.file + '">' +
        '<i class="fa-solid ' + c.icon + '" aria-hidden="true"></i>' +
        '<span class="related-text"><span class="related-num">Chapter ' + num + '</span>' +
        '<span class="related-name">' + c.title + '</span></span></a>';
    }).join("");
    var box = doc.createElement("section");
    box.className = "section related-section";
    box.setAttribute("aria-label", "Related chapters");
    box.innerHTML = '<span class="section-tag"><i class="fa-solid fa-diagram-project"></i> Related chapters</span>' +
      '<div class="related-grid">' + cards + "</div>";
    var section = pn.closest ? pn.closest(".section") : null;
    if (section && section.parentNode) section.parentNode.insertBefore(box, section);
    else pn.parentNode.insertBefore(box, pn);
  }

  /* --------------------- index story-arc timeline --------------------- */
  function buildArcTimeline() {
    var track = $("[data-arc-timeline]");
    if (!track) return;
    var html = "";
    CHAPTERS.forEach(function (c) {
      var num = c.n < 10 ? "0" + c.n : "" + c.n;
      html +=
        '<a class="arc-node" href="chapters/' + c.file + '" title="Chapter ' + num + " — " + c.title + '">' +
          '<span class="arc-dot"><i class="fa-solid ' + c.icon + '" aria-hidden="true"></i></span>' +
          '<span class="arc-phase">' + (ARC[c.n] || "") + "</span>" +
          '<span class="arc-num">Ch ' + num + "</span>" +
        "</a>";
    });
    track.innerHTML = html;
  }

  /* --------------------------- index grid ----------------------------- */
  function buildIndexGrid() {
    var grid = $("[data-chapter-grid]");
    if (!grid) return;
    var progress = loadProgress();
    var html = "";
    CHAPTERS.forEach(function (c) {
      var done = progress.indexOf(c.n) !== -1;
      var num = c.n < 10 ? "0" + c.n : "" + c.n;
      html +=
        '<a class="ch-card glass reveal" href="chapters/' + c.file + '">' +
          '<div class="ch-card-top"><span class="ch-card-num">' + num + '</span>' +
            '<i class="fa-solid ' + c.icon + ' ch-card-ico" aria-hidden="true"></i>' +
            (done ? '<span class="ch-card-done"><i class="fa-solid fa-circle-check"></i></span>' : "") +
          "</div>" +
          '<h3 class="ch-card-title">' + c.title + "</h3>" +
          '<span class="ch-card-cta">Read chapter <i class="fa-solid fa-arrow-right"></i></span>' +
        "</a>";
    });
    grid.innerHTML = html;
  }

  /* --------------------- scroll reveal animation ---------------------- */
  function wireReveal() {
    var els = $all(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------- init ----------------------------------- */
  function init() {
    applyTheme(currentTheme());
    $all("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", toggleTheme);
    });
    buildNav();
    buildIndexGrid();
    buildArcTimeline();
    wireRelated();
    wireSearch();
    wireGlossary();
    updateProgressSummary();
    wireReadingBar();
    wireAccordions();
    wireQuizzes();
    wireMobileNav();
    wirePrevNext();
    wireReveal();
    if (typeof window.Prism !== "undefined" && window.Prism.highlightAll) {
      window.Prism.highlightAll();
    }
    // Mermaid is already rendered by applyTheme() above; no second call needed.
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();

  // expose for potential debugging (kept minimal)
  window.ExponentialAIHandbook = { chapters: CHAPTERS, toggleTheme: toggleTheme };
})();
