import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Code, Palette, Zap, Server, Database, Code2, 
  Edit, Globe, RefreshCw, GitBranch, Github, 
  Terminal, Paintbrush, Figma, Smartphone, Layout, Grid, Play
} from 'lucide-react';

// Skills data based on your actual skills
const skillsData = {
  webProgramming: {
    title: "Web & Programming",
    color: "#3b82f6",
    position: [-4, 2, 0] as [number, number, number],
    skills: [
      { name: "HTML", proficiency: 90, experience: "3+ years", icon: Code },
      { name: "CSS", proficiency: 85, experience: "3+ years", icon: Palette },
      { name: "JavaScript", proficiency: 80, experience: "2+ years", icon: Zap },
      { name: "PHP", proficiency: 85, experience: "2+ years", icon: Server },
      { name: "SQL", proficiency: 80, experience: "2+ years", icon: Database },
      { name: "jQuery", proficiency: 75, experience: "1+ years", icon: Code2 }
    ]
  },
  backendApis: {
    title: "Backend & APIs",
    color: "#10b981",
    position: [4, 2, 0] as [number, number, number],
    skills: [
      { name: "MySQL", proficiency: 85, experience: "2+ years", icon: Database },
      { name: "CRUD Operations", proficiency: 90, experience: "2+ years", icon: Edit },
      { name: "RESTful APIs", proficiency: 75, experience: "1+ years", icon: Globe },
      { name: "AJAX", proficiency: 70, experience: "1+ years", icon: RefreshCw }
    ]
  },
  toolsPlatforms: {
    title: "Tools & Platforms",
    color: "#f59e0b",
    position: [-4, -2, 0] as [number, number, number],
    skills: [
      { name: "Git", proficiency: 80, experience: "2+ years", icon: GitBranch },
      { name: "GitHub", proficiency: 85, experience: "2+ years", icon: Github },
      { name: "VS Code", proficiency: 90, experience: "3+ years", icon: Code },
      { name: "Linux", proficiency: 70, experience: "1+ years", icon: Terminal }
    ]
  },
  designDevelopment: {
    title: "Design & Development",
    color: "#8b5cf6",
    position: [4, -2, 0] as [number, number, number],
    skills: [
      { name: "UI/UX Design", proficiency: 85, experience: "2+ years", icon: Paintbrush },
      { name: "Figma", proficiency: 90, experience: "2+ years", icon: Figma },
      { name: "Responsive Design", proficiency: 85, experience: "2+ years", icon: Smartphone },
      { name: "Bootstrap", proficiency: 80, experience: "2+ years", icon: Layout },
      { name: "Wireframing", proficiency: 85, experience: "2+ years", icon: Grid },
      { name: "Prototyping", proficiency: 85, experience: "2+ years", icon: Play }
    ]
  }
};

// 3D Skill Node component
function SkillNode({ 
  position, 
  color, 
  title, 
  skills, 
  isSelected, 
  onSelect 
}: {
  position: [number, number, number];
  color: string;
  title: string;
  skills: any[];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      } else if (hovered) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <group position={position}>
        {/* Main sphere */}
        <mesh
          ref={meshRef}
          onClick={onSelect}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
            transparent
            opacity={0.8}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Ring around sphere */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.2, 0.05, 8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Text label */}
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {title}
        </Text>
        
        {/* Skill count indicator */}
        <Text
          position={[0, -2.2, 0]}
          fontSize={0.2}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {skills.length} Skills
        </Text>
      </group>
    </Float>
  );
}

// Connecting lines between skill nodes
function SkillConnections() {
  const positions = Object.values(skillsData).map(category => category.position);
  
  return (
    <group>
      {/* Draw lines connecting all nodes */}
      {positions.map((pos1, i) => 
        positions.slice(i + 1).map((pos2, j) => {
          const start = new THREE.Vector3(...pos1);
          const end = new THREE.Vector3(...pos2);
          const points = [start, end];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <line key={`${i}-${j}`} geometry={geometry}>
              <lineBasicMaterial 
                color="#475569" 
                transparent 
                opacity={0.3}
                linewidth={1}
              />
            </line>
          );
        })
      )}
    </group>
  );
}

