# Content Authoring Guide

How to create, edit, and maintain checkpoints, terms, and icons for ms-brandolini-science.

---

## Quick Start

```bash
# Full build (compiles content → JS, then builds HTML)
python3 build/build.py

# Content only (YAML/CSV → JS, no HTML rebuild)
python3 build/content_build.py

# Validate without writing files
python3 build/content_build.py --check

# See content statistics
python3 build/content_build.py --stats
```

---

## Architecture Overview

```
content/                          ← YOU EDIT HERE
  checkpoints/
    biology/
      ck11-cell-structure.yaml    ← one YAML per checkpoint
      ck12-next-topic.yaml
    environmental-biology/
    sheltered-chemistry/
  terms.csv                       ← master term database (all courses)
  icons.py                        ← SVG icon library

      ↓ content_build.py compiles ↓

js/
  checkpoints/
    ck11-cell-structure.js        ← auto-generated, DO NOT EDIT
  terms-db.js                     ← auto-generated, DO NOT EDIT

      ↓ build.py renders ↓

student/biology/checkpoints/cell-structure/index.html
```

**Golden rule:** Edit files in `content/`. Never edit `js/checkpoints/*.js` or `js/terms-db.js` by hand — they get overwritten on every build.

---

## Creating a New Checkpoint

### 1. Create the YAML file

Copy the template and fill it in:

```bash
cp content/checkpoints/biology/ck11-cell-structure.yaml \
   content/checkpoints/biology/ck12-your-topic.yaml
```

The filename matters — it becomes the JS filename (e.g., `ck12-your-topic.js`).

### 2. YAML Structure

```yaml
# Required fields
id: ck12                              # unique ID, used for localStorage key
title: Your Topic Title                # displayed in banner and nav
course: biology                        # biology | environmental-biology | sheltered-chemistry
icon: "🧬"                            # emoji for the banner
banner_class: ck-entry-banner--bio     # --bio (purple-blue) | --env (teal-green) | --chem (pink-purple)

# Quiz Info (what students see first)
quiz_info:
  format: "Paper quiz — 3–4 open response questions..."
  notes: "You can use your <strong>handwritten notes</strong>..."
  grading: "<strong>Pass = full points.</strong>..."
  warning: "This quiz tests <strong>understanding</strong>..."
  readiness:                           # checklist items
    - "Can you explain X in your own words?"
    - "Can you trace the process of Y?"

# Chapters (the main content — watch/read fork)
chapters:
  - id: ch1                            # unique within this checkpoint
    title: Chapter Title
    subtitle: "One-line description"
    video:                             # primary English video
      id: YOUTUBE_ID
      title: Video Title
      channel: Channel Name
      time: "5:27"
    l1_videos:                         # optional L1 alternatives
      es: { id: YOUTUBE_ID, title: "...", channel: "...", time: "..." }
      pt: { id: YOUTUBE_ID, title: "...", channel: "...", time: "..." }
      fr: { id: YOUTUBE_ID, title: "...", channel: "...", time: "..." }
      vi: { id: YOUTUBE_ID, title: "...", channel: "...", time: "..." }
    reading: |                         # HTML content for read mode
      <p>Paragraph with <dfn data-def="definition here" tabindex="0">term</dfn>...</p>
    terms:                             # key terms for this chapter
      - ["Term Name", "short definition"]
    figure:                            # optional diagram/image
      src: https://url-to-image.png
      alt: Description for screen readers
      caption: "What to look for in this image."
    optional_videos:                   # bonus "Want More?" section
      - { id: YOUTUBE_ID, title: "...", channel: "...", time: "..." }

# Structured Notes (the "HUGE HINT" section)
notes:
  intro: "HUGE HINT: Answer these questions while you study..."
  foundation: "These questions cover the essentials — but don't stop here..."
  parts:
    - title: "Part A: Topic Name"
      icon: "🔬"
      questions:
        - id: n1
          type: table              # table | fill | short
          q: |
            Fill in the table:

            | Column A | Column B |
            |---|---|
            | ___ | ___ |
        - id: n2
          type: short
          q: "A short-answer question?"

# Vocabulary Table (multilingual)
vocab:
  - { en: Term, es: Término, pt: Termo, fr: Terme, vi: Thuật ngữ, ht: Tèm }

# Practice Questions (end-of-checkpoint review)
practice_questions:
  - q: "Scenario-based question requiring explanation."
    hint: "Optional hint."                # hint is optional
  - q: "Another question without a hint."

# Practice Resources (external links)
practice_resources:
  - { title: Resource Name, desc: "What it offers", url: "https://...", source: Provider }

# Textbook Packets (optional PDF links)
textbook_packets:
  - { title: Topic Name, pages: "pp. 24-26", url: "https://drive.google.com/..." }
```

### 3. Register in build config

Open `build/build.py` and find the checkpoint registration section. Add your new checkpoint:

```python
# In the checkpoints list for the appropriate course
{
    "config_js": "checkpoints/ck12-your-topic.js",
    "description": "Short description for meta tags",
    "slug": "your-topic",
    "title": "Your Topic Title",
    ...
}
```

