import React from 'react';
import { NPDProject, DashboardPreferences } from '../types/dashboard';

interface MetricCardsProps {
  projects: NPDProject[];
  preferences: DashboardPreferences;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ projects, preferences }) => {
  const totalProjects = projects.length;
  const onTrackCount = projects.filter(p => p.health === 'On Track').length;
  const atRiskCount = projects.filter(p => p.health === 'At Risk').length;
  const criticalCount = projects.filter(p => p.health === 'Critical').length;

  const totalAllocated = projects.reduce((acc, p) => acc + p.budgetAllocated, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.actualSpend, 0);
  const spendPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  // Signoffs pending in current gate
  let pendingSignoffs = 0;
  projects.forEach(p => {
    const requiredInCurrentGate = p.deliverables.filter(
      d => d.gate === p.currentGate && d.requiredForSignoff && !d.completed
    );
    pendingSignoffs += requiredInCurrentGate.length;
  });

  // High & Critical risks across active projects
  let highOrCriticalRisks = 0;
  projects.forEach(p => {
    p.risks.forEach(r => {
      if (r.status !== 'Resolved' && r.probability * r.impact >= 12) {
        highOrCriticalRisks += 1;
      }
    });
  });

  const onTrackRate = totalProjects > 0 ? Math.round((onTrackCount / totalProjects) * 100) : 0;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {preferences.visibleKpiCards.activeProjects && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Active Projects
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalProjects}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Across 6 Gates
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">{onTrackCount} on track</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-medium">{atRiskCount} at risk</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-600 dark:text-rose-400 font-mono font-medium">{criticalCount} crit</span>
          </div>
        </div>
      )}

      {preferences.visibleKpiCards.budgetSpend && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Budget vs Actual Spend
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              / {formatCurrency(totalAllocated)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Commitment rate</span>
            <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{spendPercentage}%</span>
          </div>
        </div>
      )}

      {preferences.visibleKpiCards.gateSignoffsPending && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pending Gate Deliverables
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {pendingSignoffs}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Blocking sign-offs
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Current stage deliverables required
          </div>
        </div>
      )}

      {preferences.visibleKpiCards.highRiskCount && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            High Severity Risks
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {highOrCriticalRisks}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Score ≥ 12
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Under active technical mitigation
          </div>
        </div>
      )}

      {preferences.visibleKpiCards.onTrackRate && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 col-span-2 md:col-span-1">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Portfolio Health Index
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {onTrackRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Schedule integrity
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {totalProjects - onTrackCount} projects require attention
          </div>
        </div>
      )}
    </div>
  );
};
