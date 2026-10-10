(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var pubById = {};
  S.pubs.forEach(function (p) { pubById[p.id] = p; });
  var spotlight = {};
  S.highlights.forEach(function (f) { spotlight[f.id] = true; });
  S.efficient.forEach(function (f) { spotlight[f.id] = true; });

  var shortName = function (p) { return p.title.split(":")[0]; };
  var anchorFor = function (id) { return spotlight[id] ? "#work-" + id : "#pub-" + id; };
  var linksHtml = function (links) {
    return Object.keys(links || {}).map(function (k) {
      return '<a href="' + esc(links[k]) + '">' + esc(k) + "</a>";
    }).join("");
  };
  var fmtStars = function (n) {
    if (n >= 1000) return (Math.floor(n / 100) / 10).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  };
  var fmtTime = function (s) { return (Math.round(s * 10) / 10).toFixed(1) + " s"; };
  var isMe = function (name) { return name.replace(/\*$/, "") === S.me; };

  // Full author list up to 10 names; longer lists keep at least 6 names and always reach my name.
  function authorsHtml(list) {
    var meAt = -1;
    list.forEach(function (a, i) { if (isMe(a)) meAt = i; });
    var shown = list;
    if (list.length > 10) shown = list.slice(0, Math.max(6, meAt + 1));
    var out = shown.map(function (a) { return isMe(a) ? "<strong>" + esc(a) + "</strong>" : esc(a); }).join(", ");
    return shown.length < list.length ? out + ", et al." : out;
  }

  // Mel axis (Slaney scale, 0-16 kHz): fraction of height measured from the bottom
  var AXIS = [["16k", 1], ["4k", 0.6355], ["1k", 0.2711], ["0", 0]];
  var PLAY = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9.5-5.5z" fill="currentColor"/></svg>';
  var PAUSE = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor"/></svg>';
  var STAR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.2l2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.5l-4.2 2.3 1-4.6L1.3 6l4.7-.5z" fill="currentColor"/></svg>';
  var EXT = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

  // ---- research themes: one row per direction
  $("themes").innerHTML = S.themes.map(function (t) {
    var works = t.works.map(function (w) {
      var p = pubById[w];
      return '<li><a href="' + anchorFor(w) + '">' + esc(shortName(p)) + "</a><span>" + esc(p.venue) + "</span></li>";
    }).join("");
    return (
      '<li class="theme">' +
      '<div class="theme-head"><h3>' + esc(t.title) + '</h3><p class="theme-keys">' + esc(t.keywords) + "</p></div>" +
      '<div class="theme-body"><p>' + esc(t.text) + '</p><ul class="theme-works">' + works + "</ul></div>" +
      "</li>"
    );
  }).join("");

  // ---- news
  var newsRow = function (n) {
    return '<li><span class="y">' + n.year + '</span><span class="v">' + esc(n.venue) + '</span><span class="t">' + n.text + "</span></li>";
  };
  $("news-list").innerHTML = S.news.filter(function (n) { return n.year >= S.newsFoldBefore; }).map(newsRow).join("");
  var older = S.news.filter(function (n) { return n.year < S.newsFoldBefore; });
  if (older.length) $("news-older").innerHTML = older.map(newsRow).join("");
  else $("news-more").hidden = true;

  // ---- research highlights: every card is a 16:9 figure frame plus a row of demo chips
  function demoHtml(d, id) {
    if (d.type === "audio") {
      var c0 = d.clips[0];
      var axis = AXIS.map(function (a) {
        return '<span style="bottom:' + (a[1] * 100).toFixed(2) + '%">' + a[0] + "</span>";
      }).join("");
      var chips = d.clips.map(function (c, i) {
        return '<button type="button" class="chip demo-chip" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' +
          '<span class="glyph">' + PLAY + "</span>" + esc(c.label) + '<span class="dur">' + fmtTime(c.dur) + "</span></button>";
      }).join("");
      return (
        '<div class="demo demo-audio" data-demo="' + id + '">' +
        '<div class="spec-wrap"><div class="axis" aria-hidden="true">' + axis + "</div>" +
        '<button class="spec" type="button" aria-label="Play or pause the selected sample">' +
        '<img class="lt" src="' + esc(c0.spec) + '-lt.webp" alt="" width="960" height="200" loading="lazy">' +
        '<img class="dk" src="' + esc(c0.spec) + '-dk.webp" alt="" width="960" height="200" loading="lazy">' +
        '<span class="played"></span><span class="playhead"></span></button></div>' +
        '<div class="chips">' + chips + "</div>" +
        '<p class="demo-caption">' + esc(c0.caption) + "</p></div>"
      );
    }
    if (d.type === "video") {
      return (
        '<div class="demo"><div class="chips">' +
        '<button type="button" class="chip video-chip" data-src="' + esc(d.src) + '" data-poster="' + esc(d.poster) + '" aria-pressed="false">' +
        '<span class="glyph">' + PLAY + "</span>" + esc(d.label) + '<span class="dur">' + fmtTime(d.dur) + "</span></button>" +
        "</div></div>"
      );
    }
    return (
      '<div class="demo"><div class="chips">' +
      '<a class="chip" href="' + esc(d.href) + '"><span class="glyph">' + EXT + "</span>" + esc(d.label) + "</a>" +
      "</div></div>"
    );
  }

  $("features").innerHTML = S.highlights.map(function (f) {
    var p = pubById[f.id];
    return (
      '<article class="feature" id="work-' + f.id + '">' +
      '<div class="feature-media">' +
      '<div class="frame"><img src="' + esc(f.figure.src) + '" alt="' + esc(f.figure.alt) + '" loading="lazy"></div>' +
      demoHtml(f.demo, f.id) +
      "</div>" +
      '<div class="feature-text">' +
      '<div class="feature-meta"><span class="venue">' + esc(p.venue) + "</span>" + (p.note ? "<span>" + esc(p.note) + "</span>" : "") + "</div>" +
      "<h3>" + esc(shortName(p)) + "</h3>" +
      '<p class="what">' + esc(f.what) + "</p>" +
      '<p class="how">' + esc(f.how) + "</p>" +
      '<p class="result">' + esc(f.result) + "</p>" +
      '<div class="links">' + linksHtml(p.links) + "</div>" +
      "</div></article>"
    );
  }).join("");

  $("efficient").innerHTML = S.efficient.map(function (e) {
    var p = pubById[e.id];
    return (
      '<article class="eff" id="work-' + e.id + '">' +
      '<div class="feature-meta"><span class="venue">' + esc(p.venue) + "</span>" + (p.note ? "<span>" + esc(p.note) + "</span>" : "") + (e.role ? "<span>" + esc(e.role) + "</span>" : "") + "</div>" +
      "<h3>" + esc(shortName(p)) + "</h3>" +
      "<p>" + esc(e.text) + "</p>" +
      '<p class="figure">' + esc(e.figure) + "</p>" +
      '<div class="links">' + linksHtml(p.links) + "</div>" +
      "</article>"
    );
  }).join("");

  // ---- publications
  function renderPubs(leadOnly) {
    var list = S.pubs.filter(function (p) { return !leadOnly || p.lead; });
    var years = [];
    list.forEach(function (p) { if (years.indexOf(p.year) < 0) years.push(p.year); });
    $("pubs").innerHTML = years.map(function (y) {
      var items = list.filter(function (p) { return p.year === y; }).map(function (p) {
        var first = Object.keys(p.links)[0];
        return (
          '<li class="pub" id="pub-' + p.id + '">' +
          '<div class="pub-venue">' + esc(p.venue) + (p.note ? "<em>" + esc(p.note) + "</em>" : "") + "</div>" +
          '<div class="pub-body">' +
          '<p class="pub-title"><a href="' + esc(p.links[first]) + '">' + esc(p.title) + "</a></p>" +
          '<p class="pub-authors">' + authorsHtml(p.authors) + "</p>" +
          '<div class="links">' + linksHtml(p.links) + "</div>" +
          "</div></li>"
        );
      }).join("");
      return '<section class="pub-year"><h3>' + y + '</h3><ol class="pub-list">' + items + "</ol></section>";
    }).join("");
    $("filter-all").setAttribute("aria-pressed", String(!leadOnly));
    $("filter-lead").setAttribute("aria-pressed", String(leadOnly));
  }
  renderPubs(false);
  $("filter-all").addEventListener("click", function () { renderPubs(false); });
  $("filter-lead").addEventListener("click", function () { renderPubs(true); });

  // ---- impact: flagship systems, then smaller repos; GitHub counts refresh live
  $("impact-cards").innerHTML = S.impact.map(function (m) {
    var metrics = m.metrics.map(function (x) {
      return '<div class="metric"><b' + (x.live ? ' data-live="' + esc(m.repo) + "|" + x.live + '"' : "") + ">" + esc(x.value) + "</b><span>" + esc(x.label) + "</span></div>";
    }).join("");
    return (
      '<article class="impact-card" id="impact-' + m.id + '">' +
      '<div class="impact-top"><h3>' + esc(m.name) + '</h3><span class="role">' + esc(m.role) + "</span></div>" +
      '<div class="metrics">' + metrics + "</div>" +
      '<p class="impact-what">' + esc(m.what) + "</p>" +
      '<p class="impact-mine"><b>My part.</b> ' + esc(m.mine) + "</p>" +
      (m.note ? '<p class="impact-note">' + esc(m.note) + "</p>" : "") +
      '<div class="links">' + linksHtml(m.links) + "</div>" +
      "</article>"
    );
  }).join("");
  $("repos").innerHTML = S.repos.map(function (r) {
    return (
      '<li class="repo">' +
      '<div class="repo-name"><a href="https://github.com/' + esc(r.repo) + '">' + esc(r.name) + "</a><span>" + esc(r.role) + "</span></div>" +
      "<p>" + esc(r.text) + "</p>" +
      '<span class="stars" title="GitHub stars">' + STAR + ' <b data-live="' + esc(r.repo) + '|stars">' + fmtStars(r.stars) + "</b></span>" +
      "</li>"
    );
  }).join("");
  if (window.fetch) {
    var repoNames = {};
    S.impact.forEach(function (m) { repoNames[m.repo] = true; });
    S.repos.forEach(function (r) { repoNames[r.repo] = true; });
    Object.keys(repoNames).forEach(function (repo) {
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 5000);
      fetch("https://api.github.com/repos/" + repo, ctl ? { signal: ctl.signal } : {})
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (d) {
          clearTimeout(timer);
          if (!d || typeof d.stargazers_count !== "number") return;
          var vals = { stars: d.stargazers_count, forks: d.forks_count };
          var els = document.querySelectorAll('[data-live^="' + repo + '|"]');
          for (var i = 0; i < els.length; i++) {
            var kind = els[i].getAttribute("data-live").split("|")[1];
            if (typeof vals[kind] === "number" && vals[kind] > 0) {
              els[i].textContent = fmtStars(vals[kind]) + (vals[kind] >= 1000 && /\+$/.test(els[i].textContent) ? "+" : "");
            }
          }
        })
        .catch(function () { clearTimeout(timer); });
    });
  }

  // ---- recognition and service
  $("honors").innerHTML = S.honors.map(function (h) {
    return "<li><span>" + esc(h.what) + "</span><span>" + esc(h.detail) + "</span></li>";
  }).join("");
  $("service-list").innerHTML = S.service.map(function (s) {
    return '<li class="stack"><b>' + esc(s.role) + "</b><span>" + esc(s.where) + "</span></li>";
  }).join("");

  // ---- background (off by default)
  if (S.showBackground && S.background && S.background.length) {
    $("timeline").innerHTML = S.background.map(function (b) {
      return '<li><span class="when">' + esc(b.when) + "</span><span><b>" + esc(b.what) + "</b>, " + esc(b.where) + "</span></li>";
    }).join("");
    $("background").hidden = false;
  }

  // ---- audio demos: one sample plays at a time; the playhead follows currentTime
  var hl = {};
  S.highlights.forEach(function (f) { hl[f.id] = f; });
  var playing = null;
  var videos = [];

  function demoState(root) {
    if (root._state) return root._state;
    var clips = hl[root.getAttribute("data-demo")].demo.clips;
    var st = {
      root: root, clips: clips, sel: 0, audios: [], raf: 0,
      spec: root.querySelector(".spec"), head: root.querySelector(".playhead"), played: root.querySelector(".played"),
    };
    root._state = st;
    return st;
  }
  function audioFor(st, i) {
    if (!st.audios[i]) {
      var a = new Audio(st.clips[i].src);
      a.preload = "auto";
      a.addEventListener("ended", function () { pause(st); setProgress(st, 0); });
      st.audios[i] = a;
    }
    return st.audios[i];
  }
  function setProgress(st, f) {
    st.head.style.left = "calc(" + (f * 100).toFixed(3) + "% - 1px)";
    st.played.style.width = (f * 100).toFixed(3) + "%";
  }
  function tick(st) {
    var a = st.audios[st.sel];
    if (!a) return;
    setProgress(st, a.duration ? Math.min(1, a.currentTime / a.duration) : 0);
    if (!a.paused) st.raf = requestAnimationFrame(function () { tick(st); });
  }
  function chipGlyphs(st) {
    var chips = st.root.querySelectorAll(".demo-chip");
    for (var i = 0; i < chips.length; i++) {
      var on = i === st.sel && playing === st;
      chips[i].setAttribute("aria-pressed", String(i === st.sel));
      chips[i].querySelector(".glyph").innerHTML = on ? PAUSE : PLAY;
    }
  }
  function pause(st) {
    var a = st.audios[st.sel];
    if (a) a.pause();
    cancelAnimationFrame(st.raf);
    st.spec.classList.remove("playing");
    if (playing === st) playing = null;
    chipGlyphs(st);
  }
  function play(st) {
    if (playing && playing !== st) pause(playing);
    videos.forEach(function (v) { v.pause(); });
    var a = audioFor(st, st.sel);
    var p = a.play();
    if (p && p.catch) p.catch(function () { pause(st); });
    playing = st;
    st.spec.classList.add("playing");
    chipGlyphs(st);
    tick(st);
  }
  function select(st, i) {
    if (i === st.sel) return;
    pause(st);
    var old = st.audios[st.sel];
    if (old) old.currentTime = 0;
    st.sel = i;
    var c = st.clips[i];
    st.root.querySelector("img.lt").src = c.spec + "-lt.webp";
    st.root.querySelector("img.dk").src = c.spec + "-dk.webp";
    st.root.querySelector(".demo-caption").textContent = c.caption;
    setProgress(st, 0);
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest ? ev.target : null;
    if (!t) return;
    var chip = t.closest(".demo-chip");
    var spec = t.closest(".demo-audio .spec");
    if (chip || spec) {
      var st = demoState((chip || spec).closest(".demo-audio"));
      if (chip) {
        var i = Number(chip.getAttribute("data-i"));
        if (i !== st.sel) { select(st, i); play(st); return; }
      }
      if (playing === st) pause(st); else play(st);
      return;
    }
    var vchip = t.closest(".video-chip");
    if (vchip) {
      var frame = vchip.closest(".feature-media").querySelector(".frame");
      if (!frame._figure) { frame._figure = frame.innerHTML; vchip._label = vchip.innerHTML; }
      if (vchip.getAttribute("aria-pressed") === "true") {
        frame.innerHTML = frame._figure;
        frame.classList.remove("is-video");
        vchip.setAttribute("aria-pressed", "false");
        vchip.innerHTML = vchip._label;
        return;
      }
      if (playing) pause(playing);
      frame.innerHTML =
        '<video controls playsinline autoplay poster="' + esc(vchip.getAttribute("data-poster")) + '">' +
        '<source src="' + esc(vchip.getAttribute("data-src")) + '" type="video/mp4"></video>';
      var v = frame.querySelector("video");
      videos.push(v);
      v.addEventListener("play", function () { if (playing) pause(playing); });
      frame.classList.add("is-video");
      vchip.setAttribute("aria-pressed", "true");
      vchip.innerHTML = '<span class="glyph">' + EXT.replace("M4 2h6v6M10 2 3 9", "M9 3 3 9M3 3l6 6") + "</span>Back to figure";
    }
  });

  // ---- theme toggle
  var root = document.documentElement;
  $("theme-toggle").addEventListener("click", function () {
    var explicit = root.getAttribute("data-theme");
    var dark = explicit ? explicit === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---- copy email
  $("copy-email").addEventListener("click", function () {
    var text = $("email-text").textContent.trim();
    var status = $("copy-status");
    var fallback = function () {
      var r = document.createRange();
      r.selectNodeContents($("email-text"));
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      status.textContent = "Selected. Press Ctrl+C or ⌘C to copy.";
    };
    try {
      navigator.clipboard.writeText(text).then(function () { status.textContent = "Copied."; }, fallback);
    } catch (e) { fallback(); }
  });
})();
