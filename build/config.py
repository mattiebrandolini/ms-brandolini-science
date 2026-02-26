"""
Site configuration — all course data, page metadata, and site-wide settings.
Edit THIS file to add courses, change descriptions, update status.
Then run: python3 build.py
"""

SITE_URL = "https://mattiebrandolini.github.io/ms-brandolini-science"
SITE_TITLE = "Ms. Brandolini's Science"
SITE_DESCRIPTION = "Science courses, resources, and tools for students at Everett High School."
CACHE_VERSION = 7

# Font stack — ONE system, used everywhere
# Fonts are self-hosted — no external CDN dependencies
FONT_CSS = "static/fonts/fonts.css"
FONT_BODY = "'DM Sans', system-ui, sans-serif"
FONT_HEADING = "'Source Serif 4', Georgia, serif"

# OpenDyslexic CDN
# OpenDyslexic is included in fonts.css (self-hosted)
OPENDYSLEXIC_LINK = None  # bundled in FONT_CSS

# All courses — single source of truth
# status: "live" or "wip"
# topic_count: shown on cards and stubs
# config_js: if set, this course has a resource viewer
# sheet_url: Google Sheets CSV URL (used by config JS)
COURSES = [
    {
        "slug": "biology",
        "title": "Biology",
        "icon": "🧬",
        "color_class": "bio",
        "status": "live",
        "topic_count": 86,
        "student_desc": "From cells to ecosystems — video episodes, structured notes, and interactive content to build your understanding of living systems.",
        "teacher_desc": "Pedagogical notes, standards alignment, scaffolding strategies, and implementation guides for the Biology curriculum.",
        "og_desc": "Biology resources — video episodes, structured notes, and interactive tools for understanding living systems.",
        "config_js": "config-biology.js",
        "sheet_url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlnCCm8pU2GqY7wem-2Q6LyjLBFzFGBAB_mrDV0zZYotofEtvNfb1iSORE7WnOi0k9Gqlb8htIeC3m/pub?output=csv",
    },
    {
        "slug": "environmental-biology",
        "title": "Environmental Biology",
        "icon": "🌍",
        "color_class": "env",
        "status": "live",
        "topic_count": 96,
        "student_desc": "How living systems interact with their environment — climate, biodiversity, human impact, and the science of sustainability.",
        "teacher_desc": "Implementation guides, standards alignment, and scaffolding strategies for the Environmental Biology curriculum.",
        "og_desc": "Environmental Biology resources — climate, biodiversity, human impact, and sustainability science.",
        "config_js": "config-envbio.js",
        "sheet_url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vReEbbwpIWoOi1L6pOOR_u_HowMLyZusBbe3F6g32fmi6EY7wXa-72eDs11HTB_H5t_BBFt14VF5I3b/pub?output=csv",
    },
    {
        "slug": "sheltered-chemistry",
        "title": "Sheltered Chemistry",
        "icon": "⚗️",
        "color_class": "chem",
        "status": "live",
        "topic_count": 120,
        "student_desc": "Matter, reactions, and energy — built for multilingual learners with visual supports, cognates, and scaffolded content.",
        "teacher_desc": "Sheltering strategies, language scaffolds, and implementation guides for the Chemistry curriculum.",
        "og_desc": "Sheltered Chemistry resources — scaffolded content for multilingual learners exploring matter, reactions, and energy.",
        "config_js": "config-chemistry.js",
        "sheet_url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLyv_NuYlNUtzbQxqa_bdBXnS2_IYLqWvRvsCsPzIm4hkne8wglDZBJ57zfZxhOgOF9qE0pqwmwr2N/pub?output=csv",
    },
    {
        "slug": "earth-science",
        "title": "Earth Science",
        "icon": "🌋",
        "color_class": "earth",
        "status": "wip",
        "topic_count": 0,
        "student_desc": "This course is currently being developed. Check back soon for episodes, structured notes, and interactive content.",
        "teacher_desc": "Teacher companion materials for Earth Science are in development.",
        "og_desc": "Earth Science resources — coming soon.",
    },
    {
        "slug": "anatomy-physiology",
        "title": "Anatomy & Physiology",
        "icon": "🫀",
        "color_class": "anat",
        "status": "wip",
        "topic_count": 0,
        "student_desc": "This course is currently being developed. Check back soon for episodes, structured notes, and interactive content.",
        "teacher_desc": "Teacher companion materials for Anatomy & Physiology are in development.",
        "og_desc": "Anatomy & Physiology resources — coming soon.",
    },
    {
        "slug": "criminology",
        "title": "Criminology",
        "icon": "🔍",
        "color_class": "crim",
        "status": "wip",
        "topic_count": 0,
        "student_desc": "This course is currently being developed. Check back soon for episodes, structured notes, and interactive content.",
        "teacher_desc": "Teacher companion materials for Criminology are in development.",
        "og_desc": "Criminology resources — coming soon.",
    },
    {
        "slug": "oceanography",
        "title": "Oceanography",
        "icon": "🌊",
        "color_class": "ocean",
        "status": "wip",
        "topic_count": 0,
        "student_desc": "This course is currently being developed. Check back soon for episodes, structured notes, and interactive content.",
        "teacher_desc": "Teacher companion materials for Oceanography are in development.",
        "og_desc": "Oceanography resources — coming soon.",
    },
    {
        "slug": "physics",
        "title": "Physics",
        "icon": "⚡",
        "color_class": "phys",
        "status": "wip",
        "topic_count": 0,
        "student_desc": "This course is currently being developed. Check back soon for episodes, structured notes, and interactive content.",
        "teacher_desc": "Teacher companion materials for Physics are in development.",
        "og_desc": "Physics resources — coming soon.",
    },
    {
        "slug": "astronomy",
        "title": "Astronomy",
        "icon": "🔭",
        "color_class": "astro",
        "status": "wip",
        "topic_count": 0,
        "student_desc": "This course is currently being developed. Check back soon for episodes, structured notes, and interactive content.",
        "teacher_desc": "Teacher companion materials for Astronomy are in development.",
        "og_desc": "Astronomy resources — coming soon.",
    },
]
