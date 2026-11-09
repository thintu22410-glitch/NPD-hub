import React from 'react';
import { NPDProject } from '../types/dashboard';
import { Calendar, Flag } from 'lucide-react';

interface GanttTimelineProps {
  projects: NPDProject[];
  onSelectProject: (project: NPDProject) => void;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ projects, onSelectProject }) => {
  // Timeline spans from 2025-07-01 to 2027-12-31 (30 months)
  const timelineStart = new Date('2025-07-01').getTime();
  const timelineEnd = new Date('2027-12-31').getTime();
  const totalDuration = timelineEnd - timelineStart;

  const quarters = [
    { label: 'Q3 2025', date: '2025-07-01' },
    { label: 'Q4 2025', date: '2025-10-01' },
    { label: 'Q1 2026', date: '2026-01-01' },
    { label: 'Q2 2026', date: '2026-04-01' },
    { label: 'Q3 2026', date: '2026-07-01' },
    { label: 'Q4 2026', date: '2026-10-01' },
    { label: 'Q1 2027', date: '2027-01-01' },
    { label: 'Q2 2027', date: '2027-04-01' },
    { label: 'Q3 2027', date: '2027-07-01' },
    { label: 'Q4 2027', date: '2027-10-01' },
  ];

  // Current date position: 2026-11-08
  const currentDate = new Date('2026-11-08').getTime();
  const currentLeftPct = Math.max(0, Math.min(100, ((currentDate - timelineStart) / totalDuration) * 100));

  const getPositionPercent = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const pct = ((time - timelineStart) / totalDuration) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>NPD Portfolio Milestone Schedule (2025 - 2027)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stage gate deliverables, engineering validation builds (EVT/DVT/PVT), and critical path release dates.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>Current Date (Nov 2026)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flag className="w-3 h-3 text-slate-700 dark:text-slate-300" />
            <span>Milestone Marker</span>
          </div>
        </div>
      </div>

      {/* Gantt Canvas Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[950px] relative">
          {/* Time axis header */}
          <div className="grid grid-cols-10 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 pb-2">
            {quarters.map((q) => (
              <div key={q.label} className="text-left pl-1 border-l border-slate-100 dark:border-slate-800/80">
                {q.label}
              </div>
            ))}
          </div>

          {/* Current Date Vertical Line */}
          <div
            className="absolute top-6 bottom-0 w-px bg-blue-500 z-10 pointer-events-none"
            style={{ left: `${currentLeftPct}%` }}
          >
            <div className="absolute -top-4 -left-7 px-1.5 py-0.5 bg-blue-600 text-[9px] font-mono font-medium text-white rounded">
              Today
            </div>
          </div>

          {/* Project rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/70 pt-2">
            {projects.map((project) => {
              const startPct = getPositionPercent(project.startDate);
              const endPct = getPositionPercent(project.targetLaunchDate);
              const widthPct = Math.max(3, endPct - startPct);

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="py-3 group hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded transition-colors cursor-pointer"
                >
                  {/* Row Metadata */}
                  <div className="flex items-center justify-between text-xs mb-1.5 px-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] text-slate-400">
                        {project.code}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {project.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Stage {project.currentGate} · Lead: {project.projectLead}
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-slate-500">
                      {project.startDate} → {project.targetLaunchDate}
                    </div>
                  </div>

                  {/* Timeline Bar Track */}
                  <div className="relative h-7 bg-slate-100 dark:bg-slate-800 rounded">
                    {/* Project duration bar */}
                    <div
                      className={`absolute top-1 bottom-1 rounded transition-all ${
                        project.health === 'On Track'
                          ? 'bg-emerald-600/80 hover:bg-emerald-600'
                          : project.health === 'At Risk'
                          ? 'bg-amber-600/80 hover:bg-amber-600'
                          : 'bg-rose-600/80 hover:bg-rose-600'
                      }`}
                      style={{
                        left: `${startPct}%`,
                        width: `${widthPct}%`,
                      }}
                    >
                      <div className="px-2 h-full flex items-center text-[10px] text-white font-medium truncate">
                        {project.code} · Gate {project.currentGate}
                      </div>
                    </div>

                    {/* Milestones on top */}
                    {project.milestones.map((m) => {
                      const mPct = getPositionPercent(m.targetDate);
                      return (
                        <div
                          key={m.id}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group/milestone"
                          style={{ left: `${mPct}%` }}
                        >
                          <div
                            className={`w-3 h-3 rotate-45 border border-white dark:border-slate-900 shadow-sm ${
                              m.status === 'Completed'
                                ? 'bg-emerald-400'
                                : m.status === 'Delayed'
                                ? 'bg-rose-500'
                                : 'bg-amber-400'
                            }`}
                          />
                          {/* Tooltip on hover */}
                          <div className="hidden group-hover/milestone:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-30 shadow-md">
                            <div className="font-medium">{m.name}</div>
                            <div className="text-[9px] text-slate-300 font-mono">
                              {m.targetDate} ({m.status})
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
