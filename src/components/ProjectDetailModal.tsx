import React, { useState, useRef } from 'react';
import { 
  NPDProject, 
  STAGE_GATES, 
  Deliverable, 
  RiskItem, 
  Milestone, 
  FileAttachment, 
  GateSignOff 
} from '../types/dashboard';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Trash2, 
  Paperclip, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  CheckCheck,
  FileCode
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: NPDProject;
  onClose: () => void;
  onUpdateProject: (updated: NPDProject) => void;
  onAdvanceGate: (projectId: string) => void;
  onNotify: (msg: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onUpdateProject,
  onAdvanceGate,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'deliverables' | 'files' | 'signoffs' | 'milestones' | 'risks' | 'financials'>('deliverables');
  const [newDeliverableTitle, setNewDeliverableTitle] = useState('');
  const [newDeliverableRequired, setNewDeliverableRequired] = useState(true);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sign-off state
  const [signOffRole, setSignOffRole] = useState('Lead Systems Engineer');
  const [signOffName, setSignOffName] = useState(project.projectLead);
  const [signOffNotes, setSignOffNotes] = useState('');

  // Deliverables toggle
  const handleToggleDeliverable = (delId: string) => {
    const updatedDeliverables = project.deliverables.map((d) =>
      d.id === delId ? { ...d, completed: !d.completed } : d
    );
    onUpdateProject({ ...project, deliverables: updatedDeliverables });
  };

  // Add deliverable
  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeliverableTitle.trim()) return;
    const newDel: Deliverable = {
      id: `del-${Date.now()}`,
      title: newDeliverableTitle.trim(),
      gate: project.currentGate,
      completed: false,
      requiredForSignoff: newDeliverableRequired,
      assignee: project.projectLead,
      dueDate: project.targetLaunchDate,
    };
    onUpdateProject({
      ...project,
      deliverables: [...project.deliverables, newDel],
    });
    setNewDeliverableTitle('');
    onNotify('Added deliverable to Gate ' + project.currentGate);
  };

  // Remove deliverable
  const handleRemoveDeliverable = (delId: string) => {
    onUpdateProject({
      ...project,
      deliverables: project.deliverables.filter((d) => d.id !== delId),
    });
  };

  // Real File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newAttachment: FileAttachment = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: project.projectLead,
        dataUrl,
      };

      const updatedAttachments = [...(project.attachments || []), newAttachment];
      onUpdateProject({
        ...project,
        attachments: updatedAttachments,
      });

      setIsUploading(false);
      onNotify(`Uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB) and saved to database.`);
    };

    reader.onerror = () => {
      setIsUploading(false);
      onNotify('Failed to read file.');
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteAttachment = (fileId: string) => {
    const updatedAttachments = (project.attachments || []).filter((f) => f.id !== fileId);
    onUpdateProject({
      ...project,
      attachments: updatedAttachments,
    });
    onNotify('Attachment removed.');
  };

  // Record Formal Gate Sign-off
  const handleRecordSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signOffName.trim()) return;

    const newSignOff: GateSignOff = {
      gate: project.currentGate,
      signedBy: signOffName.trim(),
      role: signOffRole,
      timestamp: new Date().toISOString(),
      notes: signOffNotes.trim() || undefined,
    };

    const updatedSignOffs = [...(project.signOffs || []), newSignOff];
    onUpdateProject({
      ...project,
      signOffs: updatedSignOffs,
    });
    setSignOffNotes('');
    onNotify(`Formal sign-off recorded by ${signOffName} for Gate ${project.currentGate}.`);
  };

  const currentGateDef = STAGE_GATES.find((g) => g.gateNumber === project.currentGate);
  const gateDeliverables = project.deliverables.filter((d) => d.gate === project.currentGate);
  const requiredPending = gateDeliverables.filter((d) => d.requiredForSignoff && !d.completed);
  const isReadyToAdvance = requiredPending.length === 0 && gateDeliverables.length > 0;

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{project.code}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-medium ${
                project.health === 'On Track' ? 'text-emerald-600 dark:text-emerald-400' :
                project.health === 'At Risk' ? 'text-amber-600 dark:text-amber-400' :
                'text-rose-600 dark:text-rose-400'
              }`}>{project.health}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">Cloud Synced</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
              {project.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {project.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gate Progress Ribbon */}
        <div className="px-5 py-3 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">
              Current Stage: {currentGateDef?.shortName}
            </span>
            <span className="text-slate-500 font-mono">
              ({currentGateDef?.focus})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isReadyToAdvance ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>All Required Deliverables Signed Off</span>
              </div>
            ) : (
              <div className="text-amber-600 dark:text-amber-400">
                {requiredPending.length} mandatory sign-off{requiredPending.length > 1 ? 's' : ''} pending
              </div>
            )}

            {project.currentGate < 5 && (
              <button
                onClick={() => onAdvanceGate(project.id)}
                disabled={!isReadyToAdvance}
                className={`px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  isReadyToAdvance
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Advance to Gate {project.currentGate + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'deliverables'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Stage Deliverables ({project.deliverables.length})
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'files'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Paperclip className="w-3 h-3" />
            <span>Files & Specs ({(project.attachments || []).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('signoffs')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'signoffs'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCheck className="w-3 h-3" />
            <span>Gate Sign-offs ({(project.signOffs || []).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'milestones'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Milestones ({project.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'risks'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Risks ({project.risks.length})
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'financials'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Financials
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: Deliverables */}
          {activeTab === 'deliverables' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Check off deliverables as they are reviewed and approved by the engineering and quality gatekeepers. Changes save instantly to Firestore.
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                {project.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleDeliverable(del.id)}
                        className="mt-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        {del.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div>
                        <div className={`text-xs font-medium ${del.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {del.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>Gate {del.gate}</span>
                          <span aria-hidden="true">·</span>
                          <span>Due: {del.dueDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>Assignee: {del.assignee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {del.requiredForSignoff && (
                        <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                          Mandatory Sign-off
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveDeliverable(del.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddDeliverable} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newDeliverableTitle}
                  onChange={(e) => setNewDeliverableTitle(e.target.value)}
                  placeholder="Add custom gate deliverable (e.g. FMEA review, UL compliance)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                />
                <label className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={newDeliverableRequired}
                    onChange={(e) => setNewDeliverableRequired(e.target.checked)}
                    className="rounded text-slate-900"
                  />
                  <span>Mandatory</span>
                </label>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Real Files & Specifications Repository */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Project Attached Documents & Specifications
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload and persist CAD sheets, test reports, DFMEA spreadsheets, or HTML exports.
                  </p>
                </div>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Spec File'}</span>
                  </button>
                </div>
              </div>

              {/* Upload Drop Area */}
              {(!project.attachments || project.attachments.length === 0) ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    No files attached yet
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Click to attach PDF specifications, drawings, test logs, or HTML exports
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {project.attachments.map((file) => (
                    <div key={file.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {file.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>{(file.size / 1024).toFixed(1)} KB</span>
                            <span aria-hidden="true">·</span>
                            <span>Uploaded {file.uploadedAt}</span>
                            <span aria-hidden="true">·</span>
                            <span>By {file.uploadedBy}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {file.dataUrl && (
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        )}

                        {file.dataUrl && (
                          <a
                            href={file.dataUrl}
                            download={file.name}
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteAttachment(file.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* In-Modal File Preview */}
              {previewFile && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Preview: {previewFile.name}</span>
                    <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                      Close Preview
                    </button>
                  </div>
                  {previewFile.type.includes('image') ? (
                    <img src={previewFile.dataUrl} alt={previewFile.name} className="max-h-64 rounded object-contain mx-auto" />
                  ) : previewFile.name.endsWith('.html') || previewFile.type.includes('html') ? (
                    <iframe
                      src={previewFile.dataUrl}
                      title="HTML Preview"
                      className="w-full h-64 bg-white rounded border border-slate-300"
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <div className="p-4 bg-white dark:bg-slate-900 rounded border border-slate-200 text-xs font-mono text-slate-700 dark:text-slate-300">
                      File format previewed as download. Click the download icon to save.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Gate Sign-offs Ledger */}
          {activeTab === 'signoffs' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Formal Gatekeeper approval ledger verifying stage passage criteria for compliance and ISO certification.
              </div>

              {/* Sign-off Form */}
              <form onSubmit={handleRecordSignOff} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Record Gatekeeper Sign-off for Gate {project.currentGate}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Gatekeeper Name
                    </label>
                    <input
                      type="text"
                      required
                      value={signOffName}
                      onChange={(e) => setSignOffName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Department / Role
                    </label>
                    <select
                      value={signOffRole}
                      onChange={(e) => setSignOffRole(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Lead Systems Engineer">Lead Systems Engineer</option>
                      <option value="Program Director">Program Director</option>
                      <option value="Quality & Regulatory Assurance">Quality & Regulatory Assurance</option>
                      <option value="Manufacturing & Tooling Lead">Manufacturing & Tooling Lead</option>
                      <option value="Chief Technology Officer">Chief Technology Officer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Approval Remarks / Conditions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Approved with condition that DVT tooling report is submitted before build..."
                    value={signOffNotes}
                    onChange={(e) => setSignOffNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-3.5 py-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors inline-flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Sign & Log Approval</span>
                </button>
              </form>

              {/* Sign-offs list */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Recorded Sign-offs ({ (project.signOffs || []).length })
                </div>
                {(!project.signOffs || project.signOffs.length === 0) ? (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded">
                    No sign-offs recorded yet for this project.
                  </div>
                ) : (
                  project.signOffs.map((so, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Gate {so.gate}: {so.signedBy} ({so.role})
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(so.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {so.notes && (
                        <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-1 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                          "{so.notes}"
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Milestones */}
          {activeTab === 'milestones' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Milestone schedule & validation test dates.
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                {project.milestones.map((m) => (
                  <div key={m.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{m.name}</span>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Target: {m.targetDate} {m.actualDate && `(Actual: ${m.actualDate})`}
                      </div>
                    </div>
                    <span className={`font-medium ${
                      m.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' :
                      m.status === 'Delayed' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Risks */}
          {activeTab === 'risks' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Technical, supply chain, and regulatory risks tracked for this project.
              </div>
              <div className="space-y-2">
                {project.risks.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {r.title}
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        Score: {r.probability * r.impact} (P{r.probability}·I{r.impact})
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      <span className="font-medium text-slate-500">Mitigation: </span>
                      {r.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Financials */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500">Allocated Budget</div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {formatCurrency(project.budgetAllocated)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500">Actual Spend to Date</div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {formatCurrency(project.actualSpend)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 col-span-2 md:col-span-1">
                  <div className="text-[11px] text-slate-500">Engineering Change Orders (ECOs)</div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {project.ecoCount}
                  </div>
                </div>
              </div>

              {project.notes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold block mb-1">Engineering Notes:</span>
                  {project.notes}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Project Lead: <span className="font-medium text-slate-800 dark:text-slate-200">{project.projectLead}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
