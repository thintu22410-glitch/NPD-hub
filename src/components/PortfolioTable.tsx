import React from 'react';
import { 
  NPDProject, 
  DashboardFilterState, 
  STAGE_GATES, 
  HealthStatus, 
  ProjectCategory, 
  PriorityLevel 
} from '../types/dashboard';
import { Search, ChevronDown, ChevronUp, ArrowRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface PortfolioTableProps {
  projects: NPDProject[];
  filters: DashboardFilterState;
  onUpdateFilters: (updates: Partial<DashboardFilterState>) => void;
  onSelectProject: (project: NPDProject) => void;
  onAdvanceGate: (projectId: string) => void;
}

export const PortfolioTable: React.FC<PortfolioTableProps> = ({
  projects,
  filters,
  onUpdateFilters,
  onSelectProject,
  onAdvanceGate,
}) => {
  // Filter logic
  const filteredProjects = projects.filter(project => {
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchCode = project.code.toLowerCase().includes(q);
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchLead = project.projectLead.toLowerCase().includes(q);
      const matchCat = project.category.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchLead && !matchCat) return false;
    }

    if (filters.gateFilter !== 'all' && project.currentGate !== filters.gateFilter) {
      return false;
    }

    if (filters.healthFilter !== 'all' && project.health !== filters.healthFilter) {
      return false;
    }

    if (filters.categoryFilter !== 'all' && project.category !== filters.categoryFilter) {
      return false;
    }

    if (filters.priorityFilter !== 'all' && project.priority !== filters.priorityFilter) {
      return false;
    }

    return true;
  });

  // Sort logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    switch (filters.sortBy) {
      case 'code':
        comparison = a.code.localeCompare(b.code);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'gate':
        comparison = a.currentGate - b.currentGate;
        break;
      case 'health':
        comparison = a.health.localeCompare(b.health);
        break;
      case 'budget':
        comparison = a.actualSpend - b.actualSpend;
        break;
      case 'targetLaunchDate':
        comparison = a.targetLaunchDate.localeCompare(b.targetLaunchDate);
        break;
      case 'progress': {
        const progA = a.deliverables.length ? a.deliverables.filter(d => d.completed).length / a.deliverables.length : 0;
        const progB = b.deliverables.length ? b.deliverables.filter(d => d.completed).length / b.deliverables.length : 0;
        comparison = progA - progB;
        break;
      }
      default:
        comparison = 0;
    }
    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: DashboardFilterState['sortBy']) => {
    if (filters.sortBy === field) {
      onUpdateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      onUpdateFilters({ sortBy: field, sortOrder: 'asc' });
    }
  };

  const getHealthStyle = (health: HealthStatus) => {
    switch (health) {
      case 'On Track':
        return 'text-emerald-700 dark:text-emerald-400';
      case 'At Risk':
        return 'text-amber-700 dark:text-amber-400 font-medium';
      case 'Critical':
        return 'text-rose-700 dark:text-rose-400 font-semibold';
      case 'Completed':
        return 'text-sky-700 dark:text-sky-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const formatCurrency = (val: number) => {
    return `$${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      {/* Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
              placeholder="Search by code, title, lead engineer, or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
            />
          </div>

          {/* Quick Clear Filter */}
          {(filters.searchQuery || filters.gateFilter !== 'all' || filters.healthFilter !== 'all' || filters.categoryFilter !== 'all') && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '', gateFilter: 'all', healthFilter: 'all', categoryFilter: 'all', priorityFilter: 'all' })}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 self-start md:self-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Gate Selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 dark:text-slate-400">Stage:</span>
            <select
              value={filters.gateFilter}
              onChange={(e) => onUpdateFilters({ gateFilter: e.target.value === 'all' ? 'all' : Number(e.target.value) })}
              className="py-1 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="all">All Stages (0-5)</option>
              {STAGE_GATES.map(g => (
                <option key={g.gateNumber} value={g.gateNumber}>
                  {g.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Health Selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 dark:text-slate-400">Health:</span>
            <select
              value={filters.healthFilter}
              onChange={(e) => onUpdateFilters({ healthFilter: e.target.value as HealthStatus | 'all' })}
              className="py-1 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Critical">Critical</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 dark:text-slate-400">Domain:</span>
            <select
              value={filters.categoryFilter}
              onChange={(e) => onUpdateFilters({ categoryFilter: e.target.value as ProjectCategory | 'all' })}
              className="py-1 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none max-w-[160px] truncate"
            >
              <option value="all">All Domains</option>
              <option value="IoT & Smart Devices">IoT & Smart Devices</option>
              <option value="Robotics & Actuation">Robotics & Actuation</option>
              <option value="Materials & Enclosures">Materials & Enclosures</option>
              <option value="MedTech & Diagnostics">MedTech & Diagnostics</option>
              <option value="CleanTech & Power">CleanTech & Power</option>
            </select>
          </div>

          <div className="ml-auto text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            Showing {sortedProjects.length} of {projects.length} projects
          </div>
        </div>
      </div>

      {/* High-density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('code')}>
                <div className="flex items-center gap-1">
                  <span>Project & Code</span>
                  {filters.sortBy === 'code' && (filters.sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-2.5 px-3">Domain</th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('gate')}>
                <div className="flex items-center gap-1">
                  <span>Stage-Gate</span>
                  {filters.sortBy === 'gate' && (filters.sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('health')}>
                <div className="flex items-center gap-1">
                  <span>Health</span>
                  {filters.sortBy === 'health' && (filters.sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('progress')}>
                <div className="flex items-center gap-1">
                  <span>Deliverables</span>
                  {filters.sortBy === 'progress' && (filters.sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('budget')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Spend / Budget</span>
                  {filters.sortBy === 'budget' && (filters.sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('targetLaunchDate')}>
                <div className="flex items-center gap-1">
                  <span>Target Launch</span>
                  {filters.sortBy === 'targetLaunchDate' && (filters.sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {sortedProjects.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">No NPD projects match current filters</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting the stage, status, or search query</p>
                </td>
              </tr>
            ) : (
              sortedProjects.map((project) => {
                const totalDel = project.deliverables.length;
                const completedDel = project.deliverables.filter(d => d.completed).length;
                const progressPct = totalDel > 0 ? Math.round((completedDel / totalDel) * 100) : 0;
                const gateDef = STAGE_GATES.find(g => g.gateNumber === project.currentGate);
                const currentGatePendingRequired = project.deliverables.filter(
                  d => d.gate === project.currentGate && d.requiredForSignoff && !d.completed
                ).length;

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectProject(project)}
                  >
                    {/* Code & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-slate-400 dark:text-slate-500 text-[11px]">
                          {project.code}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {project.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>Lead: {project.projectLead}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{project.ecoCount} ECOs</span>
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {project.category}
                    </td>

                    {/* Current Gate */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {gateDef?.shortName || `Gate ${project.currentGate}`}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                        {gateDef?.focus}
                      </div>
                    </td>

                    {/* Health */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className={`flex items-center gap-1.5 ${getHealthStyle(project.health)}`}>
                        {project.health === 'On Track' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        {project.health === 'At Risk' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                        {project.health === 'Critical' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                        <span>{project.health}</span>
                      </div>
                    </td>

                    {/* Deliverables Progress */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-slate-900 dark:bg-slate-100 h-full rounded-full" 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums text-[11px] text-slate-600 dark:text-slate-400">
                          {completedDel}/{totalDel}
                        </span>
                      </div>
                      {currentGatePendingRequired > 0 ? (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                          {currentGatePendingRequired} gate sign-offs pending
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Gate ready for review
                        </div>
                      )}
                    </td>

                    {/* Spend / Budget */}
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        {formatCurrency(project.actualSpend)}
                      </div>
                      <div className="font-mono tabular-nums text-[11px] text-slate-400">
                        / {formatCurrency(project.budgetAllocated)}
                      </div>
                    </td>

                    {/* Target Launch */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {project.targetLaunchDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectProject(project)}
                          className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          Details
                        </button>
                        {project.currentGate < 5 && (
                          <button
                            onClick={() => onAdvanceGate(project.id)}
                            title="Advance to next Stage-Gate"
                            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
