import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { useMediaQuery } from "react-responsive";
import ARoom from "../components/Developer"; // Ensure this is correct
import { useRef } from "react";
import { useFrame } from '@react-three/fiber';

const ReactLogo = () => {
  const { scene } = useGLTF("/models/react.glb"); 
  const logoRef = useRef();

  // Animation: Rotates the logo slightly
  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01; // Rotates continuously
      logoRef.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.2; // Small oscillation
    }
  });

  return <primitive ref={logoRef} object={scene} scale={0.3} position={[3.25, 3, 0.5]} />;
};

// const PythonLogo = () => {  // Capitalized component name
//   const { scene } = useGLTF("/models/python.glb"); 
//   const logoRef = useRef();

//   // Animation: Rotates the logo slightly
//   useFrame(() => {
//     if (logoRef.current) {
//       logoRef.current.rotation.y += 0.01; // Rotates continuously
//       logoRef.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.2; // Small oscillation
//     }
//   });

//   return <primitive ref={logoRef} object={scene} scale={0.3} position={[3.25, 3, 0.5]} />;
// };

const Hero = () => {
  // Leva Controls for Transformations
  const x = useControls("RetroCom", {
    positionX: { value: 0, min: -10, max: 10 },
    positionY: { value: 2.5, min: -10, max: 10 },
    positionZ: { value: 2.5, min: -10, max: 10 },
    rotationX: { value: 0, min: -Math.PI, max: Math.PI },
    rotationY: { value: 0, min: -Math.PI, max: Math.PI },
    rotationZ: { value: 0, min: -Math.PI, max: Math.PI },
    scale: { value: 0.5, min: 0.01, max: 2 },
  });

  const smallerscreen = useMediaQuery({ maxWidth: 768 });

  return (
    <section className="w-full min-h-screen" id="home">
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={2} />
        <directionalLight intensity={1} position={[10, 10, 10]} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        {/* Wrap ARoom & React Logo in Suspense for loading optimization */}
        <Suspense fallback={null}>
          <ARoom scale={0.04} position={[0.2, -3.9, 0.3]} rotation={[0.3, 0, 0]} />
          <ReactLogo />
          
          {/* <pythonLogo/> */}
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Hero;
