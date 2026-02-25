# CSS Variable Reference

> **For Claude or anyone editing styles.** This documents every CSS custom property used across the site.
> When changing colors, spacing, or typography, edit these variables — don't hardcode values.

## Files

| File | Purpose |
|------|---------|
| `styles/main.css` | Site-wide layout, cards, topbar, home pages, accessibility overrides |
| `styles/course-viewer.css` | Resource viewer (topic lists, resource cards, filters, search) |
| `styles/tool.css` | Interactive tools layout (wide, no article styling) |
| `styles/print.css` | Print overrides (hides nav, resets colors) |
| `static/fonts/fonts.css` | Self-hosted @font-face declarations |
| `js/toolbar.js` | Injects theme toggle + accessibility panel; references `--border-subtle`, `--accent`, `--bg-card`, `--text-*` via inline styles |

## Typography

| Variable | Dark value | Light value | Used for |
|----------|-----------|-------------|----------|
| — | `'DM Sans', sans-serif` | same | Body text (set on `body`) |
| — | `'Source Serif 4', serif` | same | Headings, brand, display text |
| — | `'OpenDyslexic'` | same | Dyslexia toggle (`[data-dyslexic="true"]`) |

## Colors — Dark Theme (default, `:root`)

### Backgrounds
| Variable | Value | Used for |
|----------|-------|----------|
| `--bg-deep` | `#0a0e1a` | Page background |
| `--bg-card` | `#111827` | Card backgrounds, panels |
| `--bg-card-hover` | `#1a2234` | Card hover state |

### Text
| Variable | Value | Used for |
|----------|-------|----------|
| `--text-primary` | `#f1f5f9` | Main body text, headings |
| `--text-secondary` | `#94a3b8` | Subtitles, descriptions, nav links |
| `--text-dim` | `#64748b` | Metadata, timestamps, badges |

### Borders
| Variable | Value | Used for |
|----------|-------|----------|
| `--border-subtle` | `rgba(255,255,255,0.06)` | Card borders, dividers |
| `--border-hover` | `rgba(255,255,255,0.12)` | Hover states on borders |

### Course Accent Colors
| Variable | Value | Course |
|----------|-------|--------|
| `--accent-bio` | `#34d399` | Biology (green) |
| `--accent-env` | `#60a5fa` | Environmental Biology (blue) |
| `--accent-chem` | `#f472b6` | Sheltered Chemistry (pink) |
| `--accent-earth` | `#d97706` | Earth Science (amber) |
| `--accent-anat` | `#f87171` | Anatomy & Physiology (red) |
| `--accent-crim` | `#a78bfa` | Criminology (violet) |
| `--accent-ocean` | `#22d3ee` | Oceanography (cyan) |
| `--accent-phys` | `#facc15` | Physics (yellow) |
| `--accent-astro` | `#c084fc` | Astronomy (purple) |
| `--accent-warm` | `#fbbf24` | Teacher role badge (warm yellow) |

### Layout
| Variable | Value | Used for |
|----------|-------|----------|
| `--radius-sm` | `8px` | Small elements (tags, badges) |
| `--radius-md` | `16px` | Cards |
| `--radius-lg` | `24px` | Hero sections, large panels |

## Colors — Light Theme (`[data-theme="light"]`)

Overrides only — unlisted variables inherit from dark theme.

| Variable | Value |
|----------|-------|
| `--bg-deep` | `#fafafa` |
| `--bg-card` | `#ffffff` |
| `--bg-card-hover` | `#f7fafc` |
| `--text-primary` | `#2d3748` |
| `--text-secondary` | `#718096` |
| `--text-dim` | `#a0aec0` |
| `--border-subtle` | `#e2e8f0` |
| `--border-hover` | `#cbd5e0` |

## Course Viewer Variables (`course-viewer.css`)

These are scoped to resource pages and have their own dark/light sets.

### Light (default in viewer)
| Variable | Value | Used for |
|----------|-------|----------|
| `--cv-bg` | `#fafafa` | Viewer page background |
| `--cv-card-bg` | `#ffffff` | Resource cards |
| `--cv-text` | `#2d3748` | Primary text |
| `--cv-text-muted` | `#718096` | Secondary text |
| `--cv-border` | `#e2e8f0` | Card borders |
| `--cv-accent` | `#4a5568` | Accent elements |
| `--cv-link` | `#2563eb` | Links |
| `--cv-link-hover` | `#1d4ed8` | Link hover |
| `--cv-hover-bg` | `#f7fafc` | Card hover |
| `--cv-tag-bg` | `#f1f5f9` | Tag backgrounds |
| `--cv-tag-text` | `#475569` | Tag text |

## Accessibility Data Attributes

These are set on `<html>` by `toolbar.js` and targeted in CSS:

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-theme` | `dark` / `light` | Swaps color variables |
| `data-dyslexic` | `true` | Switches to OpenDyslexic font |
| `data-colorblind` | `true` | Replaces color-only indicators with shapes + borders |
| `data-spacing` | `true` | `line-height: 1.9; letter-spacing: 0.03em; word-spacing: 0.12em` |
| `data-motion` | `reduced` | `animation: none; transition: none` |
| `data-textsize` | `small` / `medium` / `large` | `14px` / `16px` / `19px` base font size |

All persisted via `localStorage`.
