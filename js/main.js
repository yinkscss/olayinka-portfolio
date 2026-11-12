/* =============================================================
   main.js — every interactive feature of the portfolio.
   Written in plain (vanilla) JavaScript, no libraries.

   Structure: each feature lives in its own small function
   (initTheme, initMobileNav, ...). At the bottom, one
   DOMContentLoaded listener calls them in order. This keeps
   each feature easy to find, test and explain on its own.
   ============================================================= */

'use strict';

/* ---------- Small helpers used by several features ---------- */

/** Shorthand for document.querySelector / querySelectorAll. */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/** Returns a Promise that resolves after `ms` milliseconds (used with async/await). */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Turns a number of seconds into "m:ss", e.g. 75 -> "1:15". */
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/** True when the visitor has asked their OS to reduce motion. */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reads a CSS custom property (e.g. "--accent") from the root element. */
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();


/* =============================================================
   1. THEME TOGGLE (dark / light), remembered in localStorage
   ============================================================= */
function initTheme() {
  const root = document.documentElement;
  const button = $('#themeToggle');

  // Dark is the default look of the design; a saved choice wins.
  const saved = localStorage.getItem('theme');
  applyTheme(saved === 'light' ? 'light' : 'dark');

  button.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next); // persists across visits
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0a0a0b' : '#eeebe4');
    // Tell other features (canvas drawings) that colours changed.
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }
}


/* =============================================================
   2. MOBILE NAVIGATION (hamburger menu)
   ============================================================= */
function initMobileNav() {
  const toggle = $('#menuToggle');
  const nav = $('#mainNav');

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open)); // screen readers know the state
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));

  // Close when a link is chosen, when Escape is pressed, or when the screen becomes wide.
  $$('.nav-link', nav).forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
}


/* =============================================================
   3. SMOOTH SCROLLING that accounts for the fixed header
   ============================================================= */
function initSmoothScroll() {
  // Event delegation: ONE listener on the document handles every in-page link.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    const target = id === '#' ? null : document.querySelector(id);
    if (!target) return;

    event.preventDefault(); // stop the instant jump
    const headerHeight = $('#siteHeader').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - (id === '#home' ? 0 : headerHeight - 8);
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    history.pushState(null, '', id); // keeps the URL shareable, e.g. /#projects
  });
}


/* =============================================================
   4. ACTIVE LINK HIGHLIGHTING (scroll-spy) with IntersectionObserver
   ============================================================= */
function initScrollSpy() {
  const links = $$('.nav-link');
  const sections = links.map((link) => document.querySelector(link.getAttribute('href')));

  // A section counts as "current" when it crosses a thin band in the middle of the screen.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => section && observer.observe(section));
}


/* =============================================================
   5. SCROLL-REVEAL ANIMATIONS
   ============================================================= */
