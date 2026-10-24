import React, { useEffect } from 'react';
import { X, Download, Printer, Mail, Phone, MapPin, ExternalLink, Award, BookOpen, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { personalInfo, skillCategories, experience, projects, education, certifications } from '../data/portfolioData';

const ResumeModal = ({ isOpen, onClose, onDownload }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-sm font-semibold text-slate-200">Official Resume • Siddeswararao Botcha</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              title="Download Resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-7 bg-white text-slate-900 font-sans print:p-0">
          
          {/* Header */}
          <div className="text-center border-b border-slate-300 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {personalInfo.name}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-slate-700">
              <a href={`tel:${personalInfo.phone}`} className="hover:text-indigo-600 font-medium">
                {personalInfo.formattedPhone}
              </a>
              <span>•</span>
              <a href={`mailto:${personalInfo.email}`} className="hover:text-indigo-600 font-medium">
                {personalInfo.email}
              </a>
              <span>•</span>
              <span className="font-medium text-slate-800">LinkedIn</span>
              <span>•</span>
              <span className="font-medium text-slate-800">GitHub</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {personalInfo.about}
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-1 mb-2">
              Technical Skills
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              {skillCategories.map((cat) => (
                <div key={cat.category} className="flex flex-col sm:flex-row sm:items-baseline">
                  <span className="font-semibold text-slate-900 sm:w-44 shrink-0">• {cat.category}:</span>
                  <span className="text-slate-700">{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-1 mb-3">
              Professional Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900">{exp.company}</span>
                    <span className="text-slate-600 italic ml-2">— {exp.location}</span>
                  </div>
                  <span className="text-slate-600 font-medium text-xs">{exp.period}</span>
                </div>
                <div className="text-xs font-semibold text-indigo-900 italic">
                  {exp.role}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800 leading-relaxed pt-1">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-1 mb-3">
              Projects
            </h2>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {proj.title}
                    </span>
                    <span className="text-[11px] font-mono text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {proj.technologies.join(', ')}
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800 leading-relaxed">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-1 mb-2">
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-0.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{edu.college}</span>
                  <span className="text-slate-600 font-medium">{edu.graduationYear}</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span>{edu.degree}</span>
                  <span className="font-semibold text-indigo-900">CGPA: {edu.cgpa}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800">
              {certifications.map((cert, idx) => (
                <li key={idx}>
                  <strong className="text-slate-900">{cert.title}</strong> — {cert.issuer}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900 text-xs text-slate-300">
          <span>{personalInfo.name} • {personalInfo.formattedPhone}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeModal;
