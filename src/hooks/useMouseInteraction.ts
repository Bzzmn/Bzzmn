import { useState, useEffect } from 'react';
import * as THREE from 'three';
import type { RapierRigidBody } from '@react-three/rapier';
import type { ThreeEvent } from '@react-three/fiber';

export const useMouseInteraction = (
    card: React.RefObject<RapierRigidBody>,
    onDragStart: (position: THREE.Vector3) => void,
    onDragEnd: () => void
) => {
    const [hovered, setHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const vec = new THREE.Vector3();

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
            return () => {
                document.body.style.cursor = 'auto';
            };
        }
    }, [hovered, isDragging]);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (element) {
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.cursor === 'pointer' ||
                    computedStyle.cursor === 'default' ||
                    computedStyle.cursor === 'text') {
                    onDragEnd();
                    setIsDragging(false);
                    card.current?.wakeUp();
                }
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                onDragEnd();
                setIsDragging(false);
                card.current?.wakeUp();
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, card, onDragEnd]);

    return {
        hovered,
        handlers: {
            onPointerOver: () => setHovered(true),
            onPointerOut: () => setHovered(false),
            onPointerUp: () => {
                onDragEnd();
                setIsDragging(false);
            },
            onPointerDown: (evt: ThreeEvent<PointerEvent>) => {
                if (!card.current) return;
                setIsDragging(true);
                const dragPosition = new THREE.Vector3()
                    .copy(evt.point)
                    .sub(vec.copy(card.current.translation()));
                onDragStart(dragPosition);
            }
        }
    };
}; 