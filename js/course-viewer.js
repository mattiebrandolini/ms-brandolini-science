/* ============================================
   Course Viewer — Shared Engine
   
   Usage: Set window.COURSE_CONFIG before loading this script.
   
   COURSE_CONFIG = {
       title: "Biology Study Resources",
       subtitle: "Click a topic to see videos and readings.",
       icon: "📚",
       sheetUrl: "https://docs.google.com/.../pub?output=csv",
       tabs: [
           { id: "all", label: "All Topics" },
           { id: "Q1", label: "Q1: Foundations" },
           ...
       ],
       topics: [
           { code: "1A", name: "Topic Name", tab: "Q1", group: 1 },
           ...
       ]
   }
   ============================================ */

(function() {
    'use strict';

    const CONFIG = window.COURSE_CONFIG;
    if (!CONFIG) {
        console.error('COURSE_CONFIG not defined. Set it before loading course-viewer.js');
        return;
    }

    // State
    let resources = [];
    let currentTab = 'all';
    let searchQuery = '';

    // ---- CSV Parsing ----
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQuotes = !inQuotes; }
            else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
            else { current += ch; }
        }
        result.push(current.trim());
        return result;
    }

    function parseCSV(text) {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];
        const headers = parseCSVLine(lines[0]);
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((h, idx) => {
                row[h.trim().toLowerCase().replace(/\s+/g, '_')] = values[idx] || '';
            });
            data.push(row);
        }
        return data;
    }

    // ---- Fetch Resources ----
    async function fetchResources() {
        if (!CONFIG.sheetUrl) return [];
        try {
            const resp = await fetch(CONFIG.sheetUrl);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const text = await resp.text();
            const parsed = parseCSV(text);
            console.log(`Loaded ${parsed.length} resources from sheet`);
            return parsed;
        } catch (err) {
            console.error('Error fetching sheet:', err);
            return [];
        }
    }

    // ---- QR Code ----
    function qrUrl(url) {
        if (!url) return '';
        return `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}`;
    }

    // ---- Type Config ----
    const TYPE_CONFIG = {
        video:       { emoji: '📹', label: 'Videos', order: 1 },
        audio:       { emoji: '🎧', label: 'Audio', order: 2 },
        simulation:  { emoji: '🔬', label: 'Simulations', order: 3 },
        game:        { emoji: '🕹️', label: 'Games', order: 4 },
        lab:         { emoji: '🧪', label: 'Virtual Labs', order: 5 },
        reading:     { emoji: '📖', label: 'Reading', order: 6 },
        worksheet:   { emoji: '📝', label: 'Worksheets', order: 7 },
        interactive: { emoji: '🎮', label: 'Interactive', order: 8 },
        other:       { emoji: '💡', label: 'Other', order: 9 }
    };

    // ---- Render Single Resource ----
    function renderResource(r) {
        const qrHtml = r.url
            ? `<div class="cv-resource-qr"><img src="${qrUrl(r.url)}" alt="QR" loading="lazy"></div>`
            : '';

        const titleHtml = r.url
            ? `<span class="link-icon">🔗</span><a href="${r.url}" target="_blank" rel="noopener">${r.title}</a>`
            : (r.title || 'Untitled');

        const duration = r.duration ? ` (${r.duration})` : '';
        const provider = r.provider || '';

        // Tier 1 tags
        let t1 = [];
        if (r.wida) t1.push(`<span class="cv-tag wida wida-${r.wida}">WIDA ${r.wida}</span>`);
        if (r.visuals) t1.push(`<span class="cv-tag visuals-${r.visuals}">👁️ ${r.visuals}</span>`);
        if (r.pace) {
            const pe = r.pace === 'slow' ? '🐢' : r.pace === 'fast' ? '🐇' : '🚶';
            t1.push(`<span class="cv-tag pace-${r.pace}">${pe} ${r.pace}</span>`);
        }
        const t1Html = t1.length ? `<div class="cv-tags">${t1.join('')}</div>` : '';

        // Tier 2 tags
        let t2 = [];
        if (r.dok) t2.push(`<span class="cv-tag-small">DOK ${r.dok}</span>`);
        if (r.series) t2.push(`<span class="cv-tag-small">📺 ${r.series}</span>`);
        if (r.prereq) t2.push(`<span class="cv-tag-small">⚠️ First: ${r.prereq}</span>`);
        const t2Html = t2.length ? `<div class="cv-tags-secondary">${t2.join('')}</div>` : '';

        const notesHtml = r.notes
            ? `<div class="cv-resource-notes">💡 ${r.notes}</div>`
            : '';

        return `<div class="cv-resource">${qrHtml}<div class="cv-resource-info">
            <div class="cv-resource-title">${titleHtml}</div>
            <div class="cv-resource-meta">${provider}${duration}</div>
            ${t1Html}${t2Html}${notesHtml}
        </div></div>`;
    }

    // ---- Render Resources by Type ----
    function renderResourcesByType(topicResources) {
        if (!topicResources.length) {
            return '<p class="cv-no-resources">No resources added yet.</p>';
        }

        const byType = {};
        topicResources.forEach(r => {
            const type = TYPE_CONFIG[r.type] ? r.type : 'other';
            if (!byType[type]) byType[type] = [];
            byType[type].push(r);
        });

        const sorted = Object.keys(byType).sort((a, b) =>
            (TYPE_CONFIG[a]?.order || 99) - (TYPE_CONFIG[b]?.order || 99)
        );

        return sorted.map(type => {
            const cfg = TYPE_CONFIG[type];
            const items = byType[type];

            items.sort((a, b) => {
                const aT = (a.provider || '').toLowerCase().includes('class textbook');
                const bT = (b.provider || '').toLowerCase().includes('class textbook');
                if (aT && !bT) return -1;
                if (bT && !aT) return 1;
                const rA = parseInt(a.rank) || 999;
                const rB = parseInt(b.rank) || 999;
                if (rA !== rB) return rA - rB;
                return (a.title || '').localeCompare(b.title || '');
            });

            const uid = 'cvt_' + Math.random().toString(36).substr(2, 8);
            return `<div class="cv-type-section">
                <div class="cv-type-header" onclick="window._cvToggleType('${uid}')">
                    <span class="cv-type-toggle">▶</span>
                    <span class="cv-type-icon">${cfg.emoji}</span>
                    <span class="cv-type-label">${cfg.label}</span>
                    <span class="cv-type-count">(${items.length})</span>
                </div>
                <div class="cv-type-content" id="${uid}">
                    ${items.map(renderResource).join('')}
                </div>
            </div>`;
        }).join('');
    }

    // ---- Render Topics ----
    function renderTopics() {
        const container = document.getElementById('cv-topic-list');
        const noResults = document.getElementById('cv-no-results');

        const filtered = CONFIG.topics.filter(t => {
            if (currentTab !== 'all' && t.tab !== currentTab) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return t.code.toLowerCase().includes(q) || t.name.toLowerCase().includes(q);
            }
            return true;
        });

        if (!filtered.length) {
            container.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');

        container.innerHTML = filtered.map(t => {
            const tr = resources.filter(r => r.topic_code === t.code);
            return `<div class="cv-topic" data-code="${t.code}">
                <div class="cv-topic-header" onclick="window._cvToggleTopic('${t.code}')">
                    <span class="cv-topic-dot cv-group-${t.group}"></span>
                    <span class="cv-topic-code">${t.code}</span>
                    <span class="cv-topic-name">${t.name}</span>
                    <span class="cv-topic-toggle">▶</span>
                </div>
                <div class="cv-topic-content">${renderResourcesByType(tr)}</div>
            </div>`;
        }).join('');
    }

    // ---- Global toggle functions ----
    window._cvToggleTopic = function(code) {
        document.querySelector(`.cv-topic[data-code="${code}"]`).classList.toggle('expanded');
    };

    window._cvToggleType = function(uid) {
        document.getElementById(uid).parentElement.classList.toggle('expanded');
    };

    // ---- Build UI ----
    function buildUI() {
        const root = document.getElementById('cv-root');
        if (!root) { console.error('Missing #cv-root element'); return; }

        // Header
        let html = `<header class="cv-header">
            <h1>${CONFIG.icon || '📚'} ${CONFIG.title}</h1>
            <p class="cv-subtitle">${CONFIG.subtitle || 'Click a topic to see resources.'}</p>
        </header>`;

        // Search
        html += `<input type="text" id="cv-search" class="cv-search" placeholder="Type to filter topics...">`;

        // Tabs
        html += `<div class="cv-tabs">`;
        CONFIG.tabs.forEach(tab => {
            const active = tab.id === 'all' ? ' active' : '';
            html += `<button class="cv-tab${active}" data-tab="${tab.id}">${tab.label}</button>`;
        });
        html += `</div>`;

        // Topic list
        html += `<div class="cv-topic-list" id="cv-topic-list"><div class="cv-loading">Loading resources...</div></div>`;
        html += `<div class="cv-no-results hidden" id="cv-no-results">No topics match your search.</div>`;

        root.innerHTML = html;

        // Tab events
        root.querySelectorAll('.cv-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                root.querySelectorAll('.cv-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTab = btn.dataset.tab;
                renderTopics();
            });
        });

        // Search event
        document.getElementById('cv-search').addEventListener('input', e => {
            searchQuery = e.target.value;
            renderTopics();
        });
    }

    // ---- Init ----
    async function init() {
        buildUI();
        resources = await fetchResources();
        renderTopics();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
