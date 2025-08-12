import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Floating particles background
function ParticleField() {
  const mesh = useRef();
  
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

// 3D floating laptop model - NOW LOADS ACTUAL GLB
function FloatingLaptop() {
  const laptopRef = useRef();
  const { scene } = useGLTF('/models/laptop.glb');

  useFrame((state) => {
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      laptopRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={laptopRef} position={[3, 0, 0]} scale={[0.5, 0.5, 0.5]}>
        <primitive object={scene.clone()} />
      </group>
    </Float>
  );
}

// Earth model component
function FloatingEarth() {
  const earthRef = useRef();
  const { scene } = useGLTF('/models/earth.glb');

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      earthRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 2 + 4;
      earthRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.4) * 1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={earthRef} position={[4, 2, -2]} scale={[0.3, 0.3, 0.3]}>
        <primitive object={scene.clone()} />
      </group>
    </Float>
  );
}

// Airplane model component
function FloatingAirplane() {
  const airplaneRef = useRef();
  const { scene } = useGLTF('/models/airplane.glb');

  useFrame((state) => {
    if (airplaneRef.current) {
      airplaneRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3 - 3;
      airplaneRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 1.5 + 1;
      airplaneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
      <group ref={airplaneRef} position={[-3, 1, -1]} scale={[0.4, 0.4, 0.4]}>
        <primitive object={scene.clone()} />
      </group>
    </Float>
  );
}

// Fallback loading component
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
    </mesh>
  );
}

// 3D Text component with fallback fonts
function Hero3DText() {
  return (
    <group position={[-1, 0, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          fontSize={0.6}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.5, 0]}
          maxWidth={8}
        >
          SHREYASH DESAI
          <meshStandardMaterial attach="material" color="#f8fafc" />
        </Text>
      </Float>
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.15}>
        <Text
          fontSize={0.25}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.2, 0]}
          maxWidth={10}
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
      
      <Suspense fallback={<LoadingFallback />}>
        <FloatingLaptop />
        <FloatingEarth />
        <FloatingAirplane />
      </Suspense>
      
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
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20"
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

// Main Hero component with FIXED MOBILE RESPONSIVENESS
export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0, 8], fov: 75 }}
      >
        <Scene3D />
      </Canvas>

      {/* Overlay content - FIXED MOBILE TEXT SIZES */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6"
          >
            {/* FIXED: Much better mobile text sizing */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 tracking-tight leading-tight">
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
            {/* FIXED: Better mobile text sizes */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light mb-2">
              Computer Engineering Student
            </p>
            <p className="text-base sm:text-lg md:text-xl text-slate-400">
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
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base"
            >
              View My Work
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-400 hover:text-slate-900 text-sm sm:text-base"
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

// Preload the GLB models
useGLTF.preload('/models/laptop.glb');
useGLTF.preload('/models/earth.glb');
useGLTF.preload('/models/airplane.glb'); 
