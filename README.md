# Ms. Brandolini's Science

Student-facing science curriculum site for Everett High School.

**Live site:** https://mattiebrandolini.github.io/ms-brandolini-science/

## Courses

| Course | Status |
|--------|--------|
| Biology (86 topics) | ✅ Live |
| Environmental Biology (96 topics) | ✅ Live |
| Sheltered Chemistry (120 topics) | ✅ Live |
| Earth Science | 🚧 In development |
| Anatomy & Physiology | 🚧 In development |
| Criminology | 🚧 In development |
| Oceanography | 🚧 In development |
| Physics | 🚧 In development |
| Astronomy | 🚧 In development |

## How to update

All HTML is generated from templates. **Never edit HTML files directly** — edit the templates and config, then rebuild.

### Add or update a course

1. Edit `build/config.py` — add/modify the course entry in `COURSES`
2. If the course has a Google Sheets resource list, create `js/config-{slug}.js`
3. Run the build: `cd build && python3 build.py`
4. Commit and push

### Change site-wide elements (topbar, fonts, meta tags, etc.)

1. Edit `build/templates/base.html` (or the relevant page template)
2. Rebuild: `cd build && python3 build.py`
3. Commit and push

### Bump cache version (force browsers to reload)

1. Change `CACHE_VERSION` in `build/config.py`
2. Rebuild and push

## Project structure

```
├── build/
│   ├── config.py          ← Course data, site settings (edit this)
│   ├── build.py           ← Build script (run this)
│   └── templates/         ← Jinja2 HTML templates
│       ├── base.html      ← Shared head, meta, scripts
│       ├── splitter.html  ← Front door (student/teacher)
│       ├── student_home.html
│       ├── teacher_home.html
│       ├── course_stub.html    ← Landing page per course
│       ├── course_resources.html ← Resource viewer
│       ├── tools_hub.html
│       └── 404.html
├── js/
│   ├── toolbar.js         ← Theme toggle + accessibility panel
│   ├── course-viewer.js   ← Universal resource viewer engine
│   └── config-*.js        ← Per-course resource configs
├── styles/
│   ├── main.css           ← Site-wide styles + accessibility
│   ├── course-viewer.css  ← Resource viewer styles
│   ├── tool.css           ← Interactive tools layout
│   └── print.css          ← Print stylesheet
├── student/               ← Generated student pages
├── teacher/               ← Generated teacher pages
└── favicon.svg/png
```

## Accessibility

Built-in accessibility panel (⚙️ in topbar) with:
- Dyslexia-friendly font (OpenDyslexic)
- Colorblind-friendly mode
- Extra spacing
- Reduced motion
- Text size control (S/M/L)

Dark/light theme toggle (☀️/🌙). All settings persist via localStorage.

## Requirements

- Python 3 + Jinja2 (`pip install jinja2`)
- GitHub Pages for hosting
