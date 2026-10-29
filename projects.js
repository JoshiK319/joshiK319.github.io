/* =====================================================================
   PROJECTS — edit this list to add or update projects.

   SAMPLE VALUES: anything wrapped in [[double brackets]] is a sample
   value. On the site it shows with a dashed underline and a note saying
   it's a sample. Replace it with the real value and remove the brackets:
       '[[60,000]] rpm'  ->  '58,000 rpm'
   Sample pictures/figures live in assets/projects/<folder>/ and sample
   documents in assets/docs/. They carry a "SAMPLE" label — swap them
   for real photos, plots and PDFs and update the file names below.
   When a project has no sample material left, delete its `sample: true`.

   Every field except id, title and summary is optional; anything left
   out simply doesn't appear.

   id           short unique name, used in the shareable link (#project-<id>)
   category     filter group: 'drives' | 'power-electronics' | 'power-systems'
   tag, period  small labels above the title
   title, summary
   images       pictures for the slideshow: [{ src: '...', caption: '...' }]
                The first one is also the card cover. Add as many as you like.
   art          line drawing used on the card when there are no images:
                'dtc' | 'pwm' | 'pfc' | 'grid'
   sample       true = shows a note that the page still has sample material
   confidential true = shows a confidentiality note
   problem      "Problem & motivation" paragraphs (array of strings)
   overview     paragraphs (array of strings)
   specs        key numbers: [{ value: '450 V', label: 'DC bus' }]
   team         who the work was done with (string)
   role         what Kishor personally did (string)
   system, approach, results   bullet lists (arrays of strings)
   tools        list of tools
   documents    [{ title: 'Technical summary', type: 'PDF', url: 'assets/docs/...' }]
   links        [{ label: 'Paper (DOI)', url: 'https://...' }]
   ===================================================================== */
