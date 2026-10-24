import React from 'react';
import { 
  BarChart3, 
  Code2, 
  Cpu, 
  Network, 
  Brain, 
  Target, 
  Sparkles, 
  CheckCircle,
  Camera,
  Database,
  Workflow
} from 'lucide-react';
import { personalInfo, interests } from '../data/portfolioData';

const iconMap = {
  Brain: <Brain className="w-5 h-5 text-sky-400" />,
  Cpu: <Cpu className="w-5 h-5 text-indigo-400" />,
  BarChart3: <BarChart3 className="w-5 h-5 text-emerald-400" />,
  Camera: <Camera className="w-5 h-5 text-pink-400" />,
  Database: <Database className="w-5 h-5 text-amber-400" />,
  Target: <Target className="w-5 h-5 text-purple-400" />
};

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Me</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Data Scientist, Data Analyst &amp; Machine Learning Engineer skilled in Python, SQL, Power BI, LLMs, RAG, and Computer Vision.
          </p>
        </div>

        {/* Top Bio & Candidate Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Main Bio Card */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Who I Am</span>
                <span className="text-xs font-normal text-indigo-400 font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                  Data Science &amp; AI Practitioner
                </span>
              </h3>

              <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  I am a <strong className="text-white font-semibold">Data Scientist, Data Analyst &amp; Machine Learning Engineer</strong> skilled in <strong className="text-sky-300 font-semibold">Python, SQL, Power BI, Machine Learning, NLP, CV Basics, LLMs, and RAG concepts</strong>.
                </p>
                <p>
                  I build and deploy practical AI solutions—including intelligent conversational chatbots using Google Gemini &amp; RAG, real-time webcam Face Detection systems using OpenCV, core relational Banking Management Systems using Python &amp; SQL, and comprehensive RBI banking analytics dashboards using Power BI and Streamlit.
                </p>
                <p className="text-slate-400 text-xs sm:text-sm">
                  With verified internship training across Machine Learning, Full Stack Python, and Data Science, I focus on clean pipelines, robust statistical modeling, and seamless deployments on Render and Streamlit Cloud.
                </p>
              </div>
            </div>

            {/* Core Competencies Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Python, SQL &amp; Power BI Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Scikit-learn ML &amp; 85% R² Models</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>LLMs, RAG &amp; AI Chatbot Development</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>OpenCV Computer Vision &amp; Live Detection</span>
              </div>
            </div>
          </div>

          {/* Quick Profile Candidate Summary Card */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-sky-400" />
                <span>Candidate Summary</span>
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                {/* Target Roles with Numbered List */}
                <div className="pb-3 border-b border-slate-800/80">
                  <span className="text-slate-400 block mb-1.5 font-medium">Target Roles:</span>
                  <div className="grid grid-cols-2 gap-1.5 font-semibold text-slate-200 text-xs">
                    <span className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                      <span className="text-indigo-400 font-mono">1.</span> Data Scientist
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                      <span className="text-indigo-400 font-mono">2.</span> Data Analyst
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                      <span className="text-indigo-400 font-mono">3.</span> ML Engineer
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                      <span className="text-indigo-400 font-mono">4.</span> AI &amp; ML Engineer
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-slate-400">Core Stack:</span>
                  <span className="text-right font-medium text-indigo-300 font-mono text-xs">Python, SQL, Power BI, Scikit-learn, LLMs, RAG, OpenCV</span>
                </div>

                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-slate-400">Deployments:</span>
                  <span className="text-right font-medium text-emerald-400">Render &amp; Streamlit Cloud</span>
                </div>

                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-slate-400">Education:</span>
                  <span className="text-right font-medium text-white">Aditya Degree &amp; P.G College (CGPA 8.0)</span>
                </div>

                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-slate-400">Availability:</span>
                  <span className="text-right font-medium text-emerald-400">Immediate Joiner</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <a href={`mailto:${personalInfo.email}`} className="text-right font-medium text-sky-400 hover:underline">
                    {personalInfo.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <span>Discuss an Opportunity</span>
              </a>
            </div>
          </div>

        </div>

        {/* Highlighted Key Specializations */}
        <div>
          <div className="text-left mb-8">
            <h3 className="text-xl font-bold text-white">
              Technical Focus &amp; Core Strengths
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Key domains where I build and deploy data intelligence and machine learning pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {interests.map((item) => (
              <div
                key={item.title}
                className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform duration-300">
                    {iconMap[item.icon] || <Brain className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
