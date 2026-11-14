# Olayinka Olurotimi-Shittu — Portfolio

My personal portfolio website, built for the **Web Technologies – Lab Assessment**.
It is written by hand in **plain HTML, CSS and vanilla JavaScript** — no frameworks, no build step.

- **Live site (Vercel):** https://olayinka-portfolio-beta.vercel.app/
- **GitHub Pages (mirror):** https://yinkscss.github.io/olayinka-portfolio/
- **Repository:** https://github.com/yinkscss/olayinka-portfolio

## Pages
The site is multi-page. Each HTML file is a full page that includes the same header, footer, CSS and JavaScript. Links between pages are relative (`about.html`, `css/style.css`), so the site works both on GitHub Pages (at `/olayinka-portfolio/`) and on Vercel (at the domain root).

| Page | File | What's on it |
|------|------|----------------|
| Home | `index.html` | Hero (canvas, terminal, rotating word, ticker), a short intro, three project highlights |
| About | `about.html` | About, skills, and the interactive experience stepper |
| Projects | `projects.html` | All projects, with category filters and live search |
| Media | `media.html` | Showreel video player and boysod ambient audio visualiser |
| Contact | `contact.html` | Email card, copy-to-clipboard, and the validated contact form |
| Not found | `404.html` | A simple 404 page with links back into the site |

The current page is highlighted in the shared nav. The dark/light theme is saved in `localStorage`, so it persists when you move between pages. The mobile menu works on every page.

## JavaScript features (all in `js/main.js`)
The same `js/main.js` is loaded on every page. Each feature starts only if its markup is on that page, so unused features stay silent and the console stays clean.

| # | Feature | Function | Runs on |
|---|---------|----------|---------|
| 1 | Dark/light theme toggle saved in `localStorage` | `initTheme()` | every page |
| 2 | Mobile hamburger menu (ARIA, Escape to close) | `initMobileNav()` | every page |
| 3 | Smooth scrolling with fixed-header offset | `initSmoothScroll()` | every page (in-page `#` links, e.g. About → Skills) |
| 4 | Active nav link for the current page | `initScrollSpy()` | every page |
| 5 | Scroll-reveal animations | `initReveal()` | every page |
| 6 | Header blur, scroll-progress bar, back-to-top button | `initScrollEffects()` | every page |
| 7 | Hero canvas: rotating sphere with Bayer ordered dithering | `initDitherCanvas()` | Home |
| 8 | Terminal typing effect with `async`/`await` | `initTerminal()` | Home |
| 9 | Rotating word in the hero sentence | `initRoleRotator()` | Home |
| 10 | Seamless ticker (cloned nodes) | `initTicker()` | Home |
| 11 | Projects rendered from a data array, category filter + live search (and home highlights) | `initProjects()` | Home + Projects |
| 12 | Experience stepper (click, arrow keys, auto-advance) | `initExperience()` | About |
| 13 | Showreel video with custom controls + keyboard shortcuts | `initShowreel()` | Media |
| 14 | Audio player with a Web Audio API frequency visualiser | `initAudioPlayer()` | Media |
| 15 | Contact form validation (regex, `preventDefault`, `mailto:`) | `initContactForm()` | Contact |
| 16 | Copy email with the Clipboard API | `initCopyEmail()` | Contact |
| 17 | Footer year from `Date` | `initYear()` | every page |

Content (projects, experience, hero words, terminal lines) lives in `js/data.js`, separate from the logic.

## Folder structure
```
index.html          home page (hero, intro, highlights)
about.html          about, skills, experience
projects.html       project grid, filters and search
media.html          showreel and audio player
contact.html        contact cards and form
404.html            not-found page
css/style.css       all styling, CSS variables, themes, responsive rules
js/data.js          content arrays used by main.js
js/main.js          all interactive features (guarded per page)
assets/img/         favicon (SVG)
assets/media/       showreel video, poster image, ambient audio
```

Header and footer markup is repeated in each HTML file on purpose: there is no build step and no server-side includes, so a visitor (or a marker) can open any file and see a complete page.

## Run locally
Open `index.html` in a browser, or serve the folder (recommended, so the audio visualiser can read the audio):
```
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Media credits
- `showreel-goodbuildit.mp4` — my GoodBuildit games announcement video, compressed for the web. Music: “Classical vibes 5” by Grigoriy Nuzhny, [Mixkit Free License](https://mixkit.co/license/#musicFree).
- `ambient-sketch.mp3` — a short ambient loop synthesised with FFmpeg tone generators for this site. It is not a boysod release.

## Notes
- The contact form has no backend. After validation it opens the visitor's own email app with the message filled in; nothing is sent automatically.
- Design inspired by the dark, dithered, monospace-label look of tendeer.vercel.app. All content, code and artwork here are my own.
