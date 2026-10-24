"""
InsightAI — FastAPI Backend Server
Main API gateway connecting file upload, pandas profiling, automatic dashboard synthesis,
AI insights, and InsightAI Copilot chatbot.
"""

import os
import sys

# Ensure backend directory is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import io
import logging
from typing import Dict, Any, Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import pandas as pd
import numpy as np

# Load environment variables
load_dotenv()

from data_store import store
from profiler import profile_dataset
from dashboard_engine import generate_dashboard, compute_chart_data, format_number
from ai_engine import generate_ai_insights, AIInsightsResponse
from copilot import ask_copilot, CopilotQueryRequest, CopilotResponse
from sample_data import SAMPLE_CATALOG

# Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("InsightAI.API")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize default sample dataset on startup
    logger.info("Initializing InsightAI with default sample datasets...")
    try:
        ecom_df = SAMPLE_CATALOG["ecommerce"]["generator"]()
        ds_id = "sample_ecommerce"
        store.save_dataset(ecom_df, "Global_Ecommerce_Sales.csv", dataset_id=ds_id)
        prof = profile_dataset(ecom_df)
        dash = generate_dashboard(ecom_df, prof)
        store.set_cache(ds_id, "profile", prof)
        store.set_cache(ds_id, "dashboard", dash)
        logger.info("Default sample dataset 'sample_ecommerce' loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to preload sample dataset: {e}")
    yield

