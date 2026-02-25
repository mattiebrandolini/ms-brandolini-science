/* ============================================
   Accessibility — Self-contained module
   
   Injects the ♿ button + panel into the page.
   Reads/writes localStorage for persistence.
   Just include this script on any page.
   ============================================ */

(function() {
    'use strict';

    // ---- Apply saved settings immediately (before render) ----
    const attrs = ['data-dyslexic','data-colorblind','data-spacing','data-motion'];
    attrs.forEach(a => {
        if (localStorage.getItem(a) === 'true')
            document.documentElement.setAttribute(a, 'true');
    });
    const savedSize = localStorage.getItem('data-textsize') || 'medium';
    document.documentElement.setAttribute('data-textsize', savedSize);

    function init() {
        // ---- Inject panel HTML ----
        const panel = document.createElement('div');
        panel.className = 'a11y-panel';
        panel.id = 'a11y-panel';
        panel.innerHTML = `
            <h3>♿ Accessibility</h3>
            <div class="a11y-row"><span class="a11y-label">Dyslexia-friendly font</span><button class="a11y-toggle ${localStorage.getItem('data-dyslexic')==='true'?'on':''}" id="a11y-dyslexic"></button></div>
            <div class="a11y-row"><span class="a11y-label">Colorblind-friendly</span><button class="a11y-toggle ${localStorage.getItem('data-colorblind')==='true'?'on':''}" id="a11y-colorblind"></button></div>
            <div class="a11y-row"><span class="a11y-label">Extra spacing</span><button class="a11y-toggle ${localStorage.getItem('data-spacing')==='true'?'on':''}" id="a11y-spacing"></button></div>
            <div class="a11y-row"><span class="a11y-label">Reduce motion</span><button class="a11y-toggle ${localStorage.getItem('data-motion')==='true'?'on':''}" id="a11y-motion"></button></div>
            <div class="a11y-row"><span class="a11y-label">Text size</span><div class="a11y-size-btns">
                <button class="a11y-size-btn ${savedSize==='small'?'active':''}" data-size="small" style="font-size:0.7rem">A</button>
                <button class="a11y-size-btn ${savedSize==='medium'?'active':''}" data-size="medium" style="font-size:0.85rem">A</button>
                <button class="a11y-size-btn ${savedSize==='large'?'active':''}" data-size="large" style="font-size:1.05rem">A</button>
            </div></div>
        `;
        document.body.appendChild(panel);

        // ---- Inject ♿ button ----
        // Try to put it in topbar next to theme toggle, otherwise fixed position
        const topbar = document.querySelector('.topbar');
        const themeBtn = document.getElementById('theme-toggle');
        const btn = document.createElement('button');
        btn.className = 'a11y-btn';
        btn.id = 'a11y-btn';
        btn.title = 'Accessibility settings';
        btn.textContent = '♿';

        if (themeBtn && topbar) {
            themeBtn.parentNode.insertBefore(btn, themeBtn);
        } else {
            // Fallback: fixed position
            btn.style.cssText = 'position:fixed;bottom:1.25rem;right:3.5rem;width:40px;height:40px;border-radius:50%;border:1px solid rgba(128,128,128,0.3);background:var(--bg-raised,#121929);font-size:1rem;display:flex;align-items:center;justify-content:center;z-index:100;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.15);';
            document.body.appendChild(btn);
        }

        // ---- Toggle panel ----
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== btn)
                panel.classList.remove('open');
        });

        // ---- Toggle switches ----
        function setupToggle(id, attr) {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('click', () => {
                const on = el.classList.toggle('on');
                document.documentElement.setAttribute(attr, on ? 'true' : 'false');
                localStorage.setItem(attr, on);
            });
        }
        setupToggle('a11y-dyslexic', 'data-dyslexic');
        setupToggle('a11y-colorblind', 'data-colorblind');
        setupToggle('a11y-spacing', 'data-spacing');
        setupToggle('a11y-motion', 'data-motion');

        // ---- Size buttons ----
        panel.querySelectorAll('.a11y-size-btn').forEach(sb => {
            sb.addEventListener('click', () => {
                panel.querySelectorAll('.a11y-size-btn').forEach(b => b.classList.remove('active'));
                sb.classList.add('active');
                document.documentElement.setAttribute('data-textsize', sb.dataset.size);
                localStorage.setItem('data-textsize', sb.dataset.size);
            });
        });
    }

    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else init();
})();
