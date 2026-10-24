import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DatasetPayload,
  FilterState,
  KPICard,
  ChartConfig,
  AIInsightsResponse,
  ChatMessage,
  ChartType
} from '../types/dashboard';
import * as api from '../services/api';

interface DashboardContextType {
  // Dataset State
  dataset: DatasetPayload | null;
  loading: boolean;
  error: string | null;
  setDataset: (ds: DatasetPayload) => void;
  loadSampleDataset: (key: string) => Promise<void>;
  uploadFile: (file: File) => Promise<void>;

  // Navigation & UI
  activeTab: 'dashboard' | 'profiling' | 'explorer' | 'insights' | 'copilot';
  setActiveTab: (tab: 'dashboard' | 'profiling' | 'explorer' | 'insights' | 'copilot') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Modals & Panels
  isUploadOpen: boolean;
  setIsUploadOpen: (v: boolean) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (v: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (v: boolean) => void;
  isAddChartOpen: boolean;
  setIsAddChartOpen: (v: boolean) => void;

  // Global Slicing Filters
  filters: FilterState;
  updateFilter: (type: 'categorical' | 'numeric' | 'date', col: string, value: any) => void;
  clearFilters: () => void;
  activeFilterCount: number;

  // Dynamic Metrics & Charts
  kpis: KPICard[];
  charts: ChartConfig[];
  updateChart: (chartId: string, updates: Partial<ChartConfig>) => Promise<void>;
  addCustomChart: (chart: ChartConfig) => void;
  removeChart: (chartId: string) => void;

  // AI Insights
  insights: AIInsightsResponse | null;
  loadingInsights: boolean;
  refreshInsights: () => Promise<void>;

  // Copilot Chat
  messages: ChatMessage[];
  isThinking: boolean;
  sendChatMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  // Settings
  apiKey: string;
  setApiKey: (key: string) => void;
  toast: { message: string; type: 'info' | 'success' | 'error' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dataset, setDatasetState] = useState<DatasetPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profiling' | 'explorer' | 'insights' | 'copilot'>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddChartOpen, setIsAddChartOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({ categorical: {}, numeric: {}, date: {} });
  const [kpis, setKpis] = useState<KPICard[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);

  const [insights, setInsights] = useState<AIInsightsResponse | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // User provided API key default
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem('insightai_api_key') || 'key_Jf5XMGG0ZZrpuyLU';
  });

  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('insightai_api_key', key);
    showToast('AI API configuration updated successfully', 'success');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initial load
  useEffect(() => {
    document.documentElement.classList.add('dark');
    loadSampleDataset('ecommerce');
  }, []);

  const setDataset = (ds: DatasetPayload) => {
    setDatasetState(ds);
    setKpis(ds.dashboard?.kpis || []);
    setCharts(ds.dashboard?.charts || []);
    setFilters({ categorical: {}, numeric: {}, date: {} });
    setInsights(null);
    
    // Welcome message in Copilot
    const initMsg: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **InsightAI Copilot**. I've profiled **${ds.filename}** (${ds.row_count.toLocaleString()} rows, ${ds.col_count} columns).\n\nAsk me any question about your data, request calculations, or ask me to generate a custom chart!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_followups: [
        `What is the average ${ds.dashboard?.metadata?.primary_metric || 'metric'}?`,
        `Which ${ds.dashboard?.metadata?.primary_dimension || 'category'} performed best?`,
        'Are there any data quality issues or missing values?'
      ]
    };
    setMessages([initMsg]);
  };

  const loadSampleDataset = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.loadSample(key);
      setDataset(data);
      showToast(`Loaded sample dataset: ${data.filename}`, 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to load sample dataset');
      showToast('Error loading dataset', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.uploadDatasetFile(file);
      setDataset(data);
      setIsUploadOpen(false);
      showToast(`Successfully uploaded ${data.filename}`, 'success');
    } catch (err: any) {
      setError(err.message || 'File upload failed');
      showToast(err.message || 'Upload failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Slicing filters update
  const updateFilter = async (type: 'categorical' | 'numeric' | 'date', col: string, value: any) => {
    const updated = { ...filters };
    if (type === 'categorical') {
      updated.categorical = { ...updated.categorical, [col]: value };
      if (!value || value.length === 0) {
        delete updated.categorical[col];
      }
    } else if (type === 'numeric') {
      updated.numeric = { ...updated.numeric, [col]: value };
    } else if (type === 'date') {
      updated.date = { ...updated.date, [col]: value };
    }
    setFilters(updated);

    if (dataset) {
      try {
        // Recalculate KPIs
        const kpiRes = await api.updateKPIs(dataset.dataset_id, updated);
        if (kpiRes.kpis) {
          setKpis(kpiRes.kpis);
        }

        // Recompute all charts with active filters
        const recomputed = await Promise.all(
          charts.map(async (c) => {
            try {
              const res = await api.computeChartData(dataset.dataset_id, {
                x_column: c.x_column,
                y_column: c.y_column,
                aggregation: c.aggregation,
                chart_type: c.type,
                filters: updated
              });
              return { ...c, data: res.data };
            } catch {
              return c;
            }
          })
        );
        setCharts(recomputed);
      } catch (e) {
        console.error('Failed to filter data:', e);
      }
    }
  };

  const clearFilters = async () => {
    const emptyFilters: FilterState = { categorical: {}, numeric: {}, date: {} };
    setFilters(emptyFilters);
    if (dataset) {
      setKpis(dataset.dashboard?.kpis || []);
      setCharts(dataset.dashboard?.charts || []);
      showToast('Filters cleared', 'info');
    }
  };

  const activeFilterCount =
    Object.keys(filters.categorical).length +
    Object.keys(filters.numeric).length +
    Object.keys(filters.date).length;

  // Chart actions
  const updateChart = async (chartId: string, updates: Partial<ChartConfig>) => {
    if (!dataset) return;
    const chart = charts.find((c) => c.id === chartId);
    if (!chart) return;

    const merged = { ...chart, ...updates };
    
    // If column or aggregation changed, re-fetch data
    if (
      updates.x_column !== undefined ||
      updates.y_column !== undefined ||
      updates.aggregation !== undefined
    ) {
      try {
        const res = await api.computeChartData(dataset.dataset_id, {
          x_column: merged.x_column,
          y_column: merged.y_column,
          aggregation: merged.aggregation,
          chart_type: merged.type,
          filters
        });
        merged.data = res.data;
      } catch (err) {
        console.error('Failed to update chart data:', err);
      }
    }

    setCharts((prev) => prev.map((c) => (c.id === chartId ? merged : c)));
    showToast(`Updated chart "${merged.title}"`, 'info');
  };

  const addCustomChart = (chart: ChartConfig) => {
    setCharts((prev) => [chart, ...prev]);
    showToast(`Added visualization "${chart.title}"`, 'success');
  };

  const removeChart = (chartId: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== chartId));
    showToast('Chart removed from dashboard', 'info');
  };

  // AI Insights
  const refreshInsights = async () => {
    if (!dataset) return;
    setLoadingInsights(true);
    try {
      const res = await api.fetchAIInsights(dataset.dataset_id, {
        user_api_key: apiKey
      });
      setInsights(res);
      showToast('AI insights generated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate insights', 'error');
    } finally {
      setLoadingInsights(false);
    }
  };

  // Copilot Chat
  const sendChatMessage = async (content: string) => {
    if (!dataset || !content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({ role: m.role, content: m.content }));
      const resp = await api.queryCopilot(dataset.dataset_id, content.trim(), historyPayload, apiKey);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resp.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        computed_facts: resp.computed_facts,
        chart_suggestion: resp.chart_suggestion,
        suggested_followups: resp.suggested_followups
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Sorry, I encountered an issue analyzing that: ${err.message || 'Unknown error'}. Please try asking in a different way.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    if (dataset) {
      setDataset(dataset);
    } else {
      setMessages([]);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dataset,
        loading,
        error,
        setDataset,
        loadSampleDataset,
        uploadFile,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        isUploadOpen,
        setIsUploadOpen,
        isFilterOpen,
        setIsFilterOpen,
        isCopilotOpen,
        setIsCopilotOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isAddChartOpen,
        setIsAddChartOpen,
        filters,
        updateFilter,
        clearFilters,
        activeFilterCount,
        kpis,
        charts,
        updateChart,
        addCustomChart,
        removeChart,
        insights,
        loadingInsights,
        refreshInsights,
        messages,
        isThinking,
        sendChatMessage,
        clearChat,
        apiKey,
        setApiKey,
        toast,
        showToast
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
