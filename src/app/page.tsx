'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Dynamic imports for better performance
const Hero = dynamic(() => import('../components/Hero'), {
  loading: () => <LoadingSpinner text="Loading Hero Section..." />
});

const Education = dynamic(() => import('../components/Education'), {
  loading: () => <LoadingSpinner text="Loading Educational Journey..." />
});

const Skills = dynamic(() => import('../components/Skills'), {
  loading: () => <LoadingSpinner text="Loading Skills..." />
});

const Projects = dynamic(() => import('../components/Projects'), {
  loading: () => <LoadingSpinner text="Loading Projects..." />
});

const Internship = dynamic(() => import('../components/Internship'), {
  loading: () => <LoadingSpinner text="Loading Internship Experience..." />
});

const Certificates = dynamic(() => import('../components/Certificates'), {
  loading: () => <LoadingSpinner text="Loading Certificates..." />
});

const Contact = dynamic(() => import('../components/Contact'), {
  loading: () => <LoadingSpinner text="Loading Contact Information..." />
});

// Loading spinner component
function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <Loader2 className="w-16 h-16 text-blue-400" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-slate-300 text-lg font-medium"
      >
        {text}
      </motion.p>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-4 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
      />
    </div>
  );
}

// Navigation component
function Navigation() {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'internship', label: 'Experience' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            SD
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className="text-slate-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                {item.label}
              </motion.button>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-slate-300 hover:text-blue-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Scroll progress indicator
function ScrollProgress() {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 z-50 origin-left"
      style={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 0.2 }}
    />
  );
}

// Main portfolio application
export default function Portfolio() {
  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Scroll Progress */}
      <ScrollProgress />
      
      {/* Main Content */}
      <main className="pt-16">
        <Suspense fallback={<LoadingSpinner text="Loading Portfolio..." />}>
          {/* Hero Section */}
          <section id="hero">
            <Hero />
          </section>
          
          {/* Education Section */}
          <section id="education">
            <Education />
          </section>
          
          {/* Skills Section */}
          <section id="skills">
            <Skills />
          </section>
          
          {/* Projects Section */}
          <section id="projects">
            <Projects />
          </section>
          
          {/* Internship Section */}
          <section id="internship">
            <Internship />
          </section>
          
          {/* Certificates Section */}
          <section id="certificates">
            <Certificates />
          </section>
          
          {/* Contact Section */}
          <section id="contact">
            <Contact />
          </section>
        </Suspense>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Shreyash Desai</h3>
            <p className="text-slate-400 mb-6">Computer Engineering Student • UI/UX Designer • Full-Stack Developer</p>
            
            <div className="flex justify-center space-x-6 mb-8">
              <motion.a
                whileHover={{ scale: 1.2, color: '#60a5fa' }}
                href="tel:+917666987026"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.2, color: '#60a5fa' }}
                href="mailto:shreyashdesai60@gmail.com"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.2, color: '#60a5fa' }}
                href="https://github.com/shreyashdesai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </div>
            
            <p className="text-slate-500 text-sm">
              © 2025 Shreyash Desai. Built with Next.js, Three.js, and lots of ☕
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}