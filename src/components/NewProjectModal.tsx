import React, { useState } from 'react';
import { NPDProject, ProjectCategory, PriorityLevel, STAGE_GATES } from '../types/dashboard';
import { X, Plus } from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
  onAddProject: (project: NPDProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onAddProject }) => {
  const [code, setCode] = useState(`NPD-2026-${Math.floor(120 + Math.random() * 800)}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('IoT & Smart Devices');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [projectLead, setProjectLead] = useState('');
  const [engineeringLead, setEngineeringLead] = useState('');
  const [targetLaunchDate, setTargetLaunchDate] = useState('2027-04-30');
  const [budgetAllocated, setBudgetAllocated] = useState(350000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectLead.trim()) return;

    // Standard Gate 0 Deliverables
    const gate0 = STAGE_GATES[0];
    const initialDeliverables = gate0.standardDeliverables.map((delTitle, idx) => ({
      id: `del-init-${Date.now()}-${idx}`,
      title: delTitle,
      gate: 0 as const,
      completed: false,
      requiredForSignoff: true,
      assignee: projectLead,
      dueDate: targetLaunchDate,
    }));

    const newProj: NPDProject = {
      id: `npd-${Date.now()}`,
      code,
      title: title.trim(),
      description: description.trim() || 'New Product Development initiative scoping phase.',
      category,
      currentGate: 0,
      health: 'On Track',
      priority,
      projectLead: projectLead.trim(),
      engineeringLead: engineeringLead.trim() || projectLead.trim(),
      startDate: new Date().toISOString().split('T')[0],
      targetLaunchDate,
      budgetAllocated,
      actualSpend: 0,
      ecoCount: 0,
      milestones: [
        { id: `m-init-1`, name: 'Gate 0 Scoping Sign-off', targetDate: '2026-08-15', status: 'Pending' },
        { id: `m-init-2`, name: 'Commercial Launch', targetDate: targetLaunchDate, status: 'Pending' }
      ],
      deliverables: initialDeliverables,
      risks: [
        {
          id: `r-init-1`,
          title: 'Initial market validation and user adoption uncertainty',
          category: 'Commercial',
          probability: 3,
          impact: 3,
          mitigation: 'Voice of Customer interviews and prototyping',
          owner: projectLead.trim(),
          status: 'Open'
        }
      ]
    };

    onAddProject(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Create New NPD Project
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Project Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next-Gen Compact Thermal Imaging Camera"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              Domain / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="IoT & Smart Devices">IoT & Smart Devices</option>
              <option value="Robotics & Actuation">Robotics & Actuation</option>
              <option value="Materials & Enclosures">Materials & Enclosures</option>
              <option value="MedTech & Diagnostics">MedTech & Diagnostics</option>
              <option value="CleanTech & Power">CleanTech & Power</option>
              <option value="Consumer Electronics">Consumer Electronics</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Project Lead (PM)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Jane Smith"
                value={projectLead}
                onChange={(e) => setProjectLead(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Engineering Lead
              </label>
              <input
                type="text"
                placeholder="e.g. Liam Taylor"
                value={engineeringLead}
                onChange={(e) => setEngineeringLead(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Target Launch Date
              </label>
              <input
                type="date"
                required
                value={targetLaunchDate}
                onChange={(e) => setTargetLaunchDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Budget Allocated ($)
              </label>
              <input
                type="number"
                step="5000"
                required
                value={budgetAllocated}
                onChange={(e) => setBudgetAllocated(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initialize in Gate 0</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
