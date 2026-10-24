export type ColumnType = "numerical" | "categorical" | "date" | "id" | "boolean" | "text" | "empty";

export interface HistogramBin {
  bin: string;
  count: number;
  start: number;
  end: number;
}

export interface ValueDistribution {
  value: string;
  count: number;
  pct: number;
}

export interface NumericStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  std: number;
  q25: number;
  q75: number;
  iqr: number;
  skewness: number;
  outliers_count: number;
  outliers_pct: number;
  outlier_bounds: { lower: number; upper: number };
  histogram: HistogramBin[];
}

export interface CategoricalStats {
  top_values: ValueDistribution[];
  mode: string;
  cardinality: number;
}

export interface DateStats {
  min_date: string;
  max_date: string;
  span_days: number;
  total_valid_dates: number;
}

export interface ColumnProfile {
  name: string;
  type: ColumnType;
  missing_count: number;
  missing_pct: number;
  unique_count: number;
  raw_dtype: string;
  stats?: NumericStats | CategoricalStats | DateStats | any;
}

export interface CorrelationItem {
  col1: string;
  col2: string;
  r: number;
  abs_r: number;
  relationship: string;
}

export interface DatasetHealth {
  score: number;
  rating: string;
  color: string;
  completeness_pct: number;
  uniqueness_pct: number;
}

export interface DatasetProfile {
  dataset_health: DatasetHealth;
  overview: {
    total_rows: number;
    total_cols: number;
    duplicate_rows: number;
    duplicate_pct: number;
    missing_cells: number;
    missing_pct: number;
    column_types_count: Record<string, number>;
  };
  column_types: {
    numerical: string[];
    categorical: string[];
    date: string[];
    id: string[];
    boolean: string[];
  };
  columns: Record<string, ColumnProfile>;
  correlations: CorrelationItem[];
  correlation_matrix: Record<string, Record<string, number>>;
  quality_report: {
    summary: string;
    caveat: string;
    warnings: string[];
  };
}

export interface KPICard {
  id: string;
  title: string;
  value: string;
  raw_value: number;
  column: string;
  aggregation: string;
  description: string;
  trend: string;
  trend_positive: boolean;
}

export type ChartType = "bar" | "line" | "area" | "pie" | "scatter";

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  x_column: string;
  y_column?: string;
  aggregation: string;
  data: any[];
  description?: string;
  width?: "full" | "half";
}

export interface DashboardConfig {
  kpis: KPICard[];
  charts: ChartConfig[];
  metadata: {
    primary_metric?: string;
    secondary_metric?: string;
    primary_dimension?: string;
    primary_date?: string;
  };
}

export interface InsightItem {
  category: "key_finding" | "trend" | "anomaly" | "opportunity" | "risk" | "recommendation";
  title: string;
  explanation: string;
  evidence: string;
  is_hypothesis: boolean;
  confidence: "High" | "Medium" | "Low";
}

export interface AIInsightsResponse {
  executive_summary: string;
  insights: InsightItem[];
  data_quality_notes: string[];
  provider: string;
}

export interface FilterState {
  categorical: Record<string, string[]>;
  numeric: Record<string, { min?: number; max?: number }>;
  date: Record<string, { start?: string; end?: string }>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  computed_facts?: Record<string, any>;
  chart_suggestion?: ChartConfig;
  suggested_followups?: string[];
}

export interface DatasetPayload {
  dataset_id: string;
  filename: string;
  row_count: number;
  col_count: number;
  profile: DatasetProfile;
  dashboard: DashboardConfig;
  preview_rows: any[];
}
