# SkillSync AI — Resume Intelligence & Career Growth Platform

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PyMuPDF](https://img.shields.io/badge/PyMuPDF-fitz-blue)](https://pymupdf.readthedocs.io)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-TF--IDF-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SkillSync AI** is a modern, intelligent, AI-powered web platform designed to analyze candidate resumes against target job descriptions, discover matched and missing technical skills, compute explainable compatibility scores (0–100), visualize skill gaps through dynamic charts, and generate personalized 4-week learning roadmaps to maximize employability.

Designed with a premium SaaS aesthetic: dark navy and deep purple themes, glassmorphism, electric blue/violet accents, collapsible sidebar navigation, and real NLP & ML processing.

---

## 🌟 Key Highlights & Features

### 1. Dual-Engine Resume & Job Description Analyzer
- **PyMuPDF & pypdf Engine**: Ingests text-based PDF resumes with page-level layout parsing, character/word telemetry, and scanned PDF detection.
- **Section & Metadata Identification**: Automatically detects Professional Summary, Technical Skills, Work Experience, Education, Projects, Certifications, Contact details, and estimated years of experience.
- **Editable Extracted Skills**: Allows users to inspect and refine extracted skills before running comparisons to eliminate false positives.

### 2. Explainable 0–100 Compatibility Score Engine
Transparent multi-factor scoring formula:
$$\text{Score} = w_1(\text{Required Skills}) + w_2(\text{Preferred Skills}) + w_3(\text{Semantic Similarity}) + w_4(\text{Projects}) + w_5(\text{Experience})$$
- Default weights: Required Skills (40%), Preferred Skills (15%), Semantic TF-IDF Cosine Similarity (20%), Project Evidence (15%), Experience Alignment (10%).
- Fully customizable via the **Settings** panel with live re-computation.
- Circular SVG progress indicator, score tier, evidence-based strengths, and actionable improvement priorities.

### 3. Interactive Skill Gap Matrix & Visualizations
- **Horizontal Distribution Chart**: Recharts visualization comparing Matched, Partially Matched, Missing, and Additional skills.
- **Dynamic Competency Radar Chart**: Synthesizes skill categories dynamically from the job description and candidate resume.
- **Skill Gap Matrix Table**: Filterable table with search, category filtering, status pills, and clickable text evidence snippets from the resume.

### 4. Personalized 4-Week AI Career Growth Roadmap
- **3 Priority Tiers**: Priority 1 (Essential Must-Haves), Priority 2 (Practical Tools), and Priority 3 (Advanced Architectures).
- **Interactive 4-Week Timeline**: Week 1 (Fundamentals), Week 2 (Practical Exercises), Week 3 (Capstone Project Implementation), Week 4 (Portfolio & Interview Readiness).
- Interactive milestone check-offs and deliverable tracking.

### 5. ATS Resume Improvement Studio & Before/After Simulator
- **ATS Compliance Audit**: Automated checklist testing contact info, standard section headers, quantifiable metrics, and active action verbs.
- **Missing High-Value Keywords**: 1-click copy for high-impact missing ATS keywords.
- **Side-by-Side Professional Summary Optimizer**: Front-loads verified candidate skills and aligns with target job title.
- **Google XYZ Bullet Enhancer**: Rewrites passive duties into high-impact accomplishment bullets (*Accomplished [X], as measured by [Y], by doing [Z]*).
- **Before-and-After Simulator**: Test resume revisions against the same job description to measure your score improvement delta in real-time.

### 6. Multiple Job Match Studio
- Compare 1 resume across up to 4 job descriptions simultaneously (e.g., *Machine Learning Engineer* vs. *Data Scientist* vs. *Cloud DevOps Engineer*).
- Instant compatibility rankings, gap analysis, and best-fit badge.

### 7. Tailored Portfolio Projects & Interview Prep Generator
- **Project Blueprints**: Generates 2–3 portfolio project proposals with tech stack, step-by-step architecture, and ready-to-copy resume bullet points.
- **Interview Question Bank**: Role-specific technical theory questions, model answers, coding prompts, and behavioral architecture questions.

### 8. Privacy-First Architecture & Exportable PDF Reports
- **100% Client-Side Privacy**: Raw uploaded resume PDFs are processed in-memory and never permanently stored.
- **One-Click Data Purge**: Complete deletion of saved SQLite history records.
- **Professional PDF Export**: Generates a formatted, multi-page analysis report using `jsPDF`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons, jsPDF |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic, SQLite |
| **NLP & ML** | PyMuPDF (fitz), Scikit-Learn (TF-IDF Vectorizer & Cosine Similarity), NumPy |
| **AI / LLM** | Optional OpenAI (`gpt-4o-mini`) / Google Gemini integration with deterministic offline NLP fallback |
| **Testing** | PyTest, FastAPI TestClient, HTTPX |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher (with npm)

### 2. Backend Setup

```bash
# Navigate to the project root
cd Voting_System

# Create and activate Python virtual environment
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# (Optional) Configure environment variables in backend/.env
# If omitted, SkillSync AI runs its full deterministic offline NLP engine without external APIs.
```

Start the FastAPI backend server:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API documentation is available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Frontend Setup

In a separate terminal window:
```bash
# Install frontend dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing Suite

The application includes automated tests covering skill normalization, regex boundary extraction, section identification, job description parsing, semantic matching, scoring explainability, and REST API error handling.

Run tests:
```bash
# Windows PowerShell
$env:PYTHONPATH="."; .\.venv\Scripts\python.exe -m pytest backend/tests -v

# macOS/Linux
PYTHONPATH=. pytest backend/tests -v
```

All 8 test suites:
- `test_skill_normalization`: Validates canonical aliases (e.g. `sklearn` -> `Scikit-learn`, `k8s` -> `Kubernetes`).
- `test_skill_extraction_and_evidence`: Verifies context snippet extraction from sentences.
- `test_cleaner_and_section_detection`: Tests heading detection and contact extraction.
- `test_job_description_intelligence_and_matching`: Validates required vs preferred classification and semantic transfer logic.
- `test_scoring_formula`: Tests weighted explainability and 0–100 normalization.
- `test_roadmap_generation`: Verifies 4-week timeline and 3 priority tiers.
- `test_pdf_extractor_edge_cases`: Tests empty/scanned PDF handling without crashes.
- `test_api_endpoints`: Integration test for all REST API endpoints.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze-resume` | Uploads PDF or text, extracts skills, compares against JD, returns full analysis |
| `POST` | `/api/extract-skills` | Extracts skills and categories from raw text |
| `POST` | `/api/analyze-job-description` | Parses job description into required and preferred skills for editing |
| `POST` | `/api/compare-skills` | Re-evaluates compatibility score with custom weights or edited skills |
| `POST` | `/api/compare-jobs` | Evaluates 1 resume against up to 4 job descriptions simultaneously |
| `POST` | `/api/before-after` | Computes alignment score gain between original and revised resume text |
| `GET` | `/api/history` | Lists past saved analysis records |
| `GET` | `/api/history/{id}` | Retrieves full analysis by ID |
| `DELETE` | `/api/history/{id}` | Deletes a single analysis record |
| `DELETE` | `/api/history` | Purges all analysis history for complete privacy |
| `GET` | `/api/settings` | Returns active scoring weights and LLM integration status |
| `GET` | `/api/sample-data` | Pre-populated demo profiles for 1-click test drives |

---

## 🔒 Security & Privacy Policy

1. **Zero-Leakage API Keys**: API credentials (`OPENAI_API_KEY`, `LLM_API_KEY`) remain strictly on the backend server within `backend/.env`. They are never passed to the frontend client, exposed in browser network tabs, or stored in client-side code.
2. **Local Session Ingestion**: Uploaded resumes are read in-memory. Binary file buffers are discarded immediately after text extraction.
3. **No Mandatory LLM Requirement**: SkillSync AI operates with full fidelity entirely offline using Python, PyMuPDF, and Scikit-learn TF-IDF vectors. LLM calls are optional enhancements and gracefully fall back to deterministic heuristics if an API key is missing or offline.
4. **Data Purge**: Users can delete individual records or wipe the entire SQLite database at any time from the History page.

---

## 📄 License
This project is licensed under the MIT License.
