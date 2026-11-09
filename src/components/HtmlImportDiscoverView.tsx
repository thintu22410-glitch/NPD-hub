import React, { useState, useRef } from 'react';
import { Upload, FileCode, CheckCircle2, ArrowRight, Eye, Code, FileText, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { NPDProject } from '../types/dashboard';

interface HtmlImportDiscoverViewProps {
  onImportExtractedProjects: (newProjects: NPDProject[]) => void;
  onNotify: (msg: string) => void;
}

export const HtmlImportDiscoverView: React.FC<HtmlImportDiscoverViewProps> = ({
  onImportExtractedProjects,
  onNotify,
}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('Customised Project Dashboard.html');
  const [fileSize, setFileSize] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'source' | 'extracted'>('preview');
  const [parsedRows, setParsedRows] = useState<Array<{ [key: string]: string }>>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NPD Customised Project Dashboard - Engineering Portal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #1e293b; background: #f8fafc; }
    h1 { font-size: 20px; color: #0f172a; margin-bottom: 4px; }
    p.sub { font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-size: 13px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 14px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
    .badge-ontrack { background: #dcfce7; color: #15803d; }
    .badge-risk { background: #fef3c7; color: #b45309; }
    .badge-critical { background: #fee2e2; color: #b91c1c; }
  </style>
</head>
<body>
  <h1>New Product Development (NPD) - Project Portfolio Register</h1>
  <p class="sub">Source: Y:\\NPD\\Data\\Customised Project Dashboard.html | System ID: NPD-ENG-2026</p>

  <table>
    <thead>
      <tr>
        <th>Project Code</th>
        <th>Project Title</th>
        <th>Stage Gate</th>
        <th>Health</th>
        <th>Project Lead</th>
        <th>Target Launch</th>
        <th>Budget ($)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>NPD-2026-112</strong></td>
        <td>NextGen Lidar Solid-State Scanner</td>
        <td>Gate 3: Development</td>
        <td><span class="badge badge-ontrack">On Track</span></td>
        <td>Dr. Sarah Lin</td>
        <td>2026-12-15</td>
        <td>$520,000</td>
      </tr>
      <tr>
        <td><strong>NPD-2026-118</strong></td>
        <td>HydroDrive Subsea Pressure Vessel</td>
        <td>Gate 2: Feasibility</td>
        <td><span class="badge badge-risk">At Risk</span></td>
        <td>David Vance</td>
        <td>2027-03-30</td>
        <td>$380,000</td>
      </tr>
      <tr>
        <td><strong>NPD-2026-124</strong></td>
        <td>CryoShield Phase-Change Insulation</td>
        <td>Gate 4: Validation</td>
        <td><span class="badge badge-critical">Critical</span></td>
        <td>Alana Torres</td>
        <td>2026-09-10</td>
        <td>$245,000</td>
      </tr>
      <tr>
        <td><strong>NPD-2026-130</strong></td>
        <td>AeroGlide Carbon-Fiber Drone Wing</td>
        <td>Gate 1: Concept</td>
        <td><span class="badge badge-ontrack">On Track</span></td>
        <td>Thomas Wu</td>
        <td>2027-06-20</td>
        <td>$190,000</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;

  // Parse table rows whenever htmlContent updates
  const parseHtmlData = (html: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const tables = doc.querySelectorAll('table');
      
      if (tables.length === 0) {
        setParsedRows([]);
        return;
      }

      const rows: Array<{ [key: string]: string }> = [];
      const firstTable = tables[0];
      const headerEls = firstTable.querySelectorAll('th');
      const headers: string[] = [];
      headerEls.forEach((th, idx) => {
        headers.push(th.textContent?.trim() || `Col_${idx}`);
      });

      const trEls = firstTable.querySelectorAll('tbody tr');
      const effectiveTrs = trEls.length > 0 ? trEls : firstTable.querySelectorAll('tr:not(:first-child)');

      effectiveTrs.forEach((tr) => {
        const cells = tr.querySelectorAll('td');
        if (cells.length > 0) {
          const rowObj: { [key: string]: string } = {};
          cells.forEach((td, idx) => {
            const h = headers[idx] || `Column ${idx + 1}`;
            rowObj[h] = td.textContent?.trim() || '';
          });
          rows.push(rowObj);
        }
      });

      setParsedRows(rows);
    } catch (err) {
      console.error('Error parsing HTML:', err);
    }
  };

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
      parseHtmlData(content);
      onNotify(`Successfully loaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = () => {
    setFileName('Customised Project Dashboard.html');
    setFileSize(sampleHtml.length);
    setHtmlContent(sampleHtml);
    parseHtmlData(sampleHtml);
    onNotify('Loaded sample NPD Customised Project Dashboard HTML template.');
  };

  const handleImportToNexus = () => {
    if (parsedRows.length === 0) {
      onNotify('No table rows detected to import.');
      return;
    }

    // Convert parsed rows to NPDProject items
    const newProjects: NPDProject[] = parsedRows.map((row, idx) => {
      const code = row['Project Code'] || row['Code'] || `NPD-2026-${120 + idx}`;
      const title = row['Project Title'] || row['Title'] || row['Project Name'] || `Imported NPD Project ${idx + 1}`;
      const rawStage = row['Stage Gate'] || row['Stage'] || row['Gate'] || 'Gate 2';
      let gateNum: 0 | 1 | 2 | 3 | 4 | 5 = 2;
      if (rawStage.includes('0')) gateNum = 0;
      else if (rawStage.includes('1')) gateNum = 1;
      else if (rawStage.includes('2')) gateNum = 2;
      else if (rawStage.includes('3')) gateNum = 3;
      else if (rawStage.includes('4')) gateNum = 4;
      else if (rawStage.includes('5')) gateNum = 5;

      const rawHealth = row['Health'] || row['Status'] || 'On Track';
      const health = rawHealth.includes('Critical') ? 'Critical' : rawHealth.includes('Risk') ? 'At Risk' : 'On Track';

      const lead = row['Project Lead'] || row['Lead'] || 'Engineering Lead';
      const rawBudget = row['Budget ($)'] || row['Budget'] || '$350,000';
      const numBudget = parseInt(rawBudget.replace(/[^0-9]/g, '')) || 350000;
      const targetDate = row['Target Launch'] || row['Launch Date'] || '2027-01-15';

      return {
        id: `imported-${Date.now()}-${idx}`,
        code,
        title,
        description: `Imported from Customised Project Dashboard.html (${fileName}). Stage: Gate ${gateNum}.`,
        category: 'IoT & Smart Devices',
        currentGate: gateNum,
        health,
        priority: 'High',
        projectLead: lead,
        engineeringLead: lead,
        startDate: '2026-01-01',
        targetLaunchDate: targetDate,
        budgetAllocated: numBudget,
        actualSpend: Math.round(numBudget * 0.45),
        ecoCount: 2,
        milestones: [
          { id: `im-${idx}-1`, name: 'Initial Architecture Review', targetDate: '2026-06-01', status: 'Completed' },
          { id: `im-${idx}-2`, name: 'Target Launch', targetDate: targetDate, status: 'Pending' }
        ],
        deliverables: [
          { id: `id-${idx}-1`, title: 'PRD Specifications Sign-off', gate: gateNum, completed: true, requiredForSignoff: true, assignee: lead, dueDate: '2026-06-15' },
          { id: `id-${idx}-2`, title: 'Engineering Validation Protocol', gate: gateNum, completed: false, requiredForSignoff: true, assignee: lead, dueDate: '2026-09-01' }
        ],
        risks: [
          { id: `ir-${idx}-1`, title: 'Component supply lead times', category: 'Supply Chain', probability: 3, impact: 3, mitigation: 'Dual supplier qualification', owner: lead, status: 'Mitigating' }
        ]
      };
    });

    onImportExtractedProjects(newProjects);
    onNotify(`Successfully imported ${newProjects.length} projects into NPD Nexus!`);
  };

  return (
    <div className="space-y-6">
      {/* Informative Explanation Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Discover & Import: Customised Project Dashboard
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You pointed to <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px] text-slate-800 dark:text-slate-200">file:///Y:/NPD/Data/Customised%20Project%20Dashboard.html</code>.
              Because web browsers enforce strict security sandboxing, cloud applications cannot automatically read <code className="font-mono text-[11px]">file:///</code> URLs directly from your computer's local drives or mapped Windows network shares (<code className="font-mono text-[11px]">Y:\</code>).
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can instantly load, inspect, and parse your local HTML dashboard file below, or click <strong>Load Sample NPD HTML</strong> to test the live parser immediately.
            </p>
          </div>
        </div>

        {/* Dropzone & Action Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".html,.htm,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Drop your "Customised Project Dashboard.html" here
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              or click to browse from your computer / Y: drive
            </div>
          </div>

          {/* Quick Actions & Paste Option */}
          <div className="flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Quick Discovery Options
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Test with our authentic NPD sample template or paste HTML markup from your editor.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleLoadSample}
                className="px-3 py-1.5 text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample NPD HTML</span>
              </button>

              <button
                onClick={() => {
                  const pasted = prompt('Paste raw HTML code here:');
                  if (pasted) {
                    setHtmlContent(pasted);
                    setFileName('Pasted_Dashboard.html');
                    setFileSize(pasted.length);
                    parseHtmlData(pasted);
                    onNotify('Parsed pasted HTML successfully.');
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-white dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Paste HTML Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rendered HTML Viewer & Extracted Data Studio */}
      {htmlContent ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* Header Bar */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="font-mono">{fileName}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                ({(fileSize / 1024).toFixed(1)} KB · {parsedRows.length} table rows detected)
              </span>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Rendered Preview
              </button>
              <button
                onClick={() => setActiveTab('extracted')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'extracted'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Extracted Data ({parsedRows.length})
              </button>
              <button
                onClick={() => setActiveTab('source')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeTab === 'source'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                HTML Source
              </button>
            </div>
          </div>

          {/* Tab 1: Rendered HTML Sandbox */}
          {activeTab === 'preview' && (
            <div className="p-4 bg-slate-100 dark:bg-slate-950">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Isolated Sandbox Preview</span>
                  <span>Origin: Local File</span>
                </div>
                <iframe
                  title="HTML Dashboard Preview"
                  srcDoc={htmlContent}
                  className="w-full h-[450px] border-0 bg-white"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Extracted Data & Import */}
          {activeTab === 'extracted' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Parsed Project Table Data
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    The parser extracted structured columns from the HTML table tags.
                  </p>
                </div>

                {parsedRows.length > 0 && (
                  <button
                    onClick={handleImportToNexus}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sync & Merge into Nexus Dashboard</span>
                  </button>
                )}
              </div>

              {parsedRows.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No HTML table rows found in this file. Switch to "HTML Source" to inspect markup.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                        {Object.keys(parsedRows[0]).map((key) => (
                          <th key={key} className="py-2 px-3 font-semibold">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parsedRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="py-2.5 px-3 font-mono text-[11px]">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Raw Source Code */}
          {activeTab === 'source' && (
            <div className="p-4 bg-slate-900 text-slate-100 overflow-x-auto">
              <pre className="font-mono text-xs leading-relaxed max-h-[450px] overflow-y-auto">
                {htmlContent}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center text-slate-500">
          <FileCode className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No File Loaded Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Drag and drop your local HTML file above, or click "Load Sample NPD HTML" to test the sandbox and extractor immediately.
          </p>
        </div>
      )}
    </div>
  );
};
