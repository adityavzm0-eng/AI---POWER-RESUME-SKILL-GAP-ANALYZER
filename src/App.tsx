import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ResultsPage } from './pages/ResultsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { StudioPage } from './pages/StudioPage';
import { JobComparePage } from './pages/JobComparePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

import { AnalysisResult, HistoryRecord, SamplePreset } from './types/skillsync';
import { 
  analyzeResumeApi, 
  getHistoryApi, 
  getHistoryByIdApi, 
  deleteHistoryApi, 
  clearAllHistoryApi, 
  getSampleDataApi 
} from './services/api';
import { exportAnalysisToPdf } from './services/pdfExport';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Active Analysis State
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  
  // History & Presets State
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [samplePresets, setSamplePresets] = useState<SamplePreset[]>([]);

  // Load sample presets & past history on mount
  useEffect(() => {
    getSampleDataApi()
      .then(setSamplePresets)
      .catch((err) => console.warn('Could not fetch sample presets:', err));

    getHistoryApi()
      .then(setHistory)
      .catch((err) => console.warn('Could not fetch history:', err));
  }, []);

  // Main Resume Analysis Action
  const handleAnalyze = async (formData: FormData) => {
    setIsAnalyzing(true);
    setAnalysisProgress('Extracting readable text & parsing sections...');

    const progressTimer1 = setTimeout(() => {
      setAnalysisProgress('Mining technical skills & normalizing canonical aliases...');
    }, 600);

    const progressTimer2 = setTimeout(() => {
      setAnalysisProgress('Computing Scikit-learn TF-IDF semantic vector similarity...');
    }, 1300);

    const progressTimer3 = setTimeout(() => {
      setAnalysisProgress('Synthesizing 4-week roadmap & ATS recommendations...');
    }, 2000);

    try {
      const result = await analyzeResumeApi(formData);
      setCurrentAnalysis(result);
      
      // Refresh history
      getHistoryApi().then(setHistory).catch(() => {});
      
      // Auto-navigate to Results dashboard
      setActiveTab('results');
    } catch (err: any) {
      alert('Analysis Error: ' + (err.message || 'Failed to complete analysis'));
    } finally {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  // Quick 1-Click Demo Launcher
  const handleLoadDemoPreset = async () => {
    if (samplePresets.length === 0) {
      const presets = await getSampleDataApi().catch(() => []);
      setSamplePresets(presets);
    }
    const preset = samplePresets[0];
    if (preset) {
      const formData = new FormData();
      formData.append('resume_text', preset.resume_text);
      formData.append('job_description', preset.job_description);
      formData.append('target_role', preset.role_title);
      formData.append('experience_level', preset.experience_level);
      formData.append('save_history', 'true');
      await handleAnalyze(formData);
    }
  };

  // Select Record from History
  const handleSelectHistoryRecord = async (id: string) => {
    try {
      const fullRecord = await getHistoryByIdApi(id);
      setCurrentAnalysis(fullRecord);
      setActiveTab('results');
    } catch (err) {
      alert('Could not retrieve full analysis record.');
    }
  };

  // Delete Record from History
  const handleDeleteHistoryRecord = async (id: string) => {
    try {
      await deleteHistoryApi(id);
      setHistory(prev => prev.filter(r => r.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
    } catch (err) {
      alert('Failed to delete history item.');
    }
  };

  // Clear All History
  const handleClearAllHistory = async () => {
    try {
      await clearAllHistoryApi();
      setHistory([]);
      setCurrentAnalysis(null);
    } catch (err) {
      alert('Failed to purge history.');
    }
  };

  // Export PDF Report
  const handleExportPdf = () => {
    if (currentAnalysis) {
      exportAnalysisToPdf(currentAnalysis);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLoadPreset={handleLoadDemoPreset}
        onExportPdf={handleExportPdf}
        hasAnalysisData={Boolean(currentAnalysis)}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Workspace with Collapsible Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          hasAnalysis={Boolean(currentAnalysis)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0B0F19] via-[#0D1322] to-[#090D16]">
          {activeTab === 'landing' && (
            <LandingPage
              onStartAnalysis={() => setActiveTab('analyzer')}
              onLoadPreset={handleLoadDemoPreset}
            />
          )}

          {activeTab === 'overview' && (
            <OverviewPage
              currentAnalysis={currentAnalysis}
              history={history}
              onNavigate={setActiveTab}
              onSelectHistory={handleSelectHistoryRecord}
            />
          )}

          {activeTab === 'analyzer' && (
            <AnalyzerPage
              onAnalyze={handleAnalyze}
              samplePresets={samplePresets}
              isAnalyzing={isAnalyzing}
              analysisProgress={analysisProgress}
            />
          )}

          {activeTab === 'results' && currentAnalysis && (
            <ResultsPage
              data={currentAnalysis}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'roadmap' && currentAnalysis && (
            <RoadmapPage
              roadmap={currentAnalysis.roadmap}
              interviewPrep={currentAnalysis.interview_prep}
              projectRecommendations={currentAnalysis.project_recommendations}
            />
          )}

          {activeTab === 'studio' && currentAnalysis && (
            <StudioPage
              studioData={currentAnalysis.improvement_studio}
              originalResumeText={currentAnalysis.resume_skills.map(s => s.evidence.join(' ')).join('\n') || ''}
              jobDescriptionText={currentAnalysis.jd_analysis.responsibilities.join('\n') || ''}
              targetRole={currentAnalysis.target_role}
            />
          )}

          {activeTab === 'jobs' && (
            <JobComparePage
              currentResumeText={
                currentAnalysis
                  ? Object.values(currentAnalysis.resume_metadata.sections || {}).join('\n\n')
                  : ''
              }
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              history={history}
              onSelectRecord={handleSelectHistoryRecord}
              onDeleteRecord={handleDeleteHistoryRecord}
              onClearAll={handleClearAllHistory}
              onRefresh={() => getHistoryApi().then(setHistory)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
