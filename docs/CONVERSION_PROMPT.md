# Checkpoint Conversion — Paste-In Prompt for Fresh Chats

Copy everything below this line and paste it at the start of a new chat, followed by your Canvas HTML.

---

## Context

I'm building a free, multilingual science curriculum site at mattiebrandolini.github.io/ms-brandolini-science. I have checkpoints built as HTML in Canvas LMS that need to be converted to YAML for my authoring pipeline. You have access to my PC via MCP tools (prefixed `back up hands:`).

## Your Job

Convert my Canvas HTML into a checkpoint YAML file, search for multilingual videos, add terms to the database, register the checkpoint, build, and push. Follow this workflow exactly.

## Step 0: Orient

Before doing anything, read these files on my PC:

```
back up hands:read_file → ~/ms-brandolini-science/docs/AUTHORING.md
back up hands:read_file → ~/ms-brandolini-science/content/checkpoints/biology/ck11-cell-structure.yaml
back up hands:read_file → ~/ms-brandolini-science/content/terms.csv
back up hands:read_file → ~/ms-brandolini-science/build/config.py (just the CHECKPOINTS section)
```

These give you the YAML schema, an exemplar, existing terms, and the registration format.

## Step 1: I Give You the Canvas HTML

I'll paste the HTML content from one Canvas checkpoint page. It will contain some combination of:
- Reading passages (may need rewriting for ELL accessibility)
- Vocabulary lists
- Questions / study guide prompts
- Possibly image references
- Possibly video links

