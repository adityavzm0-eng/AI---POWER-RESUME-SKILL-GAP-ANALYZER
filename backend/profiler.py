"""
InsightAI Data Profiler Engine
Performs statistical profiling, column type classification, outlier detection,
distribution analysis, correlation calculation, and quality scoring.
"""

from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
import math

def infer_column_type(series: pd.Series, col_name: str, total_rows: int) -> str:
    # Check if empty or null
    valid_series = series.dropna()
    if len(valid_series) == 0:
        return "empty"
    
    col_lower = col_name.lower().strip()
    
    # Check Boolean
    unique_vals = set(valid_series.unique())
    if unique_vals.issubset({True, False, 0, 1, "0", "1", "true", "false", "True", "False", "yes", "no", "Yes", "No", "Y", "N"}):
        if len(unique_vals) <= 2:
            return "boolean"
            
    # Check Identifier (Must have ID in name or be string/object with unique keys, never continuous float metrics!)
    is_numeric = pd.api.types.is_numeric_dtype(series)
    is_float = pd.api.types.is_float_dtype(series)
    id_keywords = ["_id", "id", "uuid", "guid", "code", "key", "account_num", "order_id", "emp_id", "patient_id"]
    has_id_keyword = any(k in col_lower for k in id_keywords)
    
    if has_id_keyword and not is_float:
        if len(unique_vals) >= total_rows * 0.80:
            return "id"
            
    if not is_numeric and len(unique_vals) == total_rows and len(unique_vals) > 10 and not is_float:
        if not any(m in col_lower for m in ["sales", "profit", "amount", "revenue", "price", "cost", "salary"]):
            return "id"
        
    # Check Date/Time
    if pd.api.types.is_datetime64_any_dtype(series):
        return "date"
    if valid_series.dtype == object or isinstance(valid_series.iloc[0], str):
        # Quick check for date-like strings
        sample = valid_series.head(50)
        date_keywords = ["date", "time", "day", "created_at", "updated_at", "timestamp", "year", "month"]
        likely_date_name = any(k in col_lower for k in date_keywords)
        
        try:
            converted = pd.to_datetime(sample, errors='coerce')
            success_rate = converted.notna().sum() / len(sample)
            if success_rate >= 0.85:
                # Avoid pure numbers being misidentified as dates (e.g., years or integers unless named date)
                if not (sample.astype(str).str.isnumeric().all() and not likely_date_name):
                    return "date"
        except Exception:
            pass

    # Check Numerical
    if pd.api.types.is_numeric_dtype(series):
        # If very few unique numbers in an integer column, could be categorical
        if len(unique_vals) <= 5 and series.dtype in ['int64', 'int32', 'int16'] and total_rows > 30:
            return "categorical"
        return "numerical"
        
    # Check if string column contains purely numerical values
    try:
        sample = valid_series.head(100).astype(str).str.replace(',', '').str.replace('$', '').str.strip()
        num_converted = pd.to_numeric(sample, errors='coerce')
        if num_converted.notna().sum() / len(sample) > 0.90:
            return "numerical"
    except Exception:
        pass

    # Check Categorical vs Text
    if len(unique_vals) <= 60 or (len(unique_vals) / max(total_rows, 1) < 0.25):
        return "categorical"
        
    avg_len = valid_series.astype(str).str.len().mean()
    if avg_len > 35:
        return "text"
        
    return "categorical"

