import React, { useState, useEffect } from 'react';
import { 
  NPDProject, 
  DashboardFilterState, 
  DashboardPreferences,
  CMSConfig,
  ECORecord,
  STAGE_GATES 
} from './types/dashboard';
import { INITIAL_NPD_PROJECTS } from './data/mockProjects';
import { 
  subscribeToProjects, 
  saveProjectToFirestore, 
  deleteProjectFromFirestore,
  subscribeToCMSConfig,
  saveCMSConfigToFirestore,
  subscribeToECOs,
  saveECOToFirestore,
  seedInitialProjectsIfEmpty,
  DEFAULT_CMS_CONFIG
} from './lib/firebase';
import { Header, ActiveTab } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { PortfolioTable } from './components/PortfolioTable';
import { StageGateBoard } from './components/StageGateBoard';
import { GanttTimeline } from './components/GanttTimeline';
import { RiskMatrix } from './components/RiskMatrix';
import { EcoWorkflowView } from './components/EcoWorkflowView';
import { CmsFunctionEditor } from './components/CmsFunctionEditor';
import { HtmlImportDiscoverView } from './components/HtmlImportDiscoverView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { NewProjectModal } from './components/NewProjectModal';
import { CustomiseDashboardModal } from './components/CustomiseDashboardModal';
import { FileCode, ArrowRight, X, CheckCircle, Database, Sparkles } from 'lucide-react';

