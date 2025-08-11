import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Award, Calendar, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Your actual NPTEL certificates data
const certificatesData = [
  {
    id: "hci",
    title: "Human-Computer Interaction",
    issuer: "NPTEL",
    date: "2024",
    description: "Comprehensive course covering principles of user interface design, usability evaluation, and human factors in computing.",
    skills: ["UI/UX Design", "Usability Testing", "User Research", "Interface Design"],
    position: [-3, 1.5, 0] as [number, number, number],
    color: "#3b82f6",
    image: "/images/certificates/hci_nptel.jpg",
    credentialUrl: "#" // Add your actual credential URL if available
  },
  {
    id: "social_network",
    title: "Social Network Analysis", 
    issuer: "NPTEL",
    date: "2024",
    description: "Advanced techniques for analyzing social networks, graph theory applications, and network visualization methods.",
    skills: ["Network Analysis", "Graph Theory", "Data Visualization", "Algorithm Design"],
    position: [3, 1.5, 0] as [number, number, number],
    color: "#10b981",
    image: "/images/certificates/social_network_nptel.jpg",
    credentialUrl: "#"
  },
  {
    id: "leadership",
    title: "Leadership and Team Effectiveness",
    issuer: "NPTEL", 
    date: "2024",
    description: "Essential leadership skills, team dynamics, and effective communication strategies for professional environments.",
    skills: ["Leadership", "Team Management", "Communication", "Project Coordination"],
    position: [-3, -1.5, 0] as [number, number, number],
    color: "#f59e0b",
    image: "/images/certificates/leadership_nptel.jpg",
    credentialUrl: "#"
  },
  {
    id: "privacy_security",
    title: "Privacy and Security in Online Social Media",
    issuer: "NPTEL",
    date: "2024", 
    description: "Critical understanding of privacy concerns, security measures, and ethical considerations in social media platforms.",
    skills: ["Cybersecurity", "Privacy Protection", "Social Media Ethics", "Data Security"],
    position: [3, -1.5, 0] as [number, number, number],
    color: "#8b5cf6",
    image: "/images/certificates/privacy_security_nptel.jpg",
    credentialUrl: "#"
  }
];