### 4. Build and test

```bash
python3 build/build.py
# Open student/biology/checkpoints/your-topic/index.html in browser
```

---

## Managing Terms

### The terms.csv file

Each row is one term. Columns:

| Column | Required | Description |
|--------|----------|-------------|
| `term` | yes | The canonical term (lowercase) |
| `def` | yes | Plain-English definition |
| `emoji` | yes | Emoji fallback if icon fails |
| `courses` | yes | Comma-separated: `biology,chemistry` |
| `key` | yes | `true` if this is a key/essential term |
| `aliases` | no | Pipe-separated variants: `cells\|cell` |
| `icon_type` | no | Key into `content/icons.py` |

### Adding a new term

1. Add a row to `content/terms.csv`
2. If you want a custom SVG icon, add it to `content/icons.py`
3. Run `python3 build/content_build.py`

### How term annotation works

The term system (`js/term-system.js`) does the following on every page:

1. Upgrades existing `<dfn data-def="...">` tags to use the smart tooltip system
2. Scans all text content for term matches
3. Annotates only the **first mention per section** (not every occurrence)
4. Shows an inline SVG icon next to the term
5. On hover/focus: displays a viewport-clamped tooltip with the enlarged icon and definition

Sections are defined as: `.ck-chapter` elements (checkpoint chapters), `<section>` or `<article>` tags, or the whole page if none exist.

### Term matching rules

- Case-insensitive matching
- Whole-word boundaries (won't match "cellular" when looking for "cell")
- Longest-match-first (matches "rough ER" before "ER")
- Aliases allow matching plurals and variants
- Skips: navigation, buttons, links, code blocks, already-annotated text

---

## Managing Icons

### The icons.py file

Each icon is a 20×20 SVG viewBox using `stroke="currentColor"` so it inherits the site's accent color. Icons render at 16px inline and 64px in tooltips.

### Adding a new icon

```python
# In content/icons.py, add to the ICONS dict:
'your_icon_type': '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">...</svg>',
```

Then reference it in terms.csv with `icon_type=your_icon_type`.

### Icon design guidelines

- 20×20 viewBox, stroke-based (not filled)
- Use `currentColor` for strokes so theming works
- Keep simple — these are 16px inline, need to be recognizable tiny
- Use `opacity` for secondary details
- No text in icons (doesn't scale)

---

## Supported Languages

Currently: English, Español, Português, Français, Tiếng Việt, Kreyòl Ayisyen

To add a new language (e.g., Arabic):

1. **Vocab table:** Add a column to `content/terms.csv` (e.g., `ar`)
2. **Term compiler:** Update `build/content_build.py` to include the new column
3. **L1 videos:** Add `ar:` entries in checkpoint YAML files
4. **Language pills:** Add the pill button in `build/templates/checkpoint.html`
5. **Engine:** Add to `LANG_NAMES` and `LANG_FLAGS` in `js/checkpoint.js`
6. **RTL support:** For Arabic, add `dir="rtl"` styling to the vocab column

---

## Content at Scale

### Current: 1-50 checkpoints

YAML files work great. One person can maintain them easily.

### At 50-200 checkpoints

Consider:
- AI-assisted YAML generation (provide template + source material → LLM generates YAML)
- Batch validation: `python3 build/content_build.py --check`
- Statistics tracking: `python3 build/content_build.py --stats`

### At 200+ checkpoints

Consider:
- Google Sheets as authoring source → export CSV → script converts to YAML
- Per-course term CSV files that merge into one terms.csv
- Automated video link validation
- Difficulty-level variants (same YAML structure, different content per level)

### Schema migrations

If you need to add a new field to all checkpoints:

```python
# Quick migration script example
import yaml, glob
for yf in glob.glob('content/checkpoints/**/*.yaml', recursive=True):
    with open(yf) as f:
        data = yaml.safe_load(f)
    data['new_field'] = 'default_value'  # add the new field
    with open(yf, 'w') as f:
        yaml.dump(data, f, allow_unicode=True, default_flow_style=False)
```

---

## File Reference

| File | Role | Edit? |
|------|------|-------|
| `content/checkpoints/**/*.yaml` | Checkpoint authoring source | ✅ YES |
| `content/terms.csv` | Master term database | ✅ YES |
| `content/icons.py` | SVG icon library | ✅ YES |
| `build/content_build.py` | YAML/CSV → JS compiler | Only if changing schema |
| `build/build.py` | HTML site builder | Only to register new checkpoints |
| `build/templates/checkpoint.html` | Page template | Only if changing page structure |
| `js/checkpoint.js` | Checkpoint engine | Only if changing behavior |
| `js/term-system.js` | Term annotator | Only if changing annotation logic |
| `js/checkpoints/*.js` | Generated configs | ❌ NEVER (auto-generated) |
| `js/terms-db.js` | Generated term DB | ❌ NEVER (auto-generated) |
| `styles/checkpoint.css` | Checkpoint styles | Only if changing appearance |
| `styles/terms.css` | Term annotation styles | Only if changing appearance |
