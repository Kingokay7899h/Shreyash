import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Float, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  ExternalLink, Github, Database, Server, 
  Smartphone, Figma, Code, Globe, 
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

// Your actual project data
const projectsData = [
  {
    id: "dams",
    title: "DAMS - Departmental Asset Management System",
    description: "Digitized procurement, inventory, maintenance, student issues, and disposal across a college department. Included OTP-secured login, role-based dashboards, sub-role logins, multi-level approval for procurement and disposal, e-signatures, email alerts, form trackers, PDF generation, inventory sync, maintenance emails, and audit-logged issue tracking.",
    fullDescription: "A comprehensive digital transformation solution for educational institutions, streamlining asset management workflows from procurement to disposal. The system features advanced authentication, automated workflows, digital approvals, and comprehensive audit trails.",
    technologies: ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap", "AJAX"],
    category: "Web Application",
    year: "2024",
    status: "Completed",
    color: "#3b82f6",
    position: [-4, 0, 0] as [number, number, number],
    features: [
      "OTP-Secured Authentication System",
      "Role-Based Dashboard Management", 
      "Multi-Level Approval Workflows",
      "Digital E-Signature Integration",
      "Automated Email Notifications",
      "PDF Report Generation",
      "Real-Time Inventory Synchronization",
      "Comprehensive Audit Trail Logging"
    ],
    images: [
      "/images/projects/dams/dashboard.jpg",
      "/images/projects/dams/inventory.jpg", 
      "/images/projects/dams/procurement.jpg",
      "/images/projects/dams/approval.jpg",
      "/images/projects/dams/reports.jpg"
    ]
  },
  {
    id: "puregleam",
    title: "PureGleam - Dental Clinic Management",
    description: "Developed a responsive web application for dental clinics featuring service listings, patient reviews, appointment booking, and automated email notifications.",
    fullDescription: "A modern healthcare management solution designed specifically for dental practices, focusing on patient experience and operational efficiency. Features intuitive booking systems, patient management, and automated communication workflows.",
    technologies: ["PHP", "MySQL", "HTML/CSS", "Bootstrap", "JavaScript", "Email APIs"],
    category: "Healthcare Web App",
    year: "2023",
    status: "Completed",
    color: "#10b981",
    position: [0, 0, 0] as [number, number, number],
    features: [
      "Responsive Web Design",
      "Service Catalog Management",
      "Patient Review System",
      "Online Appointment Booking",
      "Automated Email Notifications",
      "Patient Profile Management",
      "Treatment History Tracking",
      "Mobile-Optimized Interface"
    ],
    images: [
      "/images/projects/puregleam/homepage.jpg",
      "/images/projects/puregleam/services.jpg",
      "/images/projects/puregleam/booking.jpg", 
      "/images/projects/puregleam/reviews.jpg",
      "/images/projects/puregleam/dashboard.jpg"
    ]
  },
  {
    id: "cricket-gear",
    title: "Cricket Gear Hub - E-commerce App Design",
    description: "Designed complete e-commerce mobile app UI/UX with 200+ wireframes and interactive prototypes in Figma.",
    fullDescription: "Comprehensive UI/UX design project for a cricket equipment e-commerce mobile application. Conducted extensive user research, created detailed user personas, and developed a complete design system with interactive prototypes for seamless shopping experience.",
    technologies: ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "User Research", "Design Systems"],
    category: "Mobile App Design",
    year: "2024",
    status: "Design Completed",
    color: "#f59e0b", 
    position: [4, 0, 0] as [number, number, number],
    features: [
      "Comprehensive User Research (3 User Types)",
      "200+ Detailed Wireframes",
      "Interactive Figma Prototypes", 
      "Complete Component Library",
      "Brand Identity System",
      "Color Palette & Typography Standards",
      "Mobile-First Design Approach",
      "Usability Testing & Iterations"
    ],
    images: [
      "/images/projects/cricket_gear/wireframes.jpg",
      "/images/projects/cricket_gear/homepage.jpg",
      "/images/projects/cricket_gear/product.jpg",
      "/images/projects/cricket_gear/cart.jpg", 
      "/images/projects/cricket_gear/components.jpg"
    ]
  }
];

