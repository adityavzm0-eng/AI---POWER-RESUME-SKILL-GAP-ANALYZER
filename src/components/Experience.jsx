import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles, Building2, Award, Eye, ExternalLink } from 'lucide-react';
import { experience } from '../data/portfolioData';

const Experience = ({ onOpenCertificate }) => {
  return (
    <section id="experience" className="py-20 md:py-28 relative">
      
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Internships &amp; Practical Training</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Experience</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Hands-on internships in Machine Learning, Full Stack Python, and Data Science &amp; AI with verified completion credentials.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-1 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                        {exp.type}
                      </span>
                      {exp.internId && (
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          ID: {exp.internId}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {exp.role}
                    </h3>
                    <p className="text-base font-semibold text-indigo-300 mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{exp.period}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="pt-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Deliverables &amp; Technical Scope
                </h4>

                <div className="space-y-2.5">
                  {exp.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>

                {/* Tech tags & Certificate Action */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/70 text-indigo-200 border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Certificate View Button if available */}
                  {exp.hasCertificate && (
                    <button
                      onClick={() => onOpenCertificate({
                        title: `${exp.role} Certificate`,
                        company: exp.company,
                        issuer: exp.company,
                        internId: exp.internId,
                        period: exp.period,
                        image: exp.certificateImage
                      })}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 transition-all hover:scale-105 shadow-sm"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Verified Certificate</span>
                      <Eye className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;
