import React from 'react';
import { Mail, Phone, Github, Linkedin, ArrowUp, Heart, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#05080E] border-t border-slate-800/80 pt-16 pb-12 overflow-hidden text-slate-400">
      
      {/* Decorative top border gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80 items-start">
          
          {/* Brand & Headline */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 font-mono text-sm">
                  SB
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {personalInfo.name}
              </span>
            </div>

            {/* Required exact string */}
            <p className="text-sm font-semibold text-slate-200">
              {personalInfo.name} | Data Science &amp; Machine Learning Portfolio
            </p>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Aspiring Data Scientist and ML Engineer passionate about extracting insights, building predictive models, and solving real-world challenges with Python and SQL.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {['Home', 'About', 'Skills', 'Projects', 'Education', 'Resume', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-sky-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Contact &amp; Profiles
            </h4>
            
            <div className="space-y-2 text-xs">
              <div>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-2 hover:text-sky-400 transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{personalInfo.email}</span>
                </a>
              </div>

              <div>
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{personalInfo.formattedPhone}</span>
                </a>
              </div>
            </div>

            {/* Social Placeholders */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={personalInfo.socials.github.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
                title="GitHub (Placeholder)"
                aria-label="GitHub Profile Placeholder"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={personalInfo.socials.linkedin.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
                title="LinkedIn (Placeholder)"
                aria-label="LinkedIn Profile Placeholder"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} {personalInfo.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-indigo-400">
              React • Tailwind CSS • Vite
            </span>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
