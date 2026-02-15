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
import ShootingStars from "../ShootingStars"; // go up one level

interface GalaxySceneProps {
  visitedStars: string[];
  showHiddenStar: boolean;
  onStarClick: (star: StarData) => void;
  onHiddenStarClick: () => void;
}

const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -5 - Math.random() * 50;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

const CameraController: React.FC<{
  target: THREE.Vector3 | null;
  zooming: boolean;
}> = ({ target, zooming }) => {
  const { camera } = useThree();
  const defaultPos = useMemo(() => new THREE.Vector3(0, 0, 12), []);

  useFrame(() => {
    if (zooming && target) {
      const zoomTarget = new THREE.Vector3(
        target.x * 0.7,
        target.y * 0.7,
        target.z + 4 /*4*/,
      );
      camera.position.lerp(zoomTarget, 0.03);
    } else {
      camera.position.lerp(defaultPos, 0.02);
    }
  });

  return null;
};

const GalaxyInner: React.FC<GalaxySceneProps> = ({
  visitedStars,
  showHiddenStar,
  onStarClick,
  onHiddenStarClick,
}) => {
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const controlsRef = useRef<any>(null);

  const handleStarClick = useCallback(
    (star: StarData) => {
      console.log("[GALAXY] Star clicked:", star.id, star.title);

      // Stop auto-rotate temporarily so camera zoom looks smooth
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      setZoomTarget(new THREE.Vector3(...star.position));
      setIsZooming(true);

      setTimeout(() => {
        onStarClick(star);
        setTimeout(() => {
          setIsZooming(false);
          // Resume auto-rotate
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true;
          }
        }, 500);
      }, 600);
    },
    [onStarClick],
  );

  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[10, 10, 5]} intensity={0.2} color="#ff6b9d" />
      <pointLight position={[-10, 5, -5]} intensity={0.15} color="#4ecdc4" />
      <pointLight position={[0, -5, -3]} intensity={0.1} color="#7b68ee" />

      <CameraController target={zoomTarget} zooming={isZooming} />

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.2}
        minDistance={3}
        maxDistance={50}
        rotateSpeed={0.5}
        zoomSpeed={1.5}
        panSpeed={0.5}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />

      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={2}
        saturation={0.5}
        fade
        speed={0.5}
      />

      <ParticleField />
      <NebulaBackground />

      {STARS_DATA.map((star) => (
        <Star
          key={star.id}
          star={star}
          isVisited={visitedStars.includes(star.id)}
          onClick={handleStarClick}
        />
      ))}

      <HiddenStar visible={showHiddenStar} onClick={onHiddenStarClick} />
      {/* Shooting stars */}
      <ShootingStars meteorCount={15} spawnRate={0.012} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={0.6}
          radius={0.6}
        />
      </EffectComposer>
    </>
  );
};

const GalaxyScene: React.FC<GalaxySceneProps> = (props) => {
  return (
    <div className="w-full h-full" style={{ touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 150 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 1.5]}
        style={{ background: "#000000" }}
        raycaster={{ params: { Points: { threshold: 0.5 } } as any }}
      >
        <Suspense fallback={null}>
          <GalaxyInner {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default React.memo(GalaxyScene);