function initReveal() {
  const items = $$('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible'); // CSS transition does the animation
      obs.unobserve(entry.target);              // animate only once
    });
  }, { threshold: 0.12 });

  // Small stagger: cards in the same parent appear one after another.
  items.forEach((el) => {
    const siblings = $$(':scope > .reveal', el.parentElement);
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 4) * 80}ms`;
    observer.observe(el);
  });
}


/* =============================================================
   6. HEADER STYLE, SCROLL PROGRESS BAR and BACK-TO-TOP button
   ============================================================= */
function initScrollEffects() {
  const header = $('#siteHeader');
  const bar = $('#scrollProgress');
  const backToTop = $('#backToTop');
  let ticking = false;

  function update() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 20);
    bar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    backToTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);
    ticking = false;
  }

  // requestAnimationFrame "throttles" the scroll handler to once per frame.
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
  update();
}


/* =============================================================
   7. HERO ART: a rotating sphere drawn with ORDERED DITHERING
   Every pixel is either "ink" or "bone" (or seal red). Whether a
   pixel is lit depends on its brightness compared with a 4x4
   Bayer threshold matrix — this creates the retro halftone look.
   ============================================================= */
function initDitherCanvas() {
  const canvas = $('#ditherCanvas');
  const ctx = canvas.getContext('2d');
  const SIZE = 120;                       // low internal resolution; CSS scales it up crisply
  canvas.width = canvas.height = SIZE;
  const image = ctx.createImageData(SIZE, SIZE);

  // 4x4 Bayer matrix, normalised to 0..1 thresholds.
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

  let colours = readColours();
  document.addEventListener('themechange', () => { colours = readColours(); if (!running) draw(0); });

  function readColours() {
    const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    return { ink: hex(cssVar('--bg')), bone: hex(cssVar('--text')), red: hex(cssVar('--accent')) };
  }

  function draw(time) {
    const t = time / 1000;
    const spin = t * 0.5;                              // rotation angle (radians)
    const light = [Math.cos(t * 0.3) * 0.6, -0.5, 0.65]; // slowly moving light
    const data = image.data;

    for (let py = 0; py < SIZE; py++) {
      for (let px = 0; px < SIZE; px++) {
        // Map pixel to -1..1 coordinates centred on the canvas.
        const x = (px - SIZE / 2) / (SIZE * 0.42);
        const y = (py - SIZE / 2) / (SIZE * 0.42);
        const r2 = x * x + y * y;
        const i = (py * SIZE + px) * 4;
        let colour = colours.ink;
        let alpha = 0;

        if (r2 <= 1) {
          const z = Math.sqrt(1 - r2);                 // sphere surface normal is (x, y, z)
          let b = Math.max(0, x * light[0] + y * light[1] + z * light[2]); // diffuse lighting
          const lon = Math.atan2(x, z) + spin;          // longitude rotates over time
          const lat = Math.asin(y);
          // Soft "globe" stripes: brightness rises and falls with longitude and latitude.
          const bands = 0.5 + 0.5 * Math.sin(lon * 5) * Math.cos(lat * 4);
          b = b * (0.35 + 0.75 * bands) + 0.04;

          // The red "seal": a dot and a ring in the middle of the sphere (like the logo).
          const d = Math.sqrt(r2);
          const pulse = 0.02 * Math.sin(t * 2);
          const isSeal = d < 0.2 + pulse || (d > 0.29 + pulse && d < 0.34 + pulse);

          const threshold = BAYER[(py % 4) * 4 + (px % 4)];
          if (isSeal) { colour = b + 0.35 > threshold ? colours.red : colours.ink; alpha = 255; }
          else if (b > threshold) { colour = colours.bone; alpha = 255; }
        } else if (r2 < 1.35 && px % 4 === 0 && py % 4 === 0) {
          colour = colours.bone; alpha = 40;            // faint halo of dots
        }
        data[i] = colour[0]; data[i + 1] = colour[1]; data[i + 2] = colour[2]; data[i + 3] = alpha;
      }
    }
    ctx.putImageData(image, 0, 0);
  }

  // Animate only while the canvas is on screen (saves battery).
  let running = false;
  let frameId = null;
  const loop = (time) => { draw(time); frameId = requestAnimationFrame(loop); };

  if (prefersReducedMotion) { draw(0); return; }
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) { running = true; frameId = requestAnimationFrame(loop); }
    else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(frameId); }
  }).observe(canvas);
}


/* =============================================================
   8. TERMINAL TYPING EFFECT (async / await)
   ============================================================= */
async function initTerminal() {
  const output = $('#terminalText');
  if (prefersReducedMotion) { output.textContent = TERMINAL_LINES.slice(0, 2).join('\n'); return; }

  let index = 0;
  // Runs forever: type a command + its response, pause, clear, next pair.
  while (true) {
    const pair = [TERMINAL_LINES[index], TERMINAL_LINES[index + 1]];
    output.textContent = '';
    for (const [lineNo, line] of pair.entries()) {
      if (lineNo > 0) output.textContent += '\n';
      for (const char of line) {
        output.textContent += char;
        await sleep(lineNo === 0 ? 45 : 18);  // commands type slower than responses
      }
      await sleep(400);
    }
    await sleep(2200);
    index = (index + 2) % TERMINAL_LINES.length; // wrap around with modulo
  }
}


/* =============================================================
   9. ROTATING WORD in the hero sentence
   ============================================================= */
function initRoleRotator() {
  const el = $('#roleRotator');
  let i = 0;
  setInterval(() => {
    el.classList.add('is-out');                 // fade out (CSS transition)
    setTimeout(() => {
      i = (i + 1) % ROLES.length;
      el.textContent = ROLES[i];
      el.classList.remove('is-out');            // fade back in with the new word
    }, 300);
  }, 2600);
}


/* =============================================================
   10. TICKER: clone the items once so the CSS loop is seamless
   ============================================================= */
function initTicker() {
  const rail = $('#tickerRail');
  $$('.tick', rail).forEach((tick) => {
    const copy = tick.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');   // screen readers read the list once
    rail.appendChild(copy);
  });
}


/* =============================================================
   11. PROJECTS: render from data, filter by category, search
   ============================================================= */
function initProjects() {
  const grid = $('#projectGrid');
  const count = $('#projectCount');
  const filterBar = $('#projectFilters');
  const search = $('#projectSearch');
  const state = { filter: 'all', query: '' };   // single source of truth

  /** Builds one card element from one project object using DOM methods. */
  function createCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const top = document.createElement('div');
    top.className = 'card-top';
    const title = document.createElement('h3');
    title.textContent = project.title;          // textContent = safe, no HTML injection
    const role = document.createElement('span');
    role.className = 'project-role';
    role.textContent = project.role;
    top.append(title, role);

    const summary = document.createElement('p');
    summary.textContent = project.summary;

    const chips = document.createElement('ul');
    chips.className = 'chips';
    project.stack.forEach((tech) => {
      const li = document.createElement('li');
      li.textContent = tech;
      chips.appendChild(li);
    });

    const links = document.createElement('div');
    links.className = 'project-links';
    if (project.links.length === 0) {
      links.innerHTML = '<span class="private">Client work · no public link</span>';
    } else {
      project.links.forEach(({ label, url }) => {   // object destructuring
        const a = document.createElement('a');
        a.href = url; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = `${label} ↗`;
        links.appendChild(a);
      });
    }

    card.append(top, summary, chips, links);
    return card;
  }

  /** Filters the PROJECTS array by the current state and redraws the grid. */
  function render() {
    const q = state.query.toLowerCase();
    const visible = PROJECTS
      .filter((p) => state.filter === 'all' || p.categories.includes(state.filter))
      .filter((p) => [p.title, p.summary, p.role, ...p.stack].join(' ').toLowerCase().includes(q));

    grid.replaceChildren(...visible.map(createCard));   // map: data -> elements
    if (visible.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state mono-copy';
      empty.textContent = `No projects match “${state.query}”. Try another word or filter.`;
      grid.appendChild(empty);
    }
    count.textContent = `Showing ${visible.length} of ${PROJECTS.length} projects`;
  }

  // Event delegation on the filter bar: one listener for all buttons.
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    state.filter = btn.dataset.filter;          // reads data-filter="..."
    $$('.filter-btn', filterBar).forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    render();
  });

  // Live search, re-rendering on every keystroke.
  search.addEventListener('input', () => { state.query = search.value.trim(); render(); });

  render();
}


/* =============================================================
   12. EXPERIENCE STEPPER (click, keyboard arrows, auto-advance)
   ============================================================= */
function initExperience() {
  const track = $('#stepperTrack');
  const panel = $('#stepperPanel');
  let current = 0;
  let autoTimer = null;

  // Build one button per job from the EXPERIENCE array.
  const buttons = EXPERIENCE.map((job, i) => {
    const btn = document.createElement('button');
    btn.className = 'step-btn';
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.innerHTML = `<span class="step-dot"></span><span class="step-name"></span>`;
    btn.querySelector('.step-name').textContent = job.short;
    btn.addEventListener('click', () => { show(i); stopAuto(); });
    track.appendChild(btn);
    return btn;
  });

  function show(i) {
    current = i;
    const job = EXPERIENCE[i];
    buttons.forEach((b, j) => {
      b.classList.toggle('is-active', j === i);
      b.setAttribute('aria-selected', String(j === i));
      b.tabIndex = j === i ? 0 : -1;
    });
    panel.innerHTML = `
      <div>
        <p class="panel-role"><span class="panel-index">${String(i + 1).padStart(2, '0')}</span><span class="js-role"></span></p>
        <ul class="panel-points"></ul>
      </div>
      <dl class="panel-meta">
        <dt>Company</dt><dd class="js-company"></dd>
        <dt>Period</dt><dd class="js-period"></dd>
        <dt>Stack</dt><dd class="js-stack"></dd>
      </dl>`;
    // Fill text safely with textContent.
    $('.js-role', panel).textContent = job.role;
    $('.js-company', panel).textContent = job.company;
    $('.js-period', panel).textContent = job.period;
    $('.js-stack', panel).textContent = job.stack;
    job.points.forEach((point) => {
      const li = document.createElement('li');
      li.textContent = point;
      $('.panel-points', panel).appendChild(li);
    });
    // Restart the little entrance animation.
    panel.classList.remove('is-switching');
    void panel.offsetWidth;                     // forces reflow so the animation can replay
    panel.classList.add('is-switching');
  }

  // Left / right arrow keys move between roles (accessible tabs pattern).
  track.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const step = e.key === 'ArrowRight' ? 1 : -1;
    const next = (current + step + EXPERIENCE.length) % EXPERIENCE.length;
    show(next); buttons[next].focus(); stopAuto();
  });

  function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
  if (!prefersReducedMotion) {
    autoTimer = setInterval(() => show((current + 1) % EXPERIENCE.length), 5000);
  }
  show(0);
}


/* =============================================================
   13. SHOWREEL VIDEO with CUSTOM CONTROLS (HTMLMediaElement API)
   ============================================================= */
function initShowreel() {
  const shell = $('#videoShell');
  const video = $('#showreel');
  const playBtn = $('#vPlay');
  const bigPlay = $('#bigPlay');
  const muteBtn = $('#vMute');
  const fullBtn = $('#vFull');
  const progress = $('#vProgress');
  const fill = $('#vProgressFill');
  const time = $('#vTime');

  const togglePlay = () => (video.paused ? video.play() : video.pause());
  playBtn.addEventListener('click', togglePlay);
  bigPlay.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // Keep the UI in sync with the video's real state using media events.
  video.addEventListener('play', () => {
    shell.classList.add('is-playing');
    playBtn.textContent = '❚❚'; playBtn.setAttribute('aria-label', 'Pause');
    const audio = $('#ambientAudio'); if (!audio.paused) audio.pause(); // only one sound at a time
  });
  video.addEventListener('pause', () => {
    shell.classList.remove('is-playing');
    playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', 'Play');
  });
  video.addEventListener('ended', () => { video.currentTime = 0; });

  const updateTime = () => {
    const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    fill.style.width = `${pct}%`;
    progress.setAttribute('aria-valuenow', Math.round(pct));
    time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  };
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', updateTime);

  // Click (or drag) on the progress bar to seek.
  const seek = (clientX) => {
    const rect = progress.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    video.currentTime = ratio * video.duration;
  };
  progress.addEventListener('pointerdown', (e) => {
    seek(e.clientX);
    const move = (ev) => seek(ev.clientX);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', () => window.removeEventListener('pointermove', move), { once: true });
  });

  const toggleMute = () => {
    video.muted = !video.muted;
    muteBtn.classList.toggle('is-muted', video.muted); // CSS swaps the two SVG icons
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
  };
  muteBtn.addEventListener('click', toggleMute);

  fullBtn.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else (shell.requestFullscreen || shell.webkitRequestFullscreen).call(shell);
  });

  // Keyboard shortcuts while the player has focus.
  shell.addEventListener('keydown', (e) => {
    const actions = {
      ' ': togglePlay, k: togglePlay, m: toggleMute,
      ArrowRight: () => { video.currentTime = Math.min(video.duration, video.currentTime + 5); },
      ArrowLeft: () => { video.currentTime = Math.max(0, video.currentTime - 5); }
    };
    const action = actions[e.key];
    if (action) { e.preventDefault(); action(); }
  });
}


/* =============================================================
   14. AUDIO PLAYER + LIVE VISUALISER (Web Audio API + canvas)
   ============================================================= */
function initAudioPlayer() {
  const audio = $('#ambientAudio');
  const playBtn = $('#aPlay');
  const volume = $('#aVolume');
  const timeEl = $('#aTime');
  const canvas = $('#visualiser');
  const ctx = canvas.getContext('2d');
  let analyser = null;
  let dataArray = null;
  let rafId = null;

  audio.volume = Number(volume.value);

  // Browsers only allow an AudioContext after a user gesture, so we create it on first play.
  function setupAnalyser() {
    if (analyser) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;                      // 256 bins of ~86 Hz each
    analyser.smoothingTimeConstant = 0.82;       // smoother, less jumpy bars
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);      // still send sound to the speakers
    audio.addEventListener('play', () => audioCtx.resume());
  }

  /** Draws bars made of small square "pixels", matching the dithered style. */
  function drawBars() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const bins = 48;                             // show only the lowest 48 bins (~0–4 kHz), where the music is
    if (analyser) analyser.getByteFrequencyData(dataArray);
    const barW = w / bins;
    const cell = 6;
    for (let i = 0; i < bins; i++) {
      const value = dataArray ? dataArray[i] / 255 : 0;
      const idle = 0.04 + 0.03 * Math.sin(i * 0.5 + performance.now() / 600);
      const level = Math.max(value, audio.paused ? idle : 0);
      const cells = Math.max(1, Math.round((level * h) / cell));
      for (let c = 0; c < cells; c++) {
        ctx.fillStyle = c > (h / cell) * 0.7 ? cssVar('--accent') : cssVar('--text');
        ctx.globalAlpha = 0.35 + 0.65 * (c / (h / cell));
        ctx.fillRect(i * barW + 1, h - (c + 1) * cell + 1, barW - 2, cell - 2);
      }
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(drawBars);
  }

  playBtn.addEventListener('click', () => {
    setupAnalyser();
    if (audio.paused) audio.play(); else audio.pause();
  });
  audio.addEventListener('play', () => {
    playBtn.textContent = '❚❚ Pause';
    const video = $('#showreel'); if (!video.paused) video.pause(); // only one sound at a time
  });
  audio.addEventListener('pause', () => { playBtn.textContent = '▶ Play'; });
  audio.addEventListener('timeupdate', () => { timeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`; });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value); });

  drawBars();
  // Pause the visualiser loop when the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId); else drawBars();
  });
}


