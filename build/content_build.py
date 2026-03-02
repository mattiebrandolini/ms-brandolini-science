#!/usr/bin/env python3
"""
Content Build Pipeline
======================

Compiles authoring sources into JS files consumed by the site:

  content/checkpoints/**/*.yaml  →  js/checkpoints/*.js
  content/terms.csv              →  js/terms-db.js

Run this BEFORE build.py. Or call build.py which runs it automatically.

Usage:
  python3 build/content_build.py              # compile everything
  python3 build/content_build.py --check      # validate without writing
  python3 build/content_build.py --stats      # show content statistics
"""

import csv
import json
import os
import sys
import glob

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml not installed. Run: pip install pyyaml --break-system-packages")
    sys.exit(1)

# Add content dir to path for icons import
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'content'))
from icons import ICONS, get_icon

CONTENT_DIR = os.path.join(ROOT, 'content')
CHECKPOINTS_DIR = os.path.join(CONTENT_DIR, 'checkpoints')
TERMS_CSV = os.path.join(CONTENT_DIR, 'terms.csv')
JS_DIR = os.path.join(ROOT, 'js')
JS_CHECKPOINTS_DIR = os.path.join(JS_DIR, 'checkpoints')


# ============ YAML → JS CONFIG ============

def yaml_to_js_config(yaml_path):
    """Convert a checkpoint YAML file to a JS config string."""
    with open(yaml_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    ck_id = data['id']
    chapter_order = [ch['id'] for ch in data['chapters']]

    # Build chapters dict
    chapters = {}
    for ch in data['chapters']:
        ch_obj = {
            'title': ch['title'],
            'subtitle': ch['subtitle'],
            'video': ch['video'],
            'reading': ch['reading'].strip(),
            'terms': ch.get('terms', []),
        }
        if 'l1_videos' in ch:
            ch_obj['l1_videos'] = ch['l1_videos']
        if 'figure' in ch:
            ch_obj['figure'] = ch['figure']
        if 'optional_videos' in ch:
            ch_obj['optionalVideos'] = ch['optional_videos']
        chapters[ch['id']] = ch_obj

    # Build config object
    config = {
        'id': ck_id,
        'title': data['title'],
        'course': data['course'],
        'icon': data['icon'],
        'bannerClass': data.get('banner_class', 'ck-entry-banner--bio'),
        'chapterOrder': chapter_order,
        'chapters': chapters,
    }

    # Quiz info
    if 'quiz_info' in data:
        config['quizInfo'] = data['quiz_info']

    # Practice questions
    if 'practice_questions' in data:
        config['practiceQuestions'] = data['practice_questions']

    # Notes
    if 'notes' in data:
        notes = data['notes']
        config['notesQuestions'] = {
            'intro': notes['intro'],
            'parts': notes['parts'],
        }
        if 'foundation' in notes:
            config['notesQuestions']['foundation'] = notes['foundation']

    # Language bridge
    if 'language_bridge' in data:
        config['languageBridge'] = data['language_bridge']

    # Vocab table
    if 'vocab' in data:
        config['vocabTable'] = data['vocab']

    # Practice resources
    if 'practice_resources' in data:
        config['practiceResources'] = data['practice_resources']

    # Textbook packets
    if 'textbook_packets' in data:
        config['textbookPackets'] = data['textbook_packets']

    # Serialize to JS
    js_str = json.dumps(config, indent=4, ensure_ascii=False)
    return f"window.CHECKPOINT_CONFIG = {js_str};\n"


def compile_checkpoints(check_only=False):
    """Find all YAML checkpoints and compile to JS."""
    yaml_files = glob.glob(os.path.join(CHECKPOINTS_DIR, '**', '*.yaml'), recursive=True)
    yaml_files.sort()

    compiled = 0
    errors = []

    for yf in yaml_files:
        rel = os.path.relpath(yf, CHECKPOINTS_DIR)
        try:
            js_content = yaml_to_js_config(yf)

            # Extract the config ID for the output filename
            with open(yf, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
            ck_id = data['id']
            basename = os.path.splitext(os.path.basename(yf))[0]
            out_path = os.path.join(JS_CHECKPOINTS_DIR, f'{basename}.js')

            if not check_only:
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                with open(out_path, 'w', encoding='utf-8') as f:
                    f.write(js_content)

            compiled += 1
            print(f"  ✓ {rel} → js/checkpoints/{basename}.js")

        except Exception as e:
            errors.append((rel, str(e)))
            print(f"  ✗ {rel}: {e}")

    return compiled, errors


# ============ CSV → TERMS DB ============

def compile_terms(check_only=False):
    """Compile terms.csv + icons.py into terms-db.js."""
    if not os.path.exists(TERMS_CSV):
        print("  ⚠ No terms.csv found — skipping")
        return 0, []

    terms = {}
    errors = []

    with open(TERMS_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            term = row['term'].strip()
            icon_type = row.get('icon_type', '').strip()
            icon_svg = get_icon(icon_type) if icon_type else None

            if icon_type and not icon_svg:
                errors.append((term, f"icon_type '{icon_type}' not found in icons.py"))

            entry = {
                'def': row['def'].strip(),
                'emoji': row.get('emoji', '').strip(),
                'courses': [c.strip() for c in row.get('courses', '').split(',') if c.strip()],
                'key': row.get('key', '').strip().lower() == 'true',
                'aliases': [a.strip() for a in row.get('aliases', '').split('|') if a.strip()],
            }
            if icon_svg:
                entry['icon'] = icon_svg

            terms[term] = entry

    # Generate JS
    out_path = os.path.join(JS_DIR, 'terms-db.js')

    # Build JS manually for readable output
    lines = ['/* Auto-generated from content/terms.csv + content/icons.py */']
    lines.append('/* Do NOT edit this file — edit content/terms.csv instead */')
    lines.append('window.TERMS_DB = {\n')

    for term, entry in terms.items():
        # JSON-encode the entry, then format nicely
        entry_json = json.dumps(entry, ensure_ascii=False)
        lines.append(f"    {json.dumps(term)}: {entry_json},\n")

    lines.append('};\n')

    js_content = ''.join(lines)

    if not check_only:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(js_content)

    print(f"  ✓ terms.csv → js/terms-db.js ({len(terms)} terms)")
    return len(terms), errors


# ============ STATS ============

def show_stats():
    """Display content statistics."""
    yaml_files = glob.glob(os.path.join(CHECKPOINTS_DIR, '**', '*.yaml'), recursive=True)

    # Count by course
    by_course = {}
    total_chapters = 0
    total_videos = 0
    total_questions = 0

    for yf in yaml_files:
        with open(yf, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        course = data.get('course', 'unknown')
        by_course[course] = by_course.get(course, 0) + 1
        total_chapters += len(data.get('chapters', []))
        for ch in data.get('chapters', []):
            total_videos += 1  # primary
            total_videos += len(ch.get('l1_videos', {}))
            total_videos += len(ch.get('optional_videos', []))
        for part in data.get('notes', {}).get('parts', []):
            total_questions += len(part.get('questions', []))
        total_questions += len(data.get('practice_questions', []))

    # Terms
    term_count = 0
    if os.path.exists(TERMS_CSV):
        with open(TERMS_CSV, 'r', encoding='utf-8') as f:
            term_count = sum(1 for _ in csv.DictReader(f))

    icon_count = len(ICONS)

    print("\n📊 Content Statistics:")
    print(f"   Checkpoints: {len(yaml_files)}")
    for course, count in sorted(by_course.items()):
        print(f"     {course}: {count}")
    print(f"   Chapters: {total_chapters}")
    print(f"   Videos: {total_videos}")
    print(f"   Questions: {total_questions}")
    print(f"   Terms: {term_count}")
    print(f"   Icons: {icon_count}")
    missing = term_count - icon_count
    if missing > 0:
        print(f"   ⚠ {missing} terms missing icons")
    print()


# ============ MAIN ============

def main():
    check_only = '--check' in sys.argv
    stats_only = '--stats' in sys.argv

    if stats_only:
        show_stats()
        return

    mode = "Validating" if check_only else "Compiling"
    print(f"\n{mode} content...\n")

    # Checkpoints
    print("Checkpoints:")
    ck_count, ck_errors = compile_checkpoints(check_only)

    # Terms
    print("\nTerms:")
    term_count, term_errors = compile_terms(check_only)

    # Summary
    all_errors = ck_errors + term_errors
    print(f"\n{'Validated' if check_only else 'Compiled'}: {ck_count} checkpoints, {term_count} terms")
    if all_errors:
        print(f"\n⚠ {len(all_errors)} warnings:")
        for name, err in all_errors:
            print(f"  - {name}: {err}")

    if not check_only:
        show_stats()

    return 0 if not all_errors else 1


if __name__ == '__main__':
    sys.exit(main() or 0)