def profile_dataset(df: pd.DataFrame) -> Dict[str, Any]:
    total_rows = len(df)
    total_cols = len(df.columns)
    
    if total_rows == 0:
        return {
            "total_rows": 0,
            "total_cols": total_cols,
            "columns": {},
            "summary": "Empty dataset."
        }
        
    # Missing & Duplicate calculations
    duplicate_rows = int(df.duplicated().sum())
    duplicate_pct = round((duplicate_rows / total_rows) * 100, 2)
    
    total_cells = total_rows * total_cols
    total_missing = int(df.isna().sum().sum())
    missing_pct = round((total_missing / max(total_cells, 1)) * 100, 2)
    
    columns_profile: Dict[str, Any] = {}
    numerical_cols: List[str] = []
    categorical_cols: List[str] = []
    date_cols: List[str] = []
    id_cols: List[str] = []
    boolean_cols: List[str] = []
    
    for col in df.columns:
        series = df[col]
        col_type = infer_column_type(series, str(col), total_rows)
        missing_count = int(series.isna().sum())
        missing_col_pct = round((missing_count / total_rows) * 100, 2)
        unique_count = int(series.nunique(dropna=True))
        
        col_info: Dict[str, Any] = {
            "name": str(col),
            "type": col_type,
            "missing_count": missing_count,
            "missing_pct": missing_col_pct,
            "unique_count": unique_count,
            "raw_dtype": str(series.dtype)
        }
        
        if col_type == "numerical":
            numerical_cols.append(str(col))
            # Clean numeric series
            clean_s = pd.to_numeric(series.dropna(), errors='coerce').dropna()
            if len(clean_s) > 0:
                mean_val = float(clean_s.mean())
                std_val = float(clean_s.std()) if len(clean_s) > 1 else 0.0
                min_val = float(clean_s.min())
                max_val = float(clean_s.max())
                median_val = float(clean_s.median())
                q25 = float(clean_s.quantile(0.25))
                q75 = float(clean_s.quantile(0.75))
                iqr = q75 - q25
                
                # Outlier detection via IQR
                lower_bound = q25 - 1.5 * iqr
                upper_bound = q75 + 1.5 * iqr
                outliers = clean_s[(clean_s < lower_bound) | (clean_s > upper_bound)]
                outlier_count = int(len(outliers))
                outlier_pct = round((outlier_count / len(clean_s)) * 100, 2)
                
                skew = float(clean_s.skew()) if len(clean_s) > 2 else 0.0
                
                # Create 10 histogram bins
                hist_data = []
                try:
                    counts, bin_edges = np.histogram(clean_s, bins=min(10, max(3, len(clean_s.unique()))))
                    for i in range(len(counts)):
                        hist_data.append({
                            "bin": f"{bin_edges[i]:.1f} - {bin_edges[i+1]:.1f}",
                            "count": int(counts[i]),
                            "start": float(bin_edges[i]),
                            "end": float(bin_edges[i+1])
                        })
                except Exception:
                    pass
                
                col_info["stats"] = {
                    "min": round(min_val, 2),
                    "max": round(max_val, 2),
                    "mean": round(mean_val, 2),
                    "median": round(median_val, 2),
                    "std": round(std_val, 2),
                    "q25": round(q25, 2),
                    "q75": round(q75, 2),
                    "iqr": round(iqr, 2),
                    "skewness": round(skew, 2),
                    "outliers_count": outlier_count,
                    "outliers_pct": outlier_pct,
                    "outlier_bounds": {"lower": round(lower_bound, 2), "upper": round(upper_bound, 2)},
                    "histogram": hist_data
                }
                
        elif col_type in ["categorical", "boolean"]:
            if col_type == "categorical":
                categorical_cols.append(str(col))
            else:
                boolean_cols.append(str(col))
                
            clean_s = series.dropna().astype(str)
            top_vals = clean_s.value_counts().head(10)
            val_dist = [
                {
                    "value": str(val),
                    "count": int(cnt),
                    "pct": round((cnt / total_rows) * 100, 2)
                }
                for val, cnt in top_vals.items()
            ]
            mode_val = str(clean_s.mode().iloc[0]) if len(clean_s) > 0 else "N/A"
            col_info["stats"] = {
                "top_values": val_dist,
                "mode": mode_val,
                "cardinality": unique_count
            }
            
        elif col_type == "date":
            date_cols.append(str(col))
            dt_series = pd.to_datetime(series, errors='coerce').dropna()
            if len(dt_series) > 0:
                min_d = dt_series.min()
                max_d = dt_series.max()
                span_days = (max_d - min_d).days
                col_info["stats"] = {
                    "min_date": min_d.strftime("%Y-%m-%d"),
                    "max_date": max_d.strftime("%Y-%m-%d"),
                    "span_days": span_days,
                    "total_valid_dates": int(len(dt_series))
                }
                
        elif col_type == "id":
            id_cols.append(str(col))
            
        columns_profile[str(col)] = col_info

    # Correlation Matrix for numeric columns
    correlations = []
    correlation_matrix: Dict[str, Dict[str, float]] = {}
    if len(numerical_cols) >= 2:
        try:
            num_df = df[numerical_cols].apply(pd.to_numeric, errors='coerce')
            corr = num_df.corr(method='pearson')
            
            for c1 in numerical_cols:
                correlation_matrix[c1] = {}
                for c2 in numerical_cols:
                    val = corr.loc[c1, c2] if c1 in corr.index and c2 in corr.columns else np.nan
                    correlation_matrix[c1][c2] = round(float(val), 3) if not np.isnan(val) else 0.0

            # List top pairs (excluding self-correlation and duplicates)
            seen_pairs = set()
            for c1 in numerical_cols:
                for c2 in numerical_cols:
                    if c1 != c2:
                        pair_key = tuple(sorted([c1, c2]))
                        if pair_key not in seen_pairs:
                            seen_pairs.add(pair_key)
                            r_val = correlation_matrix[c1][c2]
                            if not math.isnan(r_val) and abs(r_val) >= 0.25:
                                strength = "Strong" if abs(r_val) >= 0.7 else ("Moderate" if abs(r_val) >= 0.4 else "Mild")
                                direction = "Positive" if r_val > 0 else "Negative"
                                correlations.append({
                                    "col1": c1,
                                    "col2": c2,
                                    "r": r_val,
                                    "abs_r": abs(r_val),
                                    "relationship": f"{strength} {direction} Association ({r_val:+.2f})"
                                })
            correlations.sort(key=lambda x: x["abs_r"], reverse=True)
        except Exception:
            pass

    # Data Quality Health Score calculation (0-100)
    completeness_score = max(0.0, 100.0 - (missing_pct * 2))
    uniqueness_score = max(0.0, 100.0 - (duplicate_pct * 3))
    
    # Check outlier penalty
    total_outliers = sum(
        c.get("stats", {}).get("outliers_count", 0)
        for c in columns_profile.values()
        if c["type"] == "numerical"
    )
    outlier_pct_overall = (total_outliers / max(total_rows * len(numerical_cols), 1)) * 100
    outlier_penalty = min(20.0, outlier_pct_overall * 1.5)
    
    health_score = round(completeness_score * 0.5 + uniqueness_score * 0.35 + (100 - outlier_penalty) * 0.15, 1)
    health_score = max(10.0, min(100.0, health_score))
    
    if health_score >= 90:
        quality_rating = "Excellent"
        quality_color = "emerald"
    elif health_score >= 75:
        quality_rating = "Good"
        quality_color = "indigo"
    elif health_score >= 60:
        quality_rating = "Fair"
        quality_color = "amber"
    else:
        quality_rating = "Needs Attention"
        quality_color = "rose"

    return {
        "dataset_health": {
            "score": health_score,
            "rating": quality_rating,
            "color": quality_color,
            "completeness_pct": round(100 - missing_pct, 2),
            "uniqueness_pct": round(100 - duplicate_pct, 2)
        },
        "overview": {
            "total_rows": total_rows,
            "total_cols": total_cols,
            "duplicate_rows": duplicate_rows,
            "duplicate_pct": duplicate_pct,
            "missing_cells": total_missing,
            "missing_pct": missing_pct,
            "column_types_count": {
                "numerical": len(numerical_cols),
                "categorical": len(categorical_cols),
                "date": len(date_cols),
                "id": len(id_cols),
                "boolean": len(boolean_cols)
            }
        },
        "column_types": {
            "numerical": numerical_cols,
            "categorical": categorical_cols,
            "date": date_cols,
            "id": id_cols,
            "boolean": boolean_cols
        },
        "columns": columns_profile,
        "correlations": correlations[:12],
        "correlation_matrix": correlation_matrix,
        "quality_report": {
            "summary": f"Dataset contains {total_rows:,} rows across {total_cols} attributes. Data completeness is {100 - missing_pct:.1f}% with {duplicate_rows} duplicate rows detected.",
            "caveat": "Statistical Note: Correlations represent mathematical co-movements and do not imply causal relationships.",
            "warnings": [
                f"Column '{col}' has {columns_profile[col]['missing_pct']}% missing values."
                for col in df.columns
                if columns_profile[col]['missing_pct'] > 10.0
            ] + (
                [f"{duplicate_rows} exact duplicate rows found ({duplicate_pct}% of total records)."]
                if duplicate_rows > 0 else []
            ) + [
                f"Column '{col}' contains {columns_profile[col]['stats']['outliers_pct']}% potential outliers."
                for col in numerical_cols
                if columns_profile[col].get('stats', {}).get('outliers_pct', 0) > 6.0
            ]
        }
    }