/* =============================================================
   15. CONTACT FORM: client-side validation, then mailto
   ============================================================= */
function initContactForm() {
  const form = $('#contactForm');
  const status = $('#formStatus');
  const message = $('#message');
  const counter = $('#msgCounter');

  // Each rule: a test function and the error shown when it fails.
  const rules = {
    name: [
      { test: (v) => v.length > 0, msg: 'Please tell me your name.' },
      { test: (v) => /^[A-Za-zÀ-ÖØ-öø-ÿ' .-]{2,60}$/.test(v), msg: 'Use 2–60 letters (spaces, - and \' are fine).' }
    ],
    email: [
      { test: (v) => v.length > 0, msg: 'I need an email address to reply to.' },
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), msg: 'That email doesn\'t look right (e.g. name@example.com).' }
    ],
    message: [
      { test: (v) => v.length >= 10, msg: 'Write at least 10 characters so I know what you need.' }
    ]
  };

  /** Validates one field; returns true if valid and updates its error text. */
  function validateField(name) {
    const input = form.elements[name];
    const value = input.value.trim();
    const failed = rules[name].find((rule) => !rule.test(value)); // first failing rule
    const field = input.closest('.field');
    $(`#${name}Error`).textContent = failed ? failed.msg : '';
    field.classList.toggle('has-error', Boolean(failed));
    field.classList.toggle('is-valid', !failed);
    input.setAttribute('aria-invalid', String(Boolean(failed)));
    return !failed;
  }

  // Validate a field when the visitor leaves it, then live while they fix it.
  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener('blur', () => validateField(name));
    input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('has-error')) validateField(name);
    });
  });

  // Character counter for the message box.
  message.addEventListener('input', () => { counter.textContent = `${message.value.length} / 500`; });

  form.addEventListener('submit', (event) => {
    event.preventDefault();                         // stop the browser reloading the page
    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.remove('is-ok');
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    // No backend: build a mailto: link so the visitor's own email app sends it.
    const { name, email } = form.elements;
    const subject = encodeURIComponent(`Portfolio enquiry from ${name.value.trim()}`);
    const body = encodeURIComponent(`${message.value.trim()}\n\n— ${name.value.trim()} (${email.value.trim()})`);
    window.location.href = `mailto:olayinkashittu2003@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = 'Your email app should now open with the message ready to send. Nothing is sent until you press Send there.';
    status.classList.add('is-ok');
  });
}


/* =============================================================
   16. COPY EMAIL TO CLIPBOARD
   ============================================================= */
function initCopyEmail() {
  const btn = $('#copyEmail');
  btn.addEventListener('click', async () => {
    const email = btn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);  // modern async Clipboard API
      btn.classList.add('is-copied');               // CSS shows a green tick state
    } catch {
      window.prompt('Copy my email:', email);      // fallback for older browsers / file://
    }
    setTimeout(() => btn.classList.remove('is-copied'), 1600);
  });
}


/* =============================================================
   17. FOOTER YEAR (Date object)
   ============================================================= */
function initYear() {
  $('#year').textContent = new Date().getFullYear();
}


/* =============================================================
   START-UP: run every feature once the HTML is ready
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js'); // lets CSS know JavaScript is running
  initTheme();
  initMobileNav();
  initSmoothScroll();
  initScrollSpy();
  initReveal();
  initScrollEffects();
  initDitherCanvas();
  initTerminal();
  initRoleRotator();
  initTicker();
  initProjects();
  initExperience();
  initShowreel();
  initAudioPlayer();
  initContactForm();
  initCopyEmail();
  initYear();
});
