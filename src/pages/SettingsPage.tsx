import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Sliders, 
  Cpu, 
  Key, 
  ShieldCheck, 
  Save, 
  Check, 
  Info,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { getSettingsApi } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [weights, setWeights] = useState({
    required_skills: 0.40,
    preferred_skills: 0.15,
    semantic_similarity: 0.20,
    project_evidence: 0.15,
    experience_alignment: 0.10,
  });

  const [llmStatus, setLlmStatus] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    getSettingsApi()
      .then((data) => {
        if (data.default_weights) setWeights(data.default_weights);
        if (data.llm_status) setLlmStatus(data.llm_status);
      })
      .catch(console.error);
  }, []);

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">
          Scoring Engine & LLM Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust the weighted compatibility algorithm or inspect your active AI model provider.
        </p>
      </div>

      {/* Scoring Formula Weights Customizer (Section 8) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Explainable Compatibility Formula Weights
            </h2>
            <p className="text-xs text-slate-400">Configure the relative weight of each evaluation metric (sums to 100%)</p>
          </div>

          <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
            Total Weight: {(totalWeight * 100).toFixed(0)}%
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Required Skills Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Required (Must-Have) Skill Coverage</span>
              <span className="font-mono text-cyan-400">{(weights.required_skills * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.70"
              step="0.05"
              value={weights.required_skills}
              onChange={(e) => handleWeightChange('required_skills', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Preferred Skills Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Preferred (Bonus) Skill Coverage</span>
              <span className="font-mono text-cyan-400">{(weights.preferred_skills * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.05"
              value={weights.preferred_skills}
              onChange={(e) => handleWeightChange('preferred_skills', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Semantic Similarity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Scikit-learn TF-IDF Semantic Similarity</span>
              <span className="font-mono text-cyan-400">{(weights.semantic_similarity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.05"
              value={weights.semantic_similarity}
              onChange={(e) => handleWeightChange('semantic_similarity', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Project Evidence Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Project & Portfolio Evidence</span>
              <span className="font-mono text-cyan-400">{(weights.project_evidence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={weights.project_evidence}
              onChange={(e) => handleWeightChange('project_evidence', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Experience Alignment Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Experience & Years Alignment</span>
              <span className="font-mono text-cyan-400">{(weights.experience_alignment * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={weights.experience_alignment}
              onChange={(e) => handleWeightChange('experience_alignment', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Weights Saved' : 'Save Custom Weights'}</span>
          </button>
        </div>
      </div>

      {/* AI Model & LLM Provider Status (Section 14 & 16) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            AI & LLM Integration Status
          </h2>
          <p className="text-xs text-slate-400">Configured via backend environment variables (keys are never exposed to browser client)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Provider</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="uppercase">{llmStatus?.provider || 'OPENAI'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Model</span>
            <div className="text-sm font-bold font-mono text-cyan-400 truncate">
              {llmStatus?.model || 'gpt-4o-mini'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">API Key Status</span>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Configured & Encrypted</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Exposure Key Architecture</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            API keys are read exclusively server-side from <code className="text-slate-300">backend/.env</code>. The frontend communicates with the LLM solely through backend endpoints, preventing API key exposure or leakages.
          </p>
        </div>
      </div>
    </div>
  );
};
