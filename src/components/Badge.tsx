import React from 'react';
import * as THREE from 'three';
import { useEffect, useRef, useState, useCallback } from 'react';
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
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useTouchInteraction } from '../hooks/useTouchInteraction';



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

    const { trackDragStart, trackDragEnd, trackDragMove } = useDragTracker();

    const drag = useCallback((value: boolean | THREE.Vector3) => {
        if (value) {
            trackDragStart();
        } else {
            trackDragEnd();
        }
        setDragged(value);
    }, [trackDragStart, trackDragEnd]);

    const mouseInteraction = useMouseInteraction(card, drag, () => drag(false));
    const touchInteraction = useTouchInteraction(
        card,
        dragged,
        drag,
        () => drag(false),
        trackDragMove
    );

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => void (document.body.style.cursor = 'auto');
        }
    }, [hovered, dragged]);

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            if (dragged && e.touches[0]) {
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element) {
                    const computedStyle = window.getComputedStyle(element);
                    if (computedStyle.cursor === 'pointer' || computedStyle.cursor === 'default') {
                        drag(false);
                        if (card.current) {
                            card.current.wakeUp();
                        }
                    } else {
                        const currentPoint = new THREE.Vector3(touch.clientX, touch.clientY, 0);
                        trackDragMove(currentPoint);
                    }
                }
            }
        };

        const handleTouchEnd = () => {
            if (dragged) {
                drag(false);
                if (card.current) {
                    card.current.wakeUp();
                }
            }
        };

        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [dragged, trackDragMove, drag]);

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
                        {...mouseInteraction.handlers}
                        {...touchInteraction.handlers}
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