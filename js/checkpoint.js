/* ============================================
   Checkpoint Engine
   
   Reads window.CHECKPOINT_CONFIG and renders the
   forked learning path (watch/read) with sidebar
   navigation, progress tracking, and L1 integration.
   
   Expects: config JS loaded first (both deferred, order preserved).
   ============================================ */
(function() {
'use strict';

var CFG = window.CHECKPOINT_CONFIG;
if (!CFG) { console.error('CHECKPOINT_CONFIG not defined'); return; }

var LANG_NAMES = { es:'Español', pt:'Português', fr:'Français', vi:'Tiếng Việt', ht:'Kreyòl' };
var LANG_FLAGS = { es:'🇪🇸', pt:'🇧🇷', fr:'🇫🇷', vi:'🇻🇳', ht:'🇭🇹' };

// State
var mode = 'watch';
var lang = 'en';
var activeCh = 'quiz-info';
var done = {};
var storageKey = 'ck-' + CFG.id + '-state';

// Load saved state
try {
    var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved.mode) mode = saved.mode;
    if (saved.lang) lang = saved.lang;
    if (saved.done) done = saved.done;
    if (saved.activeCh) activeCh = saved.activeCh;
} catch(e) {}

function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ mode:mode, lang:lang, done:done, activeCh:activeCh })); } catch(e) {}
}

// ============ DOM GENERATION ============

