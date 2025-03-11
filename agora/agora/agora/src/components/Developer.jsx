import { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

function Asset({ url }) {
    const fbx = useLoader(FBXLoader, url);
    const mixer = new THREE.AnimationMixer(fbx);

    useEffect(() => {
        if (fbx.animations.length > 0) {
            const action = mixer.clipAction(fbx.animations[0]);
            action.play();
        }
    }, [fbx, mixer]);

    useFrame((_, delta) => {
        mixer.update(delta);
    });

    return <primitive object={fbx} dispose={null} />;
}

const ARoom = ({ scale, position, rotation }) => {
    return (
      <group scale={scale} position={position} rotation={rotation}>
        <Asset url={"./Waving.fbx"} />
      </group>
    );
  };
  
export default ARoom;
