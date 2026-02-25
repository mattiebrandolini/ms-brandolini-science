#!/usr/bin/env python3
"""
Build script for Ms. Brandolini's Science website.

Generates all HTML from Jinja2 templates + config.
Run: python3 build.py

What it does:
  1. Reads config.py for course data and site settings
  2. Renders templates into the site root
  3. Bumps cache version on all script/style refs
  4. Regenerates sitemap.xml
  5. Reports what was generated
"""

import os
import sys
import datetime
from pathlib import Path

# Add build dir to path so we can import config
BUILD_DIR = Path(__file__).parent
SITE_ROOT = BUILD_DIR.parent
sys.path.insert(0, str(BUILD_DIR))

from jinja2 import Environment, FileSystemLoader
from config import (
    SITE_URL, SITE_TITLE, SITE_DESCRIPTION, CACHE_VERSION,
    FONT_LINK, FONT_BODY, FONT_HEADING,
    OPENDYSLEXIC_LINK, COURSES,
)

# --- Setup Jinja2 ---
env = Environment(
    loader=FileSystemLoader(str(BUILD_DIR / 'templates')),
    trim_blocks=True,
    lstrip_blocks=True,
)

# Shared template context
BASE_CTX = {
    'site_url': SITE_URL,
    'site_title': SITE_TITLE,
    'site_description': SITE_DESCRIPTION,
    'cache_version': CACHE_VERSION,
    'font_link': FONT_LINK,
    'font_body': FONT_BODY,
    'font_heading': FONT_HEADING,
    'opendyslexic_link': OPENDYSLEXIC_LINK,
    'courses': COURSES,
    'year': datetime.date.today().year,
}

# Track generated files for sitemap
generated = []


def write_page(rel_path, template_name, extra_ctx=None):
    """Render a template and write it to the site root."""
    ctx = {**BASE_CTX}
    if extra_ctx:
        ctx.update(extra_ctx)

    # Calculate root-relative prefix (e.g., "../../" for student/biology/)
    depth = rel_path.count('/')
    ctx['root'] = '../' * depth if depth > 0 else ''

    tmpl = env.get_template(template_name)
    html = tmpl.render(**ctx)

    out_path = SITE_ROOT / rel_path
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding='utf-8')
    generated.append(rel_path)
    return rel_path


def build_all():
    print(f"Building {SITE_TITLE}...")
    print(f"  Cache version: {CACHE_VERSION}")
    print(f"  Courses: {len(COURSES)}")
    print()

    # --- 1. Splitter (index.html) ---
    write_page('index.html', 'splitter.html', {
        'title': SITE_TITLE,
        'og_desc': SITE_DESCRIPTION,
        'stylesheets': ['styles/main.css', 'styles/print.css'],
        'scripts': ['js/toolbar.js'],
    })

    # --- 2. Student home ---
    write_page('student/index.html', 'student_home.html', {
        'title': f'Student Resources — {SITE_TITLE}',
        'og_desc': 'Science courses, resources, and tools for students at Everett High School.',
        'stylesheets': ['styles/main.css', 'styles/print.css'],
        'scripts': ['js/toolbar.js'],
    })

    # --- 3. Teacher home ---
    write_page('teacher/index.html', 'teacher_home.html', {
        'title': f'Teaching Companion — {SITE_TITLE}',
        'og_desc': 'Pedagogical context, standards alignment, and implementation guides for science curriculum.',
        'stylesheets': ['styles/main.css', 'styles/print.css'],
        'scripts': ['js/toolbar.js'],
    })

    # --- 4. Student course stubs ---
    for c in COURSES:
        write_page(f'student/{c["slug"]}/index.html', 'course_stub.html', {
            'title': f'{c["title"]} — Student Resources',
            'og_desc': c['og_desc'],
            'course': c,
            'role': 'student',
            'stylesheets': ['styles/main.css'],
            'scripts': ['js/toolbar.js'],
        })

    # --- 5. Teacher course stubs ---
    for c in COURSES:
        write_page(f'teacher/{c["slug"]}/index.html', 'course_stub.html', {
            'title': f'{c["title"]} — Teacher Guide',
            'og_desc': c['og_desc'],
            'course': c,
            'role': 'teacher',
            'stylesheets': ['styles/main.css'],
            'scripts': ['js/toolbar.js'],
        })

    # --- 6. Course resource viewers (only for live courses with config_js) ---
    for c in COURSES:
        if c.get('config_js'):
            write_page(f'student/{c["slug"]}/resources.html', 'course_resources.html', {
                'title': f'{c["title"]} Resources — {SITE_TITLE}',
                'og_desc': c['og_desc'],
                'course': c,
                'stylesheets': ['styles/course-viewer.css'],
                'scripts': [f'js/{c["config_js"]}', 'js/course-viewer.js', 'js/toolbar.js'],
            })

    # --- 7. Tools hub ---
    write_page('student/tools/index.html', 'tools_hub.html', {
        'title': f'Interactive Tools — {SITE_TITLE}',
        'og_desc': 'Interactive science tools and simulations for students.',
        'stylesheets': ['styles/main.css'],
        'scripts': ['js/toolbar.js'],
    })

    # --- 8. 404 page ---
    # 404 uses absolute paths since GitHub Pages serves it from any URL
    ctx_404 = {
        **BASE_CTX,
        'title': f'404 — {SITE_TITLE}',
        'og_desc': 'Page not found.',
        'root': f'{SITE_URL.rstrip("/")}/',
        'stylesheets': ['styles/main.css'],
        'scripts': ['js/toolbar.js'],
    }
    tmpl = env.get_template('404.html')
    html = tmpl.render(**ctx_404)
    (SITE_ROOT / '404.html').write_text(html, encoding='utf-8')
    generated.append('404.html')

    # --- 9. Generate sitemap ---
    sitemap_entries = []
    for rel in sorted(generated):
        if rel == '404.html':
            continue
        url = f'{SITE_URL}/{rel}'
        # Clean up index.html in URLs
        if url.endswith('/index.html'):
            url = url.replace('/index.html', '/')
        sitemap_entries.append(f'  <url><loc>{url}</loc></url>')

    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += '\n'.join(sitemap_entries)
    sitemap += '\n</urlset>\n'
    (SITE_ROOT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')

    # --- Report ---
    print(f"Generated {len(generated)} pages:")
    for p in sorted(generated):
        print(f"  ✓ {p}")
    print(f"\n  ✓ sitemap.xml ({len(sitemap_entries)} URLs)")
    print(f"\nDone! Cache version: v={CACHE_VERSION}")


if __name__ == '__main__':
    build_all()
