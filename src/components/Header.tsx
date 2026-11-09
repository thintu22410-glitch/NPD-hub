import React from 'react';
import { Plus, Sun, Moon, Database } from 'lucide-react';

export type ActiveTab = 'portfolio' | 'stage-gate' | 'timeline' | 'risks' | 'ecos' | 'cms-editor' | 'discover-local' | 'customise';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewProject: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  hasLocalLoaded?: boolean;
  isDbConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewProject,
  theme,
  onToggleTheme,
  hasLocalLoaded,
  isDbConnected = true,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => onSelectTab('portfolio')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                NPD Project Nexus
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
              <Database className="w-3 h-3 text-emerald-500" />
              <span>Firestore Live</span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectTab('portfolio')}
              className={`whitespace-nowrap pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => onSelectTab('stage-gate')}
              className={`whitespace-nowrap pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'stage-gate'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Stage-Gate
            </button>
            <button
              onClick={() => onSelectTab('timeline')}
              className={`whitespace-nowrap pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => onSelectTab('risks')}
              className={`whitespace-nowrap pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'risks'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Risk Heatmap
            </button>
            <button
              onClick={() => onSelectTab('ecos')}
              className={`whitespace-nowrap pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'ecos'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ECOs
            </button>
            <button
              onClick={() => onSelectTab('cms-editor')}
              className={`whitespace-nowrap pb-0.5 transition-colors cursor-pointer ${
                activeTab === 'cms-editor'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              CMS & Functions
            </button>
            <button
              onClick={() => onSelectTab('discover-local')}
              className={`whitespace-nowrap pb-0.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'discover-local'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>HTML Discoverer</span>
              {hasLocalLoaded && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  (Loaded)
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenNewProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New NPD Project</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