const STORAGE_KEY_PREFS = 'npd_nexus_prefs_v2';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('npd_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('npd_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Live Firestore Projects state
  const [projects, setProjects] = useState<NPDProject[]>(INITIAL_NPD_PROJECTS);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Live CMS Config state
  const [cmsConfig, setCmsConfig] = useState<CMSConfig>(DEFAULT_CMS_CONFIG);

  // Live ECOs state
  const [ecos, setEcos] = useState<ECORecord[]>([]);

  // Preferences state
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load preferences:', e);
    }
    return {
      visibleKpiCards: {
        activeProjects: true,
        budgetSpend: true,
        gateSignoffsPending: true,
        highRiskCount: true,
        onTrackRate: true,
      },
      compactTableView: false,
      theme: 'light',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to persist preferences:', e);
    }
  }, [preferences]);

  // Initial Firestore synchronization and subscriptions
  useEffect(() => {
    // 1. Seed initial data if empty
    seedInitialProjectsIfEmpty().then((seeded) => {
      if (seeded) {
        showNotification('Initialized default NPD engineering portfolio in Firestore database.');
      }
    });

    // 2. Subscribe to real-time project updates from Firestore
    const unsubProjects = subscribeToProjects(
      (loadedProjects) => {
        if (loadedProjects.length > 0) {
          setProjects(loadedProjects);
        }
        setIsDbConnected(true);
      },
      () => {
        setIsDbConnected(false);
      }
    );

    // 3. Subscribe to real-time CMS Config updates
    const unsubCMS = subscribeToCMSConfig((loadedConfig) => {
      if (loadedConfig) {
        setCmsConfig(loadedConfig);
      }
    });

    // 4. Subscribe to ECOs
    const unsubECOs = subscribeToECOs((loadedECOs) => {
      if (loadedECOs.length > 0) {
        setEcos(loadedECOs);
      } else {
        // Seed standard initial ECOs
        const sampleEco: ECORecord = {
          id: 'eco-sample-01',
          projectId: 'npd-002',
          ecoNumber: 'ECO-2026-088',
          title: 'Conductive thermal sleeve addition for brushless stator cooling',
          description: 'Peak torque thermal dissipation exceeded nominal margin by 7°C. Micro-finned conductive sleeve integrated into Gate 2 architecture.',
          disposition: 'Tooling Modification',
          costImpact: 14200,
          status: 'Under Review',
          requestedBy: 'Dr. Aris Thorne',
          createdAt: '2026-05-12'
        };
        saveECOToFirestore(sampleEco);
      }
    });

    return () => {
      unsubProjects();
      unsubCMS();
      unsubECOs();
    };
  }, []);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('portfolio');

  // Filter state
  const [filters, setFilters] = useState<DashboardFilterState>({
    searchQuery: '',
    gateFilter: 'all',
    healthFilter: 'all',
    categoryFilter: 'all',
    priorityFilter: 'all',
    sortBy: 'code',
    sortOrder: 'asc',
  });

  const updateFilters = (updates: Partial<DashboardFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Modals & drawers
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [showLocalBanner, setShowLocalBanner] = useState(true);

  // Notification toast
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  // Advance Gate handler with check and Firestore save
  const handleAdvanceGate = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.currentGate >= 5) return;

    const currentGate = project.currentGate;
    const nextGate = (currentGate + 1) as 0 | 1 | 2 | 3 | 4 | 5;
    const currentGateDef = cmsConfig.stageGates.find((g) => g.gateNumber === currentGate) || STAGE_GATES[currentGate];

    // Check if mandatory deliverables in current gate are completed
    const uncompletedRequired = project.deliverables.filter(
      (d) => d.gate === currentGate && d.requiredForSignoff && !d.completed
    );

    if (uncompletedRequired.length > 0) {
      if (cmsConfig.strictGatingEnforced) {
        alert(
          `Cannot advance Gate! Strict Gating is active.\nProject "${project.code}" has ${uncompletedRequired.length} mandatory deliverable(s) pending sign-off for ${currentGateDef.shortName}. Check them off or approve them in the details drawer first.`
        );
        return;
      }

      const proceed = confirm(
        `Project "${project.code}" has ${uncompletedRequired.length} mandatory deliverable(s) pending sign-off for ${currentGateDef.shortName}.\n\nMark all current gate deliverables as approved and advance to Gate ${nextGate}?`
      );
      if (!proceed) return;
    }

    // Auto mark deliverables for passed gate as completed
    const updatedDeliverables = project.deliverables.map((d) =>
      d.gate === currentGate ? { ...d, completed: true } : d
    );

    const updatedProject: NPDProject = {
      ...project,
      currentGate: nextGate,
      deliverables: updatedDeliverables,
    };

    // Save directly to Firestore
    try {
      await saveProjectToFirestore(updatedProject);
      showNotification(`Project ${project.code} advanced to Gate ${nextGate} and synced to Firestore!`);
    } catch (e) {
      showNotification('Failed to advance gate in database.');
    }
  };

  const handleUpdateProject = async (updated: NPDProject) => {
    try {
      await saveProjectToFirestore(updated);
      showNotification(`Saved changes for "${updated.title}" to Firestore.`);
    } catch (e) {
      showNotification('Failed to save project to Firestore.');
    }
  };

  const handleAddProject = async (newProject: NPDProject) => {
    try {
      await saveProjectToFirestore(newProject);
      showNotification(`Created project ${newProject.code} in Firestore database.`);
    } catch (e) {
      showNotification('Failed to create project in Firestore.');
    }
  };

  const handleSaveCMSConfig = async (newConfig: CMSConfig) => {
    try {
      await saveCMSConfigToFirestore(newConfig);
      setCmsConfig(newConfig);
      showNotification('Updated NPD CMS and function rules in Firestore.');
    } catch (e) {
      showNotification('Failed to save CMS configuration.');
    }
  };

  const handleCreateEco = async (newEco: ECORecord) => {
    try {
      await saveECOToFirestore(newEco);
      showNotification(`Filed Change Order ${newEco.ecoNumber} in Firestore.`);
    } catch (e) {
      showNotification('Failed to save ECO to database.');
    }
  };

  const handleUpdateEco = async (updatedEco: ECORecord) => {
    try {
      await saveECOToFirestore(updatedEco);
      showNotification(`ECO ${updatedEco.ecoNumber} status updated.`);
    } catch (e) {
      showNotification('Failed to update ECO in database.');
    }
  };

  const handleImportExtractedProjects = async (newProjects: NPDProject[]) => {
    for (const p of newProjects) {
      await saveProjectToFirestore(p);
    }
    showNotification(`Merged and saved ${newProjects.length} projects to Firestore!`);
    setActiveTab('portfolio');
  };

  const handleResetData = async () => {
    for (const p of INITIAL_NPD_PROJECTS) {
      await saveProjectToFirestore(p);
    }
    showNotification('Restored initial NPD portfolio in Firestore database.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Contract compliant navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isDbConnected={isDbConnected}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Local File Discovery Notice Banner */}
        {showLocalBanner && (
          <div className="mb-6 p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-xs text-blue-900 dark:text-blue-200">
                Connected to real Firestore Database! You can upload specification files, file ECOs, edit functions in the CMS, or load <strong className="font-mono">Customised Project Dashboard.html</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('discover-local');
                  setShowLocalBanner(false);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors whitespace-nowrap inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Open HTML Discoverer</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowLocalBanner(false)}
                className="p-1 text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 rounded cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Global KPI Strip */}
        <MetricCards projects={projects} preferences={preferences} />

        {/* Active Tab View */}
        {activeTab === 'portfolio' && (
          <PortfolioTable
            projects={projects}
            filters={filters}
            onUpdateFilters={updateFilters}
            onSelectProject={(p) => setSelectedProjectId(p.id)}
            onAdvanceGate={handleAdvanceGate}
          />
        )}

        {activeTab === 'stage-gate' && (
          <StageGateBoard
            projects={projects}
            onSelectProject={(p) => setSelectedProjectId(p.id)}
            onAdvanceGate={handleAdvanceGate}
          />
        )}

        {activeTab === 'timeline' && (
          <GanttTimeline
            projects={projects}
            onSelectProject={(p) => setSelectedProjectId(p.id)}
          />
        )}

        {activeTab === 'risks' && (
          <RiskMatrix
            projects={projects}
            onSelectProject={(p) => setSelectedProjectId(p.id)}
          />
        )}

        {activeTab === 'ecos' && (
          <EcoWorkflowView
            ecos={ecos}
            projects={projects}
            onCreateEco={handleCreateEco}
            onUpdateEco={handleUpdateEco}
            onSelectProject={(p) => setSelectedProjectId(p.id)}
          />
        )}

        {activeTab === 'cms-editor' && (
          <CmsFunctionEditor
            config={cmsConfig}
            onSaveConfig={handleSaveCMSConfig}
            projects={projects}
            onNotify={showNotification}
          />
        )}

        {activeTab === 'discover-local' && (
          <HtmlImportDiscoverView
            onImportExtractedProjects={handleImportExtractedProjects}
            onNotify={showNotification}
          />
        )}

        {activeTab === 'customise' && (
          <CustomiseDashboardModal
            preferences={preferences}
            onUpdatePreferences={(updates) => setPreferences((prev) => ({ ...prev, ...updates }))}
            projects={projects}
            onNotify={showNotification}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Project Detail Drawer / Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          onUpdateProject={handleUpdateProject}
          onAdvanceGate={handleAdvanceGate}
          onNotify={showNotification}
        />
      )}

      {/* New Project Modal */}
      {isNewProjectOpen && (
        <NewProjectModal
          onClose={() => setIsNewProjectOpen(false)}
          onAddProject={handleAddProject}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}