I'll also tell you:
- **Course**: biology | environmental-biology | sheltered-chemistry
- **Checkpoint ID**: e.g. ck12 (I'll assign this or you suggest the next available)
- **Chapter breakdown**: How to split the content into chapters (or ask me)

## Step 2: Convert to YAML

Create the YAML file following the schema from AUTHORING.md. Key rules:

**Readings** (the `reading:` field):
- Target WIDA Level 3 English Language Learners — simple sentences, short paragraphs
- Use `<dfn data-def="definition here" tabindex="0">term</dfn>` for key vocabulary in the reading
- Use `<strong class="ck-hl">` for emphasized phrases/mnemonics
- Use `<p>` tags for paragraphs
- If the Canvas HTML is already well-written for ELLs, preserve it. If it's written at a higher level, simplify it.
- The reading should teach the SAME content as the video, not supplement it

**Terms** (the `terms:` array per chapter):
- Each chapter gets 3-5 key terms as `["Term Name", "short definition"]`
- Definitions should be plain language, not textbook definitions

**Figures**:
- Find appropriate Wikimedia Commons images for each chapter if not already provided
- Include `source`, `source_url`, and `license` fields
- Use the thumbnail URL format: `https://upload.wikimedia.org/wikipedia/commons/thumb/...`

**Quiz info, notes, practice questions, vocab table**: follow the exemplar structure exactly.

## Step 3: Search for L1 Videos

For each chapter's main topic, search YouTube for quality educational videos in:
- **Spanish (es)** — usually easiest to find
- **Portuguese (pt)** — Brazilian Portuguese preferred
- **French (fr)** — look for Québécois or European French edu channels
- **Vietnamese (vi)** — harder to find, skip if nothing quality exists
- **Haitian Creole (ht)** — very rare, skip unless found

Quality criteria:
- Under 12 minutes preferred
- Clear audio and visuals
- From an educational channel (not random uploads)
- Actually covers the same topic as the English video
- Not behind a paywall

Use web search to find these. Format as:
```yaml
l1_videos:
  es: { id: YOUTUBE_ID, title: "...", channel: "...", time: "..." }
```

If you can't find a quality video in a language, leave that language out. Don't pad with garbage.

## Step 4: Update Terms Database

Check `content/terms.csv` for existing terms. For any NEW terms from this checkpoint, add rows. Format:
```
term,def,emoji,courses,key,aliases,icon_type
```

- `term`: lowercase
- `def`: the tooltip definition (can be longer than the chapter definition)
- `emoji`: a relevant emoji
- `courses`: which course(s) this term appears in
- `key`: `true` if it's an important standalone term
- `aliases`: pipe-separated alternatives (e.g. `mitochondria|mitochondrion`)
- `icon_type`: same as term name unless there's a reason to group icons

Each new term also needs an SVG icon in `content/icons.py`. Follow the existing pattern — 20x20 viewBox, stroke-based, `stroke="currentColor"`. Look at existing icons for style reference.

## Step 5: Register & Build

1. Add the checkpoint to `CHECKPOINTS` in `build/config.py`:
```python
{
    "course": "biology",
    "slug": "your-slug",
    "title": "Checkpoint XX: Topic Name",
    "short_title": "Topic Name",
    "icon": "🔬",
    "banner_class": "ck-entry-banner--bio",
    "config_js": "checkpoints/ckXX-your-slug.js",
    "description": "Brief comma-separated topic list",
},
```

2. Bump `CACHE_VERSION` in `build/config.py`

3. Build:
```bash
cd ~/ms-brandolini-science
python3 build/content_build.py --check   # validate YAML
python3 build/build.py                    # full build (includes JS syntax check)
```

4. If build succeeds, commit and push:
```bash
git add -A
git commit -m "Add checkpoint: Topic Name

Course: biology
Chapters: N
Terms: N new
L1 videos: es, pt, fr, vi (list what you found)"
git push origin main
```

## Step 6: Show Me What You Did

After pushing, give me a summary:
- Chapters created and their topics
- Which L1 languages you found videos for (and which you couldn't)
- New terms added to the database
- Any decisions you made that I should review
- Any content from the Canvas HTML that didn't map cleanly

## Important Notes

- **Banner classes**: `ck-entry-banner--bio` (purple-blue), `ck-entry-banner--env` (teal-green), `ck-entry-banner--chem` (pink-purple)
- **Course slugs**: `biology`, `environmental-biology`, `sheltered-chemistry`, `earth-science`, `anatomy-physiology`, `physics`, etc.
- **Never edit generated files** in `js/checkpoints/` or `js/terms-db.js` — always edit the YAML/CSV sources
- **Always run the build** before pushing — it includes JS syntax checking
- **The readings are HTML inside YAML** — use the `|` multiline syntax and indent properly
- **Ask me if unsure** about chapter boundaries, difficulty level, or pedagogical choices

## Courses and Their Banner Classes

| Course | banner_class | color_class |
|--------|-------------|-------------|
| Biology | ck-entry-banner--bio | bio |
| Environmental Biology | ck-entry-banner--env | env |
| Sheltered Chemistry | ck-entry-banner--chem | chem |
| Earth Science | ck-entry-banner--earth | earth |
| Anatomy & Physiology | ck-entry-banner--anat | anat |
| Physics | ck-entry-banner--phys | phys |

---

## Critical Warnings (learned the hard way)

- **NEVER use Python's `yaml.dump()` to write YAML files.** It mangles URLs (strips double slashes to single), re-wraps strings unpredictably, and destroys intentional formatting. Write YAML files by hand using `back up hands:write_file` or string concatenation in Python. Read the exemplar YAML to match its style.
- **All build/git commands run on Mattie's PC** via `back up hands:shell`, NOT in Claude's container. The repo lives at `~/ms-brandolini-science/`.
- **Always validate before pushing**: run `content_build.py --check` then `build.py`. The build includes a JS syntax check that will catch errors before they reach production.
- **Check that URLs have `://`** in the generated JS config after building. This is the most common YAML-related bug.
- **Don't create empty checkpoint directories** for courses that don't have content yet. The build handles missing directories gracefully.
- **The YAML `reading:` field uses `|` block scalar syntax** — every line must be indented consistently under it. HTML goes directly in this field, no extra escaping needed except for YAML-special characters in strings.

## Ready? Paste your Canvas HTML below and tell me:
1. Which course this is for
2. What checkpoint number/ID to use (or I'll suggest one)
3. How you want the content split into chapters (or let me suggest)
