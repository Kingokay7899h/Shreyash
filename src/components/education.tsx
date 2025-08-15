import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, Environment, Float, useGLTF, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { MapPin, Calendar, Award, Globe } from 'lucide-react';

// IMPROVED: Brighter, more realistic Earth component
function RealisticEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  // Load textures
  const earthTexture = useLoader(THREE.TextureLoader, '/textures/earth_8k.jpg');
  const normalTexture = useLoader(THREE.TextureLoader, '/textures/earth_normal.jpg');
  const cloudsTexture = useLoader(THREE.TextureLoader, '/textures/clouds.png');
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      {/* IMPROVED: Brighter Earth with better lighting */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          normalMap={normalTexture}
          metalness={0.2}
          roughness={0.7}
          // IMPROVED: Add emissive for brightness
          emissive="#001122"
          emissiveIntensity={0.15}
        />
      </Sphere>
      
      {/* Brighter cloud layer */}
      <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.3}
          alphaMap={cloudsTexture}
          emissive="#ffffff"
          emissiveIntensity={0.05}
        />
      </Sphere>
      
      {/* Brighter atmosphere glow */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          transparent
          opacity={0.15}
          color="#4a90e2"
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// FIXED: Realistic tiny airplane following actual Oman-Goa route
function RealisticAirplane() {
  const { scene } = useGLTF('/models/airplane.glb');
  const airplaneRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  
  useFrame(() => {
    setProgress((prev) => (prev + 0.004) % 1); // Slightly faster but still realistic
  });

  // Convert lat/lng to 3D coordinates on Earth surface
  const latLngTo3D = (lat: number, lng: number, radius: number = 2.18) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Actual coordinates
  const muscatPos = latLngTo3D(23.5859, 58.4059); // Oman
  const goaPos = latLngTo3D(15.2993, 74.1240);    // Goa, India
  
  // Create realistic flight arc
  const midPoint = new THREE.Vector3()
    .addVectors(muscatPos, goaPos)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(2.8); // Higher altitude for international flight
  
  const curve = new THREE.QuadraticBezierCurve3(
    muscatPos,
    midPoint,
    goaPos
  );
  
  const currentPosition = curve.getPointAt(progress);
  const nextPosition = curve.getPointAt((progress + 0.02) % 1);
  
  useEffect(() => {
    if (airplaneRef.current && scene) {
      airplaneRef.current.position.copy(currentPosition);
      
      // Make airplane face the direction of travel
      const direction = nextPosition.clone().sub(currentPosition).normalize();
      airplaneRef.current.lookAt(
        currentPosition.x + direction.x,
        currentPosition.y + direction.y,
        currentPosition.z + direction.z
      );
      
      // Slight banking for realism
      airplaneRef.current.rotation.z = Math.sin(progress * Math.PI * 2) * 0.1;
    }
  }, [currentPosition, nextPosition, scene]);

  return (
    <group ref={airplaneRef}>
      <primitive 
        object={scene.clone()} 
        scale={0.015} // FIXED: Much smaller, realistic scale
        rotation={[0, Math.PI, 0]}
      />
      
      {/* Add a subtle trail effect */}
      <mesh position={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// Flight path with better visualization
function FlightPath() {
  const latLngTo3D = (lat: number, lng: number, radius: number = 2.05) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const muscatPos = latLngTo3D(23.5859, 58.4059);
  const goaPos = latLngTo3D(15.2993, 74.1240);
  
  // Create flight arc
  const midPoint = new THREE.Vector3()
    .addVectors(muscatPos, goaPos)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(2.6);
  
  const curve = new THREE.QuadraticBezierCurve3(
    muscatPos,
    midPoint,
    goaPos
  );
  
  const points = curve.getPoints(100);

  return (
    <group>
      {/* Flight path line */}
      <Line
        points={points}
        color="#fbbf24"
        lineWidth={2}
        segments
        transparent
        opacity={0.8}
      />
      
      {/* Muscat marker (red dot) */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={muscatPos}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#ef4444" 
            emissive="#ef4444" 
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Label ring for Muscat */}
        <mesh position={muscatPos}>
          <torusGeometry args={[0.08, 0.01, 8, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
        </mesh>
      </Float>
      
      {/* Goa marker (green dot) */}
      <Float speed={2.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={goaPos}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981" 
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Label ring for Goa */}
        <mesh position={goaPos}>
          <torusGeometry args={[0.08, 0.01, 8, 16]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

// IMPROVED: Main 3D Scene with better lighting
function EarthScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      
      {/* IMPROVED: Better lighting setup for brighter earth */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[-5, 3, 3]} 
        intensity={0.4} 
        color="#4a90e2" 
      />
      <pointLight 
        position={[5, -3, -3]} 
        intensity={0.3} 
        color="#fbbf24" 
      />
      
      {/* Brighter, more realistic Earth */}
      <RealisticEarth />
      
      {/* Realistic flight path */}
      <FlightPath />
      
      {/* Properly sized airplane */}
      <RealisticAirplane />
      
      <Environment preset="sunset" intensity={0.3} />
    </>
  );
}

// Education timeline component (unchanged)
function EducationTimeline() {
  const [selectedEducation, setSelectedEducation] = useState(0);
  
  const educationData = [
    {
      id: "muscat",
      institution: "Indian School Muscat",
      location: "Muscat, Oman",
      degree: "Higher Secondary Education",
      period: "2018-2019",
      grade: "79.4%",
      description: "Completed higher secondary education in Oman, developing strong English communication skills and international exposure.",
      subjects: ["Science Stream", "Mathematics", "Physics", "Chemistry", "Computer Science"],
      achievements: ["Academic Excellence", "Cultural Exchange Program", "English Proficiency"],
      color: "from-red-500 to-orange-500"
    },
    {
      id: "canacona",
      institution: "Government Higher Secondary School",
      location: "Canacona, Goa, India",
      degree: "Pre-University Course", 
      period: "2020-2021",
      grade: "69%",
      description: "Completed pre-university education in Goa, preparing for engineering entrance examinations.",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
      achievements: ["Engineering Entrance Preparation", "State Board Curriculum", "Local Integration"],
      color: "from-blue-500 to-purple-500"
    },
    {
      id: "gce",
      institution: "Goa College of Engineering",
      location: "Farmagudi, Ponda, Goa, India",
      degree: "Bachelor of Engineering in Computer Engineering",
      period: "2021-2025",
      status: "Final Year Student",
      description: "Pursuing Bachelor's degree in Computer Engineering with focus on database systems, web development, and UI/UX design.",
      specializations: [
        "Database Management Systems",
        "Web Technologies", 
        "Software Engineering",
        "Human-Computer Interaction",
        "Network Security"
      ],
      achievements: ["Academic Project Leadership", "Technical Innovation", "Industry Exposure"],
      color: "from-green-500 to-blue-500"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4">
        {educationData.map((edu, index) => (
          <button
            key={edu.id}
            onClick={() => setSelectedEducation(index)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              selectedEducation === index
                ? 'bg-gradient-to-r ' + edu.color + ' text-white shadow-lg scale-105'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <div className="text-sm font-bold">{edu.institution.split(' ')[0]} {edu.institution.split(' ')[1]}</div>
            <div className="text-xs opacity-80">{edu.period}</div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedEducation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-600"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {educationData[selectedEducation].institution}
                  </h3>
                  <div className="flex items-center text-slate-400 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {educationData[selectedEducation].location}
                  </div>
                  <div className="flex items-center text-slate-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {educationData[selectedEducation].period}
                  </div>
                </div>
                {educationData[selectedEducation].grade && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {educationData[selectedEducation].grade}
                    </div>
                    <div className="text-sm text-slate-400">Grade</div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-3">
                  {educationData[selectedEducation].degree}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {educationData[selectedEducation].description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  {educationData[selectedEducation].specializations ? 'Specializations' : 'Subjects'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(educationData[selectedEducation].specializations || educationData[selectedEducation].subjects || []).map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm border border-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Key Achievements
              </h4>
              <div className="space-y-3">
                {educationData[selectedEducation].achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-slate-300 text-sm">{achievement}</span>
                  </div>
                ))}
              </div>

              {educationData[selectedEducation].status && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-500/30">
                  <div className="text-blue-300 font-semibold mb-1">Current Status</div>
                  <div className="text-white">{educationData[selectedEducation].status}</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Main Education component
export default function Education() {
  return (
    <section className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Educational <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            From the bustling corridors of Muscat to the serene hills of Goa, my educational journey 
            has been shaped by diverse cultures, rigorous academics, and a passion for technology.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[500px] w-full">
              <Canvas className="w-full h-full">
                <EarthScene />
              </Canvas>
              
              <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                <div className="text-sm text-white font-semibold mb-3">Educational Journey</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-slate-300">Muscat, Oman</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-slate-300">Goa, India</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-1 bg-yellow-500 mr-2"></div>
                    <span className="text-slate-300">Flight Path</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-1 bg-white mr-2"></div>
                    <span className="text-slate-300">Current Journey</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-400">3</div>
                    <div className="text-xs text-slate-400">Institutions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">7</div>
                    <div className="text-xs text-slate-400">Years</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600">
              <Globe className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">International Perspective</h3>
              <p className="text-slate-300">
                Growing up and studying in Oman provided me with invaluable international exposure, 
                multicultural understanding, and strong English communication skills that complement 
                my technical abilities.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600">
              <MapPin className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Cultural Adaptation</h3>
              <p className="text-slate-300">
                Transitioning from Oman's international environment to India's diverse educational 
                landscape taught me adaptability, cultural sensitivity, and the ability to thrive 
                in different academic systems.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600">
              <Award className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Academic Excellence</h3>
              <p className="text-slate-300">
                Consistently maintained strong academic performance across different educational 
                systems, while actively engaging in practical projects and industry-relevant 
                skill development.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EducationTimeline />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Looking Ahead</h3>
            <p className="text-slate-300 max-w-4xl mx-auto mb-6">
              As I approach graduation, I'm excited to apply my international perspective, 
              technical skills, and diverse educational background to solve real-world problems 
              through innovative technology solutions. My journey from Oman to India has prepared 
              me for a global career in computer engineering.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">2025</div>
                <div className="text-slate-400">Expected Graduation</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl font-bold text-green-400 mb-2">Global</div>
                <div className="text-slate-400">Career Aspirations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">Innovation</div>
                <div className="text-slate-400">Focus Areas</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