function buildDOM() {
    var qi = CFG.quizInfo;

    // Entry info
    var infoEl = document.getElementById('ck-entry-info');
    if (infoEl && qi) {
        infoEl.innerHTML = '<p>\ud83d\udccb ' + qi.format + '</p><p>\ud83d\udcdd ' + qi.notes + '</p><p>\u2713 ' + qi.grading + '</p>';
    }

    // Quiz info body
    var qiBody = document.getElementById('ck-quiz-info-body');
    if (qiBody && qi) {
        var h = '<div class="ck-qi-block"><div class="ck-qi-label">Format</div>';
        h += '<p>\ud83d\udccb ' + qi.format + '</p><p>\ud83d\udcdd ' + qi.notes + '</p><p>\u2713 ' + qi.grading + '</p></div>';
        h += '<div class="ck-qi-block ck-qi-warning"><div class="ck-qi-label">What this tests</div><p>' + qi.warning + '</p></div>';
        if (qi.readiness) {
            h += '<div class="ck-qi-block"><div class="ck-qi-label">You\u2019re ready if you can\u2026</div>';
            qi.readiness.forEach(function(r) { h += '<div class="ck-qi-ready"><span>\u2610</span> ' + r + '</div>'; });
            h += '</div>';
        }
        qiBody.innerHTML = h;
    }

    // Set first chapter as next from quiz-info
    var emptyNextBtns = document.querySelectorAll('.ck-next-btn[data-next=""]');
    emptyNextBtns.forEach(function(btn) {
        if (CFG.chapterOrder.length) btn.dataset.next = CFG.chapterOrder[0];
    });

    // ============ STRUCTURED NOTES ============
    var notesBody = document.getElementById('ck-notes-body');
    if (notesBody && CFG.notesQuestions) {
        var nq = CFG.notesQuestions;
        var nHtml = '<div class="ck-notes-intro">' + nq.intro + '</div>';
        if (nq.foundation) {
            nHtml += '<div class="ck-notes-foundation">' + nq.foundation + '</div>';
        }
        nq.parts.forEach(function(part) {
            nHtml += '<div class="ck-notes-part"><div class="ck-notes-part-title">' + part.icon + ' ' + part.title + '</div>';
            part.questions.forEach(function(q, i) {
                var qText = q.q.replace(/\n/g, '<br>');
                // Convert markdown-style tables to HTML
                if (q.type === 'table' || q.type === 'fill') {
                    var lines = q.q.split('\n');
                    var tableLines = lines.filter(function(l) { return l.trim().indexOf('|') === 0; });
                    var nonTable = lines.filter(function(l) { return l.trim().indexOf('|') !== 0; });
                    if (tableLines.length >= 2) {
                        var tHtml = '<p>' + nonTable.filter(function(l){return l.trim();}).join(' ') + '</p>';
                        tHtml += '<table class="ck-notes-table">';
                        tableLines.forEach(function(row, ri) {
                            if (row.indexOf('---') > -1) return; // skip separator
                            var cells = row.split('|').filter(function(c) { return c.trim() !== ''; });
                            tHtml += '<tr>';
                            cells.forEach(function(c) {
                                var tag = ri === 0 ? 'th' : 'td';
                                tHtml += '<' + tag + '>' + c.trim() + '</' + tag + '>';
                            });
                            tHtml += '</tr>';
                        });
                        tHtml += '</table>';
                        qText = tHtml;
                    }
                }
                nHtml += '<div class="ck-notes-q"><span class="ck-notes-q-num">' + q.id.toUpperCase().replace('N','Q') + '</span> ' + qText + '</div>';
            });
            nHtml += '</div>';
        });
        notesBody.innerHTML = nHtml;
    }

    // ============ LANGUAGE BRIDGE (entry screen) ============
    var bridgeEl = document.getElementById('ck-lang-bridge');
    if (bridgeEl && CFG.languageBridge) {
        var lb = CFG.languageBridge;
        var bHtml = '<div class="ck-bridge-title">🌉 ' + lb.title + '</div>';
        lb.steps.forEach(function(s) {
            bHtml += '<div class="ck-bridge-step"><span class="ck-bridge-icon">' + s.icon + '</span> ' + s.text + '</div>';
        });
        bHtml += '<div class="ck-bridge-note">' + lb.note + '</div>';
        bridgeEl.innerHTML = bHtml;
    }

    // ============ VOCAB TABLE ============
    var vocabBody = document.getElementById('ck-vocab-body');
    if (vocabBody && CFG.vocabTable) {
        var vHtml = '<div class="ck-vocab-scroll"><table class="ck-vocab-table">';
        vHtml += '<thead><tr><th>English</th><th>Español</th><th>Português</th><th>Français</th><th>Tiếng Việt</th><th>Kreyòl</th></tr></thead><tbody>';
        CFG.vocabTable.forEach(function(row) {
            vHtml += '<tr><td><strong>' + row.en + '</strong></td><td>' + row.es + '</td><td>' + row.pt + '</td><td>' + row.fr + '</td><td>' + row.vi + '</td><td>' + row.ht + '</td></tr>';
        });
        vHtml += '</tbody></table></div>';
        vocabBody.innerHTML = vHtml;
    }

    // ============ PRACTICE RESOURCES ============
    var resBody = document.getElementById('ck-resources-body');
    if (resBody && CFG.practiceResources) {
        var rHtml = '<div class="ck-resources-grid">';
        CFG.practiceResources.forEach(function(r) {
            rHtml += '<a class="ck-resource-card" href="' + r.url + '" target="_blank" rel="noopener">';
            rHtml += '<div class="ck-resource-title">' + r.title + '</div>';
            rHtml += '<div class="ck-resource-desc">' + r.desc + '</div>';
            rHtml += '<div class="ck-resource-source">' + r.source + ' ↗</div>';
            rHtml += '</a>';
        });
        rHtml += '</div>';
        // Textbook packets
        if (CFG.textbookPackets) {
            rHtml += '<details class="ck-textbook-packets"><summary>📚 Textbook Packets (optional)</summary>';
            rHtml += '<p class="ck-textbook-note">The reading passages above cover the same content in simpler language.</p>';
            CFG.textbookPackets.forEach(function(p) {
                rHtml += '<a class="ck-packet-link" href="' + p.url + '" target="_blank">' + p.title + ' <span class="ck-packet-pages">' + p.pages + '</span></a>';
            });
            rHtml += '</details>';
        }
        resBody.innerHTML = rHtml;
    }

    // Nav items
    var navContainer = document.getElementById('ck-nav-chapters');
    if (navContainer) {
        var navHtml = '';
        CFG.chapterOrder.forEach(function(id, i) {
            var ch = CFG.chapters[id];
            if (!ch) return;
            navHtml += '<div class="ck-nav-item" data-ch="' + id + '">' +
                '<span class="ck-nav-check">\u2713</span>' +
                '<span class="ck-nav-name">' + (i+1) + '. ' + ch.title + '</span></div>';
        });
        navContainer.innerHTML = navHtml;
    }

    // Chapter DOM
    var chapContainer = document.getElementById('ck-chapters-container');
    if (chapContainer) {
        var chapHtml = '';
        CFG.chapterOrder.forEach(function(id, i) {
            var ch = CFG.chapters[id];
            if (!ch) return;
            var nextId = CFG.chapterOrder[i+1] || 'vocab';
            var nextLabel = nextId === 'vocab' ? 'Vocabulary table \u2192' : 'Next chapter \u2192';

            chapHtml += '<div class="ck-chapter" data-ch="' + id + '">';
            chapHtml += '<h2 class="ck-ch-title">' + ch.title + '</h2>';
            chapHtml += '<p class="ck-ch-subtitle">' + ch.subtitle + '</p>';
            chapHtml += '<div class="ck-ch-primary" id="' + id + '-primary"></div>';
            chapHtml += '<details class="ck-ch-secondary" id="' + id + '-secondary"></details>';

            if (ch.terms && ch.terms.length) {
                chapHtml += '<div class="ck-ch-terms"><div class="ck-ch-terms-label">\ud83d\udcd6 Key Terms</div>';
                ch.terms.forEach(function(t) {
                    chapHtml += '<p data-term-name="' + t[0] + '"><strong>' + t[0] + '</strong> \u2014 ' + t[1] + '</p>';
                });
                chapHtml += '</div>';
            }

            if (ch.figure) {
                chapHtml += '<figure class="ck-ch-figure">'
                    + '<img src="' + ch.figure.src + '" alt="' + ch.figure.alt + '" loading="lazy">'
                    + '<figcaption>' + ch.figure.caption;
                if (ch.figure.source) {
                    chapHtml += '<span class="ck-figure-attr"> \u00b7 '
                        + (ch.figure.source_url
                            ? '<a href="' + ch.figure.source_url + '" target="_blank" rel="noopener">' + ch.figure.source + '</a>'
                            : ch.figure.source);
                    if (ch.figure.license) chapHtml += ' (' + ch.figure.license + ')';
                    chapHtml += '</span>';
                }
                chapHtml += '</figcaption></figure>';
            }

                        // Optional videos
            if (ch.optionalVideos && ch.optionalVideos.length) {
                chapHtml += '<details class="ck-ch-optional"><summary>🎬 Want more? (' + ch.optionalVideos.length + ' bonus videos)</summary><div class="ck-optional-list">';
                ch.optionalVideos.forEach(function(v) { chapHtml += videoLink(v); });
                chapHtml += '</div></details>';
            }

            chapHtml += '<div class="ck-done-row">';
            chapHtml += '<button class="ck-done-btn" data-ch="' + id + '"><span class="ck-done-icon">\u2610</span> I understand this</button>';
            chapHtml += '<button class="ck-next-btn" data-next="' + nextId + '">' + nextLabel + '</button>';
            chapHtml += '</div></div>';
        });
        chapContainer.innerHTML = chapHtml;
    }

    // Practice questions
    var practiceBody = document.getElementById('ck-practice-body');
    if (practiceBody && CFG.practiceQuestions) {
        var pHtml = '';
        CFG.practiceQuestions.forEach(function(pq, i) {
            pHtml += '<div class="ck-practice-q"><p><strong>' + (i+1) + '.</strong> ' + pq.q + '</p>';
            if (pq.hint) pHtml += '<p><em>' + pq.hint + '</em></p>';
            pHtml += '</div>';
        });
        practiceBody.innerHTML = pHtml;
    }
}

