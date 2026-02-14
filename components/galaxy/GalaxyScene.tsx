"use client";

import React, { useRef, useMemo, Suspense, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import Star from "./Star";
import HiddenStar from "./HiddenStar";
import NebulaBackground from "./NebulaBackground";
import { StarData } from "@/store/useAppStore";
import { STARS_DATA } from "@/utils/constants";

interface GalaxySceneProps {
  visitedStars: string[];
  showHiddenStar: boolean;
  onStarClick: (star: StarData) => void;
  onHiddenStarClick: () => void;
}

/**
 * Background particle field — 1000 small particles creating depth
 */
const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -5 - Math.random() * 50;
      sz[i] = Math.random() * 2;
    }

    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
      pointsRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.02) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * Camera controller for smooth zoom-to-star transitions
 */
const CameraController: React.FC<{
  target: THREE.Vector3 | null;
  zooming: boolean;
}> = ({ target, zooming }) => {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(0, 0, 8), []);

  useFrame(() => {
    if (zooming && target) {
      // Smooth lerp toward the star position
      const zoomTarget = new THREE.Vector3(
        target.x * 0.6,
        target.y * 0.6,
        target.z + 4,
      );
      camera.position.lerp(zoomTarget, 0.03);
    } else {
      // Return to default orbit position
      camera.position.lerp(defaultPos, 0.03);
    }
  });

  return null;
};

/**
 * Main 3D galaxy inner scene
 */
const GalaxyInner: React.FC<GalaxySceneProps> = ({
  visitedStars,
  showHiddenStar,
  onStarClick,
  onHiddenStarClick,
}) => {
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null);
  const [isZooming, setIsZooming] = useState(false);

  const handleStarClick = useCallback(
    (star: StarData) => {
      setZoomTarget(new THREE.Vector3(...star.position));
      setIsZooming(true);
      // Delay modal opening to let camera animate
      setTimeout(() => {
        onStarClick(star);
        setTimeout(() => setIsZooming(false), 500);
      }, 800);
    },
    [onStarClick],
  );

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#ff6b9d" />
      <pointLight position={[5, 5, -5]} intensity={0.2} color="#4ecdc4" />
      <pointLight position={[-5, -3, -3]} intensity={0.15} color="#7b68ee" />

      {/* Camera controller */}
      <CameraController target={zoomTarget} zooming={isZooming} />

      {/* Orbit controls — subtle auto-rotate */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
        rotateSpeed={0.5}
      />

      {/* Built-in drei Stars for deep background */}
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={2}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Custom particle field */}
      <ParticleField />

      {/* Nebula effect */}
      <NebulaBackground />

      {/* Interactive stars */}
      {STARS_DATA.map((star) => (
        <Star
          key={star.id}
          star={star}
          isVisited={visitedStars.includes(star.id)}
          onClick={handleStarClick}
        />
      ))}

      {/* Hidden star */}
      <HiddenStar visible={showHiddenStar} onClick={onHiddenStarClick} />

      {/* Bloom postprocessing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.8}
          radius={0.8}
        />
      </EffectComposer>
    </>
  );
};

/**
 * Main GalaxyScene component with Canvas wrapper
 */
const GalaxyScene: React.FC<GalaxySceneProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]} // Performance: cap pixel ratio
      >
        <Suspense fallback={null}>
          <GalaxyInner {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default React.memo(GalaxyScene);
