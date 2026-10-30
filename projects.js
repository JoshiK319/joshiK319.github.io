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
   unpublished  true = marks the card Confidential because the paper is not yet published
   problem      "Problem and motivation" paragraphs (array of strings)
   overview     paragraphs (array of strings)
   specs        key numbers: [{ value: '450 V', label: 'DC bus' }]
   team         who the work was done with (string)
   role         what Kishor personally did (string)
   system, approach, results   bullet lists (arrays of strings)
   next         "Next steps" bullet list (array of strings)
   advantages   "Why process the rectified signal directly" bullet list (array of strings)
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
    summary: 'A multivariable current controller that builds the digital delay into the model. On a GaN-based PMSM drive it lifted the maximum stable speed from 33 krpm to 95 krpm, a 187.9% improvement over conventional control.',
    images: [
      { src: 'assets/projects/ultra-high-speed/drive-hardware.jpg', caption: 'Experimental drive: TI F28379D LaunchPad with a BOOSTXL-3PhGaN inverter, Hall-sensor interface circuit, PMSM motor, DC and 3-phase supplies, and a current probe.' },
      { src: 'assets/projects/ultra-high-speed/hil-setup.jpg', caption: 'Real-time validation setup: PLECS RT Box running the drive model, TI C2000 LaunchPad running the control firmware, and an oscilloscope.' },
      { src: 'assets/projects/ultra-high-speed/experiment-siso-padc.jpg', caption: 'Experiment, with the speed ramped up until the drive goes unstable: decoupled-SISO control fails at 33 krpm, and adding phase-advance delay compensation (PADC) moves that to 43 krpm. Panels: (a) speed, (b) phase and q-axis current, (c) control voltage Vq.' },
      { src: 'assets/projects/ultra-high-speed/experiment-mimo.jpg', caption: 'Experiment, same test: MIMO control reaches 51 krpm before instability. With the delay modeled, the drive keeps running until the control voltage saturates at 95 krpm.' },
      { src: 'assets/projects/ultra-high-speed/pole-selection.jpg', caption: 'Speed-loop design by pole selection, for the PI and P-I controllers. The shaded region holds the closed-loop poles that meet the limits, and the green check marks the selected pole. Design 1: fluctuation and overshoot ≤ 17%, peak time 0.04–0.06 s. Design 2: fluctuation ≤ 17%, damping 0.7–0.85, peak time 0.04–0.06 s. Click the picture to open it full size.' },
      { src: 'assets/projects/ultra-high-speed/heatmaps-design1.jpg', caption: 'Design 1: overshoot, fluctuation, settling time and rise time across the allowed pole region, for PI and P-I. Selected gains: Kp = 0.0028 and Ki = 0.062 (PI); Kp = 0.0043 and Ki = 0.369 (P-I).' },
      { src: 'assets/projects/ultra-high-speed/heatmaps-design2.jpg', caption: 'Design 2: the same four metrics over the pole region set by the damping limits. Selected gains: Kp = 0.0023 and Ki = 0.0589 (PI); Kp = 0.0045 and Ki = 0.2356 (P-I).' }
    ],
    problem: [
      'High-speed permanent magnet synchronous motors (PMSMs) are increasingly used in turbochargers, compressors and spindle motors because of their high power density and efficiency. As speed goes up, the inverter switches only a few times per electrical cycle (a low ratio of switching to fundamental frequency), and two linked problems get worse: digital control delay and cross-coupling between the d- and q-axis current loops.',
      'Left uncompensated, these effects degrade current regulation, narrow the stability margin and cap the speed the drive can reach. Conventional approaches handle them in separate stages, using feedforward or phase-advance delay compensation plus a decoupling network.'
    ],
    overview: [
      'This research proposes a multivariable (MIMO) current control framework that treats delay and cross-coupling together. The delay model is built directly into the state-space representation of the system and compensated inside the feedback path, while the multivariable structure accounts for d-q axis coupling on its own, with no separate decoupling network.',
      'The controller is validated in simulation and on a TI F28379D-based PMSM drive platform switching at 40 kHz. The drive uses a GaN inverter feeding a Maxon motor with Hall-sensor feedback. Control is designed in MATLAB, validated in real time on a PLECS RT Box FPGA model, and then deployed as embedded code.'
    ],
    specs: [
      { value: '95 krpm', label: 'Maximum stable speed (proposed controller)' },
      { value: '+187.9%', label: 'Over the 33 krpm decoupled-SISO baseline' },
      { value: '40 kHz', label: 'Switching frequency' },
      { value: '100 krpm', label: 'Design speed' }
    ],
    team: 'Research with M. Karimi-Ghartemani and S. Choi at Mississippi State University, co-authors on the related publications.',
    role: 'Designs the control strategies, including delay-aware MIMO current control, builds the drive system, runs HIL validation on PLECS RT Box, and implements the algorithms as embedded code in Code Composer Studio.',
    system: ['GaN-based inverter (BOOSTXL-3PhGaN)', 'Maxon PMSM with Hall-sensor feedback', 'TI C2000 F28379D LaunchPad controller', 'PLECS RT Box for real-time HIL'],
    approach: [
      'Designed FOC-based control strategies for operation up to 100,000 rpm',
      'Put the digital delay into the state-space model and designed a delay-integrated MIMO current controller that handles d-q coupling without a decoupling network',
      'Compared four controllers on the same platform: decoupled-SISO, SISO with phase-advance delay compensation (PADC), MIMO, and the proposed delay-integrated MIMO',
      'Designed the speed-loop PI and P-I controllers by choosing closed-loop poles inside a region set by overshoot, fluctuation, damping and peak-time limits, and compared the candidates with heat maps of overshoot, fluctuation, settling time and rise time',
      'Validated state-of-the-art and proposed methods in real time on a PLECS RT Box FPGA model',
      'Implemented the algorithms as embedded code on the microcontroller and moved from simulation to physical hardware'
    ],
    results: [
      'Maximum stable speed rose from 33 krpm (decoupled-SISO) to 43 krpm (with PADC), 51 krpm (MIMO) and 95 krpm (proposed delay-integrated MIMO)',
      'A 187.9% improvement over the conventional baseline, with 95,000 rpm reached on hardware',
      'With the delay modeled, the drive no longer goes unstable: it runs until the control voltage saturates at 95 krpm',
      'Robust multivariable current control approach submitted to IEEE Transactions on Industrial Electronics (under review)'
    ],
    next: [
      'Studying how output LC filters affect closed-loop stability: they improve current waveform quality, but the added filter pole shifts the system poles and narrows the stability margin of the proposed controller',
      'Addressing that trade-off directly within the multivariable design framework',
      'Extending the approach toward sensorless operation and higher operating speeds'
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
    images: [
      { src: 'assets/projects/high-speed-pmsm/test-setup.jpg', caption: 'Test setup: top view of the lab with the chiller, inverter and current probes; the inverter set-up with its LaunchPad controller; and the metal containment safe box around the PMSM, with air inlet and outlet, coolant lines, camera and the 3-phase line.' },
      { src: 'assets/projects/high-speed-pmsm/startup-30krpm.jpg', caption: 'Start-up and speed steps up to 30,000 rpm. The drive runs open loop for the 0–500 rpm phase, then closed loop from 501 rpm, with zoomed views of the transition (Zoom-1 and Zoom-2).' },
      { src: 'assets/projects/high-speed-pmsm/response-50krpm.jpg', caption: 'Speed steps up to 50 krpm at a 5,000 rpm/s ramp rate, and the matching phase currents. The current fluctuates at 50 krpm (80 A peak); the figure lists probable reasons.' }
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
    unpublished: true,
    tag: 'Mississippi State',
    period: 'Ph.D. research',
    title: 'Power Factor Correction',
    summary: 'A phase-locked loop that tracks a rectified ac signal directly, and a boost PFC controller built on it, validated in simulation and in real-time HIL with a regulated 400 V DC output.',
    images: [
      { src: 'assets/projects/pfc/boost-pfc-circuit.png', caption: 'Boost PFC converter: ac source, diode bridge, boost inductor L, switch Q, diode D, output capacitor Co and load, with the PFC controller driving Q.' },
      { src: 'assets/projects/pfc/hil-setup.jpg', caption: 'Real-time validation setup: PLECS RT Box running the converter model, TI C2000 LaunchPad running the controller, an oscilloscope and the host computer.' },
      { src: 'assets/projects/pfc/scope-1.png', caption: 'Oscilloscope capture: input voltage (blue, 200 V/div), input current (magenta, 10 A/div) and output voltage (gold, 50 V/div) as the load steps up. The input current rises in steps with the load.' },
      { src: 'assets/projects/pfc/scope-2.png', caption: 'Oscilloscope capture of the same load-step test, run again, with the output voltage showing a slightly different transient.' },
      { src: 'assets/projects/pfc/scope-3.png', caption: 'Oscilloscope capture of the same load-step test, one more run.' },
      { src: 'assets/projects/pfc/scope-4.png', caption: 'Longer oscilloscope capture: the input current steps up and then back down while the output voltage sags and recovers.' }
    ],
    problem: [
      'A plain diode rectifier draws current in short, distorted pulses. That gives a poor power factor and high harmonic content, wastes distribution capacity and can break grid harmonic limits such as IEC 61000-3-2.',
      'A PFC stage shapes the input current to follow the grid voltage, but only if its control stays accurately synchronized to the grid and keeps the DC output stable as conditions change.',
      'Rectified ac signals also appear in many other applications, such as rectifier and inverter systems. Existing methods usually unfold the rectified signal or treat it as a double-frequency signal, and that means sensing the actual ac voltage and conditioning it for the A/D converter and DSP.'
    ],
    overview: [
      'This project proposes an enhanced phase-locked loop for rectified signals (R-ePLL), which processes a rectified ac signal directly, without unfolding it or treating it as a double-frequency signal.',
      'Built on the R-ePLL, a new controller for a boost PFC (B-PFC) converter combines a nonlinear term derived from the R-ePLL with two simple proportional feedback loops, so the converter performs robustly. The theory and analysis are backed by MATLAB/Simulink simulations and real-time HIL validation on a PLECS RT Box.'
    ],
    specs: [
      { value: '400 V', label: 'Regulated DC output' },
      { value: 'R-ePLL', label: 'Reads the rectified signal directly' },
      { value: 'Boost', label: 'PFC converter topology' },
      { value: '2', label: 'Simple proportional feedback loops' }
    ],
    role: 'Developed the PFC control strategy and the R-ePLL, designed the control architecture, and ran the real-time HIL validation.',
    approach: [
      'Developed the rectified ePLL (R-ePLL) to synchronize directly to the rectified grid voltage',
      'Designed a boost PFC controller that combines a nonlinear R-ePLL term with two proportional feedback loops, regulating the DC output at 400 V while improving power factor and reducing input current harmonics',
      'Analyzed the R-ePLL and the controller theoretically and simulated them in MATLAB/Simulink',
      'Performed real-time HIL validation on PLECS RT Box for rapid prototyping and verification, and tested the control under dynamic operating conditions'
    ],
    advantages: [
      'The sensed voltage has a higher signal-to-noise ratio',
      'No signal conditioning is needed to level-shift an ac signal for the A/D converter and DSP, and the problems that come with it go away',
      'It uses the full effective resolution range of the A/D converter, so quantization errors are lower',
      'There is no need to measure the actual ac grid voltage, which simplifies the control and power-circuit grounding'
    ],
    results: ['DC output regulated at 400 V', 'Robust boost PFC performance from a nonlinear R-ePLL term and only two simple proportional feedback loops', 'Validated in simulation and in real-time HIL'],
    tools: ['MATLAB/Simulink', 'PLECS', 'RT Box', 'R-ePLL', 'Boost PFC']
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
    images: [
      { src: 'assets/cummins/typhoon-hil-interface.jpg', caption: 'TI C2000 LaunchPad mounted on a Typhoon HIL interface board, wired into the real-time simulator for hardware-in-the-loop testing.' },
      { src: 'assets/cummins/speedgoat.jpg', caption: 'Speedgoat real-time target machine on the test bench, used for real-time testing with the LaunchPad controller.' },
      { src: 'assets/Cummins - Fridley Plant.jpg', caption: 'Cummins facility in Fridley, Minnesota, where the internship took place.' }
    ],
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
    title: 'PV-STATCOM: Solar Inverter as a Night-Time STATCOM',
    summary: 'A control scheme that lets a grid-connected solar inverter supply reactive power at night, and share its capacity with active power by day, without exceeding its rating.',
    images: [
      { src: 'assets/projects/pv-statcom/power-results.jpg', caption: 'Simulation result: as irradiance falls, active power drops and reactive power rises, while total power stays constant.' },
      { src: 'assets/projects/pv-statcom/system-block-diagram.jpg', caption: 'Grid-connected PV system with the PV-STATCOM inverter.' },
      { src: 'assets/projects/pv-statcom/control-logic.jpg', caption: 'PV-STATCOM control logic: DC-link regulation, d-q current references and hysteresis current control.' },
      { src: 'assets/projects/pv-statcom/simulink-model.jpg', caption: 'MATLAB/Simulink model of the system.' },
      { src: 'assets/projects/pv-statcom/statcom-var-generator.jpg', caption: 'STATCOM operation as a reactive power (VAR) generator.' },
      { src: 'assets/projects/pv-statcom/hysteresis-tracking.jpg', caption: 'Principle of hysteresis band current tracking.' },
      { src: 'assets/projects/pv-statcom/current-tracking.jpg', caption: 'Inverter current tracking its reference inside the hysteresis band.' },
      { src: 'assets/projects/pv-statcom/id-current.jpg', caption: 'Active-axis current (Id): high when sunlight is available, low at night.' },
      { src: 'assets/projects/pv-statcom/iq-current.jpg', caption: 'Reactive-axis current (Iq): high at night when the inverter works as a STATCOM.' }
    ],
    problem: [
      'A solar inverter is sized for peak sunshine, but it sits idle at night and runs below its rating on cloudy days. Meanwhile the grid still needs reactive power to hold voltage, and utilities usually buy capacitor banks or dedicated STATCOM hardware for it.',
      'The question behind this work: can the inverter that is already installed provide that reactive power when the sun is not available?'
    ],
    overview: [
      'This project developed a control scheme that turns a grid-connected PV inverter into a STATCOM when there is little or no sunlight. The inverter never supplies more apparent power than its VA rating: as active power falls, reactive power takes its place.',
      'There are two modes. In partial PV-STATCOM mode (daytime) the inverter injects solar power and uses any spare capacity for reactive power. In full STATCOM mode (night) the PV array is disconnected and the whole inverter supplies reactive power. Irradiance below 200 W/m² is treated as night.',
      'This was Kishor\'s bachelor\'s thesis. It was published in the Journal of the Institute of Engineering (Vol. 15, No. 3, 2019) with Indraman Tamrakar, Pranisha Karki, Sagar Bimali and Tara Aryal.'
    ],
    specs: [
      { value: '82.5 kVA', label: 'Inverter rating' },
      { value: '700 V', label: 'DC-link reference' },
      { value: '200 W/m²', label: 'Night threshold' },
      { value: '10%', label: 'Hysteresis band' }
    ],
    team: 'Thesis group of five at the Institute of Engineering, Pulchowk Campus, Tribhuvan University.',
    role: 'Thesis project and co-author. Designed the switching and control logic and built the MATLAB/Simulink models.',
    system: [
      'PV array of SunPower SPR-315E modules with a boost converter and a P&O MPPT',
      'Three-phase inverter with 10 mF DC-link capacitor, 4 mH boost inductor and a 0.28 mH coupling inductor',
      'Two circuit breakers that connect the PV array by day and disconnect it at night'
    ],
    approach: [
      'Developed dual-function control based on d-q theory, with a DC-link PI controller (Vdc reference 700 V) setting the active-power reference',
      'Kept the target current at the square root of Id² plus Iq², so total VA stays constant while active and reactive power trade off',
      'Used a hysteresis band current controller (band set to 10% of the reference current) to generate the inverter switching pulses',
      'Designed the switching logic that changes mode as irradiance crosses the 200 W/m² threshold',
      'Built and tested the full system in MATLAB/Simulink 2016a under changing irradiance'
    ],
    results: [
      'DC-link voltage was held near its 700 V reference through the changes in irradiance',
      'Total apparent power stayed constant while active power fell and reactive power rose as sunlight dropped',
      'The reactive-axis current (Iq) was highest when the active-axis current (Id) was lowest, as intended',
      'No extra capacitor bank or STATCOM is needed, which makes it most economical where load factor is high and reactive power demand is fairly constant',
      'Results are from simulation only; no hardware was built',
      'Published in the Journal of the Institute of Engineering, vol. 15, no. 3, pp. 411–419 (2019)'
    ],
    tools: ['MATLAB/Simulink', 'd-q control', 'Hysteresis current control', 'PI control', 'P&O MPPT'],
    links: [{ label: 'Paper (DOI)', url: 'https://doi.org/10.3126/jie.v15i3.32762' }]
  },
  {
    id: 'wind-solar-hybrid',
    category: 'power-systems',
    tag: 'Undergraduate research',
    period: 'IOE Pulchowk · 2019',
    title: 'Wind–Solar Hybrid Power System for Off-Grid Nepal',
    summary: 'A case study and MATLAB/Simulink model of a wind–solar–battery mini-grid that electrifies 83 households in a village in Sindhuli, Nepal.',
    images: [
      { src: 'assets/projects/wind-solar/system-diagram.jpg', caption: 'Block diagram of the hybrid system: PV arrays, two wind turbines, battery bank and inverter (source: AEPC, Nepal).' },
      { src: 'assets/projects/wind-solar/site-map.jpg', caption: 'The site: Chisapani, Hariharpur Gadi village, Sindhuli District, at 355 m elevation.' },
      { src: 'assets/projects/wind-solar/village-load-curve.jpg', caption: 'Daily load curve of the village, with the evening peak of about 10.6 kW.' },
      { src: 'assets/projects/wind-solar/simulink-model.jpg', caption: 'MATLAB/Simulink model: PV array with boost converter and MPPT, PMSG wind turbine, DC link and inverter.' },
      { src: 'assets/projects/wind-solar/solar-inputs.jpg', caption: 'Solar PV inputs: irradiance, temperature, voltage and current.' },
      { src: 'assets/projects/wind-solar/solar-power.jpg', caption: 'Active power from the solar PV system.' },
      { src: 'assets/projects/wind-solar/total-power.jpg', caption: 'Total active power from the wind–solar hybrid system.' },
      { src: 'assets/projects/wind-solar/load-power.jpg', caption: 'Active and reactive power at the load.' }
    ],
    problem: [
      'Many villages in Nepal are far from the national grid, and extending lines to a few households is expensive. Diesel generators are a poor answer because of fuel cost, emissions and short life.',
      'Wind and solar tend to complement each other: summer has strong sun and weak wind, winter the reverse. Together with a battery bank they can serve a village reliably, if the system is sized and modeled well.'
    ],
    overview: [
      'This paper presents a case study and a model of the wind–solar hybrid mini-grid at Chisapani, Hariharpur Gadi village, Sindhuli District. The system was built in 2017 with Asian Development Bank financing, to serve 83 households.',
      'It produces about 110 kWh per day against a village demand of 87 kWh per day, with wind and solar each meant to supply half of the annual energy. The evening peak is about 10.6 kW.',
      'Kishor was a co-author. The work was published in the Journal of the Institute of Engineering (Vol. 15, No. 3, 2019) with Khagendra Bahadur Thapa, Arbin Maharjan, Kishor Kaphle and Tara Aryal.'
    ],
    specs: [
      { value: '20 kW', label: 'Wind (2 × 10 kW)' },
      { value: '15 kWp', label: 'Solar (50 × 300 Wp)' },
      { value: '45 kVA', label: 'Inverter' },
      { value: '110 kWh', label: 'Daily energy yield' }
    ],
    team: 'Department of Electrical Engineering, Pulchowk Campus, Institute of Engineering, Tribhuvan University.',
    role: 'Co-author. Contributed to the system modeling and the MATLAB/Simulink simulation.',
    system: [
      '2 wind turbines of 10 kW each and 50 PV modules of 300 Wp each',
      'Battery bank of 120 VRLA gel cells (2 V, 100 Ah each), 240 V in total',
      'One 45 kVA DC/AC inverter feeding 400 V three-phase and 230 V single-phase lines of about 2.9 km'
    ],
    approach: [
      'Collected the site data: load curves for households, businesses and street lights, plus solar and wind resource data',
      'Modeled the wind turbine (power coefficient and tip-speed ratio), the PV array and the battery in MATLAB/Simulink 2016',
      'Connected a PV array through a boost converter with MPPT, and a PMSG wind turbine through a machine-side converter, to a common DC link and inverter',
      'Looked for ways to improve the system, such as moving business load to off-peak hours and using the hybrid inverters as STATCOMs'
    ],
    results: [
      'The simulated system delivered 30 kW of active power (15 kW wind, 15 kW solar) to a load of about 20 kW and 5.5 kVAr',
      'The solar model ran at 750 W/m² and 35 °C, with about 290 V and 50 A, and followed the irradiance changes while the DC-link voltage stayed near 1 p.u.',
      'The case study shows 110 kWh/day of generation against 87 kWh/day of demand',
      'Published in the Journal of the Institute of Engineering, vol. 15, no. 3, pp. 360–367 (2019)'
    ],
    next: [
      'Shift business demand to off-peak hours (about 9–13 h) to flatten the load curve',
      'Use the hybrid inverters as STATCOMs to supply the village\'s reactive power and support voltage',
      'Encourage rooftop PV, backed by subsidies and technical support'
    ],
    tools: ['MATLAB/Simulink', 'PMSG wind model', 'PV and MPPT modeling', 'Load analysis'],
    links: [{ label: 'Paper (DOI)', url: 'https://doi.org/10.3126/jie.v15i3.32223' }]
  },
  {
    id: 'controlled-rectifier',
    category: 'power-electronics',
    tag: 'Undergraduate',
    period: 'IOE Pulchowk',
    title: 'Controlled Rectifier Study',
    summary: 'A GTO-based electronic load controller that reduces harmonics and improves power factor in an isolated micro-grid, compared with a thyristor design.',
    images: [
      { src: 'assets/projects/controlled-rectifier/simulink-model.jpg', caption: 'MATLAB/Simulink model: synchronous generator, GTO-based controller, PI regulation, firing signal generator and dump load.' },
      { src: 'assets/projects/controlled-rectifier/voltage-waveform.jpg', caption: 'Simulated voltage waveform of the GTO-based controller over 0.06 s (peak about 300 V).' }
    ],
    problem: [
      'In a small isolated micro-grid, the rectifier and phase-controlled loads inject harmonics that distort the voltage for every other user and lower the power factor. The choice of switching device directly affects power quality.'
    ],
    overview: [
      'The goal of the project was to reduce harmonics and improve the power factor. I built a GTO-based electronic load controller (ELC) for an isolated generator with a dump load, and compared it with a thyristor-based controller for micro-grid applications.'
    ],
    role: 'Built both rectifier models and carried out the comparison.',
    system: [
      'Synchronous machine as the isolated source, with the user load and a dump load',
      'GTO-based controller with a firing signal generator',
      'PI controller and low-pass filter regulating the controller'
    ],
    approach: [
      'Developed MATLAB/Simulink models of both rectifiers and validated their steady-state and transient response',
      'Investigated harmonic content, power factor variation and switching characteristics across firing angles',
      'Analyzed trade-offs between the topologies in efficiency and output voltage quality'
    ],
    tools: ['MATLAB/Simulink', 'GTO / thyristor', 'PI control', 'Harmonic analysis']
  },
  {
    id: 'load-flow',
    category: 'power-systems',
    tag: 'Industry · Prism International',
    period: 'Project Engineer · 2019 – 2021',
    title: 'Load Flow Analysis',
    summary: 'Newton–Raphson load flow in Python and ETAP for power distribution system analysis.',
    art: 'grid',
    overview: [
      'Developed and implemented Newton–Raphson load flow algorithms in Python and ETAP for power distribution system analysis.'
    ],
    approach: [
      'Analyzed voltage profiles, real and reactive power flow, and system losses across multi-bus network configurations',
      'Evaluated system performance under varying load conditions, identifying voltage stability limits and loss distribution',
      'Validated simulation results across Python and ETAP to ensure the accuracy and reliability of the power flow solutions'
    ],
    tools: ['Python', 'ETAP', 'Newton–Raphson']
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
        <div class="cover">${cardCover(p)}${p.confidential || p.unpublished ? '<span class="badge">Confidential</span>' : ''}</div>
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
      ${p.unpublished ? `<p class="pd-note">The paper on this work has not been published yet, so this project is confidential.</p>` : ''}
      ${p.sample ? `<p class="pd-note">Pictures, documents and parts of the description on this page are samples for now${hasPh(p) ? `; values with a <mark class="ph">dashed underline</mark> are sample figures` : ''}. They will be replaced with project material.</p>`
        : hasPh(p) ? `<p class="pd-note">Values with a <mark class="ph">dashed underline</mark> are sample figures and will be updated.</p>` : ''}
      ${slideshow(p)}
      ${p.specs ? `<div class="pd-specs">${p.specs.map(s => `<div><b>${txt(s.value)}</b><span>${txt(s.label)}</span></div>`).join('')}</div>` : ''}
      ${paras('Problem and motivation', p.problem)}
      ${paras(p.confidential ? 'Role' : 'Overview', p.overview)}
      ${p.team ? `<section><h3>Research team</h3><p>${txt(p.team)}</p></section>` : ''}
      ${p.role ? `<section><h3>My role</h3><p>${txt(p.role)}</p></section>` : ''}
      ${list('System', p.system)}
      ${list('Approach', p.approach)}
      ${list('Why process the rectified signal directly', p.advantages)}
      ${list(p.confidential ? 'Main contributions' : 'Results', p.results)}
      ${list('Next steps', p.next)}
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
