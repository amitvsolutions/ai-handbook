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
    { n: 20, file: "20_sdlc.html",                 title: "AI Development Lifecycle",   icon: "fa-diagram-project" },
    { n: 21, file: "21_aiops.html",                title: "AIOps: Build & Deploy",      icon: "fa-boxes-packing" },
    { n: 22, file: "22_ai_sre.html",               title: "AI-SRE: Run in Production",  icon: "fa-gauge-high" },
    { n: 23, file: "23_frontier.html",             title: "The Frontier",               icon: "fa-satellite-dish" },
    { n: 24, file: "24_future.html",               title: "The Autonomous Enterprise",  icon: "fa-rocket" }
  ];

  /* ---- Reference pages (nav only; NOT part of the chapter progress) ---- */
  var GLOSSARY = { file: "25_glossary.html", n: 25, title: "Glossary", icon: "fa-book" };

  /* ---- One-word story-arc phase per chapter (index timeline) ---- */
  var ARC = {
    1: "Manual", 2: "Learn", 3: "Perceive", 4: "Attend", 5: "Language",
    6: "Steer", 7: "Ground", 8: "Act", 9: "Plan", 10: "Orchestrate",
    11: "Connect", 12: "Communicate", 13: "Collaborate", 14: "Focus", 15: "Bound",
    16: "Afford", 17: "Measure", 18: "Defend", 19: "Build", 20: "Iterate",
    21: "Ship", 22: "Operate", 23: "Frontier", 24: "Autonomy"
  };

  /* ---- Related chapters (data-driven cross-links, 2–4 per chapter) ---- */
  var RELATED = {
    1: [2, 3, 20], 2: [1, 3, 4], 3: [2, 4, 5], 4: [3, 5, 6], 5: [4, 6, 7],
    6: [5, 7, 14], 7: [6, 14, 8, 17], 8: [7, 9, 10, 15], 9: [8, 10, 11],
    10: [9, 8, 11], 11: [10, 12, 13], 12: [11, 13, 9], 13: [11, 12, 9],
    14: [7, 6, 16, 15], 15: [8, 18, 17], 16: [14, 17, 5], 17: [15, 16, 18],
    18: [15, 17, 11], 19: [20, 17, 15], 20: [19, 21, 17], 21: [20, 22, 19],
    22: [21, 17, 15], 23: [24, 5, 3, 16], 24: [23, 19, 15, 1]
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
    20: "sdlc ai development lifecycle methodology data-centric experimentation eval-driven mlops project framing",
    21: "aiops ci cd continuous delivery deployment model prompt registry versioning canary blue-green shadow rollback serving packaging release governance",
    22: "ai-sre reliability observability tracing logs metrics slo sli error budget alerting incident on-call runbook drift degradation failover disaster recovery monitoring",
    23: "frontier advanced emerging gpu tpu npu accelerator silicon neuromorphic world models embodied physical robotics multimodal edge on-device energy efficiency agi asi compute",
    24: "future autonomous enterprise a2ui roadmap"
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
  // Capture a diagram's source verbatim. The authored HTML embeds line breaks
  // as literal <br/> elements inside .mermaid; textContent would silently drop
  // them (merging "plane"+"guardrails"), so convert <br> to newlines and decode
  // entities (e.g. &gt; -> >) before handing the source to Mermaid.
  function readMermaidSource(el) {
    var html = el.innerHTML.replace(/<br\s*\/?>/gi, "\n");
    var ta = doc.createElement("textarea");
    ta.innerHTML = html;
    return ta.value.replace(/\u00a0/g, " ").replace(/[ \t]+$/gm, "").trim();
  }
  function initMermaid(theme) {
    if (typeof window.mermaid === "undefined") return;
    if (mermaidBusy) return; // avoid overlapping renders (theme toggle spam)
    var dark = theme === "dark";
    // Clean, modern, "premium" diagrams (Stripe/Linear/O'Reilly feel): straight
    // crisp strokes, rounded-rect nodes with a soft shadow, one calm neutral fill
    // + a single accent for emphasis/decision nodes. theme:"base" so we fully
    // control the palette from the handbook's design tokens, in both themes.
    var FONT = '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    var pal = dark ? {
      fill: "#1e2748", border: "#3c4a7d", text: "#e8ecf8",
      accentFill: "#26326a", accentBorder: "#818cf8",
      line: "#7783a6", note: "#1d3f66", noteBorder: "#38b6d1", noteText: "#e8ecf8",
      cluster: "rgba(99,102,241,.08)", clusterBorder: "#3c4a7d",
      shadow: "drop-shadow(0 2px 4px rgba(0,0,0,.45))"
    } : {
      fill: "#ffffff", border: "#d5dbec", text: "#14203b",
      accentFill: "#eef0ff", accentBorder: "#6366f1",
      line: "#6b7690", note: "#e7f7fb", noteBorder: "#0891b2", noteText: "#14203b",
      cluster: "rgba(99,102,241,.06)", clusterBorder: "#d5dbec",
      shadow: "drop-shadow(0 2px 5px rgba(30,41,80,.13))"
    };
    var vars = {
      fontFamily: FONT,
      fontSize: "16px",
      background: "transparent",
      primaryColor: pal.fill,
      primaryTextColor: pal.text,
      primaryBorderColor: pal.border,
      secondaryColor: pal.fill,
      secondaryTextColor: pal.text,
      secondaryBorderColor: pal.border,
      tertiaryColor: pal.fill,
      tertiaryTextColor: pal.text,
      tertiaryBorderColor: pal.border,
      lineColor: pal.line,
      textColor: pal.text,
      mainBkg: pal.fill,
      nodeBorder: pal.border,
      clusterBkg: pal.cluster,
      clusterBorder: pal.clusterBorder,
      noteBkgColor: pal.note,
      noteTextColor: pal.noteText,
      noteBorderColor: pal.noteBorder
    };
    var conf = {
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      fontFamily: FONT,
      themeVariables: vars,
      flowchart: { nodeSpacing: 58, rankSpacing: 64, padding: 24, curve: "basis", useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true },
      state: { useMaxWidth: true }
    };
    try { window.mermaid.initialize(conf); } catch (e) {}
    // Post-render normalisation (global, no diagram content touched): give every
    // node one consistent clean treatment — neutral fill + thin border + rounded
    // corners + soft shadow, with a single accent for decision/emphasis nodes —
    // and force the sans-serif label font + crisp uniform-weight edges/arrows.
    var normalizeClean = function () {
      $all(".mermaid svg").forEach(function (svg) {
        svg.querySelectorAll("g.node").forEach(function (n) {
          var c = n.querySelector(".label-container") || n;
          var emph = /fill\s*:/.test(c.getAttribute("style") || "") || !!n.querySelector("polygon");
          var fillCol = emph ? pal.accentFill : pal.fill;
          var strokeCol = emph ? pal.accentBorder : pal.border;
          n.querySelectorAll("rect, polygon, circle, ellipse, path").forEach(function (s) {
            s.setAttribute("fill", fillCol);
            s.setAttribute("stroke", strokeCol);
            s.setAttribute("stroke-width", "1.5");
            s.style.strokeLinejoin = "round";
          });
          n.querySelectorAll("rect").forEach(function (r) { r.setAttribute("rx", "8"); r.setAttribute("ry", "8"); });
          n.style.filter = pal.shadow;
          if (c.style) { c.style.fill = fillCol; c.style.stroke = strokeCol; }
          n.querySelectorAll(".nodeLabel, .nodeLabel *, foreignObject div, foreignObject span, foreignObject p").forEach(function (t) {
            t.style.setProperty("color", pal.text, "important");
            t.style.setProperty("font-family", FONT, "important");
            t.style.setProperty("opacity", "1", "important");
          });
        });
        svg.querySelectorAll("g.cluster").forEach(function (cl) {
          cl.querySelectorAll("rect, path, polygon").forEach(function (s) {
            s.setAttribute("fill", pal.cluster); s.setAttribute("stroke", pal.clusterBorder); s.setAttribute("stroke-width", "1.2");
          });
          cl.querySelectorAll("rect").forEach(function (r) { r.setAttribute("rx", "10"); r.setAttribute("ry", "10"); });
          cl.querySelectorAll(".cluster-label *, .nodeLabel, foreignObject div, foreignObject span").forEach(function (t) {
            t.style.setProperty("color", pal.text, "important");
            t.style.setProperty("font-family", FONT, "important");
          });
        });
        svg.querySelectorAll("g.note, .note").forEach(function (nt) {
          nt.querySelectorAll("rect, path").forEach(function (s) {
            s.setAttribute("fill", pal.note); s.setAttribute("stroke", pal.noteBorder);
          });
        });
        svg.querySelectorAll(".arrowMarkerPath").forEach(function (m) {
          m.setAttribute("fill", pal.line); m.setAttribute("stroke", pal.line);
        });
        svg.querySelectorAll("path.flowchart-link, .edgePath path, .transition").forEach(function (e) {
          e.setAttribute("stroke", pal.line);
          e.setAttribute("stroke-width", "1.5");
        });
        svg.querySelectorAll(".edgeLabel, .edgeLabel *").forEach(function (t) {
          t.style.setProperty("color", pal.text, "important");
          t.style.setProperty("font-family", FONT, "important");
        });
      });
    };
    // Re-render: restore original source into .mermaid nodes, then run.
    var nodes = $all(".mermaid");
    if (!nodes.length) return;
    nodes.forEach(function (el) {
      if (!el.getAttribute("data-src")) el.setAttribute("data-src", readMermaidSource(el));
      el.removeAttribute("data-processed");
      el.textContent = el.getAttribute("data-src");
    });
    mermaidBusy = true;
    try {
      var done = function () {
        try { normalizeClean(); } catch (e) {}
        mermaidBusy = false;
      };
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
      '<li class="nav-item nav-item--ref' + (gActive ? " is-active" : "") + '" data-nav-search="25 glossary reference terms definitions">' +
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
