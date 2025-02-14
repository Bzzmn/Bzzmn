import React from 'react';
import { Vector3, CatmullRomCurve3, RepeatWrapping, Vector2 } from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload('/images/nueva_card_1.glb')
useTexture.preload('/images/band.png')
useTexture.preload('/images/band_white.png')

export default function App() {
    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 35 }} >
            <ambientLight intensity={Math.PI} />
            <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                <Band />
            </Physics>
            <Environment background={true}>
                <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
        </Canvas>
    )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
    const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef()
    const vec = new Vector3(), ang = new Vector3(), rot = new Vector3(), dir = new Vector3()
    const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
    const { nodes, materials } = useGLTF('/images/nueva_card_1.glb')
    const darkTexture = useTexture('/images/band.png')
    const lightTexture = useTexture('/images/band_white.png')
    const [currentTexture, setCurrentTexture] = useState(darkTexture)
    const { width, height } = useThree((state) => state.size)
    const [curve] = useState(() => new CatmullRomCurve3([new Vector3(), new Vector3(), new Vector3(), new Vector3()]))
    const [dragged, setDragged] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [touchStartPosition, setTouchStartPosition] = useState(null)
    const [preventDefault, setPreventDefault] = useState(false)

    useEffect(() => {
        const updateTexture = () => {
            const isDark = document.documentElement.classList.contains('dark')
            setCurrentTexture(isDark ? darkTexture : lightTexture)
        }

        updateTexture()

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateTexture()
                }
            })
        })

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })

        return () => observer.disconnect()
    }, [darkTexture, lightTexture])

    const drag = (value) => {
        console.log('Drag state changed:', value)
        setDragged(value)
        setPreventDefault(!!value)
    }

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }, [])

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab'
            return () => void (document.body.style.cursor = 'auto')
        }
    }, [hovered, dragged])

    const handlePointerDown = (e) => {
        if (!isTouchDevice) {
            e.target.setPointerCapture(e.pointerId)
            drag(new Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
        }
    }

    const handlePointerUp = (e) => {
        if (!isTouchDevice) {
            e.target.releasePointerCapture(e.pointerId)
            drag(false)
        }
    }

    const handleTouchStart = (e) => {
        console.log('Touch start event triggered')
        const touchPos = getTouchPos(e)
        setTouchStartPosition(touchPos)
        drag(new Vector3().copy(card.current.translation()))
    }

    const TOUCH_SENSITIVITY = 3

    const handleTouchMove = (e) => {
        console.log('Touch move event triggered')
        if (preventDefault) {
            e.preventDefault()
            e.stopPropagation()
        }
        if (dragged && touchStartPosition) {
            const touchPos = getTouchPos(e)
            const deltaX = (touchPos.x - touchStartPosition.x) * TOUCH_SENSITIVITY
            const deltaY = (touchPos.y - touchStartPosition.y) * TOUCH_SENSITIVITY
            const newPosition = new Vector3(
                dragged.x + deltaX,
                dragged.y + deltaY,
                dragged.z
            )
            card.current?.setNextKinematicTranslation(newPosition)
        }
    }

    const handleTouchEnd = (e) => {
        console.log('Touch end event triggered')
        if (preventDefault) {
            e.preventDefault()
            e.stopPropagation()
        }
        setTouchStartPosition(null)
        drag(false)
    }

    useEffect(() => {
        const canvas = document.querySelector('canvas')
        if (canvas) {
            const touchMoveHandler = (e) => {
                if (preventDefault) {
                    e.preventDefault()
                }
                handleTouchMove(e)
            }

            canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
            canvas.addEventListener('touchmove', touchMoveHandler, { passive: false })
            canvas.addEventListener('touchend', handleTouchEnd, { passive: true })

            return () => {
                canvas.removeEventListener('touchstart', handleTouchStart)
                canvas.removeEventListener('touchmove', touchMoveHandler)
                canvas.removeEventListener('touchend', handleTouchEnd)
            }
        }
    }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault])

    useFrame((state, delta) => {
        if (dragged) {
            if (!isTouchDevice || !touchStartPosition) {
                vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
                dir.copy(vec).sub(state.camera.position).normalize()
                vec.add(dir.multiplyScalar(state.camera.position.length()))
                    ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
                card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
            }
        }
        if (fixed.current) {
            ;[j1, j2].forEach((ref) => {
                if (!ref.current.lerped) ref.current.lerped = new Vector3().copy(ref.current.translation())
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
                ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
            })
            curve.points[0].copy(j3.current.translation())
            curve.points[1].copy(j2.current.lerped)
            curve.points[2].copy(j1.current.lerped)
            curve.points[3].copy(fixed.current.translation())
            band.current.geometry.setPoints(curve.getPoints(32))
            ang.copy(card.current.angvel())
            rot.copy(card.current.rotation())
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
        }
    })

    curve.curveType = 'chordal'
    currentTexture.wrapS = currentTexture.wrapT = RepeatWrapping

    return (
        <>
            <group position={[0, 5, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ touchAction: 'none' }}
                    >
                        <mesh geometry={nodes.card.geometry}>
                            <meshPhysicalMaterial map={materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
                        </mesh>
                        <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={[width, height]}
                    useMap map={currentTexture}
                    repeat={[-3, 1]}
                    lineWidth={1}
                />
            </mesh>
        </>
    )
}

const getTouchPos = (e) => {
    return new Vector2(
        (e.touches[0].clientX / window.innerWidth) * 2 - 1,
        -(e.touches[0].clientY / window.innerHeight) * 2 + 1
    );
}