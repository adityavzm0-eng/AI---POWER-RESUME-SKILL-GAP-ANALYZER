"""
InsightAI In-Memory Dataset Store
Manages loaded datasets, caching profiling results, and fast multi-dimensional filtering.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
import pandas as pd

class DatasetStore:
    def __init__(self):
        self._datasets: Dict[str, Dict[str, Any]] = {}

    def save_dataset(self, df: pd.DataFrame, filename: str, dataset_id: Optional[str] = None) -> str:
        if not dataset_id:
            dataset_id = f"ds_{uuid.uuid4().hex[:8]}"
            
        self._datasets[dataset_id] = {
            "id": dataset_id,
            "filename": filename,
            "df": df,
            "created_at": datetime.now().isoformat(),
            "profile": None,
            "dashboard": None,
            "insights": None
        }
        return dataset_id

    def get_dataset(self, dataset_id: str) -> Optional[Dict[str, Any]]:
        return self._datasets.get(dataset_id)

    def get_dataframe(self, dataset_id: str) -> Optional[pd.DataFrame]:
        entry = self._datasets.get(dataset_id)
        if entry:
            return entry["df"]
        return None

    def list_datasets(self):
        return [
            {
                "id": k,
                "filename": v["filename"],
                "created_at": v["created_at"],
                "row_count": len(v["df"]),
                "col_count": len(v["df"].columns)
            }
            for k, v in self._datasets.items()
        ]

    def set_cache(self, dataset_id: str, key: str, value: Any):
        if dataset_id in self._datasets:
            self._datasets[dataset_id][key] = value

    def get_cache(self, dataset_id: str, key: str) -> Any:
        if dataset_id in self._datasets:
            return self._datasets[dataset_id].get(key)
        return None

    def apply_filters(self, df: pd.DataFrame, filters: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        if not filters:
            return df
        
        filtered = df.copy()
        
        # Categorical filters: { "column_name": ["Val1", "Val2"] }
        cat_filters = filters.get("categorical", {})
        for col, selected_vals in cat_filters.items():
            if col in filtered.columns and selected_vals and len(selected_vals) > 0:
                filtered = filtered[filtered[col].astype(str).isin([str(x) for x in selected_vals])]

        # Numeric range filters: { "column_name": {"min": 10, "max": 100} }
        num_filters = filters.get("numeric", {})
        for col, r in num_filters.items():
            if col in filtered.columns:
                min_v = r.get("min")
                max_v = r.get("max")
                if min_v is not None:
                    filtered = filtered[filtered[col] >= float(min_v)]
                if max_v is not None:
                    filtered = filtered[filtered[col] <= float(max_v)]

        # Date range filters: { "column_name": {"start": "2024-01-01", "end": "2024-12-31"} }
        date_filters = filters.get("date", {})
        for col, d in date_filters.items():
            if col in filtered.columns:
                start_d = d.get("start")
                end_d = d.get("end")
                if start_d:
                    filtered = filtered[pd.to_datetime(filtered[col], errors='coerce') >= pd.to_datetime(start_d)]
                if end_d:
                    filtered = filtered[pd.to_datetime(filtered[col], errors='coerce') <= pd.to_datetime(end_d)]

        return filtered

# Global singleton
store = DatasetStore()
