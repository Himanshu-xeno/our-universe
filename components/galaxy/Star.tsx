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

const Star: React.FC<StarProps> = ({ star, isVisited, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const coreColor = React.useMemo(() => {
    return new THREE.Color(star.color).lerp(new THREE.Color("#ffffff"), 0.7);
  }, [star.color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const twinkle = Math.sin(t * 1.5 + star.position[0] * 10) * 0.15 + 0.85;

    if (meshRef.current) {
      const baseScale = 0.1 + twinkle * 0.03;
      const hoverScale = hovered ? 2 : 1;
      meshRef.current.scale.setScalar(baseScale * hoverScale);
    }

    if (glowRef.current) {
      const glowPulse = 1 + Math.sin(t * 1.2 + star.position[1] * 5) * 0.1;
      const hoverGlow = hovered ? 2 : 1;
      glowRef.current.scale.setScalar(glowPulse * hoverGlow);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.05 + twinkle * 0.025) * (hovered ? 3 : 1);
    }

    if (outerGlowRef.current) {
      const outerPulse = 1.2 + Math.sin(t * 0.8 + star.position[2] * 3) * 0.15;
      const hoverOuter = hovered ? 1.8 : 1;
      outerGlowRef.current.scale.setScalar(outerPulse * hoverOuter);
      const mat = outerGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.02 + twinkle * 0.01) * (hovered ? 2 : 1);
    }
  });

  const handleClick = useCallback(
    (e: any) => {
      // Stop the event from propagating to OrbitControls
      e.stopPropagation();
      console.log("[STAR] Clicked:", star.id, star.title);
      onClick(star);
    },
    [onClick, star],
  );

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "default";
  }, []);

  return (
    <group position={star.position}>
      {/* Layer 1: Outer atmospheric haze */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={0.02}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Layer 2: Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={star.color}
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Layer 3: Visible core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color={coreColor} />
      </mesh>

      {/* Layer 4: White center point */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* INVISIBLE HITBOX — large clickable area so stars are easy to click */}
      <mesh
        ref={hitboxRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Hover tooltip */}
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
