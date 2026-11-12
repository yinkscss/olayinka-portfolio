# Olayinka Olurotimi-Shittu — Portfolio

My personal portfolio website, built for the **Web Technologies – Lab Assessment**.
It is written by hand in **plain HTML, CSS and vanilla JavaScript** — no frameworks, no build step.

- **Live site (Vercel):** https://olayinka-portfolio-beta.vercel.app/
- **GitHub Pages (mirror):** https://yinkscss.github.io/olayinka-portfolio/
- **Repository:** https://github.com/yinkscss/olayinka-portfolio

## Sections
Hero · About · Skills · Projects · Experience · Media (video + audio) · Contact · Footer

## JavaScript features (all in `js/main.js`)
| # | Feature | Function |
|---|---------|----------|
| 1 | Dark/light theme toggle saved in `localStorage` | `initTheme()` |
| 2 | Mobile hamburger menu (ARIA, Escape to close) | `initMobileNav()` |
| 3 | Smooth scrolling with fixed-header offset | `initSmoothScroll()` |
| 4 | Active nav link (scroll-spy) with `IntersectionObserver` | `initScrollSpy()` |
| 5 | Scroll-reveal animations | `initReveal()` |
| 6 | Header blur, scroll-progress bar, back-to-top button | `initScrollEffects()` |
| 7 | Hero canvas: rotating sphere with Bayer ordered dithering | `initDitherCanvas()` |
| 8 | Terminal typing effect with `async`/`await` | `initTerminal()` |
| 9 | Rotating word in the hero sentence | `initRoleRotator()` |
| 10 | Seamless ticker (cloned nodes) | `initTicker()` |
| 11 | Projects rendered from a data array, category filter + live search | `initProjects()` |
| 12 | Experience stepper (click, arrow keys, auto-advance) | `initExperience()` |
| 13 | Showreel video with custom controls + keyboard shortcuts | `initShowreel()` |
| 14 | Audio player with a Web Audio API frequency visualiser | `initAudioPlayer()` |
| 15 | Contact form validation (regex, `preventDefault`, `mailto:`) | `initContactForm()` |
| 16 | Copy email with the Clipboard API | `initCopyEmail()` |
| 17 | Footer year from `Date` | `initYear()` |

Content (projects, experience, hero words, terminal lines) lives in `js/data.js`, separate from the logic.

## Folder structure
```
index.html          page structure (semantic HTML5)
css/style.css       all styling, CSS variables, themes, responsive rules
js/data.js          content arrays used by main.js
js/main.js          all interactive features
assets/img/         favicon (SVG)
assets/media/       showreel video, poster image, ambient audio
```

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
