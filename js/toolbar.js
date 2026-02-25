/* ============================================
   Site Toolbar — Theme + Accessibility
   
   Top-fixed bar with theme toggle + a11y panel.
   Self-contained: injects its own HTML + CSS.
   One script to rule them all.
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
            .site-toolbar {
                position: fixed;
                top: 0; right: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                padding: 0.5rem 0.75rem;
                pointer-events: none;
            }
            .stb-btn {
                pointer-events: auto;
                width: 44px; height: 44px;
                border-radius: 10px;
                border: 2px solid var(--border, rgba(255,255,255,0.15));
                background: var(--bg-card, rgba(15,20,40,0.85));
                backdrop-filter: blur(10px);
                font-size: 1.25rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.15s, border-color 0.15s;
            }
            [data-theme="light"] .stb-btn {
                background: rgba(255,255,255,0.9);
                border-color: rgba(0,0,0,0.15);
            }
            .stb-btn:hover {
                transform: scale(1.08);
                border-color: var(--accent, #818cf8);
            }

            /* --- Panel --- */
            .stb-panel {
                pointer-events: auto;
                display: none;
                position: fixed;
                top: 54px; right: 0.75rem;
                z-index: 10001;
                width: 280px;
                padding: 1rem 1.1rem;
                border-radius: 12px;
                border: 1.5px solid var(--border, rgba(255,255,255,0.12));
                background: var(--bg-card, #141928);
                backdrop-filter: blur(14px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.35);
                font-family: inherit;
            }
            [data-theme="light"] .stb-panel {
                background: rgba(255,255,255,0.97);
                box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            }
            .stb-panel.open { display: block; }
            .stb-panel h3 {
                margin: 0 0 0.75rem 0;
                font-size: 0.95rem;
                font-weight: 600;
                color: var(--text-primary, #f1f5f9);
                letter-spacing: 0.02em;
            }
            .stb-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border, rgba(255,255,255,0.07));
            }
            .stb-row:last-child { border-bottom: none; }
            .stb-label {
                font-size: 0.85rem;
                color: var(--text-secondary, #94a3b8);
            }
            .stb-toggle {
                position: relative;
                width: 42px; height: 24px;
                background: var(--border, rgba(255,255,255,0.15));
                border-radius: 12px;
                border: none;
                cursor: pointer;
                transition: background 0.2s;
                flex-shrink: 0;
            }
            .stb-toggle::after {
                content: '';
                position: absolute;
                top: 3px; left: 3px;
                width: 18px; height: 18px;
                border-radius: 50%;
                background: white;
                transition: transform 0.2s;
            }
            .stb-toggle.on {
                background: var(--accent, #818cf8);
            }
            .stb-toggle.on::after {
                transform: translateX(18px);
            }
            .stb-size-btns {
                display: flex; gap: 0.3rem;
            }
            .stb-size-btn {
                padding: 0.2rem 0.55rem;
                border-radius: 6px;
                border: 1.5px solid var(--border, rgba(255,255,255,0.15));
                background: transparent;
                color: var(--text-secondary, #94a3b8);
                font-size: 0.78rem;
                cursor: pointer;
                transition: all 0.15s;
            }
            .stb-size-btn.active {
                background: var(--accent, #818cf8);
                color: white;
                border-color: var(--accent, #818cf8);
            }
        `;
        document.head.appendChild(style);

        // Remove any old floating theme buttons
        document.querySelectorAll('#theme-toggle').forEach(el => el.remove());

        // Inject toolbar
        const bar = document.createElement('div');
        bar.className = 'site-toolbar';
        bar.innerHTML = `
            <button class="stb-btn" id="stb-theme" title="Toggle dark/light mode">${theme==='dark'?'☀️':'🌙'}</button>
            <button class="stb-btn" id="stb-a11y" title="Accessibility settings">⚙️</button>
        `;
        document.body.appendChild(bar);

        // Inject panel
        const panel = document.createElement('div');
        panel.className = 'stb-panel';
        panel.id = 'stb-panel';

        const dyOn = saved('data-dyslexic') === 'true';
        const cbOn = saved('data-colorblind') === 'true';
        const spOn = saved('data-spacing') === 'true';
        const moOn = saved('data-motion') === 'true';
        const sz = saved('data-textsize') || 'medium';

        panel.innerHTML = `
            <h3>Accessibility</h3>
            <div class="stb-row">
                <span class="stb-label">Dyslexia-friendly font</span>
                <button class="stb-toggle ${dyOn?'on':''}" data-key="data-dyslexic"></button>
            </div>
            <div class="stb-row">
                <span class="stb-label">Colorblind-friendly</span>
                <button class="stb-toggle ${cbOn?'on':''}" data-key="data-colorblind"></button>
            </div>
            <div class="stb-row">
                <span class="stb-label">Extra spacing</span>
                <button class="stb-toggle ${spOn?'on':''}" data-key="data-spacing"></button>
            </div>
            <div class="stb-row">
                <span class="stb-label">Reduced motion</span>
                <button class="stb-toggle ${moOn?'on':''}" data-key="data-motion"></button>
            </div>
            <div class="stb-row">
                <span class="stb-label">Text size</span>
                <div class="stb-size-btns">
                    <button class="stb-size-btn ${sz==='small'?'active':''}" data-size="small">A</button>
                    <button class="stb-size-btn ${sz==='medium'?'active':''}" data-size="medium">A</button>
                    <button class="stb-size-btn ${sz==='large'?'active':''}" data-size="large">A</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // --- Events ---
        const themeBtn = document.getElementById('stb-theme');
        themeBtn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = cur === 'dark' ? 'light' : 'dark';
            se('data-theme', next);
            localStorage.setItem('theme', next);
            themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
        });

        const a11yBtn = document.getElementById('stb-a11y');
        a11yBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== a11yBtn) {
                panel.classList.remove('open');
            }
        });

        // Toggles
        panel.querySelectorAll('.stb-toggle').forEach(btn => {
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
        panel.querySelectorAll('.stb-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                panel.querySelectorAll('.stb-size-btn').forEach(b => b.classList.remove('active'));
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