const PROJECTS = [
  {
    id: 'ultra-high-speed-pmsm',
    category: 'drives',
    tag: 'Mississippi State',
    period: 'Ph.D. research · 2023 – present',
    title: 'Ultra-High-Speed PMSM Drive Development',
    summary: 'Delay-aware multivariable control for a GaN-based PMSM drive designed for 100,000 rpm, run to 95,000 rpm on hardware.',
    sample: true,
    images: [
      { src: 'assets/projects/ultra-high-speed/hil-setup.svg', caption: 'HIL setup: PLECS RT Box, TI C2000 LaunchPad running the control firmware, and the model on screen.' },
      { src: 'assets/projects/ultra-high-speed/speed-ramp.svg', caption: 'Acceleration toward the 100,000 rpm design speed; 95,000 rpm reached on hardware.' },
      { src: 'assets/projects/ultra-high-speed/architecture.svg', caption: 'Drive system: GaN inverter, Maxon PMSM with Hall sensors, TI C2000 F28379D controller.' }
    ],
    documents: [
      { title: 'Technical summary', type: 'PDF', url: 'assets/docs/ultra-high-speed-pmsm-summary.pdf' },
      { title: 'Presentation slides', type: 'PDF', url: 'assets/docs/ultra-high-speed-pmsm-slides.pdf' }
    ],
    problem: [
      'At 100,000 rpm the motor\'s electrical frequency is in the kilohertz range, and the controller gets only a few samples per electrical cycle. Computation and PWM delays then become a significant fraction of the cycle and couple the d- and q-axis currents. Conventional PI current control loses stability margin exactly where the drive needs it most.',
      'Ultra-high-speed motors make compressors and turbomachinery smaller and lighter, but only if the drive stays stable and responsive at full speed.'
    ],
    overview: [
      'This project builds a complete ultra-high-speed PMSM drive and develops multivariable (MIMO) control that accounts for delay, so the drive stays stable and responsive at very high speed.',
      'The drive uses a GaN-based inverter feeding a Maxon motor with Hall-sensor feedback, controlled by FOC-based strategies on a TI C2000 (F28379D) LaunchPad. Control is designed in MATLAB, validated in real time on a PLECS RT Box FPGA model, and then deployed as embedded code.'
    ],
    specs: [
      { value: '100,000 rpm', label: 'Design speed' },
      { value: '95,000 rpm', label: 'Reached on hardware' },
      { value: '+188%', label: 'Speed margin (MIMO control)' },
      { value: 'GaN', label: 'Inverter technology' }
    ],
    team: 'Research with M. Karimi-Ghartemani and S. Choi at Mississippi State University, co-authors on the related publications.',
    role: 'Designs the control strategies, including delay-aware MIMO current control, builds the drive system, runs HIL validation on PLECS RT Box, and implements the algorithms as embedded code in Code Composer Studio.',
    system: ['GaN-based inverter', 'Maxon PMSM with Hall-sensor feedback', 'TI C2000 F28379D LaunchPad controller', 'PLECS RT Box for real-time HIL'],
    approach: [
      'Designed FOC-based control strategies for operation up to 100,000 rpm',
      'Developed and analyzed MIMO control techniques that mitigate delay effects and improve high-speed stability and dynamic performance',
      'Validated state-of-the-art and proposed methods in real time on a PLECS RT Box FPGA model',
      'Implemented the algorithms as embedded code on the microcontroller and moved from simulation to physical hardware'
    ],
    results: [
      'Delay-aware MIMO control improved the speed margin by 188%',
      'Reached a maximum speed of 95,000 rpm on hardware',
      'Robust multivariable current control approach submitted to IEEE Transactions on Industrial Electronics (under review)'
    ],
    tools: ['MATLAB/Simulink', 'PLECS', 'RT Box', 'TI C2000 F28379D', 'Code Composer Studio', 'GaN inverter'],
    links: [{ label: 'SSCET 2026 paper — PI speed controllers (DOI)', url: 'https://doi.org/10.1109/SSCET69323.2026.11735668' }]
  },
  {
    id: 'high-speed-pmsm',
    category: 'drives',
    tag: 'Mississippi State',
    period: 'Ph.D. research',
    title: 'High-Speed PMSM Control Drives',
    summary: 'A Direct Torque Control drive for a fuel-cell compressor motor on a 200 kW, 450 V inverter, validated on hardware to 60,000 rpm.',
    sample: true,
    images: [
      { src: 'assets/projects/high-speed-pmsm/test-bench.svg', caption: 'Motor test bench: inverter, high-speed PMSM coupled to a load, active cooling, and oscilloscope.' },
      { src: 'assets/projects/high-speed-pmsm/speed-response.svg', caption: 'Start-up with the open-loop to closed-loop transition, up to 60,000 rpm.' },
      { src: 'assets/projects/high-speed-pmsm/dtc-structure.svg', caption: 'DTC structure: hysteresis torque and flux control with a switching table.' },
      { src: 'assets/projects/high-speed-pmsm/torque-ripple.svg', caption: 'Steady-state torque of the commercial and lab-developed motors.' }
    ],
    documents: [
      { title: 'Technical summary', type: 'PDF', url: 'assets/docs/high-speed-pmsm-summary.pdf' },
      { title: 'Presentation slides', type: 'PDF', url: 'assets/docs/high-speed-pmsm-slides.pdf' }
    ],
    problem: [
      'Fuel-cell systems use high-speed compressors to supply air, and the motors that drive them must start reliably and hold speed under changing load. At standstill there is no reliable flux or position information, so a high-speed DTC drive needs a safe way to start before closed-loop control can take over.',
      'Because the drive is high-power and high-speed, heat and protection matter as much as the control law.'
    ],
    overview: [
      'This project develops and implements a high-speed PMSM drive using Direct Torque Control. The motor starts open-loop and then transitions smoothly into closed-loop control.',
      'The drive pairs a 200 kW XM3 inverter on a 450 V DC bus with a fuel-cell compressor PMSM, and uses active cooling for thermal management. The work is related to an IEEE APEC 2025 paper comparing DTC on commercial and laboratory-developed high-speed PMSMs.'
    ],
    specs: [
      { value: '60,000 rpm', label: 'Validated on hardware' },
      { value: '200 kW', label: 'XM3 inverter' },
      { value: '450 V', label: 'DC bus' },
      { value: 'DTC', label: 'Control method' }
    ],
    team: 'With M. Karimi-Ghartemani and S. Choi at Mississippi State University. APEC 2025 co-authors: M. Moniruzzaman, M. R. Rahman, M. K. Islam, S. Choi and M. Karimi-Ghartemani.',
    role: 'Developed and implemented the DTC drive, including the open-loop to closed-loop transition, tuned the PI controllers, integrated the inverter with the motor, and set up the active cooling.',
    system: ['200 kW XM3 inverter on a 450 V DC bus', 'Fuel-cell compressor PMSM', 'TI LaunchPad controller', 'Active cooling for thermal management'],
    approach: [
      'Developed DTC with a seamless open-loop to closed-loop transition strategy',
      'Designed and tuned PI controllers for stable closed-loop operation under varying load',
      'Integrated the high-power inverter with the compressor motor',
      'Engineered active cooling to keep the system stable and prevent overheating at high speed'
    ],
    results: [
      'Validated on hardware up to 60,000 rpm',
      'Stable high-speed performance under varying load conditions',
      'Published comparison of DTC on commercial and lab-developed PMSMs at IEEE APEC 2025'
    ],
    tools: ['MATLAB/Simulink', 'PLECS', 'RT Box', 'TI LaunchPad', 'PI control'],
    links: [{ label: 'APEC 2025 paper (DOI)', url: 'https://doi.org/10.1109/APEC48143.2025.10977544' }]
  },
  {
    id: 'power-factor-correction',
    category: 'power-electronics',
    tag: 'Mississippi State',
    period: 'Ph.D. research',
    title: 'Power Factor Correction',
    summary: 'ePLL-based power factor correction control with a regulated 400 V DC output, validated in real-time HIL.',
    sample: true,
    images: [
      { src: 'assets/projects/pfc/pfc-board.svg', caption: 'PFC board: AC input, bridge, boost inductor, switches on the heatsink, and the 400 V DC output.' },
      { src: 'assets/projects/pfc/input-waveforms.svg', caption: 'Grid voltage and input current in phase, from HIL.' },
      { src: 'assets/projects/pfc/control-loops.svg', caption: 'Control structure: voltage loop, ePLL and current loop.' },
      { src: 'assets/projects/pfc/harmonics.svg', caption: 'Input current harmonics with and without PFC.' }
    ],
    documents: [
      { title: 'Technical summary', type: 'PDF', url: 'assets/docs/power-factor-correction-summary.pdf' },
      { title: 'Presentation slides', type: 'PDF', url: 'assets/docs/power-factor-correction-slides.pdf' }
    ],
    problem: [
      'A plain diode rectifier draws current in short, distorted pulses. That gives a poor power factor and high harmonic content, wastes distribution capacity and can break grid harmonic limits such as IEC 61000-3-2.',
      'A PFC stage shapes the input current to follow the grid voltage, but only if its control stays accurately synchronized to the grid and keeps the DC output stable as conditions change.'
    ],
    overview: [
      'This project develops a PFC control strategy in MATLAB/Simulink. An enhanced phase-locked loop (ePLL) provides accurate grid synchronization, an outer loop regulates the DC output at 400 V, and an inner loop shapes the input current to raise the power factor and reduce harmonics. It was validated in real time on PLECS RT Box.'
    ],
    specs: [
      { value: '400 V', label: 'Regulated DC output' },
      { value: 'ePLL', label: 'Grid synchronization' },
      { value: '[[0.99]]', label: 'Power factor' },
      { value: '[[3.2]]%', label: 'Input current THD' }
    ],
    role: 'Developed the PFC control strategy and the ePLL, designed the control architecture, and ran the real-time HIL validation.',
    approach: [
      'Developed the PFC control strategy in MATLAB/Simulink with an ePLL for accurate grid synchronization',
      'Designed the control architecture to regulate the DC output at 400 V while improving power factor and reducing input current harmonics',
      'Performed real-time HIL validation on PLECS RT Box for rapid prototyping and verification',
      'Tested the control under dynamic operating conditions'
    ],
    results: ['DC output regulated at 400 V', 'Power factor of [[0.99]] and input current THD of [[3.2]]% in HIL'],
    tools: ['MATLAB/Simulink', 'PLECS', 'RT Box', 'ePLL', 'PI control']
  },
  {
    id: 'cummins-drive-integration',
    category: 'drives',
    art: 'dtc',
    tag: 'Industry · Cummins Inc.',
    period: 'Internship · May – Aug 2025',
    title: 'Ultra-High-Speed Compressor Drive at Cummins',
    summary: 'FOC and DTC drive control for an ultra-high-speed compressor, run to 60,000 rpm at full torque load and validated in HIL and SIL.',
    confidential: true,
    overview: [
      'Summer internship as a Power Electronics Control Intern at Cummins Inc. in Fridley, Minnesota.'
    ],
    specs: [
      { value: '60,000 rpm', label: 'Compressor speed, full torque load' },
      { value: 'FOC + DTC', label: 'Control strategies' }
    ],
    results: [
      'Designed and implemented ultra-high-speed PMSM drive control using FOC and DTC for improved dynamic performance',
      'Took ramp rate and hardware-protection criteria into account to run the compressor up to 60,000 rpm at full torque load',
      'Evaluated control robustness and system response in hardware-in-the-loop and software-in-the-loop',
      'Integrated a TI LaunchPad controller with FPGA-based HIL platforms (Speedgoat and Typhoon) for real-time testing and rapid prototyping'
    ],
    tools: ['FOC', 'DTC', 'HIL / SIL', 'TI LaunchPad', 'Speedgoat', 'Typhoon HIL']
  },
  {
    id: 'pv-statcom',
    category: 'power-electronics',
    tag: 'Undergraduate thesis',
    period: 'IOE Pulchowk · 2018',
    title: 'PV-STATCOM',
    summary: 'A dual-function inverter that injects solar power by day and gives reactive power support when there is little or no PV generation.',
    sample: true,
    images: [
      { src: 'assets/projects/pv-statcom/pq-24h.svg', caption: 'Active power by day, reactive power support at night.' },
      { src: 'assets/projects/pv-statcom/pcc-voltage.svg', caption: 'Voltage at the point of common coupling with and without PV-STATCOM.' }
    ],
    documents: [{ title: 'Technical summary', type: 'PDF', url: 'assets/docs/pv-statcom-summary.pdf' }],
    problem: [
      'A grid-connected PV inverter is fully used only around midday and sits idle at night. Meanwhile the grid still needs reactive power support to hold voltage, which usually means buying dedicated STATCOM hardware.'
    ],
    overview: [
      'This project developed a dual-function inverter control. Under irradiance the inverter works as a normal grid-connected PV inverter, and during low or no PV generation it works as a STATCOM for reactive power compensation, making fuller use of hardware that is already installed.',
      'This was Kishor\'s bachelor\'s thesis and was published in the Journal of the Institute of Engineering.'
    ],
    role: 'Thesis project and co-author. Designed the switching and control logic and built the MATLAB/Simulink models.',
    approach: [
      'Developed dual-function control: grid-connected PV inverter under irradiance, STATCOM during low or no PV generation',
      'Designed switching and control logic to move dynamically between active power injection and reactive power support',
      'Implemented and validated the control in MATLAB/Simulink for varying irradiance and grid conditions'
    ],
    results: ['Published in the Journal of the Institute of Engineering, vol. 15, no. 3, pp. 411–419 (2019)'],
    tools: ['MATLAB/Simulink', 'PSIM', 'PID control'],
    links: [{ label: 'Paper (DOI)', url: 'https://doi.org/10.3126/jie.v15i3.32762' }]
  },
  {
    id: 'wind-solar-hybrid',
    category: 'power-systems',
    tag: 'Undergraduate',
    period: 'IOE Pulchowk',
    title: 'Wind–Solar Hybrid System',
    summary: 'Modeling a wind–solar hybrid with battery storage for reliable off-grid power in rural Nepal.',
    sample: true,
    images: [
      { src: 'assets/projects/wind-solar/site.svg', caption: 'Concept of the hybrid site: wind turbines, PV array, battery room and village load.' },
      { src: 'assets/projects/wind-solar/daily-profile.svg', caption: 'Typical day: solar and wind generation against community load.' },
      { src: 'assets/projects/wind-solar/battery-soc.svg', caption: 'Battery state of charge over the same day.' }
    ],
    documents: [{ title: 'Technical summary', type: 'PDF', url: 'assets/docs/wind-solar-hybrid-summary.pdf' }],
    problem: [
      'Many rural communities in Nepal are far from the national grid. Wind and solar complement each other through the day and across seasons, but the system has to be sized and controlled carefully to cover the load reliably.'
    ],
    overview: [
      'Designed and modeled a hybrid renewable energy system that combines wind turbines, solar PV and battery storage, and proposed an optimal configuration for rural electrification.'
    ],
    specs: [
      { value: '20 kW', label: 'Wind turbines' },
      { value: '15 kWp', label: 'Solar PV' },
      { value: 'Battery', label: 'Storage' }
    ],
    role: 'Co-author. Contributed system modeling, power-sharing analysis and performance evaluation in MATLAB/Simulink.',
    approach: [
      'Designed and modeled the wind, solar and battery system',
      'Analyzed power sharing between wind, solar and storage under varying load and environmental conditions',
      'Evaluated performance, energy management and stability of the hybrid microgrid in MATLAB/Simulink'
    ],
    results: [
      'Proposed an optimal configuration for rural electrification, improving reliability and use of renewable resources',
      'Published in the Journal of the Institute of Engineering, vol. 15, no. 3, pp. 360–367 (2019)'
    ],
    tools: ['MATLAB/Simulink', 'Load analysis', 'Energy management'],
    links: [{ label: 'Paper (DOI)', url: 'https://doi.org/10.3126/jie.v15i3.32223' }]
  },
  {
    id: 'controlled-rectifier',
    category: 'power-electronics',
    tag: 'Undergraduate',
    period: 'IOE Pulchowk',
    title: 'Controlled Rectifier Study',
    summary: 'Comparing GTO and thyristor rectifiers for isolated micro-grid loads: harmonics, power factor and switching across firing angles.',
    sample: true,
    images: [
      { src: 'assets/projects/controlled-rectifier/harmonics.svg', caption: 'Current harmonics, GTO vs. thyristor rectifier.' },
      { src: 'assets/projects/controlled-rectifier/pf-vs-angle.svg', caption: 'Power factor across firing angles.' }
    ],
    documents: [{ title: 'Technical summary', type: 'PDF', url: 'assets/docs/controlled-rectifier-summary.pdf' }],
    problem: [
      'In a small isolated micro-grid, the harmonics injected by rectifier loads distort the voltage for every other user. The choice of switching device directly affects power quality.'
    ],
    overview: [
      'Engineered and compared GTO- and thyristor-based controlled rectifiers for micro-grid applications with isolated loads.'
    ],
    role: 'Built both rectifier models and carried out the comparison.',
    approach: [
      'Developed MATLAB/Simulink models of both rectifiers and validated their steady-state and transient response',
      'Investigated harmonic content, power factor variation and switching characteristics across firing angles',
      'Analyzed trade-offs between the topologies in efficiency and output voltage quality'
    ],
    tools: ['MATLAB/Simulink', 'Proteus']
  },
  {
    id: 'load-flow',
    category: 'power-systems',
    tag: 'Undergraduate',
    period: 'IOE Pulchowk',
    title: 'Load Flow Analysis',
    summary: 'Newton–Raphson load flow in Python and ETAP for multi-bus distribution systems.',
    sample: true,
    images: [
      { src: 'assets/projects/load-flow/voltage-profile.svg', caption: 'Bus voltage profile along the 30-bus feeder.' },
      { src: 'assets/projects/load-flow/branch-losses.svg', caption: 'Active power loss by feeder section.' }
    ],
    documents: [{ title: 'Technical summary', type: 'PDF', url: 'assets/docs/load-flow-summary.pdf' }],
    problem: [
      'Distribution engineers need bus voltages and losses along a feeder to plan upgrades. Long rural feeders often end with voltages below the acceptable limit.'
    ],
    overview: [
      'Developed and implemented Newton–Raphson load-flow algorithms in Python and ETAP for 10, 20 and 30-bus distribution systems, and cross-validated the two.'
    ],
    specs: [
      { value: '10 / 20 / 30', label: 'Bus systems' },
      { value: 'Newton–Raphson', label: 'Solver' }
    ],
    role: 'Wrote the Newton–Raphson solver in Python and validated it against ETAP.',
    approach: [
      'Implemented Newton–Raphson load flow in Python and ETAP',
      'Analyzed voltage profiles, real and reactive power flow, and system losses',
      'Evaluated performance under varying load, identifying voltage stability limits and how losses are distributed',
      'Cross-validated results between Python and ETAP'
    ],
    tools: ['Python', 'ETAP', 'Power system analysis']
  },
  {
    id: 'cost-estimation',
    category: 'power-systems',
    tag: 'Undergraduate',
    period: 'IOE Pulchowk',
    title: 'Transmission Line Cost Tool',
    summary: 'An automated Excel/VBA tool that estimates transmission line cost from voltage level, length and terrain.',
    sample: true,
    images: [
      { src: 'assets/projects/cost-estimation/cost-vs-length.svg', caption: 'Estimated line cost against length for three voltage levels.' },
      { src: 'assets/projects/cost-estimation/cost-breakdown.svg', caption: 'Cost breakdown per km by component.' }
    ],
    documents: [{ title: 'Technical summary', type: 'PDF', url: 'assets/docs/cost-estimation-summary.pdf' }],
    problem: [
      'Early in planning, engineers need a quick, consistent cost estimate for alternative line routes and voltage levels, long before a detailed design exists.'
    ],
    overview: [
      'An automated cost-estimation tool for transmission line projects, driven by voltage level, line length and terrain.'
    ],
    role: 'Designed the calculation algorithms and programmed the tool.',
    approach: [
      'Designed calculation algorithms for material, installation and infrastructure costs',
      'Automated the estimate in Excel/VBA',
      'Enabled fast scenario analysis across design configurations'
    ],
    results: ['Supports planning and budgeting decisions with faster, more consistent estimates'],
    tools: ['Excel/VBA', 'C++']
  }
];

