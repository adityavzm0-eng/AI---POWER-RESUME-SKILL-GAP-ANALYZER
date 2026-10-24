# InsightAI — AI-Powered Smart Dashboard Generator

> **Power BI-Inspired Usability · Automated Data Profiling · Dynamic Visual Synthesis · Conversational AI Copilot**

![InsightAI Architecture](https://img.shields.io/badge/Architecture-FastAPI%20%2B%20React%20%2B%20TypeScript-6366F1?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.13%20%7C%20FastAPI%20%7C%20Pandas%20%7C%20NumPy-0284C7?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18%20%7C%20Vite%20%7C%20TailwindCSS%20%7C%20Recharts-10B981?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI%20%7C%20Deterministic%20Engine-8B5CF6?style=for-the-badge)

---

## 🌟 Executive Overview

**InsightAI** is a production-minded web application that ingests CSV and Excel datasets (`.csv`, `.xlsx`, `.xls`) and automatically synthesizes interactive, intelligent dashboards. 

Unlike static demos, **all charts, KPI metrics, statistical distributions, multi-dimensional filters, and AI insights are dynamically computed from the actual uploaded data matrix**.

---

## 🚀 Key Features

### 1. Automated Data Profiling & Hygiene Analysis
- **Automatic Column Classification:** Distinguishes numerical measures, categorical dimensions, temporal date/time columns, unique identifiers, and boolean flags.
- **Statistical Summaries:** Computes Min, Max, Mean, Median, Standard Deviation, Skewness, 25th & 75th percentiles (IQR), and 10-bin frequency distributions.
- **Anomalies & Outlier Detection:** Employs the statistical Interquartile Range (IQR) technique ($[Q_1 - 1.5 \times \text{IQR},\, Q_3 + 1.5 \times \text{IQR}]$) to flag anomalies with exact percentages and numerical bounds.
- **Data Quality Health Score:** Evaluates dataset completeness, uniqueness (duplicate rows check), and schema uniformity to assign a 0–100% health score.
- **Correlation Ranking:** Computes Pearson correlation coefficients ($r$) across numerical attributes with explicit warnings that *correlation does not imply causation*.

### 2. Schema-Aware Dynamic Dashboard Generation
- **Dynamic KPI Cards:** Evaluates primary volume, monetary totals, averages, and secondary metrics with growth indicators.
- **Automatic Visual Synthesis:**
  - **Temporal Trend Line/Area Charts** when date columns are present.
  - **Categorical Breakdown Bar Charts** showing top-performing segments.
  - **Proportional Donut/Pie Charts** with automatic grouping of low-cardinality items into "Other".
  - **Cross-Variable Scatter Plots** for top correlated numerical pairs.
  - **Distribution Histograms** illustrating numeric density.
- **Interactive Controls:** Toggle between Bar, Line, Area, Pie, and Scatter charts; swap X/Y axes; change aggregations (Sum, Avg, Count, Min, Max); expand to fullscreen.
- **Custom Chart Studio:** Add custom visualizations with live preview before pinning to the dashboard.

### 3. Interactive Multi-Dimensional Slicing & Dicing
- Global slide-over filter panel:
  - Multi-select categorical checkboxes with search and frequency counts.
  - Numeric range bounds (Min / Max sliders).
  - Date range pickers (Start Date / End Date).
- Recomputes all KPIs and charts across the entire dashboard in real time.

### 4. InsightAI Copilot — Conversational Data Assistant
- Understands natural language questions against the active dataset schema:
  - *"What is the average sales value?"*
  - *"Which category performed best?"*
  - *"Show monthly revenue trends"*
  - *"Which products have the lowest sales?"*
  - *"Are there missing values?"*
  - *"Create a chart showing profit by category"*
  - *"Explain the most important findings"*
- Answers with formatted Markdown, computed Pandas statistics, and **renders interactive charts inline that can be pinned directly to the dashboard with one click**.

### 5. Modular AI Insights Engine & Deterministic Fallback
- Configurable AI providers: Google Gemini, OpenAI, Claude, or Local Deterministic Engine.
- Environment variable configuration (`GEMINI_API_KEY`, `AI_API_KEY`).
- Validates all AI responses using Pydantic schemas.
- **Zero-Downtime Guarantee:** If an external LLM key is unavailable or rate-limited, the native Pandas/NumPy statistical engine automatically produces deep, mathematically verified insights.

### 6. Presentation-Grade Exporting
- Export full dashboard as high-resolution PDF.
- Capture image snapshot as PNG.
- Download underlying filtered dataset as CSV.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, html2canvas, jsPDF |
| **Backend** | Python 3.13, FastAPI, Pandas, NumPy, Pydantic v2, Uvicorn, openpyxl, python-multipart |
| **AI Layer** | Google Gemini API (`gemini-1.5-flash`), OpenAI-compatible format, Deterministic Statistics Engine |

---

## 📦 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to project root
cd Voting_System

# Install Python requirements
pip install -r backend/requirements.txt

# Start FastAPI server (runs on port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
```bash
# In another terminal in project root
npm.cmd install

# Start Vite dev server (runs on port 3000)
npm.cmd run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 📂 Pre-Loaded Sample Datasets

InsightAI includes 4 pre-built realistic datasets ready for 1-click testing:
1. **Global E-Commerce Sales & Profit** (380 records: Orders, segments, categories, discounts, profits).
2. **SaaS Cloud ARR & Churn** (260 accounts: MRR, ARR, seat licensing, churn probabilities, NPS).
3. **HR Talent & Payroll** (280 employees: Departments, compensation, performance ratings, attrition).
4. **Hospital Clinical Operations** (250 admissions: Length of stay, billing, insurance, readmissions).

---

## 🔑 AI API Key Configuration

The API key is securely managed on the server side in `backend/.env`:
```env
AI_API_KEY=key_Jf5XMGG0ZZrpuyLU
GEMINI_API_KEY=key_Jf5XMGG0ZZrpuyLU
AI_PROVIDER=gemini
AI_MODEL=gemini-1.5-flash
```
You can also adjust the API key and provider directly in the UI using the **Settings** button in the top navigation bar.
