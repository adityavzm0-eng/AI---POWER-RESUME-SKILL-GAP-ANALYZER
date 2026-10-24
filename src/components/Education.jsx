import React from 'react';
import { GraduationCap, Calendar, Award, BookOpen, CheckCircle2, Sparkles, Terminal, BrainCircuit, Eye } from 'lucide-react';
import { education, certifications } from '../data/portfolioData';

const certIcons = {
  Terminal: <Terminal className="w-5 h-5 text-sky-400" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5 text-purple-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />
};

const Education = ({ onOpenCertificate }) => {
  return (
    <section id="education" className="py-20 md:py-28 relative">
      
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-80 h-80 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background &amp; Certifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Credentials</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Academic degree in Computer Science paired with industry certifications in Machine Learning, Full Stack Python, and AI.
          </p>
        </div>

        {/* Education Degree Card */}
        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-10 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/5"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-1 shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {item.degree}
                    </h3>
                    <p className="text-base font-semibold text-indigo-300 mt-0.5">
                      {item.college}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.graduationYear}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 text-sky-300 border border-indigo-800/40 text-xs font-semibold">
                    <span>CGPA: {item.cgpa}</span>
                  </span>
                </div>
              </div>

              {/* Coursework */}
              <div className="pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>Foundational Coursework</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.coursework.map((course, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Certifications Subsection */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Verified Certifications &amp; Credentials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60">
                        {certIcons[cert.icon] || <Award className="w-5 h-5 text-indigo-400" />}
                      </div>
                      <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                        {cert.tag}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">
                      {cert.title}
                    </h4>
                    <p className="text-xs font-semibold text-indigo-300 mb-2">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {cert.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>

                    {cert.hasImage ? (
                      <button
                        onClick={() => onOpenCertificate({
                          title: cert.title,
                          issuer: cert.issuer,
                          internId: cert.certificateId,
                          image: cert.image
                        })}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/40 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Certificate Photo</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">Course Certificate</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Education;
