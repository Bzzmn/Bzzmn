import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Badge from './Badge';
import { Environment, Lightformer } from '@react-three/drei';

export default function CanvasComponent() {

    return (
        <Canvas>
            <ambientLight intensity={Math.PI} />
            <Physics
                interpolate
                gravity={[0, -38, 0]}
                timeStep={1 / 60}
            >
                <Badge />
            </Physics>
            <Environment background={false}>
                <Lightformer
                    intensity={2}
                    color="white"
                    position={[0, -1, 5]}
                    rotation={[0, 0, Math.PI / 3]}
                    scale={[100, 0.1, 1]}
                />
                <Lightformer
                    intensity={3}
                    color="white"
                    position={[-1, -1, 1]}
                    rotation={[0, 0, Math.PI / 3]}
                    scale={[100, 0.1, 1]}
                />
                <Lightformer
                    intensity={3}
                    color="white"
                    position={[1, 1, 1]}
                    rotation={[0, 0, Math.PI / 3]}
                    scale={[100, 0.1, 1]}
                />
                <Lightformer
                    intensity={10}
                    color="white"
                    position={[-10, 0, 14]}
                    rotation={[0, Math.PI / 2, Math.PI / 3]}
                    scale={[100, 10, 1]}
                />
            </Environment>
        </Canvas>
    );
}