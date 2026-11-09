export type GateNumber = 0 | 1 | 2 | 3 | 4 | 5;

export interface GateDefinition {
  gateNumber: GateNumber;
  name: string;
  shortName: string;
  focus: string;
  standardDeliverables: string[];
}

export const STAGE_GATES: GateDefinition[] = [
  {
    gateNumber: 0,
    name: 'Discovery & Scoping',
    shortName: 'Gate 0: Scoping',
    focus: 'Problem definition, IP landscape & market fit',
    standardDeliverables: ['Product Vision & Problem Statement', 'Preliminary IP & Freedom-to-Operate Review', 'Target User Persona & VOC']
  },
  {
    gateNumber: 1,
    name: 'Concept & Business Case',
    shortName: 'Gate 1: Concept',
    focus: 'Value proposition, financial payback & system specs',
    standardDeliverables: ['Product Requirement Document (PRD v1)', 'Preliminary BOM & COGS Estimate', 'Financial Model & ROI Forecast']
  },
  {
    gateNumber: 2,
    name: 'Feasibility & Architecture',
    shortName: 'Gate 2: Feasibility',
    focus: 'Sub-system architecture, risk assessment & proofs-of-concept',
    standardDeliverables: ['System Architecture & Schematic', 'Design FMEA (DFMEA Initial)', 'Proof-of-Concept Hardware Bench Test']
  },
  {
    gateNumber: 3,
    name: 'Development & DVT',
    shortName: 'Gate 3: Development',
    focus: 'Detailed design, prototype tooling, firmware & EVT/DVT testing',
    standardDeliverables: ['3D CAD Freeze & Drawing Release', 'EVT & DVT Test Protocol Sign-off', 'Supplier Sourcing & Long-Lead POs']
  },
  {
    gateNumber: 4,
    name: 'Validation & PVT',
    shortName: 'Gate 4: Validation',
    focus: 'Pilot line build, regulatory certs (CE/FCC/UL), tool qualification',
    standardDeliverables: ['Production Validation Test (PVT) Run', 'Compliance & Safety Certifications (UL/CE/FCC)', 'Packaging & User Guide Release']
  },
  {
    gateNumber: 5,
    name: 'Commercial Launch & Ramp',
    shortName: 'Gate 5: Launch',
    focus: 'Volume production, field quality tracking & market release',
    standardDeliverables: ['Mass Production Quality Acceptance', 'Channel Inventory Fill', 'Post-Launch Review & Lessons Learned']
  }
];

export type HealthStatus = 'On Track' | 'At Risk' | 'Critical' | 'Completed' | 'On Hold';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type ProjectCategory = 
  | 'IoT & Smart Devices'
  | 'Robotics & Actuation'
  | 'Materials & Enclosures'
  | 'MedTech & Diagnostics'
  | 'CleanTech & Power'
  | 'Consumer Electronics';

export interface Deliverable {
  id: string;
  title: string;
  gate: GateNumber;
  completed: boolean;
  requiredForSignoff: boolean;
  assignee: string;
  dueDate: string;
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'Technical' | 'Supply Chain' | 'Regulatory' | 'Commercial' | 'Resource';
  probability: 1 | 2 | 3 | 4 | 5; // 1 lowest, 5 highest
  impact: 1 | 2 | 3 | 4 | 5;      // 1 lowest, 5 highest
  mitigation: string;
  owner: string;
  status: 'Open' | 'Mitigating' | 'Resolved';
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  actualDate?: string;
  status: 'Pending' | 'Completed' | 'Delayed';
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  deliverableId?: string;
  dataUrl?: string; // Base64 data for real preview and download
}

export interface ECORecord {
  id: string;
  projectId: string;
  ecoNumber: string;
  title: string;
  description: string;
  disposition: 'Scrap & Rework' | 'Use As Is' | 'Tooling Modification' | 'Firmware Update' | 'Drawing Revision';
  costImpact: number;
  status: 'Open' | 'Under Review' | 'Approved' | 'Implemented' | 'Rejected';
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
}

export interface GateSignOff {
  gate: GateNumber;
  signedBy: string;
  role: string;
  timestamp: string;
  notes?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface CMSConfig {
  id: string;
  stageGates: GateDefinition[];
  riskFormula: 'standard' | 'weighted_technical' | 'high_impact_biased';
  autoHealthRules: boolean;
  criticalSpendThresholdPct: number;
  overdueToleranceDays: number;
  strictGatingEnforced: boolean;
  updatedAt: string;
}

export interface NPDProject {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ProjectCategory;
  currentGate: GateNumber;
  health: HealthStatus;
  priority: PriorityLevel;
  projectLead: string;
  engineeringLead: string;
  startDate: string;
  targetLaunchDate: string;
  budgetAllocated: number;
  actualSpend: number;
  deliverables: Deliverable[];
  risks: RiskItem[];
  milestones: Milestone[];
  ecoCount: number;
  attachments?: FileAttachment[];
  signOffs?: GateSignOff[];
  auditLogs?: AuditEntry[];
  notes?: string;
}

export interface DashboardFilterState {
  searchQuery: string;
  gateFilter: number | 'all';
  healthFilter: HealthStatus | 'all';
  categoryFilter: ProjectCategory | 'all';
  priorityFilter: PriorityLevel | 'all';
  sortBy: 'code' | 'title' | 'gate' | 'health' | 'budget' | 'targetLaunchDate' | 'progress';
  sortOrder: 'asc' | 'desc';
}

export interface DashboardPreferences {
  visibleKpiCards: {
    activeProjects: boolean;
    budgetSpend: boolean;
    gateSignoffsPending: boolean;
    highRiskCount: boolean;
    onTrackRate: boolean;
  };
  compactTableView: boolean;
  theme: 'light' | 'dark';
}

