import { NPDProject } from '../types/dashboard';

export const INITIAL_NPD_PROJECTS: NPDProject[] = [
  {
    id: 'npd-001',
    code: 'NPD-2026-081',
    title: 'AuraSense Pro IoT Thermal Node',
    description: 'Compact wireless sensor node with infrared thermopile array and sub-GHz mesh networking for continuous predictive maintenance.',
    category: 'IoT & Smart Devices',
    currentGate: 3,
    health: 'On Track',
    priority: 'Critical',
    projectLead: 'Dr. Elena Vance',
    engineeringLead: 'Kieran Hayes',
    startDate: '2025-10-15',
    targetLaunchDate: '2026-10-30',
    budgetAllocated: 450000,
    actualSpend: 295000,
    ecoCount: 3,
    notes: 'EVT completed with 98.4% thermal accuracy. DVT tooling currently underway with supplier in Taoyuan.',
    milestones: [
      { id: 'm1', name: 'Scoping & Patent Search', targetDate: '2025-11-20', actualDate: '2025-11-18', status: 'Completed' },
      { id: 'm2', name: 'PRD Sign-off & BOM Target', targetDate: '2026-01-15', actualDate: '2026-01-14', status: 'Completed' },
      { id: 'm3', name: 'EVT Bench Validation', targetDate: '2026-04-10', actualDate: '2026-04-08', status: 'Completed' },
      { id: 'm4', name: 'DVT Tooling T1 Trial', targetDate: '2026-07-22', status: 'Pending' },
      { id: 'm5', name: 'FCC / CE Telemetry Cert', targetDate: '2026-09-05', status: 'Pending' },
      { id: 'm6', name: 'Mass Production Ramp', targetDate: '2026-10-30', status: 'Pending' }
    ],
    deliverables: [
      { id: 'd1', title: 'Product Vision & Problem Statement', gate: 0, completed: true, requiredForSignoff: true, assignee: 'Elena Vance', dueDate: '2025-11-05' },
      { id: 'd2', title: 'Preliminary IP & Freedom-to-Operate Review', gate: 0, completed: true, requiredForSignoff: true, assignee: 'Elena Vance', dueDate: '2025-11-15' },
      { id: 'd3', title: 'PRD v1 Specifications', gate: 1, completed: true, requiredForSignoff: true, assignee: 'Kieran Hayes', dueDate: '2025-12-10' },
      { id: 'd4', title: 'Preliminary COGS & Supplier Quotations', gate: 1, completed: true, requiredForSignoff: true, assignee: 'Elena Vance', dueDate: '2026-01-05' },
      { id: 'd5', title: 'Schematic & 4-Layer PCB Layout', gate: 2, completed: true, requiredForSignoff: true, assignee: 'Kieran Hayes', dueDate: '2026-02-28' },
      { id: 'd6', title: 'Thermal Chamber Bench Testing', gate: 2, completed: true, requiredForSignoff: true, assignee: 'Kieran Hayes', dueDate: '2026-03-20' },
      { id: 'd7', title: 'DFMEA Revision 2 Release', gate: 3, completed: true, requiredForSignoff: true, assignee: 'Elena Vance', dueDate: '2026-05-15' },
      { id: 'd8', title: 'Injection Mold Tooling T1 Review', gate: 3, completed: false, requiredForSignoff: true, assignee: 'Marcus Chen', dueDate: '2026-07-22' },
      { id: 'd9', title: 'Firmware Over-The-Air (FOTA) Security Audit', gate: 3, completed: false, requiredForSignoff: false, assignee: 'Kieran Hayes', dueDate: '2026-08-10' },
      { id: 'd10', title: 'Production Validation Test (PVT) Protocol', gate: 4, completed: false, requiredForSignoff: true, assignee: 'Elena Vance', dueDate: '2026-09-01' }
    ],
    risks: [
      { id: 'r1', title: 'Thermal IR sensor lead time pushed to 18 weeks', category: 'Supply Chain', probability: 4, impact: 4, mitigation: 'Dual-sourced secondary vendor qualified in March; 5k buffer stock reserved.', owner: 'Elena Vance', status: 'Mitigating' },
      { id: 'r2', title: 'Antenna detuning inside IP67 sealed aluminium enclosure', category: 'Technical', probability: 3, impact: 3, mitigation: 'Ceramic patch antenna repositioned 4mm from top radome aperture.', owner: 'Kieran Hayes', status: 'Resolved' }
    ]
  },
  {
    id: 'npd-002',
    code: 'NPD-2026-044',
    title: 'Titanium C-Series High-Torque Actuator',
    description: 'Precision brushless harmonic gearbox actuator for surgical robotics and automated assembly arms with redundant absolute optical encoders.',
    category: 'Robotics & Actuation',
    currentGate: 2,
    health: 'At Risk',
    priority: 'Critical',
    projectLead: 'Marcus Chen',
    engineeringLead: 'Dr. Aris Thorne',
    startDate: '2025-11-01',
    targetLaunchDate: '2027-01-20',
    budgetAllocated: 720000,
    actualSpend: 340000,
    ecoCount: 6,
    notes: 'Thermal dissipation under peak load exceeds specification by 7°C. Heat pipe redesign required before Gate 3 sign-off.',
    milestones: [
      { id: 'm21', name: 'Market Gap & Surgical Arm Specs', targetDate: '2025-12-10', actualDate: '2025-12-08', status: 'Completed' },
      { id: 'm22', name: 'Finite Element Analysis (FEA) Stress', targetDate: '2026-02-15', actualDate: '2026-02-22', status: 'Completed' },
      { id: 'm23', name: 'Sub-system Bench Rig Build', targetDate: '2026-05-18', status: 'Delayed' },
      { id: 'm24', name: 'Gate 2 Feasibility Sign-off', targetDate: '2026-06-30', status: 'Pending' },
      { id: 'm25', name: 'Alpha Prototype 10,000-cycle life test', targetDate: '2026-10-15', status: 'Pending' }
    ],
    deliverables: [
      { id: 'd21', title: 'VOC & Surgical Robotics Spec Matrix', gate: 0, completed: true, requiredForSignoff: true, assignee: 'Marcus Chen', dueDate: '2025-11-20' },
      { id: 'd22', title: 'Business Case & Target Gross Margin Model', gate: 1, completed: true, requiredForSignoff: true, assignee: 'Marcus Chen', dueDate: '2026-01-10' },
      { id: 'd23', title: 'Harmonic Gearing FEA & Dynamic Backlash Report', gate: 2, completed: true, requiredForSignoff: true, assignee: 'Dr. Aris Thorne', dueDate: '2026-03-30' },
      { id: 'd24', title: 'Stator Thermal Dissipation Redesign', gate: 2, completed: false, requiredForSignoff: true, assignee: 'Dr. Aris Thorne', dueDate: '2026-06-15' },
      { id: 'd25', title: 'Gate 2 Architecture Review Signatures', gate: 2, completed: false, requiredForSignoff: true, assignee: 'Marcus Chen', dueDate: '2026-06-30' }
    ],
    risks: [
      { id: 'r21', title: 'Stator thermal dissipation bottleneck at 120Nm torque', category: 'Technical', probability: 5, impact: 4, mitigation: 'Integrating micro-finned conductive sleeve; second FEA simulation running this week.', owner: 'Dr. Aris Thorne', status: 'Mitigating' },
      { id: 'r22', title: 'Class II Medical Device MDR certification cycle extension', category: 'Regulatory', probability: 4, impact: 5, mitigation: 'Pre-submission meeting scheduled with notified body for Q3.', owner: 'Marcus Chen', status: 'Open' }
    ]
  },
  {
    id: 'npd-003',
    code: 'NPD-2026-019',
    title: 'EcoFlex Bio-Polymer IP68 Enclosure',
    description: 'Circular economy injection molded enclosure utilizing recycled ocean plastics and marine-grade biodegradable elastomer gaskets.',
    category: 'Materials & Enclosures',
    currentGate: 4,
    health: 'Critical',
    priority: 'High',
    projectLead: 'Sarah Lindqvist',
    engineeringLead: 'Henrik Visser',
    startDate: '2025-08-01',
    targetLaunchDate: '2026-08-15',
    budgetAllocated: 210000,
    actualSpend: 198000,
    ecoCount: 8,
    notes: 'Tooling sink marks detected at boss locations during T2 molding. Tool modification quotation pending approval.',
    milestones: [
      { id: 'm31', name: 'Material Rheology & Tensile Testing', targetDate: '2025-09-30', actualDate: '2025-09-25', status: 'Completed' },
      { id: 'm32', name: 'Industrial Design CAD Sign-off', targetDate: '2025-12-05', actualDate: '2025-12-10', status: 'Completed' },
      { id: 'm33', name: 'Tooling Steel Cut (P20 Steel)', targetDate: '2026-02-28', actualDate: '2026-03-05', status: 'Completed' },
      { id: 'm34', name: 'IP68 Submersion & UV Exposure Testing', targetDate: '2026-05-15', actualDate: '2026-05-20', status: 'Delayed' },
      { id: 'm35', name: 'Gate 4 PVT Quality Sign-off', targetDate: '2026-07-01', status: 'Pending' }
    ],
    deliverables: [
      { id: 'd31', title: 'Sustainable Resin Supplier Quality Audit', gate: 1, completed: true, requiredForSignoff: true, assignee: 'Sarah Lindqvist', dueDate: '2025-10-15' },
      { id: 'd32', title: 'MoldFlow Shrinkage & Warpage Analysis', gate: 2, completed: true, requiredForSignoff: true, assignee: 'Henrik Visser', dueDate: '2026-01-20' },
      { id: 'd33', title: 'Overmolding Gasket Peel Adhesion Test', gate: 3, completed: true, requiredForSignoff: true, assignee: 'Henrik Visser', dueDate: '2026-04-10' },
      { id: 'd34', title: 'T2 Tooling Rework & Sink Mark Elimination', gate: 4, completed: false, requiredForSignoff: true, assignee: 'Henrik Visser', dueDate: '2026-06-25' },
      { id: 'd35', title: 'Final Production Inspection Standard (PIS)', gate: 4, completed: false, requiredForSignoff: true, assignee: 'Sarah Lindqvist', dueDate: '2026-07-10' }
    ],
    risks: [
      { id: 'r31', title: 'Sink marks at wall transition exceeding cosmetic Class A spec', category: 'Technical', probability: 4, impact: 4, mitigation: 'Corring out screw boss roots by 0.6mm; EDM electrode scheduled.', owner: 'Henrik Visser', status: 'Mitigating' },
      { id: 'r32', title: 'Budget ceiling overrun due to tool modifications', category: 'Commercial', probability: 4, impact: 3, mitigation: 'Requesting contingency fund allocation of $14k from NPD steering committee.', owner: 'Sarah Lindqvist', status: 'Open' }
    ]
  },
  {
    id: 'npd-004',
    code: 'NPD-2026-092',
    title: 'OmniPulse Photoplethysmography Sensor',
    description: 'Multi-wavelength clinical PPG sensor for non-invasive blood perfusion monitoring with low-power ASIC front-end.',
    category: 'MedTech & Diagnostics',
    currentGate: 1,
    health: 'On Track',
    priority: 'High',
    projectLead: 'Arjun Patel',
    engineeringLead: 'Maya Lin',
    startDate: '2026-01-10',
    targetLaunchDate: '2027-05-15',
    budgetAllocated: 580000,
    actualSpend: 75000,
    ecoCount: 1,
    notes: 'Customer Advisory Board approved preliminary optical geometry. Simulation shows 35% SNR improvement over gen 1.',
    milestones: [
      { id: 'm41', name: 'Clinical Unmet Need Definition', targetDate: '2026-02-15', actualDate: '2026-02-12', status: 'Completed' },
      { id: 'm42', name: 'Ray-Tracing Optical Simulation', targetDate: '2026-04-30', actualDate: '2026-04-28', status: 'Completed' },
      { id: 'm43', name: 'Gate 1 Business Case Sign-off', targetDate: '2026-06-15', status: 'Pending' },
      { id: 'm44', name: 'ASIC Silicon Tapeout', targetDate: '2026-11-20', status: 'Pending' }
    ],
    deliverables: [
      { id: 'd41', title: 'Clinical Partner Stakeholder Interviews', gate: 0, completed: true, requiredForSignoff: true, assignee: 'Arjun Patel', dueDate: '2026-02-01' },
      { id: 'd42', title: 'Patent Freedom to Operate - 4 Wavelength Array', gate: 0, completed: true, requiredForSignoff: true, assignee: 'Maya Lin', dueDate: '2026-03-01' },
      { id: 'd43', title: 'Comprehensive Business Plan & Pricing Strategy', gate: 1, completed: false, requiredForSignoff: true, assignee: 'Arjun Patel', dueDate: '2026-06-05' },
      { id: 'd44', title: 'Clinical Trial Phase 0 Protocol Draft', gate: 1, completed: false, requiredForSignoff: false, assignee: 'Arjun Patel', dueDate: '2026-06-12' }
    ],
    risks: [
      { id: 'r41', title: 'Semiconductor foundry wafer slot availability', category: 'Supply Chain', probability: 3, impact: 4, mitigation: 'Engaged packaging house early with reserved wafer shuttle run.', owner: 'Maya Lin', status: 'Mitigating' }
    ]
  },
  {
    id: 'npd-005',
    code: 'NPD-2026-037',
    title: 'SolarDrive MPPT Power Converter v2',
    description: 'High-efficiency 99.2% Silicon Carbide (SiC) maximum power point tracking inverter module with liquid cooling jacket.',
    category: 'CleanTech & Power',
    currentGate: 4,
    health: 'On Track',
    priority: 'Critical',
    projectLead: 'Hanna Becker',
    engineeringLead: 'Stefan Wolf',
    startDate: '2025-07-01',
    targetLaunchDate: '2026-07-31',
    budgetAllocated: 360000,
    actualSpend: 310000,
    ecoCount: 4,
    notes: 'UL 1741 and IEEE 1547 testing passed first pass! Production ramp at Dresden facility on track for early August.',
    milestones: [
      { id: 'm51', name: 'SiC Power Stage Architecture', targetDate: '2025-08-30', actualDate: '2025-08-28', status: 'Completed' },
      { id: 'm52', name: 'Thermal Loop Verification', targetDate: '2025-11-20', actualDate: '2025-11-22', status: 'Completed' },
      { id: 'm53', name: 'Grid Compliance Pre-Compliance', targetDate: '2026-02-15', actualDate: '2026-02-14', status: 'Completed' },
      { id: 'm54', name: 'Formal UL 1741 Certification', targetDate: '2026-05-10', actualDate: '2026-05-09', status: 'Completed' },
      { id: 'm55', name: 'Gate 4 Sign-off & Factory Release', targetDate: '2026-06-30', status: 'Pending' }
    ],
    deliverables: [
      { id: 'd51', title: 'Thermal Simulation in ANSYS Fluent', gate: 2, completed: true, requiredForSignoff: true, assignee: 'Stefan Wolf', dueDate: '2025-10-15' },
      { id: 'd52', title: 'Firmware Grid Code Fault Protection Protocol', gate: 3, completed: true, requiredForSignoff: true, assignee: 'Stefan Wolf', dueDate: '2026-01-30' },
      { id: 'd53', title: 'UL 1741 Safety Test Certificate', gate: 4, completed: true, requiredForSignoff: true, assignee: 'Hanna Becker', dueDate: '2026-05-09' },
      { id: 'd54', title: 'Automated End-of-Line (EOL) Tester Validation', gate: 4, completed: false, requiredForSignoff: true, assignee: 'Stefan Wolf', dueDate: '2026-06-20' }
    ],
    risks: [
      { id: 'r51', title: 'Cooling jacket CNC machining throughput at scale', category: 'Technical', probability: 2, impact: 3, mitigation: 'Secondary die-cast tooling ordered to reduce cycle time by 45%.', owner: 'Stefan Wolf', status: 'Resolved' }
    ]
  },
  {
    id: 'npd-006',
    code: 'NPD-2026-105',
    title: 'QuantumFlow Microfluidic Cartridge',
    description: 'Disposable laser-welded cyclic olefin polymer (COP) microfluidics for rapid nucleic acid extraction in under 7 minutes.',
    category: 'MedTech & Diagnostics',
    currentGate: 0,
    health: 'On Track',
    priority: 'Medium',
    projectLead: 'Kenji Sato',
    engineeringLead: 'Dr. Chloe Dubois',
    startDate: '2026-04-01',
    targetLaunchDate: '2027-11-30',
    budgetAllocated: 180000,
    actualSpend: 24000,
    ecoCount: 0,
    notes: 'Laser transmission welding parameter study initiated. Micro-channel capillary flow verified in preliminary prototypes.',
    milestones: [
      { id: 'm61', name: 'Preliminary Channel Geometry Bench', targetDate: '2026-06-15', status: 'Pending' },
      { id: 'm62', name: 'IP Patent Landscaping', targetDate: '2026-07-30', status: 'Pending' },
      { id: 'm63', name: 'Gate 0 Gate Review Meeting', targetDate: '2026-08-20', status: 'Pending' }
    ],
    deliverables: [
      { id: 'd61', title: 'Target Pathogen Sensitivity & Limit of Detection (LOD)', gate: 0, completed: true, requiredForSignoff: true, assignee: 'Kenji Sato', dueDate: '2026-05-01' },
      { id: 'd62', title: 'Cyclic Olefin Polymer Laser Welding Feasibility', gate: 0, completed: false, requiredForSignoff: true, assignee: 'Dr. Chloe Dubois', dueDate: '2026-07-01' },
      { id: 'd63', title: 'Gate 0 Charter & Committee Signatures', gate: 0, completed: false, requiredForSignoff: true, assignee: 'Kenji Sato', dueDate: '2026-08-20' }
    ],
    risks: [
      { id: 'r61', title: 'Laser absorption inconsistency across transparent COP layers', category: 'Technical', probability: 3, impact: 4, mitigation: 'Testing specialized infrared absorbing clear dopant polymer masterbatch.', owner: 'Dr. Chloe Dubois', status: 'Open' }
    ]
  }
];
