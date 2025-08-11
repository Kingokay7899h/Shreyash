import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Calendar, MapPin, Users, Target, CheckCircle2, 
  Figma, Smartphone, Palette, BarChart3, 
  Star, TrendingUp, Award, Building
} from 'lucide-react';

// Your actual internship data
const internshipData = {
  company: "Fluxatic™ Global",
  role: "UI/UX Designer",
  duration: "June 2024 - August 2024",
  location: "Remote",
  type: "Summer Internship",
  status: "Completed Successfully",
  description: "Designed UI/UX for CricketGear Hub e-commerce mobile app, conducting comprehensive user research across 3 user types (customers, sellers, admins), creating 200+ wireframes and interactive prototypes in Figma, and developing a complete component library with brand identity system including color palettes and typography standards.",
  
  keyResponsibilities: [
    "Conducted comprehensive user research for 3 distinct user personas (customers, sellers, admins)",
    "Created 200+ detailed wireframes covering all user journeys and interactions",
    "Developed interactive prototypes in Figma with micro-interactions and animations",
    "Built complete component library with reusable design elements and patterns",
    "Established brand identity system with color palettes, typography, and visual guidelines",
    "Collaborated with development team to ensure design feasibility and implementation",
    "Conducted usability testing sessions and iterated designs based on feedback",
    "Documented design decisions and created comprehensive style guides"
  ],
  
  keyAchievements: [
    "Delivered 200+ wireframes on schedule with 100% stakeholder approval",
    "Created comprehensive design system adopted by the entire development team",
    "Reduced design-development handoff time by 40% through detailed documentation",
    "Improved user flow efficiency by 30% through research-driven design decisions",
    "Successfully onboarded and mentored 2 junior design interns",
    "Received outstanding performance rating and offer for future collaboration"
  ],
  
  skillsApplied: [
    { name: "UI/UX Design", level: 90, category: "Design" },
    { name: "User Research", level: 85, category: "Research" },
    { name: "Figma", level: 95, category: "Tools" },
    { name: "Wireframing", level: 90, category: "Design" },
    { name: "Prototyping", level: 85, category: "Design" },
    { name: "Design Systems", level: 80, category: "Systems" },
    { name: "Brand Identity", level: 75, category: "Branding" },
    { name: "Usability Testing", level: 80, category: "Research" }
  ],
  
  projectHighlights: {
    "User Research": {
      icon: Users,
      value: "3",
      description: "User personas researched and documented",
      color: "#3b82f6"
    },
    "Wireframes": {
      icon: Smartphone,
      value: "200+",
      description: "Detailed wireframes created",
      color: "#10b981"
    },
    "Components": {
      icon: Palette,
      value: "50+",
      description: "Reusable components designed",
      color: "#f59e0b"
    },
    "Efficiency": {
      icon: TrendingUp,
      value: "40%",
      description: "Improvement in design handoff time",
      color: "#8b5cf6"
    }
  }
};

