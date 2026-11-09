import React from 'react';
import { NPDProject, STAGE_GATES, GateNumber } from '../types/dashboard';
import { ArrowRight, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StageGateBoardProps {
  projects: NPDProject[];
  onSelectProject: (project: NPDProject) => void;
  onAdvanceGate: (projectId: string) => void;
}

export const StageGateBoard: React.FC<StageGateBoardProps> = ({
  projects,
  onSelectProject,
  onAdvanceGate,
}) => {
  return (
    <div className="space-y-4">
      {/* Stage-Gate Pipeline Description Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Stage-Gate Process Governance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strict gatekeeper approval protocol. Advancement requires 100% completion of mandatory deliverables and technical sign-offs.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> On Track
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> At Risk
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Critical
            </span>
          </div>
        </div>
      </div>

      {/* 6 Gates Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {STAGE_GATES.map((gate) => {
          const gateProjects = projects.filter((p) => p.currentGate === gate.gateNumber);

          return (
            <div
              key={gate.gateNumber}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col min-h-[500px]"
            >
              {/* Gate Column Header */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase">
                    Stage {gate.gateNumber}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                    {gateProjects.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1">
                  {gate.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {gate.focus}
                </div>
              </div>

              {/* Projects in this Gate */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto">
                {gateProjects.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded text-slate-400 text-xs">
                    No active projects in this gate
                  </div>
                ) : (
                  gateProjects.map((project) => {
                    const gateDeliverables = project.deliverables.filter(d => d.gate === gate.gateNumber);
                    const completedGateDeliverables = gateDeliverables.filter(d => d.completed);
                    const pendingRequired = gateDeliverables.filter(d => d.requiredForSignoff && !d.completed);
                    const isGateEligibleForSignoff = pendingRequired.length === 0 && gateDeliverables.length > 0;

                    return (
                      <div
                        key={project.id}
                        onClick={() => onSelectProject(project)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono text-[10px] text-slate-400">
                            {project.code}
                          </span>
                          <span className={`text-[10px] font-medium ${
                            project.health === 'On Track' ? 'text-emerald-600 dark:text-emerald-400' :
                            project.health === 'At Risk' ? 'text-amber-600 dark:text-amber-400' :
                            'text-rose-600 dark:text-rose-400 font-semibold'
                          }`}>
                            {project.health}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                          {project.title}
                        </h4>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          Lead: {project.projectLead}
                        </div>

                        {/* Deliverables checklist count */}
                        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400">
                            Deliverables
                          </span>
                          <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            {completedGateDeliverables.length}/{gateDeliverables.length}
                          </span>
                        </div>

                        {/* Sign-off Readiness Indicator */}
                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          {isGateEligibleForSignoff ? (
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Ready for Review</span>
                            </div>
                          ) : (
                            <div className="text-amber-600 dark:text-amber-400">
                              {pendingRequired.length} required pending
                            </div>
                          )}

                          {gate.gateNumber < 5 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAdvanceGate(project.id);
                              }}
                              title="Advance to next gate"
                              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
