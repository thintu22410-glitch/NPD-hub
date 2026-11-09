import React, { useState } from 'react';
import { ECORecord, NPDProject } from '../types/dashboard';
import { GitPullRequest, Plus, CheckCircle, Clock, AlertCircle, FileText, ArrowUpRight } from 'lucide-react';

interface EcoWorkflowViewProps {
  ecos: ECORecord[];
  projects: NPDProject[];
  onCreateEco: (eco: ECORecord) => void;
  onUpdateEco: (eco: ECORecord) => void;
  onSelectProject: (project: NPDProject) => void;
}

export const EcoWorkflowView: React.FC<EcoWorkflowViewProps> = ({
  ecos,
  projects,
  onCreateEco,
  onUpdateEco,
  onSelectProject,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disposition, setDisposition] = useState<ECORecord['disposition']>('Drawing Revision');
  const [costImpact, setCostImpact] = useState<number>(12500);
  const [requestedBy, setRequestedBy] = useState('Senior Systems Engineer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedProjectId) return;

    const newEco: ECORecord = {
      id: `eco-${Date.now()}`,
      projectId: selectedProjectId,
      ecoNumber: `ECO-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      description: description.trim(),
      disposition,
      costImpact,
      status: 'Under Review',
      requestedBy: requestedBy.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateEco(newEco);
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleApprove = (eco: ECORecord) => {
    const updated: ECORecord = {
      ...eco,
      status: 'Approved',
      approvedBy: 'Chief Technical Officer (Signed)'
    };
    onUpdateEco(updated);
  };

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Engineering Change Order (ECO) Workflow Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Formal revision control and cost impact tracking across tooling modifications, PCB revs, and BOM updates.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Change Order</span>
        </button>
      </div>

      {/* New ECO Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Initiate Engineering Change Order (ECO)
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Target NPD Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} · {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  ECO Title / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heatsink extrusion tolerance enlargement to prevent thermal choke"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Disposition
                  </label>
                  <select
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value as ECORecord['disposition'])}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Tooling Modification">Tooling Modification</option>
                    <option value="Drawing Revision">Drawing Revision</option>
                    <option value="Firmware Update">Firmware Update</option>
                    <option value="Scrap & Rework">Scrap & Rework</option>
                    <option value="Use As Is">Use As Is</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Estimated Cost Impact ($)
                  </label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={costImpact}
                    onChange={(e) => setCostImpact(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Technical Root Cause & Justification
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why this change is necessary and impact on Gate sign-off..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded"
                >
                  Submit for Engineering Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ECO Register Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900 dark:text-white">
            Active Engineering Change Orders ({ecos.length})
          </span>
          <span className="text-slate-500 font-mono">
            Synced via Firestore Database
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {ecos.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No change orders currently filed. Click "New Change Order" to initiate one.
            </div>
          ) : (
            ecos.map((eco) => {
              const project = projects.find((p) => p.id === eco.projectId);

              return (
                <div key={eco.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{eco.ecoNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">{eco.disposition}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-500">Filed: {eco.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(eco.costImpact)}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        eco.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        eco.status === 'Under Review' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {eco.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1.5">
                    {eco.title}
                  </h4>

                  {eco.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {eco.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Project: </span>
                      {project ? (
                        <button
                          onClick={() => onSelectProject(project)}
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>{project.code} ({project.title})</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span>General Portfolio</span>
                      )}
                    </div>

                    {eco.status !== 'Approved' && (
                      <button
                        onClick={() => handleApprove(eco)}
                        className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors inline-flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Sign & Approve Change</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
