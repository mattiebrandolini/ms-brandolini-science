/* ============================================
   Course Viewer v2 Engine
   
   Layout: topbar (filters + search) + sidebar (units) + main (topics)
   Features: fuzzy search, CSV fallback, captions filter, thumbnails, QR codes
   
   Usage: Set window.COURSE_CONFIG before loading this script.
   ============================================ */
(function() {
    'use strict';
    
    var CONFIG = window.COURSE_CONFIG;
    if (!CONFIG) { console.error('COURSE_CONFIG not defined'); return; }

    // State
    var resources = [];
    var activeUnit = 'all';
    var searchQuery = '';
    var typeFilter = '';
    var captionsOnly = false;
    var hasCaptionsData = false;
    var fuseIndex = null;

    // Units derived from config
    var UNITS = {};
    CONFIG.topics.forEach(function(t) {
        if (!UNITS[t.tab]) UNITS[t.tab] = { id: t.tab, label: '', topics: [] };
        UNITS[t.tab].topics.push(t);
    });
    CONFIG.tabs.forEach(function(t) { if (UNITS[t.id]) UNITS[t.id].label = t.label; });

    // Type config
    var TYPE_CFG = {
        video: { emoji: '📹', label: 'Videos', order: 1 },
        audio: { emoji: '🎧', label: 'Audio', order: 2 },
        simulation: { emoji: '🔬', label: 'Simulations', order: 3 },
        game: { emoji: '🕹️', label: 'Games', order: 4 },
        lab: { emoji: '🧪', label: 'Labs', order: 5 },
        reading: { emoji: '📖', label: 'Reading', order: 6 },
        worksheet: { emoji: '📝', label: 'Worksheets', order: 7 },
        interactive: { emoji: '🎮', label: 'Interactive', order: 8 },
        other: { emoji: '💡', label: 'Other', order: 9 }
    };
    var TYPE_ORDER = Object.keys(TYPE_CFG);
    var FILTER_TYPES = ['video', 'simulation', 'lab', 'reading', 'game'];

    // Colors for unit groups
    var GRP_COLORS = ['#7c3aed','#059669','#0891b2','#ca8a04','#16a34a','#8b5cf6','#dc2626','#0284c7','#ea580c','#d946ef','#6366f1','#14b8a6'];
    function grpColor(g) { return GRP_COLORS[(g - 1) % GRP_COLORS.length]; }

    // ---- CSV Parsing ----
    function parseLine(l) {
        var r = [], c = '', q = false;
        for (var i = 0; i < l.length; i++) {
            var ch = l[i];
            if (ch === '"') q = !q;
            else if (ch === ',' && !q) { r.push(c.trim()); c = ''; }
            else c += ch;
        }
        r.push(c.trim());
        return r;
    }

    function parseCSV(text) {
        var lines = text.trim().split('\n');
        if (lines.length < 2) return [];
        var headers = parseLine(lines[0]);
        return lines.slice(1).map(function(line) {
            var vals = parseLine(line);
            var row = {};
            headers.forEach(function(h, i) {
                row[h.trim().toLowerCase().replace(/\s+/g, '_')] = vals[i] || '';
            });
            return row;
        });
    }

    // ---- Fetch with fallback ----
    async function fetchResources() {
        if (!CONFIG.sheetUrl) return [];
        
        // Try live fetch
        try {
            var controller = new AbortController();
            var timeout = setTimeout(function() { controller.abort(); }, 8000);
            var resp = await fetch(CONFIG.sheetUrl, { signal: controller.signal });
            clearTimeout(timeout);
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            var text = await resp.text();
            var parsed = parseCSV(text);
            console.log('Loaded ' + parsed.length + ' resources (live)');
            return parsed;
        } catch (e) {
            console.warn('Live fetch failed:', e.message);
        }
        
        // Fallback to snapshot
        var snapshotUrl = '../../static/data/' + (CONFIG.slug || 'unknown') + '.csv';
        try {
            var resp2 = await fetch(snapshotUrl);
            if (!resp2.ok) throw new Error('HTTP ' + resp2.status);
            var text2 = await resp2.text();
            var parsed2 = parseCSV(text2);
            console.log('Loaded ' + parsed2.length + ' resources (snapshot)');
            
            var main = document.querySelector('.cv-main');
            if (main) {
                var banner = document.createElement('div');
                banner.className = 'cv-fallback-banner';
                banner.setAttribute('role', 'status');
                banner.textContent = 'Using offline copy — some links may be out of date';
                main.insertBefore(banner, main.firstChild);
            }
            return parsed2;
        } catch (e2) {
            console.error('Snapshot also failed:', e2);
            var main2 = document.querySelector('.cv-main');
            if (main2) main2.innerHTML = '<div class="cv-error"><h2>Could not load resources</h2><p>Try refreshing, or <a href="' + CONFIG.sheetUrl + '">open the list directly</a>.</p><button class="cv-retry" onclick="location.reload()">Retry</button></div>';
            return [];
        }
    }

    // ---- Helpers ----
    function qrUrl(url) {
        if (!url) return '';
        return 'https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=' + encodeURIComponent(url);
    }

    function ytId(url) {
        if (!url) return null;
        var m = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : null;
    }

    // ---- Render functions ----
    function renderThumb(r) {
        var vid = r.video_id || ytId(r.url);
        var emoji = (TYPE_CFG[r.type] || TYPE_CFG.other).emoji;
        if (vid) {
            return '<div class="cv-res-thumb"><img src="https://img.youtube.com/vi/' + vid + '/mqdefault.jpg" alt="" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=cv-res-thumb-ph>' + emoji + '</div>\'"></div>';
        }
        return '<div class="cv-res-thumb"><div class="cv-res-thumb-ph">' + emoji + '</div></div>';
    }

    function renderResource(r) {
        var title = r.url
            ? '<a class="cv-res-link" href="' + r.url + '" target="_blank" rel="noopener">' + (r.title || 'Link') + '</a>'
            : '<span class="cv-res-plain">' + (r.title || 'Untitled') + '</span>';

        var ccBadge = (r.captions && r.captions.trim().toLowerCase() === 'yes')
            ? '<span class="cv-cc-badge" title="Has captions">CC</span>' : '';

        var tags = '';
        if (r.wida) tags += '<span class="cv-rtag cv-rtag-wida">W' + r.wida + '</span>';
        if (r.pace) tags += '<span class="cv-rtag cv-rtag-pace">' + r.pace + '</span>';
        if (r.visuals) tags += '<span class="cv-rtag cv-rtag-visuals">' + r.visuals + '</span>';

        var notes = r.notes
            ? '<div class="cv-res-notes">💡 ' + r.notes + '</div>' : '';

        var qr = r.url
            ? '<div class="cv-res-qr"><img src="' + qrUrl(r.url) + '" alt="QR code" loading="lazy" onerror="this.style.display=\'none\'"></div>' : '';

        return '<div class="cv-res">' + renderThumb(r) +
            '<div class="cv-res-body"><div>' + title + ccBadge + '</div>' +
            '<div class="cv-res-meta">' +
            (r.provider ? '<span>' + r.provider + '</span>' : '') +
            (r.duration ? '<span>· ' + r.duration + '</span>' : '') +
            '</div>' +
            (tags ? '<div class="cv-res-tags">' + tags + '</div>' : '') +
            '</div>' + qr + '</div>' + notes;
    }

    function renderTopic(t) {
        var tr = resources.filter(function(r) { return r.topic_code === t.code; });
        if (typeFilter) tr = tr.filter(function(r) { return r.type === typeFilter; });
        if (captionsOnly) tr = tr.filter(function(r) { return r.captions && r.captions.trim().toLowerCase() === 'yes'; });

        // Group by type
        var byType = {};
        tr.forEach(function(r) {
            var type = TYPE_CFG[r.type] ? r.type : 'other';
            if (!byType[type]) byType[type] = [];
            byType[type].push(r);
        });
        // Sort within type by rank
        Object.values(byType).forEach(function(arr) {
            arr.sort(function(a, b) {
                var ra = parseInt(a.rank) || 999, rb = parseInt(b.rank) || 999;
                return ra !== rb ? ra - rb : (a.title || '').localeCompare(b.title || '');
            });
        });

        var sorted = TYPE_ORDER.filter(function(t) { return byType[t]; });
        var resHtml = '';
        if (!sorted.length) {
            resHtml = '<div style="padding:0.75rem;color:var(--text-dim);font-size:0.82rem;font-style:italic">No resources match current filters</div>';
        } else {
            sorted.forEach(function(type) {
                var cfg = TYPE_CFG[type];
                resHtml += '<div class="cv-type-group"><div class="cv-type-label">' + cfg.emoji + ' ' + cfg.label + '</div>' +
                    byType[type].map(renderResource).join('') + '</div>';
            });
        }

        var count = tr.length;
        return '<div class="cv-topic-block" data-code="' + t.code + '">' +
            '<div class="cv-topic-head" onclick="window._cvToggle(\'' + t.code + '\')">' +
            '<div class="cv-topic-dot" style="background:' + grpColor(t.group) + '"></div>' +
            '<span class="cv-topic-code">' + t.code + '</span>' +
            '<span class="cv-topic-name">' + t.name + '</span>' +
            '<span class="cv-topic-count">' + count + '</span>' +
            '<span class="cv-topic-chevron">▶</span>' +
            '</div><div class="cv-topic-resources">' + resHtml + '</div></div>';
    }

    window._cvToggle = function(code) {
        var el = document.querySelector('.cv-topic-block[data-code="' + code + '"]');
        if (el) el.classList.toggle('open');
    };

    function getFilteredTopics() {
        var topics;
        if (activeUnit === 'all') {
            topics = CONFIG.topics.slice();
        } else {
            topics = (UNITS[activeUnit] ? UNITS[activeUnit].topics : []).slice();
        }

        // Fuzzy search
        if (searchQuery && fuseIndex) {
            var results = fuseIndex.search(searchQuery);
            var matchCodes = {};
            results.forEach(function(r) { matchCodes[r.item.code] = true; });
            topics = topics.filter(function(t) { return matchCodes[t.code]; });
        }

        // Captions filter: only keep topics with captioned resources
        if (captionsOnly) {
            topics = topics.filter(function(t) {
                return resources.some(function(r) {
                    return r.topic_code === t.code && r.captions && r.captions.trim().toLowerCase() === 'yes';
                });
            });
        }

        return topics;
    }

    function renderSidebar() {
        var sb = document.querySelector('.cv-sidebar');
        if (!sb) return;

        var html = '<div class="cv-sidebar-label">Navigation</div>' +
            '<div class="cv-sidebar-unit' + (activeUnit === 'all' ? ' active' : '') + '" data-unit="all">' +
            '<div class="cv-sidebar-dot" style="background:var(--accent-bio)"></div>' +
            '<span class="cv-sidebar-name">All Topics</span>' +
            '<span class="cv-sidebar-count">' + CONFIG.topics.length + '</span></div>';

        html += '<div class="cv-sidebar-label">Units</div>';
        CONFIG.tabs.filter(function(t) { return t.id !== 'all'; }).forEach(function(tab) {
            var u = UNITS[tab.id];
            if (!u) return;
            var label = tab.label.replace(/^[^:]+:\s*/, '');
            html += '<div class="cv-sidebar-unit' + (activeUnit === tab.id ? ' active' : '') + '" data-unit="' + tab.id + '">' +
                '<div class="cv-sidebar-dot" style="background:' + grpColor(u.topics[0] ? u.topics[0].group : 1) + '"></div>' +
                '<span class="cv-sidebar-name">' + label + '</span>' +
                '<span class="cv-sidebar-count">' + u.topics.length + '</span></div>';
        });

        sb.innerHTML = html;
        sb.querySelectorAll('.cv-sidebar-unit').forEach(function(el) {
            el.addEventListener('click', function() {
                activeUnit = el.dataset.unit;
                renderSidebar();
                renderMain();
                sb.classList.remove('open');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    function renderMain() {
        var main = document.querySelector('.cv-main');
        if (!main) return;

        // Preserve fallback banner if present
        var banner = main.querySelector('.cv-fallback-banner');

        var topics = getFilteredTopics();
        if (!topics.length) {
            main.innerHTML = '<div class="cv-empty"><div class="cv-empty-icon">🔍</div><div>No topics match your search.</div></div>';
            if (banner) main.insertBefore(banner, main.firstChild);
            return;
        }

        var html = '';
        if (activeUnit === 'all') {
            CONFIG.tabs.filter(function(t) { return t.id !== 'all'; }).forEach(function(tab) {
                var unitTopics = topics.filter(function(t) { return t.tab === tab.id; });
                if (!unitTopics.length) return;
                html += '<div class="cv-unit-header" id="unit-' + tab.id + '"><h2>' + tab.label + '</h2>' +
                    '<div class="cv-unit-meta">' + unitTopics.length + ' topics</div></div>';
                html += unitTopics.map(renderTopic).join('');
            });
        } else {
            var u = UNITS[activeUnit];
            html += '<div class="cv-unit-header"><h2>' + (u ? u.label : activeUnit) + '</h2>' +
                '<div class="cv-unit-meta">' + topics.length + ' topics</div></div>';
            html += topics.map(renderTopic).join('');
        }

        main.innerHTML = html;
        if (banner) main.insertBefore(banner, main.firstChild);
    }

    function renderFilters() {
        var container = document.querySelector('.cv-topbar-filters');
        if (!container) return;

        var html = FILTER_TYPES.map(function(t) {
            var cfg = TYPE_CFG[t];
            return '<button class="cv-filter-btn' + (typeFilter === t ? ' active' : '') + '" data-type="' + t + '" title="' + cfg.label + '">' + cfg.emoji + '</button>';
        }).join('');

        container.innerHTML = html;
        container.querySelectorAll('.cv-filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                typeFilter = typeFilter === btn.dataset.type ? '' : btn.dataset.type;
                renderFilters();
                renderMain();
            });
        });
    }

    // ---- Init ----
    async function init() {
        // Show loading in main
        var main = document.querySelector('.cv-main');
        if (main) {
            main.innerHTML = '<div class="cv-loading"><div class="cv-spinner"></div><p>Loading ' + CONFIG.title + ' resources…</p></div>';
        }

        renderSidebar();
        renderFilters();

        // Wire search
        var searchEl = document.querySelector('.cv-topbar-search');
        if (searchEl) {
            searchEl.addEventListener('input', function(e) {
                searchQuery = e.target.value;
                renderMain();
            });
        }

        // Wire sidebar toggle
        var sidebarToggle = document.querySelector('.cv-sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                document.querySelector('.cv-sidebar').classList.toggle('open');
            });
        }

        // Wire CC filter
        var ccBtn = document.getElementById('cv-cc-filter');
        if (ccBtn) {
            ccBtn.addEventListener('click', function() {
                captionsOnly = !captionsOnly;
                this.classList.toggle('active', captionsOnly);
                renderMain();
            });
        }

        // Fetch data
        resources = await fetchResources();
        hasCaptionsData = resources.some(function(r) { return r.captions && r.captions.trim() !== ''; });

        // Show CC button if data supports it
        if (hasCaptionsData) {
            var ccContainer = document.getElementById('cv-cc-container');
            if (ccContainer) ccContainer.style.display = 'inline-block';
        }

        // Build fuzzy search index
        if (typeof Fuse !== 'undefined' && CONFIG.topics) {
            fuseIndex = new Fuse(CONFIG.topics, {
                keys: ['code', 'name'],
                threshold: 0.4,
                distance: 100,
                ignoreLocation: true
            });
        }

        renderMain();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
