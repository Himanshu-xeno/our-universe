"use client";

import React, { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { StarData } from "@/store/useAppStore";

interface StarProps {
  star: StarData;
  isVisited: boolean;
  onClick: (star: StarData) => void;
}

/**
 * Individual interactive star in the 3D galaxy.
 * Features pulsating glow, hover effects, and click handling.
 */
const Star: React.FC<StarProps> = ({ star, isVisited, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      // Pulsating scale
      const pulse = 1 + Math.sin(t * 2 + star.position[0]) * 0.1;
      const hoverScale = hovered ? 1.4 : 1;
      meshRef.current.scale.setScalar(pulse * hoverScale);
    }

    if (glowRef.current) {
      // Glow pulsation
      const glowPulse = 1.5 + Math.sin(t * 1.5 + star.position[1]) * 0.3;
      const hoverGlow = hovered ? 2.5 : 1;
      glowRef.current.scale.setScalar(glowPulse * hoverGlow);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        (0.15 + Math.sin(t * 2) * 0.05) * (hovered ? 2 : 1);
    }
  });

  const handleClick = useCallback(() => {
    onClick(star);
  }, [onClick, star]);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "default";
  }, []);

  return (
    <group position={star.position}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core star */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={star.color} />
      </mesh>

      {/* Second glow layer for depth */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Star label on hover */}
      {hovered && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="glass px-3 py-1.5 rounded-lg text-center whitespace-nowrap">
            <p className="text-xs text-white/80 font-medium">{star.title}</p>
            <p className="text-[10px] text-white/50">{star.date}</p>
            {isVisited && (
              <p className="text-[10px] text-nebula-pink mt-0.5">✦ Visited</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export default React.memo(Star);