// ADD THIS ENTIRE COMPONENT:
// NEW: Interactive Laptop component that shows projects on the screen
function InteractiveLaptop({ selectedProject }: { selectedProject: string | null }) {
  const laptopRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/laptop.glb');
  const [hovering, setHovering] = useState(false);

  useFrame((state) => {
    if (laptopRef.current) {
      // Gentle floating animation
      laptopRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Scale based on selection
      const targetScale = selectedProject ? 1.1 : hovering ? 1.05 : 1;
      laptopRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const selectedProjectData = projectsData.find(p => p.id === selectedProject);

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group 
        ref={laptopRef} 
        position={[0, -1, 2]}
        scale={[0.8, 0.8, 0.8]}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <primitive object={scene.clone()} />
        
        {/* Virtual screen showing project */}
        <Html
          position={[0, 0.4, -0.1]} // Position on laptop screen
          transform
          scale={0.2}
          style={{
            width: '800px',
            height: '500px',
            background: selectedProjectData ? '#1e293b' : '#374151',
            borderRadius: '8px',
            padding: '20px',
            color: 'white',
            fontSize: '16px',
            overflow: 'hidden',
            border: '2px solid #475569'
          }}
        >
          {selectedProjectData ? (
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: selectedProjectData.color }}
                  ></div>
                  <h3 className="text-xl font-bold text-white truncate">
                    {selectedProjectData.title}
                  </h3>
                </div>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                  {selectedProjectData.status}
                </span>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <img
                  src={selectedProjectData.images[0]}
                  alt={selectedProjectData.title}
                  className="w-full h-48 object-cover rounded mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23d1d5db'%3EProject Preview%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                <p className="text-sm text-gray-300 mb-3">
                  {selectedProjectData.description.substring(0, 150)}...
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {selectedProjectData.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center">
              <Code className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Select a Project</h3>
              <p className="text-gray-400 text-sm">
                Click on any project card to see it displayed on this laptop screen
              </p>
            </div>
          )}
        </Html>
      </group>
    </Float>
  );
}

// 3D Project Card component
function ProjectCard3D({ 
  project, 
  position, 
  isSelected, 
  onSelect 
}: {
  project: typeof projectsData[0];
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.setScalar(1.2);
      } else if (hovered) {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.rotation.y += 0.005;
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group 
        ref={meshRef}
        position={position}
        onClick={onSelect}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Main project card */}
        <mesh>
          <boxGeometry args={[2.5, 3.5, 0.3]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Screen/display area */}
        <mesh position={[0, 0.3, 0.16]}>
          <boxGeometry args={[2.2, 2.8, 0.1]} />
          <meshStandardMaterial
            color="#1f2937"
            emissive="#374151"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Glowing border */}
        <mesh position={[0, 0.3, 0.2]}>
          <boxGeometry args={[2.3, 2.9, 0.05]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Project title floating above */}
        <Html
          position={[0, -2.2, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-white text-center font-semibold text-sm bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-600">
            <div className="text-lg">{project.title.split(' - ')[0]}</div>
            <div className="text-xs text-slate-400 mt-1">{project.category}</div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

// 3D Scene for projects
// FIND THIS FUNCTION AND ADD THE LAPTOP LINE:
function ProjectsScene({ 
  selectedProject, 
  onProjectSelect 
}: {
  selectedProject: string | null;
  onProjectSelect: (id: string) => void;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60a5fa" />
      
      {/* ADD THIS LINE: */}
      <InteractiveLaptop selectedProject={selectedProject} />
      
      {projectsData.map((project) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          position={project.position}
          isSelected={selectedProject === project.id}
          onSelect={() => onProjectSelect(project.id)}
        />
      ))}
      
      <Environment preset="night" />
    </>
  );
}

// Project detail modal
function ProjectDetailModal({ 
  project, 
  isOpen, 
  onClose 
}: {
  project: typeof projectsData[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div>
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  <p className="text-slate-400">{project.category} • {project.year}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="p-6 grid lg:grid-cols-2 gap-8">
                {/* Left side - Images */}
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-slate-800">
                    <img
                      src={project.images[currentImageIndex]}
                      alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23d1d5db'%3EProject Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    
                    {/* Image navigation */}
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Image thumbnails */}
                  <div className="flex gap-2 overflow-x-auto">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          currentImageIndex === index ? 'border-blue-400' : 'border-slate-600'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3C/svg%3E";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Right side - Details */}
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Project Overview</h4>
                    <p className="text-slate-300 leading-relaxed">{project.fullDescription}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-white">{project.year}</div>
                      <div className="text-sm text-slate-400">Year</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-white">{project.status}</div>
                      <div className="text-sm text-slate-400">Status</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Project cards for mobile/tablet view
function ProjectCards() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <div className="lg:hidden">
      <div className="grid gap-6">
        {projectsData.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-xl border border-slate-600 overflow-hidden hover:border-slate-500 transition-all duration-300"
          >
            {/* Project image */}
            <div className="aspect-video bg-slate-700 relative overflow-hidden">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23d1d5db'%3E%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs text-white font-medium">{project.category}</span>
              </div>
            </div>
            
            {/* Project content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
              <p className="text-slate-300 mb-4 leading-relaxed">{project.description}</p>
              
              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 text-slate-400 text-xs">
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </div>
              
              {/* Action button */}
              <button
                onClick={() => setSelectedProject(project.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Project detail modal */}
      <ProjectDetailModal
        project={projectsData.find(p => p.id === selectedProject) || null}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

// Main Projects component
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const selectedProjectData = projectsData.find(p => p.id === selectedProject);

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
            Featured <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real-world applications showcasing my expertise in database systems, web development, 
            and UI/UX design - from departmental digitization to healthcare management and e-commerce design.
          </p>
        </motion.div>
        
        {/* Desktop 3D View */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - 3D Projects */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[600px] w-full">
                <Canvas className="w-full h-full">
                  <ProjectsScene 
                    selectedProject={selectedProject}
                    onProjectSelect={setSelectedProject}
                  />
                </Canvas>
                
                {/* Instructions overlay */}
                <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                  <div className="text-sm text-white font-semibold mb-2">Interactive Projects</div>
                  <div className="text-xs text-slate-300">
                    <div>• Click on any project card to explore details</div>
                    <div>• Hover for preview animations</div>
                    <div>• Projects show real implementations</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right side - Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="h-[600px] overflow-y-auto"
            >
              <AnimatePresence mode="wait">
                {selectedProjectData ? (
                  <motion.div
                    key={selectedProject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-600 p-6"
                  >
                    {/* Project header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: selectedProjectData.color }}
                        ></div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{selectedProjectData.title}</h3>
                          <p className="text-slate-400">{selectedProjectData.category} • {selectedProjectData.year}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedProjectData.status === 'Completed' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {selectedProjectData.status}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-slate-300 leading-relaxed">{selectedProjectData.fullDescription}</p>
                    </div>
                    
                    {/* Key Features */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                      <div className="grid gap-2 max-h-40 overflow-y-auto">
                        {selectedProjectData.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProjectData.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProject(selectedProject)} // This would open the full modal
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                      View Full Details
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-800/50 rounded-xl border border-slate-600 p-8 text-center h-full flex flex-col justify-center"
                  >
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <Code className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Explore My Projects</h3>
                      <p className="text-slate-300 mb-6">
                        Click on any project card in the 3D view to see detailed information, 
                        features, and the technologies I used to build real-world solutions.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-slate-400">Featured Projects:</div>
                      <div className="grid gap-2">
                        {projectsData.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                            <span className="text-white font-medium">{project.title.split(' - ')[0]}</span>
                            <span className="text-xs text-slate-400">{project.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
        
        {/* Mobile/Tablet Cards */}
        <ProjectCards />
        
        {/* Project Detail Modal for desktop */}
        <ProjectDetailModal
          project={selectedProjectData || null}
          isOpen={false} // Control this with a separate state if you want the full modal
          onClose={() => setSelectedProject(null)}
        />
        
        {/* Projects Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-4">Project Impact & Learning</h3>
            <p className="text-slate-300 max-w-4xl mx-auto mb-6">
              Through these projects, I've gained hands-on experience in full-stack development, database design, 
              user experience research, and agile development methodologies. Each project solved real-world problems 
              and demonstrated my ability to work with stakeholders, gather requirements, and deliver functional solutions 
              that improve operational efficiency and user satisfaction.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">200+</div>
                <div className="text-slate-400">Design Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
                <div className="text-slate-400">Technologies Used</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
                <div className="text-slate-400">Major Projects</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
// ADD AT THE BOTTOM:
useGLTF.preload('/models/laptop.glb');