// 3D Certificate Frame component
function CertificateFrame({ 
  certificate, 
  position, 
  isSelected, 
  onSelect 
}: {
  certificate: typeof certificatesData[0];
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const frameRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (frameRef.current) {
      if (isSelected) {
        frameRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        frameRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        frameRef.current.scale.setScalar(1.3);
      } else if (hovered) {
        frameRef.current.rotation.y += 0.01;
        frameRef.current.scale.setScalar(1.1);
      } else {
        frameRef.current.rotation.y += 0.005;
        frameRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group 
        ref={frameRef}
        position={position}
        onClick={onSelect}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Certificate frame */}
        <mesh>
          <boxGeometry args={[2.2, 2.8, 0.15]} />
          <meshStandardMaterial
            color="#8b7355"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Certificate paper */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[1.8, 2.4, 0.05]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#f1f5f9"
            emissiveIntensity={isSelected ? 0.1 : 0.05}
          />
        </mesh>
        
        {/* Glow effect for selected */}
        {isSelected && (
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[2.4, 3, 0.1]} />
            <meshStandardMaterial
              color={certificate.color}
              emissive={certificate.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
            />
          </mesh>
        )}
        
        {/* Certificate title floating above */}
        <Html
          position={[0, -1.8, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-white text-center font-semibold text-sm bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-600 max-w-48">
            <div className="text-base font-bold">{certificate.title}</div>
            <div className="text-xs text-slate-400 mt-1">{certificate.issuer} • {certificate.date}</div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

// 3D Scene for certificates
function CertificatesScene({ 
  selectedCertificate, 
  onCertificateSelect 
}: {
  selectedCertificate: string | null;
  onCertificateSelect: (id: string) => void;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60a5fa" />
      
      {certificatesData.map((certificate) => (
        <CertificateFrame
          key={certificate.id}
          certificate={certificate}
          position={certificate.position}
          isSelected={selectedCertificate === certificate.id}
          onSelect={() => onCertificateSelect(certificate.id)}
        />
      ))}
      
      <Environment preset="studio" />
    </>
  );
}

// Certificate detail modal
function CertificateDetailModal({ 
  certificate, 
  isOpen, 
  onClose 
}: {
  certificate: typeof certificatesData[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!certificate) return null;

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
            <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-400 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">{certificate.title}</h3>
                    <p className="text-slate-400">{certificate.issuer} • {certificate.date}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="p-6 grid lg:grid-cols-2 gap-8">
                {/* Left side - Certificate Image */}
                <div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-slate-800">
                    <img
                      src={certificate.image}
                      alt={`${certificate.title} certificate`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23d1d5db'%3ECertificate%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  
                  {/* Certificate actions */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                      onClick={() => window.open(certificate.image, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Size
                    </motion.button>
                    
                    {certificate.credentialUrl !== "#" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-3 border-2 border-blue-400 text-blue-400 rounded-lg font-medium hover:bg-blue-400 hover:text-slate-900 transition-colors flex items-center justify-center"
                        onClick={() => window.open(certificate.credentialUrl, '_blank')}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Verify Certificate
                      </motion.button>
                    )}
                  </div>
                </div>
                
                {/* Right side - Details */}
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">About This Certificate</h4>
                    <p className="text-slate-300 leading-relaxed">{certificate.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Skills Gained</h4>
                    <div className="flex flex-wrap gap-2">
                      {certificate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-white">{certificate.issuer}</div>
                      <div className="text-sm text-slate-400">Institution</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-white">{certificate.date}</div>
                      <div className="text-sm text-slate-400">Year</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                    <h5 className="text-white font-semibold mb-2">Certificate Value</h5>
                    <p className="text-slate-300 text-sm">
                      NPTEL certificates are recognized industry-wide and demonstrate commitment to continuous learning 
                      and professional development. This certificate validates expertise in {certificate.title.toLowerCase()}.
                    </p>
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

// Certificate overview cards
function CertificatesOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {certificatesData.map((certificate, index) => (
        <motion.div
          key={certificate.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <div 
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: certificate.color }}
            ></div>
            <Award className="w-5 h-5 text-yellow-400 mr-2" />
            <h3 className="text-sm font-semibold text-white">NPTEL Certified</h3>
          </div>
          
          <h4 className="text-lg font-bold text-white mb-2 leading-tight">
            {certificate.title}
          </h4>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Institution</span>
              <span className="text-white font-medium">{certificate.issuer}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Year</span>
              <span className="text-white font-medium">{certificate.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Skills</span>
              <span className="text-white font-medium">{certificate.skills.length}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {certificate.skills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {certificate.skills.length > 2 && (
              <span className="px-2 py-1 text-slate-400 text-xs">
                +{certificate.skills.length - 2}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Main Certificates component
export default function Certificates() {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const selectedCertData = certificatesData.find(cert => cert.id === selectedCertificate);

  const handleCertificateSelect = (id: string) => {
    setSelectedCertificate(id);
    setModalOpen(true);
  };

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
            Professional <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Certificates</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            NPTEL certifications demonstrating expertise in Human-Computer Interaction, 
            Social Network Analysis, Leadership, and Privacy & Security - validating continuous learning and professional development.
          </p>
        </motion.div>
        
        {/* Certificates Overview Cards */}
        <CertificatesOverview />
        
        {/* 3D Certificate Gallery */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - 3D Certificates */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[600px] w-full">
              <Canvas className="w-full h-full">
                <CertificatesScene 
                  selectedCertificate={selectedCertificate}
                  onCertificateSelect={handleCertificateSelect}
                />
              </Canvas>
              
              {/* Instructions overlay */}
              <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                <div className="text-sm text-white font-semibold mb-2">Interactive Certificate Gallery</div>
                <div className="text-xs text-slate-300">
                  <div>• Click on any certificate to view details</div>
                  <div>• Hover for preview animations</div>
                  <div>• All certificates are NPTEL verified</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Certificate Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[600px] overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              {selectedCertData && !modalOpen ? (
                <motion.div
                  key={selectedCertificate}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-600 p-6"
                >
                  {/* Certificate preview */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Award className="w-8 h-8 text-yellow-400 mr-3" />
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedCertData.title}</h3>
                        <p className="text-slate-400">{selectedCertData.issuer} • {selectedCertData.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-slate-300 leading-relaxed">{selectedCertData.description}</p>
                  </div>
                  
                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Skills Validated</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCertData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setModalOpen(true)}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
                  >
                    View Certificate Details
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-800/50 rounded-xl border border-slate-600 p-8 text-center h-full flex flex-col justify-center"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Professional Certifications</h3>
                    <p className="text-slate-300 mb-6">
                      Click on any certificate in the 3D gallery to view detailed information, 
                      skills gained, and verification details for each NPTEL certification.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-slate-400">Certifications Summary:</div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">4</div>
                        <div className="text-xs text-slate-400">NPTEL Certificates</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-400">2024</div>
                        <div className="text-xs text-slate-400">Completion Year</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Certificate Detail Modal */}
        <CertificateDetailModal
          certificate={selectedCertData || null}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedCertificate(null);
          }}
        />
        
        {/* Certificates Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-4">Continuous Learning Journey</h3>
            <p className="text-slate-300 max-w-4xl mx-auto">
              These NPTEL certifications represent my commitment to continuous professional development and staying current 
              with industry trends. Each course provided in-depth knowledge that I've applied in real-world projects, 
              particularly in user experience design, social network understanding, leadership skills, and cybersecurity awareness. 
              These certifications complement my practical experience and demonstrate a well-rounded approach to technology and leadership.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}