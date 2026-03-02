/* ============================================
   Image Monitor
   
   Site-wide broken image detection.
   
   Always active:
   - Replaces broken images with a styled placeholder
   - Logs broken URLs to console
   
   Debug mode (?debug=images):
   - Shows a floating report panel
   - Lists all broken images with source URLs
   - Copy-pasteable replacement list
   ============================================ */
(function() {
'use strict';

var broken = [];
var checked = 0;
var debugMode = /[?&]debug=images/.test(location.search);

// ---- Handle broken image ----
function onImgError(img) {
    // Skip already-handled or tracking pixels
    if (img.dataset.monitored === 'error') return;
    if (img.width < 2 && img.height < 2) return;
    img.dataset.monitored = 'error';

    var src = img.getAttribute('src') || '';
    var alt = img.getAttribute('alt') || '';
    var context = findContext(img);

    broken.push({ src: src, alt: alt, context: context, element: img });

    // Visual placeholder (unless inside a figure that handles its own errors)
    if (!img.closest('.ck-ch-figure')) {
        var ph = document.createElement('div');
        ph.className = 'img-broken-ph';
        ph.innerHTML = '<span class="img-broken-icon">\ud83d\uddbc\ufe0f</span>'
            + '<span class="img-broken-text">' + (alt || 'Image not available') + '</span>';
        img.parentNode.insertBefore(ph, img.nextSibling);
        img.style.display = 'none';
    }

    console.warn('[Image Monitor] Broken image:', src, '| Context:', context);

    if (debugMode) updateDebugPanel();
}

function onImgLoad(img) {
    if (!img.dataset.monitored) {
        img.dataset.monitored = 'ok';
        checked++;
    }
}

// ---- Find page context for the broken image ----
function findContext(img) {
    // Walk up to find a heading or identifiable container
    var el = img.parentElement;
    while (el && el !== document.body) {
        if (el.dataset && el.dataset.ch) return 'Chapter: ' + el.dataset.ch;
        if (el.classList && el.classList.contains('ck-chapter')) {
            var h = el.querySelector('h2, h3');
            return h ? h.textContent.trim() : 'checkpoint chapter';
        }
        if (el.classList && el.classList.contains('cv-res')) {
            var link = el.querySelector('.cv-res-link');
            return link ? 'Resource: ' + link.textContent.trim() : 'resource card';
        }
        el = el.parentElement;
    }
    return document.title || 'unknown';
}

// ---- Monitor all images ----
function monitorAll() {
    var imgs = document.querySelectorAll('img:not([data-monitored])');
    imgs.forEach(function(img) {
        if (img.complete) {
            if (img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) {
                onImgError(img);
            } else {
                onImgLoad(img);
            }
        } else {
            img.addEventListener('error', function() { onImgError(img); });
            img.addEventListener('load', function() { onImgLoad(img); });
        }
        img.dataset.monitored = img.dataset.monitored || 'watching';
    });
}

// ---- Debug panel ----
var panel = null;

function updateDebugPanel() {
    if (!debugMode) return;

    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'img-debug-panel';
        panel.innerHTML = '<div id="img-debug-header">'
            + '<span>\ud83d\uddbc\ufe0f Image Monitor</span>'
            + '<button id="img-debug-close">\u2715</button>'
            + '</div><div id="img-debug-body"></div>';
        document.body.appendChild(panel);
        document.getElementById('img-debug-close').addEventListener('click', function() {
            panel.style.display = 'none';
        });
    }

    var body = document.getElementById('img-debug-body');
    if (broken.length === 0) {
        body.innerHTML = '<p style="color:#4ade80">\u2713 All images loading correctly (' + checked + ' checked)</p>';
        return;
    }

    var html = '<p style="color:#f59e0b">\u26a0 ' + broken.length + ' broken image' + (broken.length > 1 ? 's' : '') + '</p>';
    html += '<div class="img-debug-list">';
    broken.forEach(function(b, i) {
        html += '<div class="img-debug-item">'
            + '<div class="img-debug-num">' + (i + 1) + '</div>'
            + '<div>'
            + '<div class="img-debug-ctx">' + b.context + '</div>'
            + '<div class="img-debug-src">' + b.src + '</div>'
            + (b.alt ? '<div class="img-debug-alt">alt: ' + b.alt + '</div>' : '')
            + '</div></div>';
    });
    html += '</div>';

    // Copy-pasteable replacement list
    html += '<button id="img-debug-copy" style="margin-top:0.5rem">Copy replacement list</button>';
    body.innerHTML = html;

    document.getElementById('img-debug-copy').addEventListener('click', function() {
        var csv = 'broken_url,alt,context\n';
        broken.forEach(function(b) {
            csv += '"' + b.src + '","' + b.alt + '","' + b.context + '"\n';
        });
        navigator.clipboard.writeText(csv).then(function() {
            document.getElementById('img-debug-copy').textContent = '\u2713 Copied!';
        });
    });
}

// ---- Styles ----
var style = document.createElement('style');
style.textContent = ''
    + '.img-broken-ph{display:flex;align-items:center;gap:0.5rem;padding:1rem;background:var(--bg-card,#1e293b);border:1px dashed #f59e0b;border-radius:6px;color:var(--text-dim,#94a3b8);font-size:0.85em;margin:0.5rem 0}'
    + '.img-broken-icon{font-size:1.3em}'
    + '#img-debug-panel{position:fixed;bottom:1rem;right:1rem;width:420px;max-height:50vh;background:#0f172a;border:1px solid #334155;border-radius:8px;z-index:99999;font-family:system-ui;font-size:13px;color:#e2e8f0;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5)}'
    + '#img-debug-header{display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;background:#1e293b;border-bottom:1px solid #334155;font-weight:600}'
    + '#img-debug-header button{background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1.1em}'
    + '#img-debug-body{padding:0.75rem;overflow-y:auto;max-height:calc(50vh - 3rem)}'
    + '.img-debug-list{display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem}'
    + '.img-debug-item{display:flex;gap:0.5rem;padding:0.4rem;background:#1e293b;border-radius:4px}'
    + '.img-debug-num{color:#f59e0b;font-weight:700;min-width:1.5em}'
    + '.img-debug-ctx{color:#94a3b8;font-size:0.9em}'
    + '.img-debug-src{color:#60a5fa;word-break:break-all;font-size:0.85em}'
    + '.img-debug-alt{color:#64748b;font-size:0.85em;font-style:italic}'
    + '#img-debug-copy{background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:0.35rem 0.75rem;border-radius:4px;cursor:pointer;font-size:12px}'
    + '#img-debug-copy:hover{background:#334155}';
document.head.appendChild(style);

// ---- Run ----
// Initial scan after DOM + scripts have built content
function run() {
    monitorAll();
    if (debugMode) updateDebugPanel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(run, 500); });
} else {
    setTimeout(run, 500);
}

// Re-scan when new content is added (course viewer, checkpoint chapters)
var obs = new MutationObserver(function() { setTimeout(monitorAll, 200); });
obs.observe(document.body, { childList: true, subtree: true });

})();
