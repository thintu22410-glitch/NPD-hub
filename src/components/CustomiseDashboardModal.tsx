import React from 'react';
import { DashboardPreferences, NPDProject } from '../types/dashboard';
import { Settings2, Download, RefreshCw, Check } from 'lucide-react';

interface CustomiseDashboardModalProps {
  preferences: DashboardPreferences;
  onUpdatePreferences: (updates: Partial<DashboardPreferences>) => void;
  projects: NPDProject[];
  onNotify: (msg: string) => void;
  onResetData: () => void;
}

export const CustomiseDashboardModal: React.FC<CustomiseDashboardModalProps> = ({
  preferences,
  onUpdatePreferences,
  projects,
  onNotify,
  onResetData,
}) => {
  const toggleKpi = (key: keyof DashboardPreferences['visibleKpiCards']) => {
    onUpdatePreferences({
      visibleKpiCards: {
        ...preferences.visibleKpiCards,
        [key]: !preferences.visibleKpiCards[key],
      },
    });
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'NPD_Customised_Project_Dashboard_Export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onNotify('Exported full NPD portfolio dataset as JSON.');
  };

  const handleExportCsv = () => {
    const headers = ['Code', 'Title', 'Category', 'CurrentGate', 'Health', 'Lead', 'Budget', 'Spend', 'TargetLaunchDate'];
    const rows = projects.map(p => [
      `"${p.code}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.currentGate,
      `"${p.health}"`,
      `"${p.projectLead}"`,
      p.budgetAllocated,
      p.actualSpend,
      `"${p.targetLaunchDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'NPD_Portfolio_Register.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    onNotify('Exported NPD portfolio register as CSV.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-6">
      <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-500" />
            <span>Dashboard Customisation & Export Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personalize scorecard metrics, manage portfolio visibility, and export data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPI Scorecard Toggles */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Visible Scorecard KPI Cards
          </h3>
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Active Projects & Stage Distribution</span>
              <input
                type="checkbox"
                checked={preferences.visibleKpiCards.activeProjects}
                onChange={() => toggleKpi('activeProjects')}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Budget vs Actual Spend Metric</span>
              <input
                type="checkbox"
                checked={preferences.visibleKpiCards.budgetSpend}
                onChange={() => toggleKpi('budgetSpend')}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Pending Gate Sign-offs Counter</span>
              <input
                type="checkbox"
                checked={preferences.visibleKpiCards.gateSignoffsPending}
                onChange={() => toggleKpi('gateSignoffsPending')}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">High Severity Technical Risks</span>
              <input
                type="checkbox"
                checked={preferences.visibleKpiCards.highRiskCount}
                onChange={() => toggleKpi('highRiskCount')}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Portfolio Schedule Health Index</span>
              <input
                type="checkbox"
                checked={preferences.visibleKpiCards.onTrackRate}
                onChange={() => toggleKpi('onTrackRate')}
                className="rounded"
              />
            </label>
          </div>
        </div>

        {/* Export & Data Management */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Export & Data Portability
          </h3>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Download your full NPD project register with all stage gate deliverables, risks, and milestone schedules.
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Spreadsheet</span>
              </button>
              <button
                onClick={handleExportJson}
                className="px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Schema</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Reset Portfolio State
            </div>
            <div className="text-[11px] text-slate-500">
              Restore default engineering sample projects if you made experimental changes.
            </div>
            <button
              onClick={() => {
                if (confirm('Reset portfolio to initial factory dataset?')) {
                  onResetData();
                  onNotify('Portfolio reset to initial NPD dataset.');
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded border border-rose-200 dark:border-rose-900/40 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Dataset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
