import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Floating particles background
function ParticleField() {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 2000; i++) {
      temp.push((Math.random() - 0.5) * 50);
      temp.push((Math.random() - 0.5) * 50);
      temp.push((Math.random() - 0.5) * 50);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// 3D floating laptop model placeholder
function FloatingLaptop() {
  const laptopRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      laptopRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={laptopRef} position={[3, 0, 0]}>
        {/* Laptop base */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[2, 0.2, 1.4]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Laptop screen */}
        <mesh position={[0, 0.6, -0.7]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[1.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0.6, -0.65]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[1.6, 1]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#1e40af" 
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Text component
function Hero3DText() {
  return (
    <group position={[-2, 0, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          font="/fonts/Inter-Bold.woff"
          fontSize={0.8}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.5, 0]}
        >
          SHREYASH DESAI
          <meshStandardMaterial attach="material" color="#f8fafc" />
        </Text>
      </Float>
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.15}>
        <Text
          font="/fonts/Inter-Regular.woff"
          fontSize={0.3}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.2, 0]}
        >
          Computer Engineering Student
          <meshStandardMaterial attach="material" color="#94a3b8" />
        </Text>
      </Float>
    </group>
  );
}

// 3D Scene component
function Scene3D() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60a5fa" />
      
      <ParticleField />
      <Hero3DText />
      <FloatingLaptop />
      
      <Environment preset="night" />
    </>
  );
}

// Scroll indicator component
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="flex flex-col items-center"
      >
        <span className="text-slate-400 text-sm mb-2">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-blue-400 to-transparent"></div>
      </motion.div>
    </motion.div>
  );
}

// Main Hero component
export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      >
        <Scene3D />
      </Canvas>

      {/* Overlay content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                SHREYASH
              </span>
              <br />
              <span className="text-slate-200">DESAI</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-slate-300 font-light">
              Computer Engineering Student
            </p>
            <p className="text-lg md:text-xl text-slate-400 mt-2">
              UI/UX Designer • Full-Stack Developer • Database Systems Expert
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
            >
              View My Work
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-400 hover:text-slate-900"
            >
              Download Resume
            </motion.button>
          </motion.div>
        </div>
      </div>

      <ScrollIndicator />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
    </section>
  );
}