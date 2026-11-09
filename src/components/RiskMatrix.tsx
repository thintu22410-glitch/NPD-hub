import React, { useState } from 'react';
import { NPDProject, RiskItem } from '../types/dashboard';
import { AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RiskMatrixProps {
  projects: NPDProject[];
  onSelectProject: (project: NPDProject) => void;
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ projects, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCell, setSelectedCell] = useState<{ p: number; i: number } | null>(null);

  // Flatten all risks across projects
  const allRisks: { risk: RiskItem; project: NPDProject }[] = [];
  projects.forEach((project) => {
    project.risks.forEach((risk) => {
      allRisks.push({ risk, project });
    });
  });

  const filteredRisks = allRisks.filter(({ risk }) => {
    if (selectedCategory !== 'all' && risk.category !== selectedCategory) return false;
    if (selectedCell && (risk.probability !== selectedCell.p || risk.impact !== selectedCell.i)) return false;
    return true;
  });

  const getCellColor = (p: number, i: number) => {
    const score = p * i;
    if (score >= 16) return 'bg-rose-500/20 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-300';
    if (score >= 10) return 'bg-amber-500/20 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-700 dark:text-amber-300';
    if (score >= 5) return 'bg-yellow-500/15 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-300';
    return 'bg-emerald-500/15 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300';
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>NPD Engineering & Technical Risk Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5×5 Probability × Impact assessment mapping DFMEA, supply chain vulnerabilities, and regulatory gates.
            </p>
          </div>

          {/* Filter by Category */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
            >
              <option value="all">All Risk Domains</option>
              <option value="Technical">Technical</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Regulatory">Regulatory</option>
              <option value="Commercial">Commercial</option>
              <option value="Resource">Resource</option>
            </select>

            {selectedCell && (
              <button
                onClick={() => setSelectedCell(null)}
                className="text-xs text-blue-600 dark:text-blue-400 underline underline-offset-2 ml-2"
              >
                Clear Cell Filter
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 5x5 Heatmap Matrix */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <div className="text-xs font-semibold text-slate-900 dark:text-white mb-4">
            Risk Severity Distribution (Click any cell to filter register)
          </div>

          <div className="flex">
            {/* Y Axis Label */}
            <div className="w-8 flex items-center justify-center -rotate-90 text-[11px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Probability (1-5)
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1.5">
                {[5, 4, 3, 2, 1].map((p) =>
                  [1, 2, 3, 4, 5].map((i) => {
                    const matching = allRisks.filter(
                      ({ risk }) => risk.probability === p && risk.impact === i
                    );
                    const isSelected = selectedCell?.p === p && selectedCell?.i === i;

                    return (
                      <div
                        key={`${p}-${i}`}
                        onClick={() => setSelectedCell(isSelected ? null : { p, i })}
                        className={`h-16 p-1.5 border rounded flex flex-col justify-between transition-all cursor-pointer ${getCellColor(
                          p,
                          i
                        )} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:scale-[1.02]'}`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="opacity-75">
                            P{p}×I{i}
                          </span>
                          <span className="font-bold tabular-nums">
                            {p * i}
                          </span>
                        </div>

                        <div className="text-center font-mono font-bold text-xs">
                          {matching.length > 0 ? (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-900/70 shadow-xs">
                              {matching.length}
                            </span>
                          ) : (
                            <span className="opacity-25">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* X Axis Label */}
              <div className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                Impact / Consequence (1-5)
              </div>
            </div>
          </div>
        </div>

        {/* Risk Register Table */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Risk Mitigation Register ({filteredRisks.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {selectedCell ? `Filtered: P=${selectedCell.p}, I=${selectedCell.i}` : 'Showing all active'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
            {filteredRisks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No risks matching the selected matrix cell or category
              </div>
            ) : (
              filteredRisks.map(({ risk, project }) => (
                <div
                  key={risk.id}
                  onClick={() => onSelectProject(project)}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-mono text-slate-400">{project.code}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500">{risk.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-500">Owner: {risk.owner}</span>
                      </div>
                      <h4 className="text-xs font-medium text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {risk.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        Score: {risk.probability * risk.impact}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        P{risk.probability} · I{risk.impact}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] bg-slate-50 dark:bg-slate-800/80 p-2 rounded border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Mitigation: </span>
                    {risk.mitigation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
