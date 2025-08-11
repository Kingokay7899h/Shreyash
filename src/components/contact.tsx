import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { 
  Phone, Mail, MapPin, MessageCircle, Send, 
  Github, Linkedin, Download, Copy, Check
} from 'lucide-react';

// Your actual contact information
const contactInfo = {
  name: "Shreyash Desai",
  role: "Computer Engineering Student",
  phone: "+91 7666987026",
  email: "shreyashdesai60@gmail.com",
  location: "Shantinagar, Ponda, Goa, India",
  github: "https://github.com/shreyashdesai", // Update with your actual GitHub
  linkedin: "#", // Update with your actual LinkedIn
  availability: "Available for internships and project collaborations"
};

// 3D floating contact elements
function ContactElements() {
  const phoneRef = useRef<THREE.Group>(null);
  const emailRef = useRef<THREE.Group>(null);
  const locationRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      phoneRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
    }
    if (emailRef.current) {
      emailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
      emailRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
    if (locationRef.current) {
      locationRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      locationRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.2;
    }
  });

  return (
    <group>
      {/* Phone Icon */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={phoneRef} position={[-3, -1, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 1.4, 0.2]} />
            <meshStandardMaterial 
              color="#10b981" 
              emissive="#10b981" 
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[0.6, 1, 0.05]} />
            <meshStandardMaterial 
              color="#064e3b" 
              emissive="#065f46" 
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </Float>

      {/* Email Icon */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={emailRef} position={[0, 1, 0]}>
          <mesh>
            <boxGeometry args={[1.5, 1, 0.2]} />
            <meshStandardMaterial 
              color="#3b82f6" 
              emissive="#3b82f6" 
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[1.3, 0.8, 0.05]} />
            <meshStandardMaterial 
              color="#1e40af" 
              emissive="#1d4ed8" 
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </Float>

      {/* Location Icon */}
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.5}>
        <group ref={locationRef} position={[3, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial 
              color="#f59e0b" 
              emissive="#f59e0b" 
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.2, 0.6, 8]} />
            <meshStandardMaterial 
              color="#d97706" 
              emissive="#d97706" 
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </Float>

      {/* Connecting lines */}
      <group>
        {/* Phone to Email */}
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
          <meshStandardMaterial 
            color="#64748b" 
            transparent 
            opacity={0.4}
          />
        </mesh>
        
        {/* Email to Location */}
        <mesh position={[1.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.02, 0.02, 2.2, 8]} />
          <meshStandardMaterial 
            color="#64748b" 
            transparent 
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* Floating text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Get In Touch
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
        Let's connect and collaborate
        <meshStandardMaterial attach="material" color="#94a3b8" />
      </Text>
    </group>
  );
}

// 3D Scene
function ContactScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#10b981" />
      <pointLight position={[10, -5, -10]} intensity={0.3} color="#3b82f6" />
      
      <ContactElements />
      
      <Environment preset="night" />
    </>
  );
}

// Contact method cards
function ContactMethods() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      value: contactInfo.phone,
      action: () => window.open(`tel:${contactInfo.phone}`, '_self'),
      copyAction: () => copyToClipboard(contactInfo.phone, 'phone'),
      color: "from-green-500 to-emerald-600",
      description: "Call me directly"
    },
    {
      icon: Mail,
      title: "Email",
      value: contactInfo.email,
      action: () => window.open(`mailto:${contactInfo.email}`, '_self'),
      copyAction: () => copyToClipboard(contactInfo.email, 'email'),
      color: "from-blue-500 to-cyan-600",
      description: "Send me an email"
    },
    {
      icon: MapPin,
      title: "Location",
      value: contactInfo.location,
      action: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(contactInfo.location)}`, '_blank'),
      copyAction: () => copyToClipboard(contactInfo.location, 'location'),
      color: "from-orange-500 to-yellow-600",
      description: "View on Google Maps"
    }
  ];

  return (
    <div className="grid gap-6">
      {contactMethods.map((method, index) => {
        const IconComponent = method.icon;
        return (
          <motion.div
            key={method.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${method.color} mr-4 flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{method.title}</h3>
                  <p className="text-slate-400 text-sm mb-2">{method.description}</p>
                  <p className="text-slate-300 font-medium break-all">{method.value}</p>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={method.copyAction}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === method.title.toLowerCase() ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-300" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={method.action}
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${method.color} text-white font-medium hover:shadow-lg transition-all duration-300`}
                >
                  {method.title === 'Phone' ? 'Call' : method.title === 'Email' ? 'Email' : 'View'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Social links and resume download
function SocialAndResume() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 rounded-xl p-6 border border-slate-600"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Connect With Me
        </h3>
        
        <div className="space-y-3">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <Github className="w-5 h-5 text-slate-300 mr-3" />
            <div>
              <div className="text-white font-medium">GitHub</div>
              <div className="text-slate-400 text-sm">View my code repositories</div>
            </div>
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <Linkedin className="w-5 h-5 text-slate-300 mr-3" />
            <div>
              <div className="text-white font-medium">LinkedIn</div>
              <div className="text-slate-400 text-sm">Professional networking</div>
            </div>
          </motion.a>
        </div>
      </motion.div>

      {/* Resume Download */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-slate-800/50 rounded-xl p-6 border border-slate-600"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Resume
        </h3>
        
        <p className="text-slate-300 mb-4">
          Download my complete resume with detailed information about my projects, skills, and experience.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Replace with your actual resume file path
            const link = document.createElement('a');
            link.href = '/resume/Shreyash_Desai_Resume.pdf';
            link.download = 'Shreyash_Desai_Resume.pdf';
            link.click();
          }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Resume
        </motion.button>
      </motion.div>
    </div>
  );
}

// Quick contact form (optional)
function QuickContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, just open email client with pre-filled data
    const emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    window.open(`mailto:${contactInfo.email}?subject=Contact from Portfolio&body=${encodeURIComponent(emailBody)}`);
    
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-800/50 rounded-xl p-6 border border-slate-600"
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Send className="w-5 h-5 mr-2" />
        Quick Message
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <div>
          <textarea
            placeholder="Your Message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none transition-colors resize-none"
            required
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

// Main Contact component
export default function Contact() {
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
            Let's <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            I'm always interested in new opportunities, collaborations, and innovative projects. 
            Let's discuss how we can work together to create something amazing.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/50 rounded-xl border border-slate-600 p-8 mb-16 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
            SD
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{contactInfo.name}</h3>
          <p className="text-slate-400 mb-4">{contactInfo.role}</p>
          <p className="text-slate-300 max-w-2xl mx-auto">{contactInfo.availability}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - 3D Contact Scene */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[500px] w-full mb-8">
              <Canvas className="w-full h-full">
                <ContactScene />
              </Canvas>
            </div>

            {/* Contact Methods */}
            <ContactMethods />
          </motion.div>
          
          {/* Right side - Social & Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Social Links and Resume */}
            <SocialAndResume />
            
            {/* Quick Contact Form */}
            <QuickContactForm />
          </motion.div>
        </div>

        {/* Contact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Collaborate</h3>
            <p className="text-slate-300 max-w-4xl mx-auto">
              Whether you're looking for a dedicated computer engineering student for an internship, 
              a UI/UX designer for your next project, or a full-stack developer to bring your ideas to life, 
              I'm excited to hear from you. I bring a unique combination of technical skills, design thinking, 
              and international perspective gained from my educational journey across Oman and India.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
              }
