# Ms. Brandolini's Science

Student-facing science curriculum website for Everett High School. Video episodes, structured notes, interactive content, and review games organized by course and topic.

**Live site:** [mattiebrandolini.github.io/ms-brandolini-science](https://mattiebrandolini.github.io/ms-brandolini-science)

## How to update

All pages are generated from templates. To make changes:

1. Edit `build/config.py` (courses, metadata, settings)
2. Edit `build/templates/` (page layouts)
3. Run the build: `python3 build/build.py`
4. Commit and push

### Common tasks

**Add a new course:**
- Add an entry to `COURSES` in `build/config.py`
- Run `python3 build/build.py`
- If the course has resources, also create a `js/config-{slug}.js` file

**Change the site-wide font, description, or URL:**
- Edit the constants at the top of `build/config.py`
- Rebuild

**Bump cache version** (forces browsers to reload JS/CSS):
- Change `CACHE_VERSION` in `build/config.py`
- Rebuild

**Update a single course's status from WIP to live:**
- Change `"status": "wip"` to `"status": "live"` in `config.py`
- Add `topic_count` and `config_js` fields
- Rebuild

## Architecture

```
├── build/
│   ├── build.py          # Build script — generates all HTML
│   ├── config.py         # Course data + site settings (edit this)
│   └── templates/        # Jinja2 templates
│       ├── base.html             # Shared head/foot for all pages
│       ├── splitter.html         # Front door (student vs teacher)
│       ├── student_home.html     # Student course listing
│       ├── teacher_home.html     # Teacher companion listing
│       ├── course_stub.html      # Course landing pages (×18)
│       ├── course_resources.html # Resource viewer shell (×3)
│       ├── tools_hub.html        # Interactive tools landing
│       └── 404.html              # Error page
├── js/
│   ├── toolbar.js        # Theme toggle + accessibility panel
│   ├── course-viewer.js  # Universal resource viewer engine
│   └── config-*.js       # Per-course data (topics, sheet URLs)
├── styles/
│   ├── main.css          # Site-wide styles + dark/light themes
│   ├── course-viewer.css # Resource viewer styles
│   ├── tool.css          # Interactive tool styles
│   └── print.css         # Print styles
└── [generated HTML files]
```

## Accessibility

Built-in accessibility panel (⚙️ in topbar) with:
- **Dyslexia-friendly font** — OpenDyslexic
- **Colorblind-friendly mode** — shapes + borders replace color-only indicators
- **Extra spacing** — increased line/letter/word spacing (also helps ELL students)
- **Reduced motion** — disables all animations
- **Text size** — three levels (small / medium / large)

All settings persist via localStorage across pages.

Other accessibility features:
- Skip-to-content links on every page
- Breadcrumb navigation on resource pages
- Semantic HTML and ARIA landmarks
- Dark/light theme toggle
- Keyboard-navigable throughout

## Tech stack

- Static HTML + CSS + vanilla JS (no framework)
- Jinja2 templates (Python build step)
- Google Sheets as resource database (CSV export)
- GitHub Pages hosting
- Google Fonts (DM Sans + Source Serif 4)

## Design philosophy

- **Curb-cut design** — accessibility features help everyone, not just those they're designed for
- **Multimodal by default** — every topic has video, audio, reading, and interactive options
- **ELL-centered** — built for WIDA Level 3 English Language Learners with visual supports and scaffolding
- **One codebase** — universal course viewer, shared templates, single source of truth in config
