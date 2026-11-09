import React, { useState } from 'react';
import { CMSConfig, GateDefinition, NPDProject } from '../types/dashboard';
import { Sliders, Code2, ShieldAlert, CheckCircle2, Save, RotateCcw, Plus, Trash2, Cpu, Sparkles } from 'lucide-react';

interface CmsFunctionEditorProps {
  config: CMSConfig;
  onSaveConfig: (updated: CMSConfig) => void;
  projects: NPDProject[];
  onNotify: (msg: string) => void;
  isSaving?: boolean;
}

export const CmsFunctionEditor: React.FC<CmsFunctionEditorProps> = ({
  config,
  onSaveConfig,
  projects,
  onNotify,
  isSaving,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stage-gates' | 'formulas' | 'rules' | 'test-engine'>('stage-gates');
  const [localConfig, setLocalConfig] = useState<CMSConfig>(config);
  const [selectedGateIdx, setSelectedGateIdx] = useState<number>(0);
  const [newDeliverableInput, setNewDeliverableInput] = useState<string>('');

  // Update when external config changes
  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleUpdateGate = (idx: number, updates: Partial<GateDefinition>) => {
    const updatedGates = [...localConfig.stageGates];
    updatedGates[idx] = { ...updatedGates[idx], ...updates };
    setLocalConfig({ ...localConfig, stageGates: updatedGates });
  };

  const handleAddDeliverableToGate = (gateIdx: number) => {
    if (!newDeliverableInput.trim()) return;
    const gate = localConfig.stageGates[gateIdx];
    const updated = {
      ...gate,
      standardDeliverables: [...gate.standardDeliverables, newDeliverableInput.trim()]
    };
    handleUpdateGate(gateIdx, updated);
    setNewDeliverableInput('');
  };

  const handleRemoveDeliverableFromGate = (gateIdx: number, delIdx: number) => {
    const gate = localConfig.stageGates[gateIdx];
    const updated = {
      ...gate,
      standardDeliverables: gate.standardDeliverables.filter((_, i) => i !== delIdx)
    };
    handleUpdateGate(gateIdx, updated);
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    onNotify('Saved CMS rules and functions directly to Firestore.');
  };

  // Test diagnostic rule against a sample project
  const testProject = projects[0] || null;
  const evaluateProjectHealth = (p: NPDProject) => {
    if (!localConfig.autoHealthRules) return { health: p.health, reason: 'Automated rules disabled (Manual override)' };
    const spendPct = p.budgetAllocated > 0 ? (p.actualSpend / p.budgetAllocated) * 100 : 0;
    if (spendPct >= localConfig.criticalSpendThresholdPct) {
      return { health: 'Critical', reason: `Spend (${spendPct.toFixed(1)}%) exceeds critical threshold of ${localConfig.criticalSpendThresholdPct}%` };
    }
    const hasHighRisk = p.risks.some(r => r.status !== 'Resolved' && r.probability * r.impact >= 15);
    if (hasHighRisk) {
      return { health: 'At Risk', reason: 'Contains unmitigated technical risk with score ≥ 15' };
    }
    return { health: 'On Track', reason: 'Nominal stage performance within budget boundaries' };
  };

  const selectedGate = localConfig.stageGates[selectedGateIdx];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              NPD Process CMS & Function Logic Editor
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize Stage-Gate review definitions, evaluation formulas, and automated health triggers stored in Firestore.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors inline-flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Syncing to Database...' : 'Save CMS to Firestore'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex gap-4 text-xs font-medium bg-slate-50/30 dark:bg-slate-900/30">
        <button
          onClick={() => setActiveSubTab('stage-gates')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'stage-gates'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Stage-Gate Criteria CMS
        </button>
        <button
          onClick={() => setActiveSubTab('formulas')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'formulas'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Calculation & Scoring Formulas
        </button>
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'rules'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Automated Health Diagnostic Rules
        </button>
        <button
          onClick={() => setActiveSubTab('test-engine')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'test-engine'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Live Function Diagnostic Test
        </button>
      </div>

      {/* Tab 1: Stage-Gate Criteria CMS */}
      {activeSubTab === 'stage-gates' && (
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gate Selector List */}
            <div className="md:col-span-4 space-y-2">
              <div className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                Select Stage Gate to Edit
              </div>
              {localConfig.stageGates.map((g, idx) => (
                <button
                  key={g.gateNumber}
                  onClick={() => setSelectedGateIdx(idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                    selectedGateIdx === idx
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="font-mono text-[10px] text-slate-400">Stage {g.gateNumber}</div>
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{g.standardDeliverables.length} required deliverables</div>
                </button>
              ))}
            </div>

            {/* Gate Configuration Form */}
            {selectedGate && (
              <div className="md:col-span-8 space-y-4 bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Editing Gate {selectedGate.gateNumber}: {selectedGate.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">Live Config</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Full Stage Name
                    </label>
                    <input
                      type="text"
                      value={selectedGate.name}
                      onChange={(e) => handleUpdateGate(selectedGateIdx, { name: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      Short Label
                    </label>
                    <input
                      type="text"
                      value={selectedGate.shortName}
                      onChange={(e) => handleUpdateGate(selectedGateIdx, { shortName: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Stage Focus & Review Intent
                  </label>
                  <input
                    type="text"
                    value={selectedGate.focus}
                    onChange={(e) => handleUpdateGate(selectedGateIdx, { focus: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Mandatory Deliverables Checklist CMS */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                    Mandatory Stage Deliverables Sign-off Criteria ({selectedGate.standardDeliverables.length})
                  </label>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                    {selectedGate.standardDeliverables.map((del, dIdx) => (
                      <div key={dIdx} className="p-2.5 flex items-center justify-between text-xs">
                        <span className="text-slate-800 dark:text-slate-200">{del}</span>
                        <button
                          onClick={() => handleRemoveDeliverableFromGate(selectedGateIdx, dIdx)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Remove deliverable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Deliverable input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newDeliverableInput}
                      onChange={(e) => setNewDeliverableInput(e.target.value)}
                      placeholder="Add required gate deliverable (e.g. UL 1741 Certificate, BOM Freeze)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDeliverableToGate(selectedGateIdx);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddDeliverableToGate(selectedGateIdx)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Calculation & Scoring Formulas */}
      {activeSubTab === 'formulas' && (
        <div className="p-5 space-y-6">
          <div className="max-w-2xl space-y-4 text-xs">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                Technical Risk Scoring Formula
              </h3>
              <p className="text-slate-500 mt-0.5">
                Select how project risk exposure is quantified across engineering and manufacturing dimensions.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer">
                <input
                  type="radio"
                  name="riskFormula"
                  value="standard"
                  checked={localConfig.riskFormula === 'standard'}
                  onChange={() => setLocalConfig({ ...localConfig, riskFormula: 'standard' })}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Standard ISO 14971: <code className="font-mono">Probability × Impact</code>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Linear 1-to-25 scale. Balanced evaluation across frequency and technical outcome severity.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer">
                <input
                  type="radio"
                  name="riskFormula"
                  value="weighted_technical"
                  checked={localConfig.riskFormula === 'weighted_technical'}
                  onChange={() => setLocalConfig({ ...localConfig, riskFormula: 'weighted_technical' })}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    High Probability Biased: <code className="font-mono">Probability² × Impact</code>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Penalizes recurring prototype failure modes and repeated manufacturing defects.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer">
                <input
                  type="radio"
                  name="riskFormula"
                  value="high_impact_biased"
                  checked={localConfig.riskFormula === 'high_impact_biased'}
                  onChange={() => setLocalConfig({ ...localConfig, riskFormula: 'high_impact_biased' })}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Catastrophic Impact Biased: <code className="font-mono">Probability × Impact²</code>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Prioritizes safety, regulatory non-compliance, and total system thermal failures above all else.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Automated Health Diagnostic Rules */}
      {activeSubTab === 'rules' && (
        <div className="p-5 space-y-6">
          <div className="max-w-2xl space-y-4 text-xs">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                NPD Governance & Rule Engine Triggers
              </h3>
              <p className="text-slate-500 mt-0.5">
                Automated criteria that trigger real-time alerts or health escalations.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Automated Health Calculation Engine
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Continuously evaluate budget variance and open risks to calculate project health.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localConfig.autoHealthRules}
                  onChange={(e) => setLocalConfig({ ...localConfig, autoHealthRules: e.target.checked })}
                  className="rounded"
                />
              </label>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Budget Spend Critical Threshold ({localConfig.criticalSpendThresholdPct}%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="70"
                    max="115"
                    step="1"
                    value={localConfig.criticalSpendThresholdPct}
                    onChange={(e) => setLocalConfig({ ...localConfig, criticalSpendThresholdPct: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {localConfig.criticalSpendThresholdPct}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Projects spending above this percentage of allocated budget automatically trigger "Critical" status.
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Strict Gatekeeping Protocol
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Require 100% completion of mandatory deliverables before a project can advance to the next gate.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localConfig.strictGatingEnforced}
                    onChange={(e) => setLocalConfig({ ...localConfig, strictGatingEnforced: e.target.checked })}
                    className="rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Live Function Diagnostic Test */}
      {activeSubTab === 'test-engine' && (
        <div className="p-5 space-y-4">
          <div className="text-xs">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-500" />
              <span>Real-Time Function Engine Output</span>
            </h3>
            <p className="text-slate-500 mt-0.5">
              Live simulation of active CMS rules against active database projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((p) => {
              const result = evaluateProjectHealth(p);
              return (
                <div key={p.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono font-semibold text-slate-400">{p.code}</span>
                    <span className={`font-semibold ${
                      result.health === 'On Track' ? 'text-emerald-600 dark:text-emerald-400' :
                      result.health === 'At Risk' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {result.health}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {p.title}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-500">Evaluation Logic: </span>
                    {result.reason}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