/* ---------- rendering (no need to edit below) ---------- */
(function () {
  const grid = document.getElementById('project-grid');
  const dialog = document.getElementById('project-dialog');
  const body = document.getElementById('project-body');
  if (!grid || !dialog) return;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // escape, then turn [[sample]] into a marked placeholder
  const txt = s => esc(s).replace(/\[\[(.+?)\]\]/g, '<mark class="ph" title="Sample value — to be updated">$1</mark>');
  const plain = s => String(s).replace(/\[\[(.+?)\]\]/g, '$1');
  const hasPh = p => JSON.stringify(p).includes('[[');
  const art = name => document.querySelector(`#art-lib svg[data-art="${name || 'dtc'}"]`);

  const SLIDE_MS = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cardCover(p) {
    if (p.images && p.images.length) return `<img src="${esc(p.images[0].src)}" alt="" loading="lazy">${p.images.length > 1 ? `<span class="count">${p.images.length} pictures</span>` : ''}`;
    const svg = art(p.art);
    return svg ? `<span class="art-wrap">${svg.outerHTML.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"')}</span>` : '';
  }
  const list = (title, items) => items && items.length
    ? `<section><h3>${title}</h3><ul>${items.map(i => `<li>${txt(i)}</li>`).join('')}</ul></section>` : '';
  const paras = (title, items) => items && items.length
    ? `<section><h3>${title}</h3>${items.map(t => `<p>${txt(t)}</p>`).join('')}</section>` : '';

  // project cards: the heading's button opens the project and stretches over the whole card
  grid.innerHTML = PROJECTS.map((p, i) => `
    <li class="project reveal" data-id="${esc(p.id)}" data-category="${esc(p.category || '')}">
      <article>
        <div class="cover">${cardCover(p)}${p.confidential ? '<span class="badge">Confidential</span>' : ''}</div>
        <div class="card-body">
          <p class="n">${String(i + 1).padStart(2, '0')} · ${esc(p.tag || '')}</p>
          <h3 class="title"><button type="button" class="project-open" aria-haspopup="dialog">${esc(p.title)}</button></h3>
          <p class="summary">${txt(p.summary)}</p>
          ${p.tools ? `<p class="stack">${p.tools.map(esc).join(' · ')}</p>` : ''}
          <p class="more" aria-hidden="true">View project <span>→</span></p>
        </div>
      </article>
    </li>`).join('');

  // filter tabs
  const tabs = document.querySelectorAll('#filter-tabs .filter-tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const f = tab.dataset.filter;
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t === tab)));
    grid.querySelectorAll('.project').forEach(card => {
      card.hidden = f !== 'all' && card.dataset.category !== f;
      card.classList.add('in'); // filtered-in cards shouldn't wait for a scroll reveal
    });
  }));

  // hero reel: two rows of project tiles drifting in opposite directions
  const reel = document.getElementById('hero-reel');
  if (reel) {
    const tile = p => `<button type="button" class="reel-tile" data-id="${esc(p.id)}" tabindex="-1">
        ${p.images && p.images.length ? `<img src="${esc(p.images[0].src)}" alt="" loading="lazy">` : `<span class="art-wrap">${(art(p.art) || { outerHTML: '' }).outerHTML}</span>`}
        <span class="reel-cap"><b>${esc(p.title)}</b><i>${esc(p.tag || '')}</i></span>
      </button>`;
    const half = Math.ceil(PROJECTS.length / 2);
    const rows = [PROJECTS.slice(0, half), PROJECTS.slice(half)];
    // each row is repeated so the scroll animation can loop seamlessly
    reel.innerHTML = rows.map((row, r) => `<div class="reel-row ${r ? 'right' : 'left'}" aria-hidden="true"><div class="reel-track">${[...row, ...row].map(tile).join('')}</div></div>`).join('');
    reel.addEventListener('click', e => {
      const t = e.target.closest('.reel-tile');
      if (t) open(PROJECTS.findIndex(p => p.id === t.dataset.id));
    });
  }

  function slideshow(p) {
    const imgs = p.images || [];
    if (!imgs.length) return '';
    const multi = imgs.length > 1;
    return `
      <div class="ss"${multi ? ' tabindex="0" aria-roledescription="carousel"' : ''} aria-label="${esc(p.title)} pictures">
        <div class="ss-viewport">
          <div class="ss-track">
            ${imgs.map((g, k) => `<figure class="ss-slide" aria-roledescription="slide" aria-label="${k + 1} of ${imgs.length}"${k ? ' aria-hidden="true"' : ''}>
              <a href="${esc(g.src)}" target="_blank" rel="noopener" tabindex="-1"><img src="${esc(g.src)}" alt="${esc(plain(g.caption || p.title))}" draggable="false"${k ? ' loading="lazy"' : ''}></a>
            </figure>`).join('')}
          </div>
          ${multi ? `<button class="ss-btn prev" type="button" aria-label="Previous picture">‹</button>
          <button class="ss-btn next" type="button" aria-label="Next picture">›</button>
          <span class="ss-progress" aria-hidden="true"><i></i></span>` : ''}
        </div>
        <div class="ss-bar">
          <p class="ss-caption" aria-live="polite">${txt(imgs[0].caption || '')}</p>
          ${multi ? `<div class="ss-dots">${imgs.map((_, k) => `<button type="button" aria-label="Show picture ${k + 1}"${k ? '' : ' aria-current="true"'}></button>`).join('')}</div>
          <span class="ss-count">1 / ${imgs.length}</span>` : ''}
        </div>
      </div>`;
  }

  // slideshow behaviour: auto-advance, arrows, dots, swipe, keys; pauses on hover/focus
  let slides = null;
  function stopSlides() {
    if (slides) clearInterval(slides.timer);
    slides = null;
  }
  function startSlides(p) {
    stopSlides();
    const root = body.querySelector('.ss');
    const imgs = p.images || [];
    if (!root || imgs.length < 2) return;
    const track = root.querySelector('.ss-track');
    const items = [...root.querySelectorAll('.ss-slide')];
    const dots = [...root.querySelectorAll('.ss-dots button')];
    const caption = root.querySelector('.ss-caption');
    const count = root.querySelector('.ss-count');
    const bar = root.querySelector('.ss-progress i');
    const state = slides = { i: 0, timer: null, paused: false };

    function restart() {
      clearInterval(state.timer);
      bar.style.animation = 'none';
      void bar.offsetWidth; // restart the CSS animation
      if (reduceMotion || state.paused) return;
      bar.style.animation = `ssProgress ${SLIDE_MS}ms linear forwards`;
      state.timer = setInterval(() => show(state.i + 1), SLIDE_MS);
    }
    function show(n) {
      state.i = (n + imgs.length) % imgs.length;
      track.style.transform = `translateX(-${state.i * 100}%)`;
      items.forEach((el, k) => el.setAttribute('aria-hidden', String(k !== state.i)));
      dots.forEach((d, k) => k === state.i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
      caption.innerHTML = txt(imgs[state.i].caption || '');
      count.textContent = `${state.i + 1} / ${imgs.length}`;
      restart();
    }
    const pause = v => { state.paused = v; restart(); };

    root.querySelector('.prev').addEventListener('click', () => show(state.i - 1));
    root.querySelector('.next').addEventListener('click', () => show(state.i + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
    root.addEventListener('mouseenter', () => pause(true));
    root.addEventListener('mouseleave', () => pause(false));
    root.addEventListener('focusin', () => pause(true));
    root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) pause(false); });
    root.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); e.stopPropagation();
      show(state.i + (e.key === 'ArrowRight' ? 1 : -1));
    });
    let x0 = null;
    const viewport = root.querySelector('.ss-viewport');
    viewport.addEventListener('pointerdown', e => { x0 = e.clientX; });
    viewport.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      state.swiped = Math.abs(dx) > 40;
      if (state.swiped) show(state.i + (dx < 0 ? 1 : -1));
    });
    // a swipe shouldn't also open the image link
    viewport.addEventListener('click', e => {
      if (state.swiped && e.target.closest('a')) e.preventDefault();
      state.swiped = false;
    });
    restart();
  }

  let current = -1;

  function render(i) {
    const p = PROJECTS[i];
    const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    body.innerHTML = `
      <header class="pd-head">
        <div class="pd-meta">${txt([p.tag, p.period].filter(Boolean).join(' · '))}</div>
        <h2 id="project-title">${esc(p.title)}</h2>
        <p class="pd-summary">${txt(p.summary)}</p>
      </header>
      ${p.confidential ? `<p class="pd-note">This work is confidential. Only Kishor's main contributions are listed.</p>` : ''}
      ${p.sample ? `<p class="pd-note">Pictures, documents and parts of the description on this page are samples for now${hasPh(p) ? `; values with a <mark class="ph">dashed underline</mark> are sample figures` : ''}. They will be replaced with project material.</p>`
        : hasPh(p) ? `<p class="pd-note">Values with a <mark class="ph">dashed underline</mark> are sample figures and will be updated.</p>` : ''}
      ${slideshow(p)}
      ${p.specs ? `<div class="pd-specs">${p.specs.map(s => `<div><b>${txt(s.value)}</b><span>${txt(s.label)}</span></div>`).join('')}</div>` : ''}
      ${paras('Problem &amp; motivation', p.problem)}
      ${paras(p.confidential ? 'Role' : 'Overview', p.overview)}
      ${p.team ? `<section><h3>Research team</h3><p>${txt(p.team)}</p></section>` : ''}
      ${p.role ? `<section><h3>My role</h3><p>${txt(p.role)}</p></section>` : ''}
      ${list('System', p.system)}
      ${list('Approach', p.approach)}
      ${list(p.confidential ? 'Main contributions' : 'Results', p.results)}
      ${p.documents && p.documents.length ? `<section><h3>Documents</h3><div class="pd-docs">${p.documents.map(d => `<a class="doc" href="${esc(d.url)}" target="_blank" rel="noopener"><span class="doc-icon" aria-hidden="true">${esc(d.type || 'PDF')}</span><span><b>${esc(d.title)}</b><small>${esc(d.type || 'PDF')}${p.sample ? ' · sample' : ''} · opens in a new tab</small></span></a>`).join('')}</div></section>` : ''}
      ${p.tools ? `<section><h3>Tools</h3><div class="pd-tools">${p.tools.map(t => `<span>${esc(t)}</span>`).join('')}</div></section>` : ''}
      ${p.links && p.links.length ? `<div class="pd-links">${p.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>` : ''}
      <nav class="pd-nav">
        <button type="button" data-go="${i - 1}">← ${esc(prev.title)}</button>
        <button type="button" data-go="${i + 1}">${esc(next.title)} →</button>
      </nav>`;
    dialog.scrollTop = 0;
    startSlides(p);
  }

  function open(i, push = true) {
    current = (i + PROJECTS.length) % PROJECTS.length;
    render(current);
    if (!dialog.open) dialog.showModal();
    const hash = '#project-' + PROJECTS[current].id;
    if (push && location.hash !== hash) history.replaceState(null, '', hash);
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  grid.addEventListener('click', e => {
    const card = e.target.closest('.project');
    if (card) open(PROJECTS.findIndex(p => p.id === card.dataset.id));
  });
  let lastTrigger = null;
  document.addEventListener('click', e => { if (e.target.closest('.project-open, .reel-tile')) lastTrigger = e.target.closest('.project-open, .reel-tile'); }, true);
  body.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) open(+go.dataset.go);
  });
  dialog.querySelector('.pd-close').addEventListener('click', close);
  // click on the backdrop (outside the panel) closes
  dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    stopSlides();
    history.replaceState(null, '', '#projects');
    // return focus to the card's button (or the reel tile) that opened the dialog
    const btn = lastTrigger && lastTrigger.classList.contains('project-open') ? lastTrigger
      : grid.querySelector(`[data-id="${PROJECTS[current]?.id}"] .project-open`);
    if (btn) btn.focus({ preventScroll: true });
    lastTrigger = null;
  });
  document.addEventListener('keydown', e => {
    if (!dialog.open) return;
    if (e.key === 'ArrowRight') open(current + 1);
    if (e.key === 'ArrowLeft') open(current - 1);
  });

  function fromHash() {
    const m = location.hash.match(/^#project-(.+)$/);
    if (!m) return;
    const i = PROJECTS.findIndex(p => p.id === decodeURIComponent(m[1]));
    if (i >= 0) {
      document.getElementById('projects').scrollIntoView();
      open(i, false);
    }
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
