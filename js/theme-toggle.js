/* ============================================
   Theme Toggle — Site-wide dark/light mode
   
   Stores preference in localStorage.
   Defaults to dark to match site aesthetic.
   
   Usage: Include this script, then call
   themeToggle.init() after DOM is ready.
   Needs an element with id="theme-toggle".
   ============================================ */

window.themeToggle = {
    init: function() {
        const saved = localStorage.getItem('theme');
        const theme = saved || 'dark';
        this.apply(theme);

        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                this.apply(next);
                localStorage.setItem('theme', next);
            });
        }
    },

    apply: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }
};

// Auto-init if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => themeToggle.init());
} else {
    themeToggle.init();
}