// ============ VIDEO HELPERS ============

function videoEmbed(id) {
    return '<div class="ck-video-embed"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '" allowfullscreen loading="lazy" title="Video"></iframe></div>';
}

function videoLink(v, label) {
    var badge = label ? '<span class="ck-l1-label">' + label + '</span>' : '';
    return '<a class="ck-video-link" href="https://www.youtube.com/watch?v=' + v.id +
        '" target="_blank" rel="noopener"><div class="ck-vthumb"><img src="https://img.youtube.com/vi/' +
        v.id + '/mqdefault.jpg" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
        '<div class="ck-vinfo"><div class="ck-vname">' + v.title + badge + '</div>' +
        '<div class="ck-vmeta">' + v.channel + ' \u00b7 ' + v.time + '</div></div></a>';
}

// ============ RENDER CHAPTERS ============

function renderChapter(chId) {
    var ch = CFG.chapters[chId];
    if (!ch) return;
    var primaryEl = document.getElementById(chId + '-primary');
    var secondaryEl = document.getElementById(chId + '-secondary');
    if (!primaryEl || !secondaryEl) return;

    // Video HTML
    var vHtml = '<div class="ck-video-wrap">';
    if (lang !== 'en' && ch.l1_videos && ch.l1_videos[lang]) {
        vHtml += videoEmbed(ch.l1_videos[lang].id);
        vHtml += '<div class="ck-video-bridge">\u25b2 ' + LANG_NAMES[lang] + ' \u2014 watch this first, then the English version below</div>';
        vHtml += videoLink(ch.video, 'English');
    } else {
        vHtml += videoEmbed(ch.video.id);
        if (ch.l1_videos) {
            var hasAny = false;
            Object.keys(ch.l1_videos).forEach(function(l) {
                if (!hasAny) { vHtml += '<div style="margin-top:0.75rem;font-size:0.78em;color:var(--text-dim)">Also available in:</div>'; hasAny = true; }
                vHtml += videoLink(ch.l1_videos[l], LANG_FLAGS[l] || '');
            });
        }
    }
    vHtml += '</div>';

    // Reading HTML
    var rHtml = '<div class="ck-reading">' + ch.reading + '</div>';

    if (mode === 'watch') {
        primaryEl.innerHTML = '<div class="ck-ch-primary-header">\ud83d\udcfa Watch</div>' + vHtml;
        secondaryEl.innerHTML = '<summary>\ud83d\udcd6 I want to read this too</summary><div>' + rHtml + '</div>';
    } else {
        primaryEl.innerHTML = '<div class="ck-ch-primary-header">\ud83d\udcd6 Read</div>' + rHtml;
        secondaryEl.innerHTML = '<summary>\ud83d\udcfa I want to watch this too</summary><div>' + vHtml + '</div>';
    }
}

