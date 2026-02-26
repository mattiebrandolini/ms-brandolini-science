window.CHECKPOINT_CONFIG = {
    id: 'ck11',
    title: 'Cell Structure',
    course: 'Biology',
    icon: '🔬',
    bannerClass: 'ck-entry-banner--bio',

    chapterOrder: ['ch1','ch2','ch3','ch4','ch5'],

    chapters: {
        ch1: {
            title: 'Prokaryotic vs Eukaryotic Cells',
            subtitle: 'The two types of cells — and the rule that separates them',
            video: { id: 'Pxujitlv8wc', title: 'Prokaryotic vs Eukaryotic Cells', channel: 'Amoeba Sisters', time: '5:27' },
            l1_videos: {
                es: { id: 'lNuosW_N8H8', title: 'Célula Procariota y Eucariota', channel: 'A Cierta Ciencia', time: '5:35' },
                pt: { id: '4IoiIUgpcnw', title: 'Célula Eucarionte vs Procarionte', channel: 'Biologia com Samuel Cunha', time: '7:15' },
                fr: { id: 'EHkwY4vw8yo', title: 'Procaryote vs Eucaryote', channel: 'Les Bons Profs', time: '4:50' },
                vi: { id: 'auZoVh0yoy0', title: 'Tế bào nhân sơ và nhân thực', channel: 'VietJack', time: '9:20' },
            },
            reading: '<p>Every living thing is made of cells. But not all cells are the same.</p><p>There are two main types: <dfn data-def="A cell with NO nucleus and NO membrane-bound organelles. Example: bacteria." tabindex="0">prokaryotic</dfn> cells and <dfn data-def="A cell WITH a nucleus and WITH membrane-bound organelles. Example: plant and animal cells." tabindex="0">eukaryotic</dfn> cells.</p><p>Here\u2019s an easy way to remember:</p><p><strong class="ck-hl">Pro = No.</strong> Prokaryotic cells have NO nucleus. They have NO membrane-bound organelles. Their DNA just floats in the cytoplasm. Bacteria are prokaryotic.</p><p><strong class="ck-hl">Eu = Do.</strong> Eukaryotic cells DO have a nucleus. They DO have membrane-bound organelles. Their DNA is stored safely inside the nucleus. Plants, animals, and fungi are all eukaryotic.</p><p>But ALL cells \u2014 prokaryotic and eukaryotic \u2014 share three things: a <strong>cell membrane</strong> (barrier that controls what goes in and out), <strong>cytoplasm</strong> (jelly-like fluid filling the cell), and <strong>DNA</strong> (genetic instructions).</p><p>The big difference is organization. A prokaryotic cell is like one big room with everything mixed together. A eukaryotic cell is like a building with separate rooms. Each room has a specific purpose. Those \u201crooms\u201d are the <dfn data-def="A small structure inside a cell that has a specific job \u2014 means \u2018little organ\u2019" tabindex="0">organelles</dfn>.</p>',
            terms: [
                ['Prokaryotic', 'a cell with NO nucleus and NO membrane-bound organelles (example: bacteria)'],
                ['Eukaryotic', 'a cell WITH a nucleus and WITH membrane-bound organelles (example: plant and animal cells)'],
                ['Organelle', 'a small structure inside a cell that has a specific job (means "little organ")'],
            ],
            figure: {
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Celltypes.svg/960px-Celltypes.svg.png',
                alt: 'Prokaryotic cell vs eukaryotic cell comparison diagram',
                caption: 'The prokaryotic cell (left) has NO nucleus \u2014 DNA floats freely. The eukaryotic cell (right) has a nucleus and organized compartments.',
            },
        },
        ch2: {
            title: 'The Nucleus',
            subtitle: 'The command center \u2014 where DNA lives and instructions begin',
            video: { id: 'URUJD5NEXC8', title: 'Biology: Cell Structure (Full Tour)', channel: 'Nucleus Medical Media', time: '7:22' },
            l1_videos: {
                es: { id: '0hbr5Vmda1Y', title: 'Los Organelos Celulares', channel: 'Lifeder Educaci\u00f3n', time: '8:20' },
                pt: { id: 'V_hAOq5iWvA', title: 'Organelas Citoplasm\u00e1ticas', channel: 'Paulo Jubilut', time: '7:47' },
                fr: { id: 'tO9WiIl-4Yg', title: 'Les constituants de la cellule', channel: 'AlloProf', time: '6:15' },
                vi: { id: 'Q5Zrx-iKIJw', title: 'T\u1ebf b\u00e0o nh\u00e2n th\u1ef1c (Ph\u1ea7n 1)', channel: 'H\u1ecdc tr\u1ef1c tuy\u1ebfn OLM', time: '8:45' },
            },
            reading: '<p>The <dfn data-def="The control center of the cell \u2014 holds DNA and sends instructions" tabindex="0">nucleus</dfn> is the most important organelle. It is the control center of the cell.</p><p>Why? Because the nucleus holds the cell\u2019s DNA. DNA contains all the instructions the cell needs to work. When the cell needs to make a protein, the instructions come from the DNA inside the nucleus.</p><p>Inside the nucleus, the DNA is usually spread out in a tangled form called <dfn data-def="DNA in its spread-out, tangled form \u2014 like a messy pile of yarn" tabindex="0">chromatin</dfn>. Think of it like a messy pile of yarn. When the cell is ready to divide, the chromatin coils up tightly into <strong>chromosomes</strong> \u2014 like rolling that yarn into neat balls.</p><p>The nucleus also has a small, dense area called the <strong>nucleolus</strong>. This is where the cell builds <dfn data-def="A tiny machine that builds proteins \u2014 made in the nucleolus" tabindex="0">ribosomes</dfn> \u2014 the tiny machines that make proteins.</p><p>The nucleus is surrounded by a double membrane called the <strong>nuclear envelope</strong>. This envelope has tiny pores \u2014 like doors \u2014 that let messages and materials move between the nucleus and the rest of the cell.</p><p>Everything outside the nucleus but inside the cell membrane is called the <strong>cytoplasm</strong>. This is where all the other organelles do their work.</p>',
            terms: [
                ['Nucleus', 'the control center of the cell; holds DNA'],
                ['Chromatin', 'DNA in its spread-out, tangled form (like messy yarn)'],
                ['Chromosomes', 'chromatin coiled up tightly (like neat balls of yarn)'],
                ['Ribosome', 'a tiny machine that builds proteins (made in the nucleolus)'],
            ],
            figure: {
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cell-organelles-labeled.png/960px-Cell-organelles-labeled.png',
                alt: 'Animal cell with labeled organelles',
                caption: 'Find the nucleus \u2014 the large round structure near the center. Can you also spot the ER, Golgi, and mitochondria?',
            },
        },
        ch3: {
            title: 'The Protein Pathway',
            subtitle: 'How cells build, process, package, and ship proteins',
            video: { id: 'Fcxc8Gv7NiU', title: 'The Endomembrane System', channel: 'Ricochet Science', time: '3:06' },
            l1_videos: {
                es: { id: 'ffwRDZAfw6Y', title: 'Sistema de Endomembranas', channel: 'Biolog\u00eda Educatina', time: '5:12' },
                pt: { id: 'bFL1eGof6Iw', title: 'Sistema de Endomembranas', channel: 'Biologia Ilustrada', time: '6:40' },
                fr: { id: '-eE2l-GruY0', title: 'Syst\u00e8me Endomembranaire', channel: 'You\'Tut', time: '8:30' },
                vi: { id: 'ZLsNnFrVk4g', title: 'L\u01b0\u1edbi n\u1ed9i ch\u1ea5t v\u00e0 b\u1ed9 m\u00e1y Golgi', channel: 'H\u1ecdc tr\u1ef1c tuy\u1ebfn OLM', time: '7:30' },
            },
            reading: '<p>Cells need proteins to do almost everything. Proteins help with digestion, fight infection, send signals, and build structure.</p><p>But proteins don\u2019t just appear. They are built, processed, packaged, and shipped \u2014 like products in a factory. This factory is called the <dfn data-def="The network of organelles that builds, processes, and ships proteins" tabindex="0">endomembrane system</dfn>.</p><p><strong class="ck-hl">Step 1:</strong> The <dfn data-def="A tiny machine that reads DNA instructions and assembles amino acids into proteins" tabindex="0">ribosome</dfn> builds the protein by reading instructions from the nucleus.</p><p><strong class="ck-hl">Step 2:</strong> The <dfn data-def="Network of folded membranes covered in ribosomes \u2014 folds and transports proteins (the highway)" tabindex="0">rough ER</dfn> receives the protein and folds it into the correct shape. It looks \u201crough\u201d because ribosomes cover its surface.</p><p><strong class="ck-hl">Step 3:</strong> A <dfn data-def="A small membrane bubble that carries materials between organelles" tabindex="0">vesicle</dfn> pinches off from the ER, carrying the protein to the next stop.</p><p><strong class="ck-hl">Step 4:</strong> The <dfn data-def="Stacked membranes that modify, package, and sort proteins for delivery (the packaging center)" tabindex="0">Golgi apparatus</dfn> modifies the protein, adds a \u201cshipping label,\u201d and sorts it.</p><p><strong class="ck-hl">Step 5:</strong> Another vesicle delivers the finished protein to its destination \u2014 the cell membrane, outside the cell, or another organelle.</p><p>The full pathway: <strong>Ribosome \u2192 Rough ER \u2192 Vesicle \u2192 Golgi \u2192 Vesicle \u2192 Destination</strong></p><p>Also important: <dfn data-def="Organelle that breaks down waste, damaged parts, and foreign invaders (the garbage collector)" tabindex="0">lysosomes</dfn> are the garbage collectors \u2014 they contain enzymes that break down damaged organelles and waste.</p>',
            terms: [
                ['Endomembrane system', 'the network of organelles that builds, processes, and ships proteins'],
                ['Rough ER', 'folded membranes with ribosomes; folds and transports proteins (the "highway")'],
                ['Golgi apparatus', 'stacked membranes that package and sort proteins (the "packaging center")'],
                ['Vesicle', 'a small membrane bubble that carries materials between organelles'],
                ['Lysosome', 'organelle that breaks down waste and damaged parts (the "garbage collector")'],
            ],
            figure: {
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Endomembrane_system_diagram_en.svg/960px-Endomembrane_system_diagram_en.svg.png',
                alt: 'Endomembrane system diagram',
                caption: 'Follow the arrows: Ribosome \u2192 Rough ER \u2192 Vesicle \u2192 Golgi \u2192 Vesicle \u2192 Destination. This is the pathway you need to know.',
            },
        },
        ch4: {
            title: 'Energy Organelles',
            subtitle: 'Mitochondria burn fuel. Chloroplasts capture sunlight. Plants have both.',
            video: { id: 'Tp8mmyPev5s', title: 'Mitochondria vs Chloroplast', channel: '2 Minute Classroom', time: '~2:00' },
            l1_videos: {
                es: { id: 'jS0b70BoWHA', title: 'Mitocondrias y Cloroplastos', channel: 'A Cierta Ciencia', time: '4:32' },
                pt: { id: 'TBEpshmaagE', title: 'Mitoc\u00f4ndria e Cloroplasto', channel: 'Professor Gui', time: '9:10' },
                fr: { id: 'xFto9MkVStU', title: 'Mitochondrie et Chloroplaste', channel: 'Khan Academy FR', time: '7:20' },
                vi: { id: '4n_dBUZixRE', title: 'Ti th\u1ec3 v\u00e0 l\u1ee5c l\u1ea1p', channel: 'H\u1ecdc tr\u1ef1c tuy\u1ebfn OLM', time: '6:15' },
            },
            reading: '<p>Every cell needs energy. Two organelles handle this:</p><p><strong class="ck-hl">\ud83d\udd0b Mitochondria \u2014 The Engine.</strong> <dfn data-def="Organelle that converts glucose into ATP energy \u2014 the engine or powerhouse of the cell" tabindex="0">Mitochondria</dfn> burn fuel (glucose) and produce <dfn data-def="The energy molecule cells use to do work \u2014 like a rechargeable battery" tabindex="0">ATP</dfn>, the energy molecule cells use. This process is called <strong>cellular respiration</strong>. It happens in almost every eukaryotic cell \u2014 plant AND animal. Your muscle cells have thousands of mitochondria because muscles need lots of energy.</p><p><strong class="ck-hl">\u2600\ufe0f Chloroplasts \u2014 The Solar Panel.</strong> <dfn data-def="Organelle that captures sunlight to make glucose through photosynthesis \u2014 only in plants" tabindex="0">Chloroplasts</dfn> capture sunlight and use it to make glucose. This is <strong>photosynthesis</strong>. They contain <dfn data-def="The green pigment inside chloroplasts that absorbs sunlight energy" tabindex="0">chlorophyll</dfn> \u2014 the green pigment that makes plants green.</p><p><strong>The key connection:</strong> Chloroplasts MAKE the glucose. Mitochondria BURN the glucose. Plants have BOTH. Animals only have mitochondria.</p><p><strong>What makes these special:</strong> Both have their own DNA, their own ribosomes, a double membrane, and can divide on their own \u2014 because scientists believe they were once independent bacteria that were swallowed by ancient cells billions of years ago.</p>',
            terms: [
                ['Mitochondria', 'converts glucose into ATP energy (the "engine")'],
                ['Chloroplast', 'captures sunlight to make glucose (the "solar panel") \u2014 plants only'],
                ['ATP', 'the energy molecule cells use to do work'],
                ['Chlorophyll', 'the green pigment inside chloroplasts that absorbs sunlight'],
            ],
            figure: {
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Mitochondrion_mini_diagram_en.svg/960px-Mitochondrion_mini_diagram_en.svg.png',
                alt: 'Mitochondrion cross-section',
                caption: 'The mitochondrion has a DOUBLE membrane. The inner folds (cristae) are where ATP is made. More folds = more energy production.',
            },
        },
        ch5: {
            title: 'Plant vs Animal Cells',
            subtitle: 'Same blueprint, different extras',
            video: { id: 'ApvxVtBJxd0', title: 'Plant vs Animal Cells', channel: 'Neural Academy', time: '~5:00' },
            l1_videos: {
                es: { id: 'JIFP22tG9R0', title: 'C\u00e9lula Animal y Vegetal', channel: 'Amigos de la Qu\u00edmica', time: '9:45' },
                pt: { id: '74MYdwFqr9c', title: 'C\u00e9lula Animal e Vegetal', channel: 'Brasil Escola', time: '6:55' },
                fr: { id: 'z4daqmPSYuE', title: 'Cellule animale et v\u00e9g\u00e9tale', channel: 'Yannick Sayer', time: '5:40' },
                vi: { id: 'eZUCLziATjM', title: 'So s\u00e1nh t\u1ebf b\u00e0o th\u1ef1c v\u1eadt v\u00e0 \u0111\u1ed9ng v\u1eadt', channel: 'VietJack', time: '5:10' },
            },
            reading: '<p>Plant cells and animal cells are BOTH eukaryotic. They share most organelles: nucleus, ER, Golgi, ribosomes, mitochondria, lysosomes, vesicles.</p><p>But plant cells have three extras:</p><p><strong class="ck-hl">\ud83c\udf3f 1. Cell Wall</strong> \u2014 A thick, rigid outer layer made of <dfn data-def="The material that makes plant cell walls rigid \u2014 gives plants structural support" tabindex="0">cellulose</dfn>. Gives the plant cell its square shape. This is why plants stand upright without bones. Animal cells have NO cell wall \u2014 just a flexible membrane, giving them a round shape.</p><p><strong class="ck-hl">\u2600\ufe0f 2. Chloroplasts</strong> \u2014 For photosynthesis. Plants make their own food from sunlight. Animals don\u2019t have these \u2014 they eat food instead.</p><p><strong class="ck-hl">\ud83d\udca7 3. Central Vacuole</strong> \u2014 One very large water storage tank. When full, it pushes against the cell wall and keeps the plant firm. This pressure is called <dfn data-def="The pressure of water inside the central vacuole pushing against the cell wall \u2014 keeps plants firm" tabindex="0">turgor pressure</dfn>. When a plant wilts, the central vacuole has lost water.</p><p>Animal cells have <strong>centrioles</strong> \u2014 small structures that help organize cell division. Most plant cells don\u2019t.</p>',
            terms: [
                ['Cell wall', 'rigid outer layer of plant cells made of cellulose (gives the square shape)'],
                ['Central vacuole', 'large water storage compartment in plant cells'],
                ['Turgor pressure', 'water pushing against the cell wall, keeping the plant firm'],
                ['Centrioles', 'small structures in animal cells that help organize cell division'],
            ],
            figure: {
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Differences_between_simple_animal_and_plant_cells_%28en%29.svg/960px-Differences_between_simple_animal_and_plant_cells_%28en%29.svg.png',
                alt: 'Plant cell vs animal cell comparison',
                caption: 'Plant cell (left) has a rigid cell wall, green chloroplasts, and a large central vacuole. Animal cell (right) is round and flexible.',
            },
        },
    },

    quizInfo: {
        format: 'Paper quiz \u2014 3\u20134 open response questions. You explain and draw. No multiple choice.',
        notes: 'You can use your <strong>handwritten notes</strong>. No phones, no Chromebooks.',
        grading: '<strong>Pass = full points.</strong> If you don\u2019t pass, retake with different questions until you do.',
        warning: 'This quiz tests <strong>understanding, not memorization</strong>. You\u2019ll get a scenario and need to explain what\u2019s happening inside the cell and <em>why</em>.',
        readiness: [
            'Explain the difference between prokaryotic and eukaryotic cells <em>in your own words</em>',
            'Trace a protein from ribosome \u2192 ER \u2192 Golgi \u2192 vesicle \u2192 destination',
            'Explain what mitochondria and chloroplasts each do \u2014 and how they connect',
            'List at least 3 differences between plant and animal cells',
            'Explain <em>why</em> a muscle cell has more mitochondria than a skin cell',
        ],
    },

    practiceQuestions: [
        { q: 'A scientist discovers a new single-celled organism. It has no nucleus and no membrane-bound organelles. Is it prokaryotic or eukaryotic?', hint: 'How do you know?' },
        { q: 'Trace the path of a protein from where it is built to where it leaves the cell. Name each organelle it passes through and what happens at each stop.' },
        { q: 'A student says: \u201cMitochondria and chloroplasts do the same thing.\u201d Is this correct?', hint: 'Explain what each one actually does and how they are connected.' },
        { q: 'A plant cell and an animal cell are both placed in a very dry environment. Predict what happens to each cell. Which one will change shape? Why?', hint: 'Think about the cell wall and turgor pressure.' },
        { q: 'Your muscle cells have MORE mitochondria than your skin cells. Why?' },
        { q: 'If chloroplasts make glucose and mitochondria use glucose for energy, why do plant cells need BOTH organelles?' },
    ],
};
