import React from 'react';
import { ArrowDown, Download, Mail, Sparkles, Terminal, Database, Cpu, Brain, CheckCircle2, ChevronRight, BarChart2, Camera, Cloud } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const Hero = ({ onOpenResume, onDownloadResume }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* Ambient Radial Gradient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/15 via-indigo-600/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 shadow-inner backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-200">
                {personalInfo.status}
              </span>
            </div>

            {/* Greeting */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-medium text-slate-300 flex items-center gap-2">
                <span>Hi, I'm</span>
                <span className="font-semibold text-white">{personalInfo.name}</span>
              </p>

              {/* Professional Headline - No "Aspiring" */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Data Scientist &amp; Analyst</span>
                <span className="block text-2xl sm:text-4xl text-slate-200 mt-2 font-bold">
                  Machine Learning, AI, LLMs &amp; RAG
                </span>
              </h1>
            </div>

            {/* Tagline / Description */}
            <p className="text-base sm:text-lg text-slate-300/90 max-w-2xl leading-relaxed font-normal">
              {personalInfo.tagline}
            </p>

            {/* Core Competencies Quick Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Python & SQL', 
                'Power BI', 
                'Machine Learning', 
                'NLP & Transformers', 
                'CV Basics (OpenCV)', 
                'LLMs & RAG Chatbots', 
                'Streamlit Frontend', 
                'Render Deployment'
              ].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-indigo-500/40 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Required Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {/* Explore My Projects */}
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <span>Explore My Projects</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              {/* Download Resume */}
              <button
                onClick={onDownloadResume}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 transition-all hover:border-slate-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Download Resume</span>
              </button>

              {/* Contact Me */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Direct Quick Contact Snippet */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Email: <a href={`mailto:${personalInfo.email}`} className="text-slate-300 hover:text-sky-400 underline decoration-slate-700">{personalInfo.email}</a></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Phone: <a href={`tel:${personalInfo.phone}`} className="text-slate-300 hover:text-purple-400 underline decoration-slate-700">{personalInfo.formattedPhone}</a></span>
              </span>
            </div>

          </div>

          {/* Right Column: AI & Data Science Interactive Terminal Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer decorative gradient border */}
              <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-sky-500/40 via-indigo-500/20 to-purple-500/40 shadow-2xl shadow-indigo-950/50">
                <div className="rounded-[15px] bg-[#0A0E17]/95 backdrop-blur-xl p-5 sm:p-6 space-y-4">
                  
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                      <span className="text-xs font-mono text-slate-400 ml-2">ds_ai_pipeline.py</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                      <Cloud className="w-3 h-3" />
                      <span>Render &amp; Streamlit</span>
                    </div>
                  </div>

                  {/* Code Mockup */}
                  <div className="space-y-1.5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto pb-1">
                    <p className="text-slate-500"># Production Data &amp; AI Pipeline</p>
                    <p><span className="text-purple-400">from</span> gemini_rag <span className="text-purple-400">import</span> RAGChatbot</p>
                    <p><span className="text-purple-400">import</span> cv2 <span className="text-purple-400">as</span> cv, streamlit <span className="text-purple-400">as</span> st</p>
                    <p><span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd, mysql.connector</p>
                    
                    <div className="pt-1 text-slate-500"># Core Banking Query &amp; Analytics</div>
                    <p className="text-sky-300">df_rbi = pd.read_sql(<span className="text-amber-300">"SELECT * FROM rbi_banks"</span>, db)</p>
                    
                    <div className="pt-1 text-slate-500"># Live Face Detection &amp; RAG Chatbot</div>
                    <p className="text-emerald-300">face_cascade = cv.CascadeClassifier(<span className="text-amber-300">'haarcascade.xml'</span>)</p>
                    <p className="text-indigo-300">bot = RAGChatbot(model=<span className="text-amber-300">'gemini-pro'</span>)</p>
                  </div>

                  {/* Production Metrics Card */}
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
                        Verified Project Highlights
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        Tested
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-mono">ML Score</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">85% R²</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-mono">Gen AI</span>
                        <span className="text-xs font-bold text-sky-400 font-mono">RAG + LLM</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-mono">Vision</span>
                        <span className="text-xs font-bold text-purple-400 font-mono">Live CV</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro-cards */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Banking SQL Systems</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Power BI Dashboards</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Accent Badges */}
              <div className="hidden sm:flex absolute -top-4 -right-4 items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/40 shadow-xl backdrop-blur-md">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-purple-200">LLM &amp; RAG Certified</span>
              </div>

              <div className="hidden sm:flex absolute -bottom-4 -left-4 items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-sky-500/40 shadow-xl backdrop-blur-md">
                <Database className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-medium text-sky-200">Python, SQL &amp; Power BI</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="max-w-7xl mx-auto px-4 mt-12 flex justify-center">
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors group"
          aria-label="Scroll to About section"
        >
          <span className="text-[11px] font-medium tracking-wider uppercase group-hover:text-sky-400">Explore Portfolio</span>
          <ArrowDown className="w-4 h-4 text-slate-400 animate-bounce group-hover:text-sky-400" />
        </a>
      </div>

    </section>
  );
};

export default Hero;
