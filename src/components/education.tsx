import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, Environment, Html, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { MapPin, Calendar, Award, Globe } from 'lucide-react';

// Earth component with realistic textures and rotation
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002; // Slow rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015; // Slightly different speed for clouds
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={null} // Placeholder - you'll need to add earth texture
          normalMap={null} // Placeholder - you'll need to add normal map
          color="#4ade80"
          metalness={0.1}
          roughness={0.9}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
        <meshStandardMaterial
          transparent
          opacity={0.3}
          color="#ffffff"
          alphaMap={null} // Placeholder - you'll need to add cloud texture
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

// Flight path component showing the journey from Oman to India
function FlightPath() {
  const pathRef = useRef<THREE.Line>(null);
  
  // Convert lat/lng to 3D coordinates on sphere
  const latLngTo3D = (lat: number, lng: number, radius: number = 2.05) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Coordinates for Muscat and Goa
  const muscatPos = latLngTo3D(23.5859, 58.4059);
  const goaPos = latLngTo3D(15.4167, 74.0167);
  
  // Create curved path
  const curve = new THREE.QuadraticBezierCurve3(
    muscatPos,
    new THREE.Vector3(0, 3, 0), // High point for flight arc
    goaPos
  );
  
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* Flight path line */}
      <line geometry={geometry}>
        <lineBasicMaterial color="#f59e0b" linewidth={3} />
      </line>
      
      {/* Location markers */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={muscatPos}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      
      <Float speed={2.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={goaPos}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

// Animated airplane following the flight path
function AnimatedAirplane() {
  const airplaneRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  
  useFrame(() => {
    setProgress((prev) => (prev + 0.005) % 1);
  });

  // Convert lat/lng to 3D coordinates
  const latLngTo3D = (lat: number, lng: number, radius: number = 2.2) => {
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
    new THREE.Vector3(0, 3.2, 0),
    goaPos
  );
  
  const currentPosition = curve.getPointAt(progress);
  const nextPosition = curve.getPointAt((progress + 0.01) % 1);
  
  useEffect(() => {
    if (airplaneRef.current) {
      airplaneRef.current.position.copy(currentPosition);
      airplaneRef.current.lookAt(nextPosition);
    }
  }, [currentPosition, nextPosition]);

  return (
    <group ref={airplaneRef}>
      {/* Simple airplane model */}
      <group scale={0.1}>
        {/* Fuselage */}
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Wings */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[3, 0.1, 0.5]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// 3D Scene component
function EarthScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60a5fa" />
      
      <Earth />
      <FlightPath />
      <AnimatedAirplane />
      
      <Environment preset="night" />
    </>
  );
}

// Education timeline component
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
      