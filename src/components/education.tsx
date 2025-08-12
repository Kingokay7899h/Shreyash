import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, Environment, Float, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { MapPin, Calendar, Award, Globe } from 'lucide-react';

// Realistic Earth component with your actual textures
function RealisticEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  // Load your actual textures
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
      {/* Main Earth sphere with realistic textures */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          normalMap={normalTexture}
          metalness={0.1}
          roughness={0.9}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          alphaMap={cloudsTexture}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial
          transparent
          opacity={0.1}
          color="#60a5fa"
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// Tiny airplane component using your GLB model
function TinyAirplane() {
  const { scene } = useGLTF('/models/airplane.glb');
  const airplaneRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  
  useFrame(() => {
    setProgress((prev) => (prev + 0.003) % 1); // Slower for more realistic flight
  });

  // Convert lat/lng to 3D coordinates
  const latLngTo3D = (lat: number, lng: number, radius: number = 2.15) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const muscatPos = latLngTo3D(23.5859, 58.4059); // Oman
  const goaPos = latLngTo3D(15.4167, 74.0167);   // Goa
  
  // Create curved flight path
  const curve = new THREE.QuadraticBezierCurve3(
    muscatPos,
    new THREE.Vector3(0, 3.5, 0), // Higher arc
    goaPos
  );
  
  const currentPosition = curve.getPointAt(progress);
  const nextPosition = curve.getPointAt((progress + 0.01) % 1);
  
  useEffect(() => {
    if (airplaneRef.current && scene) {
      // Position airplane
      airplaneRef.current.position.copy(currentPosition);
      
      // Make airplane look towards next position
      const lookAtVector = nextPosition.clone().sub(currentPosition).normalize();
      airplaneRef.current.lookAt(
        currentPosition.x + lookAtVector.x,
        currentPosition.y + lookAtVector.y,
        currentPosition.z + lookAtVector.z
      );
    }
  }, [currentPosition, nextPosition, scene]);

  return (
    <group ref={airplaneRef}>
      <primitive 
        object={scene.clone()} 
        scale={0.05} // Tiny airplane
        rotation={[0, Math.PI, 0]} // Adjust orientation if needed
      />
    </group>
  );
}

// Flight path visualization
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
  const goaPos = latLngTo3D(15.4167, 74.0167);
  
  const curve = new THREE.QuadraticBezierCurve3(
    muscatPos,
    new THREE.Vector3(0, 3, 0),
    goaPos
  );
  
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* Flight path line */}
      <line geometry={geometry}>
        <lineBasicMaterial color="#f59e0b" linewidth={2} />
      </line>
      
      {/* Muscat marker (red dot) */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={muscatPos}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      
      {/* Goa marker (green dot) */}
      <Float speed={2.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={goaPos}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

// Main 3D Scene with realistic Earth
function EarthScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60a5fa" />
      
      {/* Your realistic Earth model instead of green ball */}
      <RealisticEarth />
      
      {/* Flight path between Oman and Goa */}
      <FlightPath />
      
      {/* Tiny airplane flying the route */}
      <TinyAirplane />
      
      <Environment preset="night" />
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
