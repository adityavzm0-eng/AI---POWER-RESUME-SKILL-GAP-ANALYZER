import {
  DatasetPayload,
  FilterState,
  ChartConfig,
  AIInsightsResponse,
  ChatMessage
} from '../types/dashboard';

const API_BASE = '/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function getSampleDatasets() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to load sample catalog');
  return res.json();
}

export async function loadSample(sampleKey: string): Promise<DatasetPayload> {
  const res = await fetch(`${API_BASE}/sample/${sampleKey}`, {
    method: 'POST'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to load sample dataset');
  }
  return res.json();
}

export async function uploadDatasetFile(file: File): Promise<DatasetPayload> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Upload failed');
  }

  return res.json();
}

export async function getDatasetDetails(datasetId: string): Promise<DatasetPayload> {
  const res = await fetch(`${API_BASE}/dataset/${datasetId}`);
  if (!res.ok) throw new Error('Failed to fetch dataset details');
  return res.json();
}

export async function fetchDatasetPreview(
  datasetId: string,
  params: {
    page: number;
    page_size: number;
    search?: string;
    sort_column?: string;
    sort_order?: string;
    filters?: FilterState;
  }
) {
  const res = await fetch(`${API_BASE}/dataset/${datasetId}/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to fetch preview records');
  return res.json();
}

export async function computeChartData(
  datasetId: string,
  params: {
    x_column: string;
    y_column?: string;
    aggregation: string;
    chart_type: string;
    limit?: number;
    filters?: FilterState;
  }
) {
  const res = await fetch(`${API_BASE}/dataset/${datasetId}/chart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to recompute chart');
  return res.json();
}

export async function updateKPIs(datasetId: string, filters: FilterState) {
  const res = await fetch(`${API_BASE}/dataset/${datasetId}/kpis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  if (!res.ok) throw new Error('Failed to recalculate KPIs');
  return res.json();
}

export async function fetchAIInsights(
  datasetId: string,
  config?: {
    user_api_key?: string;
    provider?: string;
    model_name?: string;
  }
): Promise<AIInsightsResponse> {
  const res = await fetch(`${API_BASE}/dataset/${datasetId}/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config || {})
  });
  if (!res.ok) throw new Error('Failed to generate insights');
  return res.json();
}

export async function queryCopilot(
  datasetId: string,
  query: string,
  history?: { role: string; content: string }[],
  apiKey?: string
) {
  const res = await fetch(`${API_BASE}/dataset/${datasetId}/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataset_id: datasetId,
      query,
      history,
      user_api_key: apiKey
    })
  });
  if (!res.ok) throw new Error('Failed to communicate with Copilot');
  return res.json();
}

export function getCsvExportUrl(datasetId: string): string {
  return `${API_BASE}/dataset/${datasetId}/export/csv`;
}
