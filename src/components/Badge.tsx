import React from 'react';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import {
    BallCollider,
    CuboidCollider,
    RapierRigidBody,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useGLTF, useTexture } from '@react-three/drei';
import { useDragTracker } from '../hooks/useDragTracker';
import { DragStats } from './DragStats';



extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload(
    '/images/nueva_card_1.glb'
);

// Make RigidBody physics a bit more realistic
const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
} as const;

export default function Badge({ maxSpeed = 50, minSpeed = 10 }) {
    // References for the band and the joints
    const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
    const fixed = useRef<RapierRigidBody>(null);
    const j1 = useRef<RapierRigidBody>(null);
    const j2 = useRef<RapierRigidBody>(null);
    const j3 = useRef<RapierRigidBody>(null);

    // Reference for the card and some vector values
    const card = useRef<RapierRigidBody>(null);
    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const [dragged, setDragged] = useState(false);
    const [hovered, hover] = useState(false);
    const [bandColor, setBandColor] = useState('black');

    const { nodes, materials } = useGLTF(
        '/images/nueva_card_1.glb'
    );

    // Listen for theme changes and update band color
    useEffect(() => {
        const updateColor = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setBandColor(isDark ? 'black' : 'white');
        };

        updateColor();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateColor();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // A Catmull-Rom curve
    const [curve] = useState(
        () =>
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3(),
            ])
    );

    // Connect band joints
    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);

    // Connect card to band
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 1.45, 0],
    ]);

    const [dragStats, setDragStats] = useState({
        count: 0,
        totalDistance: 0,
        lastPosition: null,
        currentDistance: 0
    });

    const trackDragDistance = (currentPoint) => {
        if (!dragStats.lastPosition) {
            setDragStats(prev => ({
                ...prev,
                lastPosition: currentPoint
            }));
            return;
        }

        const distance = currentPoint.distanceTo(dragStats.lastPosition);
        setDragStats(prev => ({
            count: prev.count,
            totalDistance: prev.totalDistance + distance,
            lastPosition: currentPoint,
            currentDistance: distance
        }));
    };

    const drag = (value) => {
        if (value) {
            // Inicio del arrastre
            setDragStats(prev => ({
                ...prev,
                count: prev.count + 1,
                lastPosition: null,
                currentDistance: 0
            }));
        } else {
            // Fin del arrastre
            console.log('Drag Stats:', {
                totalDrags: dragStats.count,
                totalDistance: dragStats.totalDistance.toFixed(2),
                averageDistance: (dragStats.totalDistance / dragStats.count).toFixed(2)
            });
        }
        setDragged(value);
    };

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => void (document.body.style.cursor = 'auto');
        }
    }, [hovered, dragged]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragged) {
                const element = document.elementFromPoint(e.clientX, e.clientY);
                if (element) {
                    const computedStyle = window.getComputedStyle(element);
                    if (computedStyle.cursor === 'pointer' || computedStyle.cursor === 'default') {
                        drag(null);
                        if (card.current) {
                            card.current.wakeUp();
                        }
                    } else {
                        // Trackear el movimiento durante el arrastre
                        const currentPoint = new THREE.Vector3(e.clientX, e.clientY, 0);
                        trackDragDistance(currentPoint);
                    }
                }
            }
        };

        const handleMouseLeave = () => {
            if (dragged) {
                drag(null);
                if (card.current) {
                    card.current.wakeUp();
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [dragged, dragStats]);

    // Opcional: Guardar estadísticas en localStorage
    useEffect(() => {
        const savedStats = localStorage.getItem('badgeDragStats');
        if (savedStats) {
            setDragStats(prev => ({
                ...prev,
                ...JSON.parse(savedStats)
            }));
        }

        return () => {
            localStorage.setItem('badgeDragStats', JSON.stringify({
                count: dragStats.count,
                totalDistance: dragStats.totalDistance
            }));
        };
    }, []);

    useFrame((state, delta) => {
        if (
            !fixed.current ||
            !j1.current ||
            !j2.current ||
            !j3.current ||
            !band.current ||
            !card.current
        )
            return;

        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
            card.current.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z,
            });
        }

        // Fix most of the band jitter when over pulling the card (https://codesandbox.io/s/sweet-galois-3fw3wq?file=/App.js:3796-3849)
        const [j1Lerped, j2Lerped] = [j1, j2].map((ref) => {
            if (ref.current) {
                const lerped = new THREE.Vector3().copy(ref.current.translation());

                const clampedDistance = Math.max(
                    0.1,
                    Math.min(1, lerped.distanceTo(ref.current.translation()))
                );

                return lerped.lerp(
                    ref.current.translation(),
                    delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
                );
            }
        });

        // Calculate Catmull curve for band
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2Lerped ?? j2.current.translation());
        curve.points[2].copy(j1Lerped ?? j1.current.translation());
        curve.points[3].copy(fixed.current.translation());
        band.current.geometry.setPoints(curve.getPoints(32));

        // Tilt the card back towards the screen
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel(
            { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
            false
        );
    });

    curve.curveType = 'chordal';

    return (
        <>
            <group position={[0, 6.3, 3]}>
                {/* Band */}
                <RigidBody ref={fixed} type="fixed" position={[0, 0, 0]} />
                <RigidBody position={[0.5, 0, 0]} {...segmentProps} ref={j1}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1, 0, 0]} {...segmentProps} ref={j2}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} {...segmentProps} ref={j3}>
                    <BallCollider args={[0.1]} />
                </RigidBody>

                {/* Card */}
                <RigidBody
                    ref={card}
                    {...segmentProps}
                    type={dragged ? 'kinematicPosition' : 'dynamic'}
                >
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={() => drag(null)}
                        onPointerDown={(evt) =>
                            card.current &&
                            drag(
                                new THREE.Vector3()
                                    .copy(evt.point)
                                    .sub(vec.copy(card.current.translation()))
                            )
                        }
                    >
                        {/* @ts-expect-error geometry/map are not declared? */}
                        <mesh geometry={nodes.card.geometry}>
                            <meshPhysicalMaterial
                                // @ts-expect-error geometry/map are not declared?
                                map={materials.base.map}
                                map-anisotropy={16}
                                clearcoat={1}
                                clearcoatRoughness={0.15}
                                roughness={0.3}
                                metalness={0.5}
                            />
                        </mesh>
                        <mesh
                            // @ts-expect-error geometry/map are not declared?
                            geometry={nodes.clip.geometry}
                            material={materials.metal}
                            material-roughness={0.3}
                        />
                        {/* @ts-expect-error geometry/map are not declared? */}
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color={bandColor}
                    depthTest={false}
                    lineWidth={0.6}
                />
            </mesh>
        </>
    );
}