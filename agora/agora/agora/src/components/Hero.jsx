import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { OrbitControls, useGLTF } from '@react-three/drei';
// import CanvasLoader from '../components/canvasloader';
import HackerRoom from '../components/HackerRoom'
import {Leva,useControls } from 'leva';
import {useMediaQuery} from 'react-responsive';
// function Model() {
//   const { scene } = useGLTF('/hacker-room.glb'); 
//   return (
//     <primitive 
//       object={scene} 
//       scale={[0.05, 0.05, 0.05]}  
//       position={[0, 0, 0]} 
//       rotation={[0, 280, 0]} 
//     />
//   );
// }

const Hero = () => {
  const x=useControls('HackerRoom',{
    positionX : {value:0, min:-10, max:10},
    positionY : {value:2.5, min:-10, max:10},
    positionZ : {value:2.5, min:-10, max:10},
    rotationX : {value:2.5, min:-10, max:10},
    rotationY : {value:2.5, min:-10, max:10}, 
    rotationZ : {value:2.5, min:-10, max:10},
    scale:      {value:1, min:0.001, max:1}

  }
  )
  const smallerscreen= useMediaQuery({maxWidth:768})
  return (
    <section className="w-full min-h-screen" id="home">
      {/* Animation */}
     
      {/* <Leva/> */}
        <Canvas className="w-full h-full">
          {/* <Suspense fallback={<CanvasLoader />}> */}
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} intensity={1.5} />
            {/* <Model /> */}
            <HackerRoom
             scale={x.scale} 
             position={[x.positionX, x.positionY ,x.positionZ]} 
             rotation={[x.rotationX, x.rotationY ,x.rotationZ]} 
            // position={[0,-1.3 ,0.1]}
            // scale={smallerscreen ? 0.02 :0.03} fro smaller screens
            // scale={0.03}
            // rotation={[3.5,5.7,3.1]}
            />
            <OrbitControls enableZoom={false} enablePan={true} enableRotate={true} />
        </Canvas>
     
    </section>
  );
};

export default Hero;
