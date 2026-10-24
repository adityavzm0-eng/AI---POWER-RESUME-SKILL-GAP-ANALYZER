import React, { useState } from 'react';
import { 
  Terminal, 
  LineChart, 
  BrainCircuit, 
  Layers, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  Database,
  Code,
  Brain,
  Camera
} from 'lucide-react';
import { skillCategories } from '../data/portfolioData';

const categoryIcons = {
  Terminal: <Terminal className="w-5 h-5 text-sky-400" />,
  LineChart: <LineChart className="w-5 h-5 text-indigo-400" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5 text-purple-400" />,
  Brain: <Brain className="w-5 h-5 text-sky-400" />,
  Camera: <Camera className="w-5 h-5 text-rose-400" />,
  Database: <Database className="w-5 h-5 text-amber-400" />,
  Layers: <Layers className="w-5 h-5 text-pink-400" />,
  Wrench: <Wrench className="w-5 h-5 text-emerald-400" />
};

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...skillCategories.map(c => c.category)];

  const filteredCategories = selectedCategory === 'All' 
    ? skillCategories 
    : skillCategories.filter(c => c.category === selectedCategory);

  return (
    <section id="skills" className="py-20 md:py-28 relative">
      
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Technical Skills</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Toolkit</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Practical skills in Python, SQL, Power BI, Machine Learning, NLP, Computer Vision Basics, LLMs, and RAG concepts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredCategories.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 backdrop-blur-sm flex flex-col justify-between h-full"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60">
                      {categoryIcons[group.icon] || <Code className="w-5 h-5 text-indigo-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {group.category}
                      </h3>
                      <span className="text-[11px] font-mono text-indigo-400 font-medium">
                        {group.skills.length} competencies
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {group.description}
                </p>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/70 hover:bg-slate-800 text-slate-200 border border-slate-700/60 hover:border-indigo-500/40 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="pt-5 mt-5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Industry Tested</span>
                <span className="text-indigo-400 font-medium">Production Ready</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;
