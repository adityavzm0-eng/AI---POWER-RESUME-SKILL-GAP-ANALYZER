import React from 'react';
import { Bot, Sparkles, TrendingUp, Cpu, Activity, FileText, CheckCircle2, ArrowRight, Database, Landmark, Camera, ShieldCheck } from 'lucide-react';

export const RagChatbotPreview = () => (
  <div className="h-44 w-full bg-slate-950/90 rounded-xl p-4 flex flex-col justify-between border border-slate-800/80 font-mono relative overflow-hidden group-hover:border-sky-500/40 transition-colors">
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
        <Bot className="w-3.5 h-3.5" />
        Google Gemini • RAG Engine
      </span>
      <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-[10px]">
        Render Deployed
      </span>
    </div>

    {/* Chat Bubble Interface Simulation */}
    <div className="space-y-2 my-auto">
      <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 max-w-[85%]">
        <span className="text-slate-500 block text-[9px]">User Query</span>
        "Summarize domain context with vector retrieval"
      </div>
      <div className="bg-indigo-950/40 border border-indigo-700/40 px-3 py-1.5 rounded-lg text-[11px] text-sky-200 ml-auto max-w-[90%]">
        <span className="text-indigo-400 block text-[9px] flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> Gemini + RAG
        </span>
        "Context retrieved from vector store without hallucinations..."
      </div>
    </div>

    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
      <span>Flask REST API Backend</span>
      <span className="text-indigo-300">React Frontend</span>
    </div>
  </div>
);

export const BankingSystemPreview = () => (
  <div className="h-44 w-full bg-slate-950/90 rounded-xl p-4 flex flex-col justify-between border border-slate-800/80 font-mono relative overflow-hidden group-hover:border-amber-500/40 transition-colors">
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
        <Database className="w-3.5 h-3.5" />
        Core Banking System (SQL)
      </span>
      <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-[10px]">
        ACID Compliant
      </span>
    </div>

    {/* Transaction Ledger visual */}
    <div className="space-y-1.5 my-auto text-[10px]">
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded">
        <span className="text-slate-400">TXN_ID #8921: Account Transfer</span>
        <span className="text-emerald-400 font-bold">+Rs. 25,000 [COMMITTED]</span>
      </div>
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded">
        <span className="text-slate-400">TXN_ID #8922: Customer Ledger</span>
        <span className="text-sky-300">Interest Calculation &amp; Audit</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
      <span>Python Backend Core</span>
      <span className="text-amber-300">MySQL Workbench</span>
    </div>
  </div>
);

export const RbiDashboardPreview = () => (
  <div className="h-44 w-full bg-slate-950/90 rounded-xl p-4 flex flex-col justify-between border border-slate-800/80 font-mono relative overflow-hidden group-hover:border-cyan-500/40 transition-colors">
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
        <Landmark className="w-3.5 h-3.5" />
        RBI Banking Analytics (BI)
      </span>
      <span className="text-sky-300 font-semibold bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded text-[10px]">
        Govt vs Private
      </span>
    </div>

    {/* Banking KPI Metrics Comparison */}
    <div className="grid grid-cols-2 gap-2 my-auto">
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
        <span className="text-[9px] text-slate-400 block uppercase">Govt / Public Banks</span>
        <span className="text-xs font-bold text-emerald-400">Deposit Share 62%</span>
      </div>
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
        <span className="text-[9px] text-slate-400 block uppercase">Private Banks</span>
        <span className="text-xs font-bold text-cyan-400">Lower Net NPA Ratio</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
      <span>Power BI Visualizations</span>
      <span className="text-cyan-300">Streamlit Dashboard</span>
    </div>
  </div>
);

export const FaceDetectionPreview = () => (
  <div className="h-44 w-full bg-slate-950/90 rounded-xl p-4 flex flex-col justify-between border border-slate-800/80 font-mono relative overflow-hidden group-hover:border-rose-500/40 transition-colors">
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
        <Camera className="w-3.5 h-3.5" />
        OpenCV Live Face Detection
      </span>
      <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-[10px]">
        30 FPS Webcam
      </span>
    </div>

    {/* Bounding Box Visual Simulation */}
    <div className="relative my-auto flex items-center justify-center h-20 bg-slate-900/80 rounded-lg border border-slate-800/80">
      <div className="border-2 border-emerald-400/90 rounded px-5 py-2 relative">
        <span className="absolute -top-3 left-1 bg-emerald-500 text-black text-[9px] font-bold px-1 rounded">
          Face: 98.4%
        </span>
        <span className="text-[10px] text-emerald-300">Face Landmark Tracked</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
      <span>Computer Vision (CV)</span>
      <span className="text-rose-300">Streamlit ML Frontend</span>
    </div>
  </div>
);

export const SalaryPredictionPreview = () => (
  <div className="h-44 w-full bg-slate-950/90 rounded-xl p-4 flex flex-col justify-between border border-slate-800/80 font-mono relative overflow-hidden group-hover:border-purple-500/40 transition-colors">
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
        <TrendingUp className="w-3.5 h-3.5" />
        Random Forest Regressor
      </span>
      <span className="text-purple-300 font-bold bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded text-[10px]">
        R² Score: 85%
      </span>
    </div>

    {/* Regression Metric Cards */}
    <div className="grid grid-cols-3 gap-2 my-auto">
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
        <span className="text-[9px] text-slate-400 block uppercase">Test R²</span>
        <span className="text-xs font-bold text-emerald-400">0.85 (85%)</span>
      </div>
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
        <span className="text-[9px] text-slate-400 block uppercase">Evaluation</span>
        <span className="text-xs font-bold text-sky-400">MAE / RMSE</span>
      </div>
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-center">
        <span className="text-[9px] text-slate-400 block uppercase">Frontend</span>
        <span className="text-xs font-bold text-purple-400">Streamlit</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
      <span>Scikit-learn Regressor</span>
      <span className="text-purple-300">Streamlit ML Frontend</span>
    </div>
  </div>
);

export const TextSummarizerPreview = () => (
  <div className="h-44 w-full bg-slate-950/90 rounded-xl p-4 flex flex-col justify-between border border-slate-800/80 font-mono relative overflow-hidden group-hover:border-emerald-500/40 transition-colors">
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
        <FileText className="w-3.5 h-3.5" />
        BART Transformers
      </span>
      <span className="text-emerald-300 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-[10px]">
        ROUGE Evaluated
      </span>
    </div>

    {/* Tokenizer & Abstractive Summary Preview */}
    <div className="space-y-2 my-auto">
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
        <span className="text-slate-400 text-[10px]">Input Document</span>
        <span className="text-sky-400 text-[10px] font-mono">BART Tokenized</span>
      </div>
      <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg text-xs">
        <span className="text-slate-300 text-[10px]">Concise Abstractive Summary</span>
        <span className="text-emerald-400 text-[10px] font-bold">ROUGE Benchmark</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
      <span>PyTorch &amp; Flask API</span>
      <span className="text-emerald-300">Render Deployment</span>
    </div>
  </div>
);
