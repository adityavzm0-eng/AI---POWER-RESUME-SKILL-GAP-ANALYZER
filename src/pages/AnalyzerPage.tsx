import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Plus, 
  Layers, 
  Zap,
  ArrowRight,
  Loader2,
  FileSearch,
  Sliders,
  Check
} from 'lucide-react';
import { SamplePreset } from '../types/skillsync';
import { analyzeJobDescriptionApi } from '../services/api';

interface AnalyzerPageProps {
  onAnalyze: (formData: FormData) => Promise<void>;
  samplePresets: SamplePreset[];
  isAnalyzing: boolean;
  analysisProgress: string;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  onAnalyze,
  samplePresets,
  isAnalyzing,
  analysisProgress,
}) => {
  // Input mode: 'upload' or 'paste'
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  // Text states
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Machine Learning Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Senior Level');
  
  // Editable Extracted Skills feature
  const [isExtractingJDSkills, setIsExtractingJDSkills] = useState(false);
  const [showSkillEditor, setShowSkillEditor] = useState(false);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop/selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      validateAndSetFile(selected);
    }
  };

  const validateAndSetFile = (f: File) => {
    setFileError(null);
    const validExtensions = ['.pdf', '.txt'];
    const hasValidExt = validExtensions.some(ext => f.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setFileError('Invalid file type. Please upload a PDF (.pdf) or Text (.txt) file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError('File exceeds 10MB limit. Please upload a smaller document.');
      return;
    }
    setFile(f);
  };

  // Preset quick fill
  const handleSelectPreset = (preset: SamplePreset) => {
    setInputMode('paste');
    setResumeText(preset.resume_text);
    setJobDescription(preset.job_description);
    setTargetRole(preset.role_title);
    setExperienceLevel(preset.experience_level);
  };

  // Preview / Edit extracted JD skills before running full match
  const handleInspectJDSkills = async () => {
    if (!jobDescription.trim() || jobDescription.length < 20) {
      setFileError('Please enter a comprehensive job description first.');
      return;
    }
    setIsExtractingJDSkills(true);
    setFileError(null);
    try {
      const data = await analyzeJobDescriptionApi(jobDescription, targetRole);
      const skills = [
        ...data.required_skills.map((s: any) => s.name),
        ...data.preferred_skills.map((s: any) => s.name)
      ];
      setCustomSkills(skills);
      setShowSkillEditor(true);
    } catch (err: any) {
      setFileError('Could not parse JD skills: ' + err.message);
    } finally {
      setIsExtractingJDSkills(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCustomSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddCustomSkill = () => {
    if (newSkillInput.trim() && !customSkills.includes(newSkillInput.trim())) {
      setCustomSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(null);

    if (inputMode === 'upload' && !file && !resumeText.trim()) {
      setFileError('Please upload a PDF resume or paste your resume text.');
      return;
    }
    if (inputMode === 'paste' && !resumeText.trim()) {
      setFileError('Please paste your resume text in the field below.');
      return;
    }
    if (!jobDescription.trim() || jobDescription.length < 20) {
      setFileError('Job description must be at least 20 characters long.');
      return;
    }

    const formData = new FormData();
    if (inputMode === 'upload' && file) {
      formData.append('file', file);
    } else {
      formData.append('resume_text', resumeText);
    }
    formData.append('job_description', jobDescription);
    formData.append('target_role', targetRole);
    formData.append('experience_level', experienceLevel);
    formData.append('save_history', 'true');

    await onAnalyze(formData);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-cyan-400" />
            AI Resume & Job Description Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload text-based PDF or paste resume content for instant NLP extraction, scoring, and skill gap mapping.
          </p>
        </div>

        {/* Demo Presets Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/50 transition-all"
            >
              {preset.id === 'aiml_engineer' ? 'AI / ML Engineer' : 'Full-Stack Dev'}
            </button>
          ))}
        </div>
      </div>

      {fileError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 & 2: Resume Input & Target Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Resume Input */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 1: Candidate Resume</span>
              
              {/* Tab Selector */}
              <div className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    inputMode === 'upload' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                  }`}
                >
                  PDF Upload
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    inputMode === 'paste' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputMode === 'upload' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    validateAndSetFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-slate-700 hover:border-cyan-500/50 bg-slate-950/40 hover:bg-slate-950/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-sm text-white truncate max-w-xs mx-auto">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {(file.size / 1024).toFixed(1)} KB • Ready for extraction
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-xs text-rose-400 hover:underline pt-2"
                    >
                      Remove and choose another
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">Click or drag & drop resume PDF</div>
                      <p className="text-xs text-slate-400 mt-1">Supports standard text-based PDF resumes (up to 10MB)</p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
                      PyMuPDF Fast Extractor
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  rows={9}
                  placeholder="Paste candidate resume text here (Summary, Skills, Experience, Education)..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full p-3.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>
            )}

            {/* Target Role & Experience Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Target Job Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior ML Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Experience Tier
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500/50 font-medium"
                >
                  <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                  <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                  <option value="Senior Level (5+ yrs)">Senior Level (5+ yrs)</option>
                  <option value="Lead / Staff Engineer">Lead / Staff Engineer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Job Description Input */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 2: Target Job Description</span>
              <button
                type="button"
                onClick={handleInspectJDSkills}
                disabled={isExtractingJDSkills}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                title="Preview extracted skills and remove or add manual keywords"
              >
                {isExtractingJDSkills ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sliders className="w-3 h-3" />}
                <span>Inspect / Edit Skills</span>
              </button>
            </div>

            <textarea
              rows={11}
              placeholder="Paste job description text here, including requirements, qualifications, and responsibilities..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Characters: {jobDescription.length}</span>
              <span className="text-slate-400">Categorizes must-haves vs preferred skills</span>
            </div>
          </div>
        </div>

        {/* Modal: Editable Extracted Skills */}
        {showSkillEditor && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Customized Extracted Job Skills
                </h4>
                <p className="text-xs text-slate-400">Edit, remove false positives, or add custom skills before running comparison.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSkillEditor(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
              >
                Done Editing
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-2 bg-slate-900/50 rounded-xl border border-slate-800">
              {customSkills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add custom skill requirement..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex-1 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>
        )}

        {/* Submit Button & Progress Indicator */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className={`w-full max-w-md mx-auto py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-2xl transition-all flex items-center justify-center gap-2 ${
              isAnalyzing
                ? 'bg-slate-800 cursor-wait text-slate-400'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-cyan-500/25 hover:scale-[1.02]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                <span>{analysisProgress || 'Extracting Skills & Computing Compatibility...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Analyze Resume & Generate Skill Gap Intelligence</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-500 mt-2">
            Deterministic NLP processing • Scikit-learn TF-IDF semantic vector similarity
          </p>
        </div>
      </form>
    </div>
  );
};