app = FastAPI(
    title="InsightAI API",
    description="Intelligent AI-Powered Smart Dashboard Generator Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server (port 3000, 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FilterRequest(BaseModel):
    categorical: Optional[Dict[str, List[str]]] = {}
    numeric: Optional[Dict[str, Dict[str, Optional[float]]]] = {}
    date: Optional[Dict[str, Dict[str, Optional[str]]]] = {}

class ChartQueryRequest(BaseModel):
    x_column: str
    y_column: Optional[str] = None
    aggregation: str = "sum"
    chart_type: str = "bar"
    limit: Optional[int] = 15
    filters: Optional[FilterRequest] = None

class PreviewRequest(BaseModel):
    page: int = 1
    page_size: int = 50
    search: Optional[str] = None
    sort_column: Optional[str] = None
    sort_order: Optional[str] = "asc"
    filters: Optional[FilterRequest] = None

class InsightsRequest(BaseModel):
    user_api_key: Optional[str] = None
    provider: Optional[str] = None
    model_name: Optional[str] = None

# --- Endpoints ---

@app.get("/api/health")
def health_check():
    api_key = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")
    return {
        "status": "healthy",
        "service": "InsightAI Intelligent Dashboard Engine",
        "has_ai_key": bool(api_key),
        "ai_provider": os.getenv("AI_PROVIDER", "gemini"),
        "ai_model": os.getenv("AI_MODEL", "gemini-1.5-flash")
    }

@app.get("/api/samples")
def list_sample_datasets():
    return [
        {
            "key": k,
            "title": v["title"],
            "description": v["description"],
            "default_filename": v["default_filename"]
        }
        for k, v in SAMPLE_CATALOG.items()
    ]

@app.post("/api/sample/{sample_key}")
def load_sample_dataset(sample_key: str):
    if sample_key not in SAMPLE_CATALOG:
        raise HTTPException(status_code=404, detail=f"Sample dataset '{sample_key}' not found.")
        
    ds_id = f"sample_{sample_key}"
    existing = store.get_dataset(ds_id)
    if existing and existing.get("profile") and existing.get("dashboard"):
        return {
            "dataset_id": ds_id,
            "filename": existing["filename"],
            "row_count": len(existing["df"]),
            "col_count": len(existing["df"].columns),
            "profile": existing["profile"],
            "dashboard": existing["dashboard"],
            "preview_rows": existing["df"].head(100).replace({np.nan: None}).to_dict(orient="records")
        }

    catalog_entry = SAMPLE_CATALOG[sample_key]
    df = catalog_entry["generator"]()
    store.save_dataset(df, catalog_entry["default_filename"], dataset_id=ds_id)
    
    prof = profile_dataset(df)
    dash = generate_dashboard(df, prof)
    store.set_cache(ds_id, "profile", prof)
    store.set_cache(ds_id, "dashboard", dash)
    
    return {
        "dataset_id": ds_id,
        "filename": catalog_entry["default_filename"],
        "row_count": len(df),
        "col_count": len(df.columns),
        "profile": prof,
        "dashboard": dash,
        "preview_rows": df.head(100).replace({np.nan: None}).to_dict(orient="records")
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_dataset.csv"
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in [".csv", ".xlsx", ".xls"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file.")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds the 50MB limit.")

    df = None
    if ext == ".csv":
        # Graceful encoding and delimiter detection
        for enc in ["utf-8", "utf-8-sig", "latin1", "cp1252", "iso-8859-1"]:
            try:
                # Try sniffing delimiter
                sample_bytes = content[:8192].decode(enc, errors='ignore')
                sep = ","
                if sample_bytes.count(";") > sample_bytes.count(",") and sample_bytes.count(";") > sample_bytes.count("\t"):
                    sep = ";"
                elif sample_bytes.count("\t") > sample_bytes.count(","):
                    sep = "\t"
                    
                df = pd.read_csv(io.BytesIO(content), encoding=enc, sep=sep, on_bad_lines='skip')
                break
            except Exception:
                continue
                
        if df is None:
            raise HTTPException(status_code=400, detail="Unable to parse CSV file. Please verify encoding and format.")
    else:
        # Excel
        try:
            df = pd.read_excel(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read Excel file: {str(e)}")

    # Clean column names (strip whitespace)
    df.columns = [str(c).strip() for c in df.columns]
    
    ds_id = store.save_dataset(df, filename)
    prof = profile_dataset(df)
    dash = generate_dashboard(df, prof)
    store.set_cache(ds_id, "profile", prof)
    store.set_cache(ds_id, "dashboard", dash)

    return {
        "dataset_id": ds_id,
        "filename": filename,
        "row_count": len(df),
        "col_count": len(df.columns),
        "profile": prof,
        "dashboard": dash,
        "preview_rows": df.head(100).replace({np.nan: None}).to_dict(orient="records")
    }

@app.get("/api/dataset/{dataset_id}")
def get_dataset_details(dataset_id: str):
    entry = store.get_dataset(dataset_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Dataset not found.")
        
    df = entry["df"]
    prof = entry.get("profile") or profile_dataset(df)
    dash = entry.get("dashboard") or generate_dashboard(df, prof)
    
    return {
        "dataset_id": dataset_id,
        "filename": entry["filename"],
        "row_count": len(df),
        "col_count": len(df.columns),
        "profile": prof,
        "dashboard": dash,
        "preview_rows": df.head(100).replace({np.nan: None}).to_dict(orient="records")
    }

@app.post("/api/dataset/{dataset_id}/preview")
def get_dataset_preview(dataset_id: str, req: PreviewRequest):
    df = store.get_dataframe(dataset_id)
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # Apply filters if any
    filtered = store.apply_filters(df, req.filters.dict() if req.filters else None)
    
    # Search filter across string representations
    if req.search and req.search.strip():
        term = req.search.strip().lower()
        mask = filtered.astype(str).apply(lambda row: row.str.lower().str.contains(term, regex=False)).any(axis=1)
        filtered = filtered[mask]

    # Sorting
    if req.sort_column and req.sort_column in filtered.columns:
        ascending = req.sort_order.lower() != "desc"
        filtered = filtered.sort_values(by=req.sort_column, ascending=ascending)

    total_filtered_rows = len(filtered)
    start_idx = (req.page - 1) * req.page_size
    end_idx = start_idx + req.page_size
    page_slice = filtered.iloc[start_idx:end_idx]

    return {
        "total_records": total_filtered_rows,
        "page": req.page,
        "page_size": req.page_size,
        "total_pages": max(1, int(np.ceil(total_filtered_rows / req.page_size))),
        "rows": page_slice.replace({np.nan: None}).to_dict(orient="records")
    }

@app.post("/api/dataset/{dataset_id}/chart")
def compute_dynamic_chart(dataset_id: str, req: ChartQueryRequest):
    df = store.get_dataframe(dataset_id)
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    filtered = store.apply_filters(df, req.filters.dict() if req.filters else None)
    
    chart_data = compute_chart_data(
        df=filtered,
        x_col=req.x_column,
        y_col=req.y_column,
        aggregation=req.aggregation,
        limit=req.limit or 15
    )

    return {
        "x_column": req.x_column,
        "y_column": req.y_column,
        "chart_type": req.chart_type,
        "aggregation": req.aggregation,
        "data": chart_data,
        "record_count": len(filtered)
    }

@app.post("/api/dataset/{dataset_id}/kpis")
def compute_dynamic_kpis(dataset_id: str, filters: FilterRequest):
    entry = store.get_dataset(dataset_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    df = entry["df"]
    filtered = store.apply_filters(df, filters.dict())
    
    # Regenerate dashboard on filtered subset
    prof = entry.get("profile") or profile_dataset(df)
    dash = generate_dashboard(filtered, prof)

    return {
        "kpis": dash["kpis"],
        "filtered_rows": len(filtered),
        "total_rows": len(df)
    }

@app.post("/api/dataset/{dataset_id}/insights")
async def get_insights(dataset_id: str, req: InsightsRequest):
    entry = store.get_dataset(dataset_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    prof = entry.get("profile") or profile_dataset(entry["df"])
    dash = entry.get("dashboard") or generate_dashboard(entry["df"], prof)

    insights_resp = await generate_ai_insights(
        profile=prof,
        kpis=dash.get("kpis", []),
        user_api_key=req.user_api_key,
        provider=req.provider,
        model_name=req.model_name
    )
    
    store.set_cache(dataset_id, "insights", insights_resp.dict())
    return insights_resp

@app.post("/api/dataset/{dataset_id}/copilot")
async def copilot_query(dataset_id: str, req: CopilotQueryRequest):
    entry = store.get_dataset(dataset_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    df = entry["df"]
    prof = entry.get("profile") or profile_dataset(df)
    
    resp = await ask_copilot(req, df, prof)
    return resp

@app.get("/api/dataset/{dataset_id}/export/csv")
def export_dataset_csv(dataset_id: str):
    df = store.get_dataframe(dataset_id)
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")
        
    csv_bytes = df.to_csv(index=False).encode('utf-8')
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=insightai_{dataset_id}.csv"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