// 3D Scene component
function SkillsScene({ selectedCategory, onCategorySelect }: {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60a5fa" />
      
      <SkillConnections />
      
      {Object.entries(skillsData).map(([key, category]) => (
        <SkillNode
          key={key}
          position={category.position}
          color={category.color}
          title={category.title}
          skills={category.skills}
          isSelected={selectedCategory === key}
          onSelect={() => onCategorySelect(key)}
        />
      ))}
      
      <Environment preset="night" />
    </>
  );
}

// Skills detail panel
function SkillsDetailPanel({ category }: { category: string | null }) {
  if (!category || !skillsData[category as keyof typeof skillsData]) return null;
  
  const categoryData = skillsData[category as keyof typeof skillsData];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-600 p-6"
    >
      <div className="flex items-center mb-6">
        <div 
          className="w-4 h-4 rounded-full mr-3"
          style={{ backgroundColor: categoryData.color }}
        ></div>
        <h3 className="text-2xl font-bold text-white">{categoryData.title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryData.skills.map((skill, index) => {
          const IconComponent = skill.icon;
          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <IconComponent 
                    className="w-5 h-5 mr-3" 
                    style={{ color: categoryData.color }} 
                  />
                  <h4 className="font-semibold text-white">{skill.name}</h4>
                </div>
                <span className="text-sm text-slate-400">{skill.experience}</span>
              </div>
              
              {/* Proficiency bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Proficiency</span>
                  <span className="text-white font-medium">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: categoryData.color }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Category stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-white">{categoryData.skills.length}</div>
          <div className="text-sm text-slate-400">Technologies</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">
            {Math.round(categoryData.skills.reduce((sum, skill) => sum + skill.proficiency, 0) / categoryData.skills.length)}%
          </div>
          <div className="text-sm text-slate-400">Avg Proficiency</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">
            {Math.max(...categoryData.skills.map(skill => parseInt(skill.experience)))}+
          </div>
          <div className="text-sm text-slate-400">Max Experience</div>
        </div>
      </div>
    </motion.div>
  );
}

// Skills overview cards
function SkillsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {Object.entries(skillsData).map(([key, category], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <div 
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: category.color }}
            ></div>
            <h3 className="text-lg font-semibold text-white">{category.title}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Skills</span>
              <span className="text-white font-medium">{category.skills.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Avg Level</span>
              <span className="text-white font-medium">
                {Math.round(category.skills.reduce((sum, skill) => sum + skill.proficiency, 0) / category.skills.length)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Top Skill</span>
              <span className="text-white font-medium">
                {category.skills.reduce((max, skill) => skill.proficiency > max.proficiency ? skill : max).name}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Main Skills component
export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
            Technical <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A comprehensive overview of my technical expertise across web development, 
            backend systems, tools, and design - gained through hands-on projects and continuous learning.
          </p>
        </motion.div>
        
        {/* Skills Overview Cards */}
        <SkillsOverview />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - 3D Skills Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[600px] w-full">
              <Canvas className="w-full h-full">
                <SkillsScene 
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </Canvas>
              
              {/* Instructions overlay */}
              <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                <div className="text-sm text-white font-semibold mb-2">Interactive Skills Map</div>
                <div className="text-xs text-slate-300">
                  <div>• Click on any sphere to explore skills</div>
                  <div>• Hover for animation effects</div>
                  <div>• Lines connect related skill areas</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Skills Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[600px] overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              {selectedCategory ? (
                <SkillsDetailPanel category={selectedCategory} />
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
                    <h3 className="text-2xl font-bold text-white mb-4">Explore My Skills</h3>
                    <p className="text-slate-300 mb-6">
                      Click on any skill category in the 3D visualization to see detailed information 
                      about my proficiency levels, experience, and the technologies I work with.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-slate-400">Quick Stats:</div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">16+</div>
                        <div className="text-xs text-slate-400">Technologies</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">4</div>
                        <div className="text-xs text-slate-400">Skill Areas</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-4">Skill Development Journey</h3>
            <p className="text-slate-300 max-w-4xl mx-auto">
              My technical skills have been developed through a combination of academic coursework at Goa College of Engineering, 
              hands-on project experience including DAMS and PureGleam applications, professional internship at Fluxatic™ Global, 
              and continuous self-learning. I focus on building robust, user-centric solutions using modern web technologies 
              and best practices in software development and UI/UX design.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
        