function renderAll() { CFG.chapterOrder.forEach(renderChapter); }

// ============ NAVIGATION ============

function showChapter(ch) {
    activeCh = ch;
    document.querySelectorAll('.ck-chapter').forEach(function(el) { el.classList.remove('active'); });
    var target = document.querySelector('.ck-chapter[data-ch="' + ch + '"]');
    if (target) target.classList.add('active');
    document.querySelectorAll('.ck-nav-item').forEach(function(el) {
        el.classList.toggle('active', el.dataset.ch === ch);
    });
    window.scrollTo({ top: 0 });
    save();
    var sb = document.querySelector('.ck-sidebar');
    if (sb) sb.classList.remove('open');
}

function wireNavigation() {
    document.querySelectorAll('.ck-nav-item').forEach(function(el) {
        el.addEventListener('click', function() { showChapter(el.dataset.ch); });
    });
    document.querySelectorAll('.ck-next-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { showChapter(btn.dataset.next); });
    });
}

// ============ PROGRESS ============

function updateProgress() {
    var count = 0;
    CFG.chapterOrder.forEach(function(ch) { if (done[ch]) count++; });
    var pct = CFG.chapterOrder.length > 0 ? (count / CFG.chapterOrder.length * 100) : 0;
    var fill = document.getElementById('ck-progress-fill');
    var text = document.getElementById('ck-progress-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = count + ' / ' + CFG.chapterOrder.length;

    document.querySelectorAll('.ck-nav-item').forEach(function(el) {
        el.classList.toggle('done', !!done[el.dataset.ch]);
    });
    document.querySelectorAll('.ck-done-btn').forEach(function(btn) {
        var isDone = !!done[btn.dataset.ch];
        btn.classList.toggle('checked', isDone);
        var icon = btn.querySelector('.ck-done-icon');
        if (icon) icon.textContent = isDone ? '\u2713' : '\u2610';
    });
}

function wireDoneButtons() {
    document.querySelectorAll('.ck-done-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            done[btn.dataset.ch] = !done[btn.dataset.ch];
            updateProgress();
            save();
        });
    });
}

// ============ ENTRY → STUDY ============

function startStudy() {
    var entry = document.getElementById('ck-entry');
    var study = document.getElementById('ck-study');
    if (entry) entry.style.display = 'none';
    if (study) study.classList.add('active');
    var badge = document.getElementById('ck-mode-badge');
    if (badge) badge.textContent = mode === 'watch' ? '\ud83d\udcfa Watch' : '\ud83d\udcd6 Read';
    renderAll();
    updateProgress();
    showChapter(activeCh);
}

function wireEntry() {
    document.querySelectorAll('.ck-mode-card').forEach(function(card) {
        card.addEventListener('click', function() {
            mode = card.dataset.mode;
            save();
            startStudy();
        });
    });

    document.querySelectorAll('.ck-lang-pill').forEach(function(pill) {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.ck-lang-pill').forEach(function(p) { p.classList.remove('active'); });
            pill.classList.add('active');
            lang = pill.dataset.lang;
            save();
            if (document.getElementById('ck-study').classList.contains('active')) renderAll();
        });
    });

    var backBtn = document.getElementById('ck-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            document.getElementById('ck-study').classList.remove('active');
            document.getElementById('ck-entry').style.display = '';
        });
    }

    var mobToggle = document.getElementById('ck-sidebar-toggle');
    if (mobToggle) {
        mobToggle.addEventListener('click', function() {
            document.querySelector('.ck-sidebar').classList.toggle('open');
        });
    }
}

// ============ INIT ============

// 1. Generate DOM from config
buildDOM();

// 2. Wire all event listeners (must happen AFTER DOM generation)
wireNavigation();
wireDoneButtons();
wireEntry();

// 3. Restore lang pill state
document.querySelectorAll('.ck-lang-pill').forEach(function(p) {
    p.classList.toggle('active', p.dataset.lang === lang);
});

// 4. If returning user, skip entry
if (localStorage.getItem(storageKey)) {
    startStudy();
}

})();
