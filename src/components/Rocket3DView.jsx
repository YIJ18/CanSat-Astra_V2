import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Box as Cube } from 'lucide-react';

const RocketModel = ({ roll, pitch, yaw }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Convertir grados a radianes
      const rollRad = THREE.MathUtils.degToRad(roll);
      const pitchRad = THREE.MathUtils.degToRad(pitch);
      const yawRad = THREE.MathUtils.degToRad(yaw);

      // Aplicar rotación. El orden es importante (por ejemplo, YXZ para aeroespacial)
      groupRef.current.rotation.set(pitchRad, yawRad, rollRad, 'YXZ');
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cuerpo del cohete */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cono superior */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.3, 0.5, 16]} />
        <meshStandardMaterial color="#ff4444" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Aletas */}
      {[0, 90, 180, 270].map(angle => (
        <mesh key={angle} rotation={[0, THREE.MathUtils.degToRad(angle), 0]} position={[0, -0.7, 0]}>
          <boxGeometry args={[0.1, 0.8, 0.8]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const Rocket3DView = ({ roll, pitch, yaw }) => {
  return (
    <motion.div
      className="bg-card border-2 border-primary rounded-lg p-4 space-glow h-[300px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-2">
        <Cube className="text-primary mr-3" size={20} />
        <h3 className="text-lg font-bold text-card-foreground">Visualización 3D</h3>
      </div>
      <div className="flex-grow rounded-md overflow-hidden bg-black/50">
        <Suspense fallback={<div className="text-center text-muted-foreground pt-12">Cargando modelo 3D...</div>}>
          <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff0000" />
            <RocketModel roll={roll} pitch={pitch} yaw={yaw} />
            <OrbitControls enableZoom={true} enablePan={true} />
            <gridHelper args={[10, 10, '#ff0000', '#444444']} />
          </Canvas>
        </Suspense>
      </div>
    </motion.div>
  );
};

export default Rocket3DView;