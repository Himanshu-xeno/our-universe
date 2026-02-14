"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Creates a volumetric nebula effect using layered transparent planes
 * with custom shader materials for a soft, gaseous look.
 */
const NebulaBackground: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Create nebula cloud geometries with subtle animation
  const nebulaClouds = useMemo(() => {
    const clouds: {
      position: THREE.Vector3;
      scale: number;
      color: string;
      speed: number;
    }[] = [];
    const colors = ["#1a0a2e", "#2d1b4e", "#0a1628", "#1e0533", "#0d1f3c"];

    for (let i = 0; i < 8; i++) {
      clouds.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          -15 - Math.random() * 20,
        ),
        scale: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.0005 + Math.random() * 0.001,
      });
    }
    return clouds;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.05) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {nebulaClouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <planeGeometry args={[cloud.scale, cloud.scale]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Ambient glow spheres */}
      <mesh position={[-8, 3, -20]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial color="#ff6b9d" transparent opacity={0.02} />
      </mesh>
      <mesh position={[10, -5, -25]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshBasicMaterial color="#4ecdc4" transparent opacity={0.015} />
      </mesh>
      <mesh position={[0, 8, -30]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial color="#7b68ee" transparent opacity={0.02} />
      </mesh>
    </group>
  );
};

export default React.memo(NebulaBackground);
