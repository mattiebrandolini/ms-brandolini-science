/* ============================================
   Site-Wide Term Database
   
   Central source of truth for all scientific terms.
   Each term has: definition, SVG icon, emoji fallback,
   course tags, key-term flag, and optional image.
   
   Terms are matched case-insensitively. The `aliases`
   array catches plurals and variant forms.
   ============================================ */
window.TERMS_DB = {

    // ======== CELL STRUCTURE (Biology) ========

    'cell': {
        def: 'The basic unit of life — all living things are made of cells',
        emoji: '🔬',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="8" ry="7"/><circle cx="10" cy="9" r="3"/><circle cx="10" cy="8.5" r="1" fill="currentColor" stroke="none"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['cells'],
    },

    'prokaryotic': {
        def: 'A cell with NO nucleus and NO membrane-bound organelles. Example: bacteria.',
        emoji: '🦠',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="7" ry="5"/><path d="M7 8.5c1.5 1 3.5 1 5 0"/><circle cx="8" cy="10" r="0.7" fill="currentColor" stroke="none"/><circle cx="12" cy="10.5" r="0.5" fill="currentColor" stroke="none"/><path d="M3 10c-1.5-2 -1-4 0-4M17 10c1.5-2 1-4 0-4"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['prokaryotic cells', 'prokaryote', 'prokaryotes'],
    },

    'eukaryotic': {
        def: 'A cell WITH a nucleus and WITH membrane-bound organelles. Example: plant and animal cells.',
        emoji: '🧫',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="8" ry="7"/><circle cx="10" cy="9" r="3"/><circle cx="10" cy="8.5" r="1" fill="currentColor" stroke="none"/><ellipse cx="5.5" cy="11" rx="1.5" ry="1" opacity="0.5"/><ellipse cx="14" cy="12" rx="1.8" ry="0.8" opacity="0.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['eukaryotic cells', 'eukaryote', 'eukaryotes'],
    },

    'organelle': {
        def: 'A small structure inside a cell that has a specific job — means "little organ"',
        emoji: '⚙️',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="3"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.4 1.4M13.55 13.55l1.4 1.4M5.05 14.95l1.4-1.4M13.55 6.45l1.4-1.4"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['organelles'],
    },

    'nucleus': {
        def: 'The control center of the cell — holds DNA and sends instructions',
        emoji: '🎯',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><circle cx="10" cy="10" r="3"/><circle cx="10" cy="9.5" r="1.2" fill="currentColor" stroke="none" opacity="0.4"/><path d="M6.5 7.5l1 0.8M13 13l0.8-0.5" stroke-width="1" opacity="0.4"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'dna': {
        def: 'The molecule that carries genetic instructions for life — shaped like a twisted ladder (double helix)',
        emoji: '🧬',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 2c0 3 8 5 8 8s-8 5-8 8"/><path d="M14 2c0 3-8 5-8 8s8 5 8 8"/><path d="M7.5 6h5M7 10h6M7.5 14h5" stroke-width="1" opacity="0.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'chromatin': {
        def: 'DNA in its spread-out, tangled form — like a messy pile of yarn',
        emoji: '🧶',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 8c2-3 4 1 5-1s2-3 4-1"/><path d="M6 11c1.5 2 3-1 5 1s2.5 2 3.5 0"/><path d="M7 14c2-2 3 1 4.5 0s2-2 3-1" opacity="0.6"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'chromosome': {
        def: 'DNA coiled up tightly into a compact X or rod shape — happens when a cell is ready to divide',
        emoji: '✖️',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 4c-1 0-2 1-2 2.5S6 9 7 9.5M7 16c-1 0-2-1-2-2.5S6 11 7 10.5M13 4c1 0 2 1 2 2.5S14 9 13 9.5M13 16c1 0 2-1 2-2.5S14 11 13 10.5"/><path d="M7 9.5h6" stroke-width="1.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['chromosomes'],
    },

    'ribosome': {
        def: 'A tiny machine that builds proteins — made in the nucleolus',
        emoji: '🔩',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="8" r="3.5"/><circle cx="10" cy="13" r="2.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['ribosomes'],
    },

    'cell membrane': {
        def: 'The flexible outer boundary of ALL cells — controls what enters and leaves',
        emoji: '🛡️',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 10c0-5 3.5-7 7-7s7 2 7 7-3.5 7-7 7-7-2-7-7"/><path d="M4.5 10c0-4 2.8-5.5 5.5-5.5s5.5 1.5 5.5 5.5-2.8 5.5-5.5 5.5-5.5-1.5-5.5-5.5" stroke-dasharray="2 2" opacity="0.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'cytoplasm': {
        def: 'The jelly-like fluid filling the cell — everything between the membrane and the nucleus',
        emoji: '💧',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="8" ry="7" stroke-dasharray="3 2"/><circle cx="7" cy="8" r="0.8" fill="currentColor" stroke="none" opacity="0.3"/><circle cx="13" cy="12" r="0.6" fill="currentColor" stroke="none" opacity="0.3"/><circle cx="9" cy="13" r="0.7" fill="currentColor" stroke="none" opacity="0.3"/><circle cx="14" cy="8" r="0.5" fill="currentColor" stroke="none" opacity="0.3"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'endomembrane system': {
        def: 'The network of organelles that builds, processes, and ships proteins — includes ER, Golgi, and vesicles',
        emoji: '🏭',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 6c2 0 2 2 4 2s2-2 4-2 2 2 4 2"/><path d="M3 10c2 0 2 2 4 2s2-2 4-2 2 2 4 2"/><rect x="6" y="13" width="8" height="3" rx="1"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'rough er': {
        def: 'Network of folded membranes covered in ribosomes — folds and transports proteins (the "highway")',
        emoji: '🛣️',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 5c3 0 3 3 6 3s3-3 6-3"/><path d="M3 9c3 0 3 3 6 3s3-3 6-3"/><path d="M3 13c3 0 3 3 6 3s3-3 6-3"/><circle cx="5" cy="5" r="0.7" fill="currentColor" stroke="none"/><circle cx="9" cy="8" r="0.7" fill="currentColor" stroke="none"/><circle cx="13" cy="5" r="0.7" fill="currentColor" stroke="none"/><circle cx="7" cy="12" r="0.7" fill="currentColor" stroke="none"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['rough endoplasmic reticulum', 'endoplasmic reticulum'],
    },

    'golgi apparatus': {
        def: 'Stacked membranes that modify, package, and sort proteins for delivery — the "packaging center"',
        emoji: '📦',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 6h10" stroke-width="2"/><path d="M5.5 9h9" stroke-width="2"/><path d="M6 12h8" stroke-width="2"/><path d="M6.5 15h7" stroke-width="2"/><circle cx="16" cy="7.5" r="1.2"/><circle cx="4" cy="13.5" r="1.2"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['golgi', 'golgi body'],
    },

    'vesicle': {
        def: 'A small membrane bubble that carries materials between organelles',
        emoji: '🫧',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="5"/><circle cx="10" cy="10" r="3" stroke-dasharray="2 1.5" opacity="0.4"/><path d="M15 10l2.5 0" stroke-width="1"/><path d="M16.5 9l1 1-1 1" stroke-width="1"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['vesicles'],
    },

    'lysosome': {
        def: 'Organelle that breaks down waste, damaged parts, and foreign invaders — the "garbage collector"',
        emoji: '🗑️',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><path d="M7 8l2 2-2 2" stroke-width="1.2"/><path d="M13 8l-2 2 2 2" stroke-width="1.2"/><path d="M8.5 13h3" stroke-width="1.2" opacity="0.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['lysosomes'],
    },

    'mitochondria': {
        def: 'Organelle that converts glucose into ATP energy — the "engine" or "powerhouse" of the cell',
        emoji: '🔋',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="8" ry="5"/><ellipse cx="10" cy="10" rx="6.5" ry="3.5"/><path d="M5 10c1-2 2 1 3-1s1.5 2 2.5 0 1.5 2 2.5 0 2 1.5 2 0" stroke-width="1" opacity="0.6"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['mitochondrion'],
    },

    'chloroplast': {
        def: 'Organelle that captures sunlight to make glucose through photosynthesis — only in plant cells',
        emoji: '☀️',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="8" ry="5"/><ellipse cx="10" cy="10" rx="6" ry="3.5"/><path d="M5 8.5h10M5 10h10M5 11.5h10" stroke-width="0.8" opacity="0.4"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['chloroplasts'],
    },

    'atp': {
        def: 'The energy molecule cells use to do work — like a rechargeable battery',
        emoji: '⚡',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2L5 11h5l-1 7 6-9h-5l1-7"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'chlorophyll': {
        def: 'The green pigment inside chloroplasts that absorbs sunlight energy',
        emoji: '🌿',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 18V8"/><path d="M10 8C10 4 6 2 3 3c0 4 3 7 7 5"/><path d="M10 11c0-3 3-5 6-4.5-.5 4-3 6.5-6 4.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'cell wall': {
        def: 'A thick, rigid outer layer made of cellulose — gives plant cells their square shape',
        emoji: '🧱',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="14" height="14" rx="1"/><rect x="4.5" y="4.5" width="11" height="11" rx="0.5" stroke-dasharray="2 1.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'central vacuole': {
        def: 'One very large water storage compartment in plant cells — keeps the plant firm when full',
        emoji: '💧',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="10" cy="10" rx="7" ry="6"/><ellipse cx="10" cy="10" rx="5" ry="4" fill="currentColor" opacity="0.08"/><path d="M9 8.5c0.5-1 1.5-1 2 0" stroke-width="1" opacity="0.4"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['vacuole', 'vacuoles'],
    },

    'turgor pressure': {
        def: 'The pressure of water inside the central vacuole pushing against the cell wall — keeps plants firm',
        emoji: '💪',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="12" height="12" rx="1"/><circle cx="10" cy="10" r="4"/><path d="M10 7v-1M10 14v-1M7 10h-1M14 10h-1" stroke-width="1.2"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'cellulose': {
        def: 'The material that makes plant cell walls rigid — gives plants structural support',
        emoji: '🌾',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 5h14M3 8h14M3 11h14M3 14h14" opacity="0.6"/><path d="M5 3v14M10 3v14M15 3v14" opacity="0.3"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'centrioles': {
        def: 'Small structures in animal cells that help organize cell division',
        emoji: '🎯',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="7" width="5" height="6" rx="2"/><rect x="11" y="7" width="5" height="6" rx="2"/><path d="M7 8v4M13 8v4" stroke-width="1" opacity="0.4"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: ['centriole'],
    },

    'photosynthesis': {
        def: 'The process by which plants use sunlight to convert CO₂ and water into glucose and oxygen',
        emoji: '☀️',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="7" r="3"/><path d="M10 4V2M10 10v1M6.5 5.5L5 4M13.5 5.5L15 4M5 7H3M15 7h2M6.5 8.5L5 10M13.5 8.5L15 10"/><path d="M10 12v5M7 14l3-2 3 2" stroke-width="1.2"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'cellular respiration': {
        def: 'The process by which cells break down glucose to release ATP energy — happens in mitochondria',
        emoji: '🔥',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 17c-3.5 0-5-3-5-5.5 0-3 3-5 3-8 1.5 2 2 3 2 3s2-2.5 3-1c-0.5 1.5-1 2-1 2s2.5 1.5 2.5 4c0 2.5-1.5 5.5-4.5 5.5z"/><path d="M10 17c-1.5 0-2.5-1.5-2.5-3s1.5-2.5 2.5-4c1 1.5 2.5 2.5 2.5 4s-1 3-2.5 3z" opacity="0.4"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'nucleolus': {
        def: 'A small, dense area inside the nucleus where ribosomes are made',
        emoji: '⚫',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><circle cx="10" cy="10" r="2.5" fill="currentColor" opacity="0.3"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },

    'nuclear envelope': {
        def: 'The double membrane surrounding the nucleus — has pores that let messages in and out',
        emoji: '🔲',
        icon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><circle cx="10" cy="10" r="5" stroke-dasharray="2 2"/><circle cx="14.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" opacity="0.5"/><circle cx="5.5" cy="12" r="0.8" fill="currentColor" stroke="none" opacity="0.5"/></svg>',
        courses: ['biology'],
        key: true,
        aliases: [],
    },
};
