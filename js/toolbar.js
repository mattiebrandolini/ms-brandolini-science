/* ============================================
   Site Toolbar — Theme + Accessibility
   
   If a .topbar-nav exists, buttons go IN it.
   Otherwise, creates a small fixed cluster.
   ============================================ */
(function() {
    'use strict';

    /* --- Apply saved settings BEFORE paint --- */
    const saved = key => localStorage.getItem(key);
    const se = (k,v) => document.documentElement.setAttribute(k,v);

    ['data-dyslexic','data-colorblind','data-spacing','data-motion'].forEach(a => {
        if (saved(a) === 'true') se(a, 'true');
    });
    se('data-textsize', saved('data-textsize') || 'medium');
    se('data-theme', saved('theme') || 'dark');

    function init() {
        const theme = saved('theme') || 'dark';

        // Inject CSS
        const style = document.createElement('style');
        style.textContent = `
            /* --- Inline (inside topbar) --- */
            .tb-inline {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-left: 0;
            }
            .tb-btn {
                width: 36px; height: 36px;
                border-radius: 8px;
                border: 1.5px solid var(--border-subtle, rgba(255,255,255,0.1));
                background: transparent;
                font-size: 1.1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.15s, background 0.15s;
                flex-shrink: 0;
            }
            .tb-btn:hover {
                transform: scale(1.08);
                background: var(--bg-card-hover, rgba(255,255,255,0.06));
            }

            /* --- Floating fallback (splitter page etc) --- */
            .tb-float {
                position: fixed;
                top: 1rem; right: 1rem;
                z-index: 10000;
                display: flex;
                gap: 0.4rem;
            }
            .tb-float .tb-btn {
                background: var(--bg-card, rgba(15,20,40,0.9));
                backdrop-filter: blur(10px);
                border-color: var(--border, rgba(255,255,255,0.15));
                width: 42px; height: 42px;
                font-size: 1.2rem;
                border-radius: 10px;
            }
            [data-theme="light"] .tb-float .tb-btn {
                background: rgba(255,255,255,0.92);
                border-color: rgba(0,0,0,0.12);
            }

            /* --- Panel --- */
            .tb-panel {
                display: none;
                position: fixed;
                z-index: 10001;
                width: 270px;
                padding: 1rem 1.1rem;
                border-radius: 12px;
                border: 1.5px solid var(--border, rgba(255,255,255,0.12));
                background: var(--bg-card, #141928);
                backdrop-filter: blur(14px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.35);
                font-family: inherit;
            }
            [data-theme="light"] .tb-panel {
                background: rgba(255,255,255,0.97);
                box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            }
            .tb-panel.open { display: block; }
            .tb-panel h3 {
                margin: 0 0 0.65rem 0;
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-primary, #f1f5f9);
                letter-spacing: 0.02em;
            }
            .tb-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.45rem 0;
                border-bottom: 1px solid var(--border, rgba(255,255,255,0.07));
            }
            .tb-row:last-child { border-bottom: none; }
            .tb-lbl {
                font-size: 0.82rem;
                color: var(--text-secondary, #94a3b8);
            }
            .tb-tog {
                position: relative;
                width: 40px; height: 22px;
                background: var(--border, rgba(255,255,255,0.15));
                border-radius: 11px;
                border: none;
                cursor: pointer;
                transition: background 0.2s;
                flex-shrink: 0;
            }
            .tb-tog::after {
                content: '';
                position: absolute;
                top: 3px; left: 3px;
                width: 16px; height: 16px;
                border-radius: 50%;
                background: white;
                transition: transform 0.2s;
            }
            .tb-tog.on { background: var(--accent, #818cf8); }
            .tb-tog.on::after { transform: translateX(18px); }
            .tb-sizes { display: flex; gap: 0.3rem; }
            .tb-sz {
                padding: 0.15rem 0.5rem;
                border-radius: 5px;
                border: 1.5px solid var(--border, rgba(255,255,255,0.15));
                background: transparent;
                color: var(--text-secondary, #94a3b8);
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.15s;
            }
            .tb-sz.active {
                background: var(--accent, #818cf8);
                color: white;
                border-color: var(--accent, #818cf8);
            }
        `;
        document.head.appendChild(style);

        // Remove any old floating theme buttons
        document.querySelectorAll('#theme-toggle, .site-toolbar').forEach(el => el.remove());

        // Build buttons HTML
        const btnHTML = `
            <button class="tb-btn" id="tb-theme" title="Toggle dark/light">${theme==='dark'?'☀️':'🌙'}</button>
            <button class="tb-btn" id="tb-a11y" title="Accessibility">⚙️</button>
        `;

        // Find topbar-nav or create floating container
        const topbar = document.querySelector('.topbar');
        let container;
        if (topbar) {
            container = document.createElement('div');
            container.className = 'tb-inline';
            container.innerHTML = btnHTML;
            topbar.appendChild(container);
        } else {
            container = document.createElement('div');
            container.className = 'tb-float';
            container.innerHTML = btnHTML;
            document.body.appendChild(container);
        }

        // Build panel
        const dyOn = saved('data-dyslexic') === 'true';
        const cbOn = saved('data-colorblind') === 'true';
        const spOn = saved('data-spacing') === 'true';
        const moOn = saved('data-motion') === 'true';
        const sz = saved('data-textsize') || 'medium';

        const panel = document.createElement('div');
        panel.className = 'tb-panel';
        panel.id = 'tb-panel';
        panel.innerHTML = `
            <h3>Accessibility</h3>
            <div class="tb-row">
                <span class="tb-lbl">Dyslexia-friendly font</span>
                <button class="tb-tog ${dyOn?'on':''}" data-key="data-dyslexic"></button>
            </div>
            <div class="tb-row">
                <span class="tb-lbl">Colorblind-friendly</span>
                <button class="tb-tog ${cbOn?'on':''}" data-key="data-colorblind"></button>
            </div>
            <div class="tb-row">
                <span class="tb-lbl">Extra spacing</span>
                <button class="tb-tog ${spOn?'on':''}" data-key="data-spacing"></button>
            </div>
            <div class="tb-row">
                <span class="tb-lbl">Reduced motion</span>
                <button class="tb-tog ${moOn?'on':''}" data-key="data-motion"></button>
            </div>
            <div class="tb-row">
                <span class="tb-lbl">Text size</span>
                <div class="tb-sizes">
                    <button class="tb-sz ${sz==='small'?'active':''}" data-size="small">A</button>
                    <button class="tb-sz ${sz==='medium'?'active':''}" data-size="medium">A</button>
                    <button class="tb-sz ${sz==='large'?'active':''}" data-size="large">A</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Position panel near the ⚙️ button
        function positionPanel() {
            const btn = document.getElementById('tb-a11y');
            const rect = btn.getBoundingClientRect();
            panel.style.top = (rect.bottom + 6) + 'px';
            panel.style.right = (window.innerWidth - rect.right) + 'px';
        }

        // --- Events ---
        const themeBtn = document.getElementById('tb-theme');
        themeBtn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = cur === 'dark' ? 'light' : 'dark';
            se('data-theme', next);
            localStorage.setItem('theme', next);
            themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
        });

        const a11yBtn = document.getElementById('tb-a11y');
        a11yBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            positionPanel();
            panel.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== a11yBtn) {
                panel.classList.remove('open');
            }
        });

        // Toggles
        panel.querySelectorAll('.tb-tog').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('on');
                const key = btn.dataset.key;
                const on = btn.classList.contains('on');
                if (on) {
                    se(key, 'true');
                    localStorage.setItem(key, 'true');
                } else {
                    document.documentElement.removeAttribute(key);
                    localStorage.removeItem(key);
                }
            });
        });

        // Size buttons
        panel.querySelectorAll('.tb-sz').forEach(btn => {
            btn.addEventListener('click', () => {
                panel.querySelectorAll('.tb-sz').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const size = btn.dataset.size;
                se('data-textsize', size);
                localStorage.setItem('data-textsize', size);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
