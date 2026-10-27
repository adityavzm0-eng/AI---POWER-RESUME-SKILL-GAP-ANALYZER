"""
InsightAI Copilot Engine
Understands natural language questions regarding the active dataset schema,
executes deterministic calculations via Pandas, and returns evidence-backed responses
with optional chart specifications.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import re
import json
import logging
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
import httpx
from pydantic import BaseModel
from dashboard_engine import compute_chart_data, format_number, is_monetary_column

logger = logging.getLogger("InsightAI.copilot")

class CopilotQueryRequest(BaseModel):
    query: str
    dataset_id: str
    history: Optional[List[Dict[str, str]]] = None
    user_api_key: Optional[str] = None
    provider: Optional[str] = None
    model_name: Optional[str] = None

class CopilotResponse(BaseModel):
    answer: str
    computed_facts: Dict[str, Any] = {}
    chart_suggestion: Optional[Dict[str, Any]] = None
    suggested_followups: List[str] = []

def find_best_matching_column(query: str, columns: List[str]) -> Optional[str]:
    q = query.lower()
    # 1. Exact full token match
    for col in columns:
        col_l = col.lower()
        if f" {col_l} " in f" {q} " or col_l == q:
            return col

    # 2. Replaced underscores exact token
    for col in columns:
        col_clean = col.lower().replace("_", " ")
        if f" {col_clean} " in f" {q} ":
            return col

    # 3. Direct substring match
    for col in columns:
        if col.lower() in q:
            return col

    # 4. Keyword tokens
    for col in columns:
        parts = col.lower().split("_")
        if any(p in q for p in parts if len(p) >= 3):
            return col

    return None

def process_copilot_deterministic(
    query: str,
    df: pd.DataFrame,
    profile: Dict[str, Any]
) -> CopilotResponse:
    q = query.lower().strip()
    num_cols = profile.get("column_types", {}).get("numerical", [])
    cat_cols = profile.get("column_types", {}).get("categorical", [])
    date_cols = profile.get("column_types", {}).get("date", [])
    total_rows = len(df)
    
    # 1. Missing values inquiry
    if any(k in q for k in ["missing", "null", "empty", "quality"]):
        missing_s = df.isna().sum()
        cols_with_missing = missing_s[missing_s > 0]
        if len(cols_with_missing) == 0:
            return CopilotResponse(
                answer=f"**Clean Dataset:** There are **0 missing or null values** across all {len(df.columns)} columns in the active dataset ({total_rows:,} rows). Data completeness is **100%**.",
                computed_facts={"total_missing": 0, "completeness_pct": 100.0},
                suggested_followups=["What are the potential outliers?", "What is the average value?", "Show correlation matrix"]
            )
        else:
            bullets = "\n".join([f"- **{col}**: {cnt:,} missing rows ({(cnt/total_rows)*100:.1f}%)" for col, cnt in cols_with_missing.items()])
            return CopilotResponse(
                answer=f"**Missing Values Detected:**\n\nFound missing values in {len(cols_with_missing)} column(s):\n{bullets}\n\n*All chart aggregations automatically handle null records gracefully.*",
                computed_facts={col: int(cnt) for col, cnt in cols_with_missing.items()},
                suggested_followups=["How do missing values affect the totals?", "What is the data health score?", "Show summary statistics"]
            )

    # 2. Average / Mean inquiry
    if any(k in q for k in ["average", "mean", "avg"]):
        target_num = find_best_matching_column(q, num_cols) or (num_cols[0] if num_cols else None)
        if target_num and target_num in df.columns:
            s = pd.to_numeric(df[target_num], errors='coerce').dropna()
            avg_v = float(s.mean())
            med_v = float(s.median())
            std_v = float(s.std()) if len(s) > 1 else 0.0
            is_cur = is_monetary_column(target_num)
            
            return CopilotResponse(
                answer=(
                    f"### Average Analysis: `{target_num}`\n\n"
                    f"- **Mean (Average):** **{format_number(avg_v, is_currency=is_cur)}**\n"
                    f"- **Median (50th percentile):** **{format_number(med_v, is_currency=is_cur)}**\n"
                    f"- **Standard Deviation:** ±{format_number(std_v, is_currency=is_cur)}\n"
                    f"- **Min / Max Range:** {format_number(float(s.min()), is_currency=is_cur)} to {format_number(float(s.max()), is_currency=is_cur)}\n\n"
                    f"*(Based on {len(s):,} non-null observations)*"
                ),
                computed_facts={"mean": round(avg_v, 2), "median": round(med_v, 2), "std": round(std_v, 2)},
                suggested_followups=[f"Show {target_num} by category", f"Which category has highest {target_num}?", f"Show trend of {target_num}"]
            )

    # 3. Total / Sum inquiry
    if any(k in q for k in ["total", "sum", "cumulative", "overall"]):
        target_num = find_best_matching_column(q, num_cols) or (num_cols[0] if num_cols else None)
        if target_num and target_num in df.columns:
            s = pd.to_numeric(df[target_num], errors='coerce').dropna()
            total_v = float(s.sum())
            is_cur = is_monetary_column(target_num)
            
            return CopilotResponse(
                answer=(
                    f"### Total Aggregation: `{target_num}`\n\n"
                    f"The total cumulative **{target_num}** across all {len(s):,} records is **{format_number(total_v, is_currency=is_cur)}** "
                    f"(`{total_v:,.2f}`).\n\n"
                    f"- Count of observations: **{len(s):,}**\n"
                    f"- Average per observation: **{format_number(float(s.mean()), is_currency=is_cur)}**"
                ),
                computed_facts={"total": round(total_v, 2), "count": len(s), "avg": round(float(s.mean()), 2)},
                suggested_followups=[f"Breakdown {target_num} by category", f"Show monthly {target_num} trend", "What are the top 5 records?"]
            )

    # 4. Top / Best performers
    if any(k in q for k in ["best", "highest", "top", "max", "maximum", "winner", "leading"]):
        target_num = find_best_matching_column(q, num_cols) or (num_cols[0] if num_cols else None)
        target_cat = find_best_matching_column(q, cat_cols) or (cat_cols[0] if cat_cols else None)
        
        if target_num and target_cat:
            temp_df = df.dropna(subset=[target_cat, target_num]).copy()
            temp_df[target_num] = pd.to_numeric(temp_df[target_num], errors='coerce')
            grouped = temp_df.groupby(target_cat)[target_num].sum().sort_values(ascending=False).head(5)
            
            top_winner = grouped.index[0]
            top_val = grouped.iloc[0]
            total_sum = temp_df[target_num].sum()
            share_pct = (top_val / total_sum * 100) if total_sum > 0 else 0
            is_cur = is_monetary_column(target_num)
            
            table_rows = "\n".join([
                f"| #{idx+1} | **{cat}** | {format_number(val, is_currency=is_cur)} | {(val / total_sum * 100):.1f}% |"
                for idx, (cat, val) in enumerate(grouped.items())
            ])
            
            chart_spec = {
                "id": "copilot_top_chart",
                "title": f"Top 5 {target_cat} by {target_num}",
                "type": "bar",
                "x_column": target_cat,
                "y_column": target_num,
                "aggregation": "sum",
                "data": compute_chart_data(df, target_cat, target_num, aggregation="sum", limit=5),
                "description": f"Leaderboard showing highest {target_num} across {target_cat}."
            }
            
            return CopilotResponse(
                answer=(
                    f"### Top Performers in `{target_cat}` by `{target_num}`\n\n"
                    f"🏆 **Leading Segment:** **{top_winner}** leads with **{format_number(top_val, is_currency=is_cur)}** "
                    f"({share_pct:.1f}% of total {target_num}).\n\n"
                    f"| Rank | {target_cat} | Total {target_num} | Share % |\n"
                    f"| :--- | :--- | :--- | :--- |\n"
                    f"{table_rows}\n"
                ),
                computed_facts={"top_segment": str(top_winner), "top_value": round(float(top_val), 2), "share_pct": round(share_pct, 1)},
                chart_suggestion=chart_spec,
                suggested_followups=[f"Show lowest {target_cat}", f"Show {target_num} trend", f"Compare top 2 {target_cat}"]
            )

    # 5. Lowest / Worst performers
    if any(k in q for k in ["lowest", "worst", "bottom", "min", "minimum", "least"]):
        target_num = find_best_matching_column(q, num_cols) or (num_cols[0] if num_cols else None)
        target_cat = find_best_matching_column(q, cat_cols) or (cat_cols[0] if cat_cols else None)
        
        if target_num and target_cat:
            temp_df = df.dropna(subset=[target_cat, target_num]).copy()
            temp_df[target_num] = pd.to_numeric(temp_df[target_num], errors='coerce')
            grouped = temp_df.groupby(target_cat)[target_num].sum().sort_values(ascending=True).head(5)
            
            lowest_name = grouped.index[0]
            lowest_val = grouped.iloc[0]
            is_cur = is_monetary_column(target_num)
            
            table_rows = "\n".join([
                f"| #{idx+1} | **{cat}** | {format_number(val, is_currency=is_cur)} |"
                for idx, (cat, val) in enumerate(grouped.items())
            ])
            
            return CopilotResponse(
                answer=(
                    f"### Lowest Performing `{target_cat}` by `{target_num}`\n\n"
                    f"⚠️ **Lowest Segment:** **{lowest_name}** with **{format_number(lowest_val, is_currency=is_cur)}**.\n\n"
                    f"| Rank | {target_cat} | Total {target_num} |\n"
                    f"| :--- | :--- | :--- |\n"
                    f"{table_rows}\n"
                ),
                computed_facts={"lowest_segment": str(lowest_name), "lowest_value": round(float(lowest_val), 2)},
                suggested_followups=[f"What is causing low performance in {lowest_name}?", f"Top 5 {target_cat}", "Show correlation analysis"]
            )

    # 6. Trend / Time-series / Monthly
    if any(k in q for k in ["trend", "month", "monthly", "over time", "timeline", "temporal"]):
        target_num = find_best_matching_column(q, num_cols) or (num_cols[0] if num_cols else None)
        target_date = date_cols[0] if date_cols else None
        
        if target_date and target_num:
            chart_data = compute_chart_data(df, target_date, target_num, aggregation="sum")
            chart_spec = {
                "id": "copilot_trend_chart",
                "title": f"{target_num} Timeline Trend",
                "type": "area",
                "x_column": target_date,
                "y_column": target_num,
                "aggregation": "sum",
                "data": chart_data,
                "description": f"Chronological aggregation of {target_num} over {target_date}."
            }
            
            first_val = chart_data[0]["value"] if chart_data else 0
            last_val = chart_data[-1]["value"] if chart_data else 0
            growth = ((last_val - first_val) / max(abs(first_val), 0.001)) * 100 if first_val else 0
            
            return CopilotResponse(
                answer=(
                    f"### Temporal Trend for `{target_num}`\n\n"
                    f"Generated timeline aggregation across **{len(chart_data)} time periods** ({target_date}).\n\n"
                    f"- Initial Period ({chart_data[0]['name']}): **{format_number(first_val, is_currency=is_monetary_column(target_num))}**\n"
                    f"- Final Period ({chart_data[-1]['name']}): **{format_number(last_val, is_currency=is_monetary_column(target_num))}**\n"
                    f"- Period Change: **{growth:+.1f}%**\n\n"
                    f"*The visual timeline chart has been created below for immediate inspection.*"
                ),
                computed_facts={"periods_count": len(chart_data), "change_pct": round(growth, 1)},
                chart_suggestion=chart_spec,
                suggested_followups=[f"Breakdown {target_num} by category", "Are there seasonal anomalies?", "What is the average value?"]
            )

    # 7. Create a chart request
    if any(k in q for k in ["chart", "plot", "graph", "visualize"]):
        target_num = find_best_matching_column(q, num_cols) or (num_cols[0] if num_cols else None)
        target_cat = find_best_matching_column(q, cat_cols) or (cat_cols[0] if cat_cols else None)
        
        chosen_type = "bar"
        if "line" in q:
            chosen_type = "line"
        elif "pie" in q or "donut" in q:
            chosen_type = "pie"
        elif "area" in q:
            chosen_type = "area"
            
        if target_cat and target_num:
            chart_data = compute_chart_data(df, target_cat, target_num, aggregation="sum", limit=8)
            chart_spec = {
                "id": "copilot_custom_chart",
                "title": f"{target_num.replace('_', ' ')} by {target_cat.replace('_', ' ')}",
                "type": chosen_type,
                "x_column": target_cat,
                "y_column": target_num,
                "aggregation": "sum",
                "data": chart_data,
                "description": f"Custom {chosen_type} visualization synthesized on demand."
            }
            return CopilotResponse(
                answer=(
                    f"### Chart Generated: `{target_num}` by `{target_cat}`\n\n"
                    f"Synthesized a **{chosen_type.upper()} chart** grouping `{target_num}` across top `{target_cat}` categories. "
                    f"You can review the chart below and pin it to your dashboard!"
                ),
                computed_facts={"x_axis": target_cat, "y_axis": target_num, "chart_type": chosen_type},
                chart_suggestion=chart_spec,
                suggested_followups=["Change chart type to pie", f"What is the average {target_num}?", "Show top 5 only"]
            )

    # 8. Explain findings / General overview
    return CopilotResponse(
        answer=(
            f"### Dataset Executive Overview\n\n"
            f"- **Dataset Matrix:** **{total_rows:,} records** across **{len(df.columns)} columns**\n"
            f"- **Numerical Measures ({len(num_cols)}):** {', '.join([f'`{c}`' for c in num_cols[:4]])}\n"
            f"- **Categorical Dimensions ({len(cat_cols)}):** {', '.join([f'`{c}`' for c in cat_cols[:4]])}\n"
            f"- **Temporal Dimensions ({len(date_cols)}):** {', '.join([f'`{c}`' for c in date_cols]) if date_cols else 'None'}\n\n"
            f"You can ask me to compute averages, find top performers, plot monthly trends, check missing values, or compare specific segments!"
        ),
        computed_facts={"rows": total_rows, "cols": len(df.columns)},
        suggested_followups=[
            f"What is the average {num_cols[0]}?" if num_cols else "Check missing values",
            f"Which {cat_cols[0]} performed best?" if cat_cols and num_cols else "What is the dataset health score?",
            "Show monthly trends" if date_cols else "Are there missing values?"
        ]
    )

async def ask_copilot(
    request: CopilotQueryRequest,
    df: pd.DataFrame,
    profile: Dict[str, Any]
) -> CopilotResponse:
    # First, compute deterministic factual answer using Pandas calculations
    det_resp = process_copilot_deterministic(request.query, df, profile)
    
    # If the user has an AI API key configured and the question was conversational/overview, attempt LLM enrichment
    api_key = request.user_api_key or os.getenv("AI_API_KEY") or os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY")
    active_provider = (
        request.provider or 
        os.getenv("AI_PROVIDER") or 
        ("openai" if api_key and api_key.startswith("sk-") else "gemini")
    ).lower()
    active_model = request.model_name or os.getenv("AI_MODEL") or ("gpt-4o-mini" if "openai" in active_provider else "gemini-1.5-flash")

    if api_key and not det_resp.chart_suggestion:
        summary = {
            "rows": len(df),
            "cols": list(df.columns),
            "query": request.query,
            "profile_overview": profile.get("overview"),
            "sample_stats": {
                k: v.get("stats") for k, v in list(profile.get("columns", {}).items())[:6] if "stats" in v
            }
        }
        system_prompt = (
            "You are InsightAI Copilot, a sharp, senior data analyst and BI architect. "
            "Answer the user's question with precise Markdown, citing factual column names and exact numbers. "
            "Never invent columns or numbers outside the dataset schema. "
            "Distinguish proven data facts from hypotheses."
        )

        if "openai" in active_provider or (api_key and api_key.startswith("sk-")):
            try:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
                payload = {
                    "model": active_model if "gpt" in active_model else "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Context:\n{json.dumps(summary)}\n\nUser Question: {request.query}"}
                    ],
                    "temperature": 0.2
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        text_resp = res.json()["choices"][0]["message"]["content"]
                        det_resp.answer = text_resp
                    else:
                        logger.warning(f"OpenAI Copilot returned status {res.status_code}")
            except Exception as e:
                logger.warning(f"OpenAI Copilot request failed: {e}")
        elif "gemini" in active_provider:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{active_model}:generateContent?key={api_key}"
                payload = {
                    "contents": [
                        {"parts": [{"text": f"{system_prompt}\n\nContext:\n{json.dumps(summary)}\n\nUser Question: {request.query}"}]}
                    ]
                }
                async with httpx.AsyncClient(timeout=8.0) as client:
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        text_resp = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                        det_resp.answer = text_resp
                    else:
                        logger.warning(f"Gemini Copilot returned status {res.status_code}")
            except Exception as e:
                logger.warning(f"Gemini Copilot request failed: {e}")
            
    return det_resp
