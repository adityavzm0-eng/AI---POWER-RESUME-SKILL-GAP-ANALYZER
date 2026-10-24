import React, { useState } from 'react';
import Navbar from './components/Navbar';
import NeuralBackground from './components/NeuralBackground';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import ResumeSection from './components/ResumeSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import ResumeModal from './components/ResumeModal';
import CertificateModal from './components/CertificateModal';
import Toast from './components/Toast';
import { personalInfo } from './data/portfolioData';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = `/${personalInfo.resumeFileName}`;
    link.download = personalInfo.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloading ${personalInfo.resumeFileName}.`, 'success');
  };

  return (
    <div className="relative min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Interactive Neural Canvas Background */}
      <NeuralBackground />

      {/* Main Sticky Navigation */}
      <Navbar onOpenResume={() => setIsResumeModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-grow relative z-10">
        <Hero
          onOpenResume={() => setIsResumeModalOpen(true)}
          onDownloadResume={handleDownloadResume}
        />

        <About />

        <Experience onOpenCertificate={(cert) => setSelectedCertificate(cert)} />

        <Skills />

        <Projects
          onSelectProject={(project) => setSelectedProject(project)}
        />

        <Education onOpenCertificate={(cert) => setSelectedCertificate(cert)} />

        <ResumeSection
          onOpenResume={() => setIsResumeModalOpen(true)}
          onDownloadResume={handleDownloadResume}
        />

        <Contact onNotify={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onDownload={handleDownloadResume}
      />

      <CertificateModal
        certificate={selectedCertificate}
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* Interactive Toast Notifications */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      )}

    </div>
  );
}

export default App;
