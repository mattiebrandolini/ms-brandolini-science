/* ============================================
   Term Annotation System
   
   Scans page text, matches terms from TERMS_DB,
   wraps them with icons + smart tooltips.
   
   - Auto-annotates all text content
   - Viewport-clamped tooltips (never clip off-screen)
   - Shows definition + enlarged icon/image
   - z-index always on top
   ============================================ */
(function() {
'use strict';

var DB = window.TERMS_DB;
if (!DB) return;

// ============ BUILD LOOKUP ============
// Map all terms + aliases to their canonical key
var lookup = {};
var sortedTerms = []; // longest first for matching priority

Object.keys(DB).forEach(function(key) {
    var entry = DB[key];
    var forms = [key].concat(entry.aliases || []);
    forms.forEach(function(form) {
        var lower = form.toLowerCase();
        lookup[lower] = key;
        sortedTerms.push(lower);
    });
});

// Sort longest first so "rough er" matches before "er"
sortedTerms.sort(function(a, b) { return b.length - a.length; });

// Deduplicate
sortedTerms = sortedTerms.filter(function(v, i, a) { return a.indexOf(v) === i; });

// Build regex: match whole words, case-insensitive
// Escape regex special chars in terms
function escRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
var pattern = new RegExp('\\b(' + sortedTerms.map(escRx).join('|') + ')\\b', 'gi');

// ============ SVG ICON HELPER ============
function getIconHTML(entry, size) {
    size = size || 16;
    if (entry.icon) {
        return '<span class="term-icon" style="width:' + size + 'px;height:' + size + 'px;">' + entry.icon + '</span>';
    }
    return '<span class="term-emoji">' + (entry.emoji || '•') + '</span>';
}

function getLargeIconHTML(entry) {
    if (entry.image) {
        return '<img class="term-tooltip-img" src="' + entry.image + '" alt="" loading="lazy">';
    }
    if (entry.icon) {
        return '<span class="term-tooltip-icon">' + entry.icon + '</span>';
    }
    return '<span class="term-tooltip-emoji">' + (entry.emoji || '') + '</span>';
}

// ============ TOOLTIP ============
var tooltip = document.createElement('div');
tooltip.className = 'term-tooltip';
tooltip.setAttribute('role', 'tooltip');
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

var activeTarget = null;
var hideTimer = null;

function showTooltip(el) {
    var key = el.dataset.termKey;
    var entry = DB[key];
    if (!entry) return;

    clearTimeout(hideTimer);
    activeTarget = el;

    tooltip.innerHTML =
        '<div class="term-tooltip-header">' +
            getLargeIconHTML(entry) +
            '<div class="term-tooltip-term">' + key.charAt(0).toUpperCase() + key.slice(1) + '</div>' +
        '</div>' +
        '<div class="term-tooltip-def">' + entry.def + '</div>';

    tooltip.style.display = 'block';

    // Position: above the element, centered, viewport-clamped
    var elRect = el.getBoundingClientRect();
    var ttRect = tooltip.getBoundingClientRect();
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;

    // Horizontal: center on element, clamp to viewport
    var left = elRect.left + (elRect.width / 2) - (ttRect.width / 2) + scrollX;
    var minLeft = scrollX + 8;
    var maxLeft = scrollX + vw - ttRect.width - 8;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    // Vertical: prefer above, fall back to below
    var top = elRect.top - ttRect.height - 8 + scrollY;
    var above = true;
    if (elRect.top - ttRect.height - 8 < 0) {
        top = elRect.bottom + 8 + scrollY;
        above = false;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.toggle('term-tooltip--below', !above);
    tooltip.classList.toggle('term-tooltip--above', above);

    // Arrow position
    var arrowLeft = elRect.left + (elRect.width / 2) + scrollX - left;
    arrowLeft = Math.max(12, Math.min(ttRect.width - 12, arrowLeft));
    tooltip.style.setProperty('--arrow-left', arrowLeft + 'px');
}

function hideTooltip() {
    hideTimer = setTimeout(function() {
        tooltip.style.display = 'none';
        activeTarget = null;
    }, 150);
}

// Keep tooltip alive when hovering the tooltip itself
tooltip.addEventListener('mouseenter', function() { clearTimeout(hideTimer); });
tooltip.addEventListener('mouseleave', function() { hideTooltip(); });

// ============ ANNOTATE ============
var SKIP_TAGS = { SCRIPT:1, STYLE:1, TEXTAREA:1, INPUT:1, SELECT:1, OPTION:1, SVG:1, CODE:1, PRE:1 };
var SKIP_CLASSES = ['term-annotated', 'term-tooltip', 'ck-nav-name', 'ck-nav-label', 'ck-ch-terms'];

function shouldSkip(node) {
    if (!node || !node.parentElement) return true;
    var el = node.parentElement;
    if (SKIP_TAGS[el.tagName]) return true;
    // Walk up to check for skip classes or already-annotated parents
    var check = el;
    while (check && check !== document.body) {
        if (check.classList) {
            for (var i = 0; i < SKIP_CLASSES.length; i++) {
                if (check.classList.contains(SKIP_CLASSES[i])) return true;
            }
        }
        if (check.tagName === 'BUTTON' || check.tagName === 'A' || check.tagName === 'SUMMARY') return true;
        check = check.parentElement;
    }
    return false;
}

function annotateTextNode(textNode) {
    if (shouldSkip(textNode)) return;
    var text = textNode.textContent;
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0; // reset regex state

    var frag = document.createDocumentFragment();
    var lastIndex = 0;
    var match;

    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
        var matchedText = match[0];
        var termKey = lookup[matchedText.toLowerCase()];
        if (!termKey) continue;
        var entry = DB[termKey];

        // Only annotate first mention per section
        if (!isFirstMention(termKey, textNode)) {
            continue;
        }

        // Add text before match
        if (match.index > lastIndex) {
            frag.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        // Create annotated span
        var span = document.createElement('span');
        span.className = 'term-annotated' + (entry.key ? ' term-key' : '');
        span.dataset.termKey = termKey;
        span.innerHTML = getIconHTML(entry) + '<span class="term-text">' + matchedText + '</span>';

        span.setAttribute('tabindex', '0');

        frag.appendChild(span);
        lastIndex = match.index + matchedText.length;
    }

    if (lastIndex === 0) return; // no matches actually replaced
    if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
}

// Track which terms have been annotated per section
var sectionSeen = {};
var currentSectionId = '__global__';

function getSectionId(node) {
    var el = node.parentElement || node;
    while (el && el !== document.body) {
        // Checkpoint chapters, or any section/article
        if (el.classList && el.classList.contains('ck-chapter')) return 'ck-' + (el.dataset.ch || el.id || 'unknown');
        if (el.tagName === 'SECTION' || el.tagName === 'ARTICLE') return el.id || el.tagName + '-' + el.querySelector('h1,h2,h3,h4')?.textContent?.substring(0,20) || 'section';
        el = el.parentElement;
    }
    return '__page__';
}

function isFirstMention(termKey, node) {
    var secId = getSectionId(node);
    if (!sectionSeen[secId]) sectionSeen[secId] = {};
    if (sectionSeen[secId][termKey]) return false;
    sectionSeen[secId][termKey] = true;
    return true;
}

function walkAndAnnotate(root) {
    var textNodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim().length > 0) {
            textNodes.push(walker.currentNode);
        }
    }
    textNodes.forEach(annotateTextNode);
}

// ============ UPGRADE EXISTING <dfn> TAGS ============
// Replace CSS-only data-def tooltips with the smart system
function upgradeDfns() {
    var dfns = document.querySelectorAll('dfn[data-def]');
    dfns.forEach(function(dfn) {
        var text = dfn.textContent.toLowerCase();
        var termKey = lookup[text];
        if (!termKey) return;
        var entry = DB[termKey];

        // Mark this as seen for the section it's in
        var dfnSecId = getSectionId(dfn);
        if (!sectionSeen[dfnSecId]) sectionSeen[dfnSecId] = {};
        sectionSeen[dfnSecId][termKey] = true;

        var span = document.createElement('span');
        span.className = 'term-annotated term-key term-from-dfn';
        span.dataset.termKey = termKey;
        span.innerHTML = getIconHTML(entry) + '<span class="term-text">' + dfn.textContent + '</span>';
        span.setAttribute('tabindex', '0');

        dfn.parentNode.replaceChild(span, dfn);
    });
}

// ============ UPGRADE KEY TERMS BOXES ============
// checkpoint.js renders key terms with data-term-name attributes.
// We upgrade them here with icons + tooltip support.
function upgradeKeyTerms() {
    var items = document.querySelectorAll('[data-term-name]');
    items.forEach(function(p) {
        var name = p.getAttribute('data-term-name');
        var termKey = lookup[name.toLowerCase()];
        if (!termKey) return;
        var entry = DB[termKey];
        if (!entry) return;

        // Find the <strong> element and replace it with an annotated span
        var strong = p.querySelector('strong');
        if (!strong) return;

        var span = document.createElement('span');
        span.className = 'term-annotated term-key';
        span.dataset.termKey = termKey;
        span.setAttribute('tabindex', '0');
        span.innerHTML = getIconHTML(entry) + '<span class="term-text">' + strong.textContent + '</span>';

        strong.parentNode.replaceChild(span, strong);
        p.removeAttribute('data-term-name'); // mark as processed
        p.classList.add('ck-ch-term-entry');
    });
}

// ============ INIT ============
// Content areas to scan (not nav, not toolbars)
var CONTENT_SELECTORS = ['.ck-content', '.ck-reading', '.page-content', 'main', '.content-body', 'article'];

function init() {
    // Upgrade key terms boxes (checkpoint.js renders these with data-term-name)
    upgradeKeyTerms();

    // Upgrade existing <dfn> tags
    upgradeDfns();

    // Then scan content areas
    var scanned = false;
    CONTENT_SELECTORS.forEach(function(sel) {
        var els = document.querySelectorAll(sel);
        els.forEach(function(el) { walkAndAnnotate(el); scanned = true; });
    });

    // Fallback: scan body if no content selectors matched
    if (!scanned) {
        walkAndAnnotate(document.body);
    }
}

// Run after DOM + other scripts have built content
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 100); });
} else {
    setTimeout(init, 100);
}