// 3D Office/Workspace Environment
function InternshipWorkspace() {
  const deskRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);
  const figmaLogoRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (deskRef.current) {
      deskRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (figmaLogoRef.current) {
      figmaLogoRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      figmaLogoRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group>
      {/* Desk */}
      <group ref={deskRef}>
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[4, 0.2, 2]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
      </group>

      {/* Laptop */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <group ref={laptopRef} position={[0, -0.5, -0.3]}>
          {/* Laptop base */}
          <mesh>
            <boxGeometry args={[1.8, 0.1, 1.2]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Laptop screen */}
          <mesh position={[0, 0.6, -0.6]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[1.6, 1, 0.05]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          {/* Screen content */}
          <mesh position={[0, 0.6, -0.57]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[1.4, 0.8]} />
            <meshStandardMaterial 
              color="#f472b6" 
              emissive="#ec4899" 
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      </Float>

      {/* Floating Figma logo */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={figmaLogoRef} position={[-2, 2, 1]}>
          <mesh>
            <boxGeometry args={[0.3, 0.8, 0.1]} />
            <meshStandardMaterial color="#f24e1e" emissive="#f24e1e" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.1]} />
            <meshStandardMaterial color="#a259ff" emissive="#a259ff" emissiveIntensity={0.3} />
          </mesh>
        </group>
      </Float>

      {/* Floating UI elements */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[2, 1, 1]}>
          <boxGeometry args={[0.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.2} />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh position={[2.5, -0.5, 1.5]}>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.2} />
        </mesh>
      </Float>

      {/* Company name floating text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Fluxatic™ Global
        <meshStandardMaterial attach="material" color="#ffffff" />
      </Text>

      <Text
        position={[0, 2.4, 0]}
        fontSize={0.2}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        UI/UX Design Internship
        <meshStandardMaterial attach="material" color="#94a3b8" />
      </Text>
    </group>
  );
}

// 3D Scene
function InternshipScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#f472b6" />
      <pointLight position={[10, -5, -10]} intensity={0.3} color="#60a5fa" />
      
      <InternshipWorkspace />
      
      <Environment preset="night" />
    </>
  );
}

// Skills applied during internship
function SkillsApplied() {
  const skillCategories = {
    Design: internshipData.skillsApplied.filter(skill => skill.category === "Design"),
    Research: internshipData.skillsApplied.filter(skill => skill.category === "Research"),
    Tools: internshipData.skillsApplied.filter(skill => skill.category === "Tools"),
    Systems: internshipData.skillsApplied.filter(skill => skill.category === "Systems"),
    Branding: internshipData.skillsApplied.filter(skill => skill.category === "Branding")
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(skillCategories).map(([category, skills]) => (
        skills.length > 0 && (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-600"
          >
            <h4 className="text-lg font-semibold text-white mb-3">{category}</h4>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-white font-medium">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      ))}
    </div>
  );
}

// Achievement timeline
function AchievementTimeline() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 to-purple-500"></div>
      
      <div className="space-y-6">
        {internshipData.keyAchievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <div className="absolute left-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full border-4 border-slate-900 z-10"></div>
            
            {/* Achievement content */}
            <div className="ml-12 bg-slate-800/50 rounded-lg p-4 border border-slate-600 flex-1">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-slate-300 leading-relaxed">{achievement}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Project highlights cards
function ProjectHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(internshipData.projectHighlights).map(([key, highlight], index) => {
        const IconComponent = highlight.icon;
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-600 text-center hover:border-slate-500 transition-all duration-300"
          >
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${highlight.color}20` }}
            >
              <IconComponent 
                className="w-8 h-8" 
                style={{ color: highlight.color }} 
              />
            </div>
            <div 
              className="text-3xl font-bold mb-2"
              style={{ color: highlight.color }}
            >
              {highlight.value}
            </div>
            <div className="text-slate-300 text-sm">{highlight.description}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Main Internship component
export default function Internship() {
  const [activeTab, setActiveTab] = useState<'overview' | 'responsibilities' | 'achievements' | 'skills'>('overview');

  return (
    <section className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Professional <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            UI/UX Design Internship at Fluxatic™ Global - designing user-centered solutions 
            for e-commerce mobile applications with comprehensive research and design systems.
          </p>
        </motion.div>

        {/* Company Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/50 rounded-xl border border-slate-600 p-8 mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Building className="w-8 h-8 text-pink-400 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-white">{internshipData.company}</h3>
                  <p className="text-slate-400">{internshipData.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-slate-300">
                  <Calendar className="w-5 h-5 text-pink-400 mr-3" />
                  <span>{internshipData.duration}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="w-5 h-5 text-pink-400 mr-3" />
                  <span>{internshipData.location}</span>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">{internshipData.description}</p>
              
              <div className="flex items-center">
                <Award className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400 font-medium">{internshipData.status}</span>
              </div>
            </div>
            
            {/* 3D Workspace */}
            <div className="h-80 w-full">
              <Canvas className="w-full h-full">
                <InternshipScene />
              </Canvas>
            </div>
          </div>
        </motion.div>

        {/* Project Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Project Impact</h3>
          <ProjectHighlights />
        </motion.div>

        {/* Detailed Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/50 rounded-xl border border-slate-600 overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-slate-600">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'responsibilities', label: 'Responsibilities', icon: CheckCircle2 },
              { id: 'achievements', label: 'Achievements', icon: Star },
              { id: 'skills', label: 'Skills Applied', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-6 py-4 font-medium transition-all duration-300 ${
                  activeTab === id
                    ? 'text-pink-400 border-b-2 border-pink-400 bg-slate-700/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-xl font-bold text-white mb-6">Internship Overview</h4>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-300 leading-relaxed mb-6">
                      During my summer internship at Fluxatic™ Global, I worked as a UI/UX Designer on the CricketGear Hub project, 
                      an e-commerce mobile application for cricket equipment. This experience provided hands-on exposure to professional 
                      design workflows, user research methodologies, and collaborative development processes.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      The role involved working closely with product managers, developers, and other designers to create a comprehensive 
                      mobile shopping experience. I was responsible for understanding user needs, translating business requirements into 
                      design solutions, and ensuring seamless user experiences across different user types and device formats.
                    </p>
                    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                      <h5 className="text-lg font-semibold text-white mb-3">Key Learning Outcomes</h5>
                      <ul className="list-disc list-inside text-slate-300 space-y-2">
                        <li>Professional design workflow and collaboration processes</li>
                        <li>Advanced Figma techniques for prototyping and design systems</li>
                        <li>User research methodologies and persona development</li>
                        <li>Design-development handoff best practices</li>
                        <li>Mobile-first design principles and responsive design</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'responsibilities' && (
                <motion.div
                  key="responsibilities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-xl font-bold text-white mb-6">Key Responsibilities</h4>
                  <div className="grid gap-4">
                    {internshipData.keyResponsibilities.map((responsibility, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                      >
                        <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 mr-4 flex-shrink-0"></div>
                        <p className="text-slate-300 leading-relaxed">{responsibility}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-xl font-bold text-white mb-6">Key Achievements</h4>
                  <AchievementTimeline />
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-xl font-bold text-white mb-6">Skills Applied & Developed</h4>
                  <SkillsApplied />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Experience Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-4">Professional Growth & Impact</h3>
            <p className="text-slate-300 max-w-4xl mx-auto">
              This internship at Fluxatic™ Global was instrumental in bridging the gap between academic learning and 
              professional practice. Working on a real-world e-commerce project allowed me to apply theoretical knowledge 
              of user experience design while learning industry-standard workflows, collaboration tools, and design methodologies. 
              The experience reinforced my passion for user-centered design and provided valuable insights into the complete 
              product development lifecycle.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}