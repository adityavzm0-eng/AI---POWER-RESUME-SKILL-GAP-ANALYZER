import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  AlertCircle, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Info,
  Clock,
  MapPin,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const Contact = ({ onNotify }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 5) {
      errs.message = 'Message must be at least 5 characters long.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const getMailtoUrl = () => {
    const bodyContent = `Hello Siddeswararao,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    return `mailto:${personalInfo.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(bodyContent)}`;
  };

  const getGmailWebUrl = () => {
    const bodyContent = `Hello Siddeswararao,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(bodyContent)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      onNotify('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Launch email client pre-filled with the message
    const mailto = getMailtoUrl();
    window.location.href = mailto;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onNotify('Email client opened! You can also send directly via Gmail.', 'success');
    }, 600);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      onNotify(`Copied ${text} to clipboard!`, 'success');
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      onNotify(`Copied ${text} to clipboard!`, 'success');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      
      {/* Background radial accent */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-indigo-900/15 via-purple-900/15 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Me</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Seeking opportunities in Data Science, Data Analytics, Machine Learning &amp; AI. Reach out directly via email, phone, or the message form.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Socials */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Identity Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-1">{personalInfo.name}</h3>
              <p className="text-xs text-indigo-400 font-mono mb-4">{personalInfo.title}</p>
              
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Available for Immediate Joining</span>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 transition-all backdrop-blur-sm group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Email Address</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-sm font-semibold text-white hover:text-sky-400 transition-colors break-all"
                      title="Send email"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(personalInfo.email, 'email')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone Card (Single, Clean Phone Number) */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all backdrop-blur-sm group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Phone Number</span>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="text-sm font-semibold text-white hover:text-purple-400 transition-colors"
                      title="Call phone number"
                    >
                      {personalInfo.formattedPhone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(personalInfo.formattedPhone, 'phone')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Copy phone to clipboard"
                  aria-label="Copy phone number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* LinkedIn Placeholder */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700/60">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">LinkedIn Profile</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
                        Connect
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      {personalInfo.socials.linkedin.note}
                    </span>
                  </div>
                </div>

                <a
                  href={personalInfo.socials.linkedin.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Open LinkedIn"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* GitHub Placeholder */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-800 text-sky-400 border border-slate-700/60">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">GitHub Profile</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
                        Repositories
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      {personalInfo.socials.github.note}
                    </span>
                  </div>
                </div>

                <a
                  href={personalInfo.socials.github.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Open GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl relative">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Send Me a Message</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Fill in your details below. Submitting will send the message directly to <strong className="text-sky-300">{personalInfo.email}</strong>.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-emerald-900/50 text-center space-y-5 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Message Ready to Send!</h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                      Thank you, <span className="font-semibold text-white">{formData.name}</span>. Choose your preferred way to send your message to <strong className="text-sky-400">{personalInfo.email}</strong>:
                    </p>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={getGmailWebUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Gmail Web</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={getMailtoUrl()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>Open in Email App</span>
                    </a>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="text-xs text-slate-400 hover:text-white underline decoration-slate-700 transition-colors"
                    >
                      Write another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                          errors.name 
                            ? 'border-rose-500 focus:ring-rose-500/30' 
                            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. recruiter@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                          errors.email 
                            ? 'border-rose-500 focus:ring-rose-500/30' 
                            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Subject <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Job Opportunity: Data Scientist / ML Engineer"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                        errors.subject 
                          ? 'border-rose-500 focus:ring-rose-500/30' 
                          : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Message <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your role, project, or requirements..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors resize-none ${
                        errors.message 
                          ? 'border-rose-500 focus:ring-rose-500/30' 
                          : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                    ></textarea>
                    {errors.message && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span>Opening Mail Composer...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message Now</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