// ============ EVENT DELEGATION ============
// Tooltips work for ANY .term-annotated element, no matter who created it
document.addEventListener('mouseover', function(e) {
    var el = e.target.closest('.term-annotated');
    if (el) showTooltip(el);
});
document.addEventListener('mouseout', function(e) {
    var el = e.target.closest('.term-annotated');
    if (el) hideTooltip();
});
document.addEventListener('focusin', function(e) {
    var el = e.target.closest('.term-annotated');
    if (el) showTooltip(el);
});
document.addEventListener('focusout', function(e) {
    var el = e.target.closest('.term-annotated');
    if (el) hideTooltip();
});

// Re-annotate when checkpoint chapters render (dynamic content)
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && !node.classList.contains('term-tooltip')) {
                // Upgrade any key terms boxes in the new content
                if (node.querySelector && node.querySelector('[data-term-name]')) {
                    upgradeKeyTerms();
                }
                walkAndAnnotate(node);
            }
        });
    });
});
var contentEl = document.getElementById('ck-content') || document.querySelector('main');
if (contentEl) {
    observer.observe(contentEl, { childList: true, subtree: true });
}

// ============ EXPOSE FOR OTHER SCRIPTS ============
// checkpoint.js uses these to render rich key terms
window.TermSystem = {
    getIconHTML: getIconHTML,
    DB: DB,
    lookup: lookup
};

})();
