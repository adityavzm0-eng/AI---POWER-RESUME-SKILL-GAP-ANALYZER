import React, { useState } from 'react';
import { useDashboard } from './context/DashboardContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DataProfilingView } from './components/DataProfilingView';
import { DataPreviewTable } from './components/DataPreviewTable';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { FileUploadModal } from './components/FileUploadModal';
import { FilterDrawer } from './components/FilterDrawer';
import { AddChartModal } from './components/AddChartModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, loading, error, dataset } = useDashboard();
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar onOpenExport={() => setIsExportOpen(true)} />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar />

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {loading && !dataset ? (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Profiling dataset & synthesizing dashboard...
              </p>
            </div>
          ) : error && !dataset ? (
            <div className="p-8 text-center text-rose-500 max-w-md mx-auto">
              <p className="font-bold text-lg mb-2">Error initializing application</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div id="dashboard-capture-root" className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'profiling' && <DataProfilingView />}
              {activeTab === 'explorer' && <DataPreviewTable />}
              {activeTab === 'insights' && <AIInsightsPanel />}
              {activeTab === 'copilot' && <AICopilotDrawer isDrawer={false} />}
            </div>
          )}
        </main>
      </div>

      {/* Slide-over Copilot Drawer (available when triggered from Navbar) */}
      <AICopilotDrawer isDrawer={true} />

      {/* Slide-over Multi-dimensional Slicing Filters */}
      <FilterDrawer />

      {/* Modals */}
      <FileUploadModal />
      <AddChartModal />
      <SettingsModal />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
};

export default App;
