import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { RapierRigidBody } from '@react-three/rapier';
import { useThree } from '@react-three/fiber';

export const useTouchInteraction = (
    card: React.RefObject<RapierRigidBody>,
    dragged: boolean | THREE.Vector3,
    onDragStart: (position: THREE.Vector3) => void,
    onDragEnd: () => void,
    trackDragDistance: (point: THREE.Vector3) => void
) => {
    const [touchStartPosition, setTouchStartPosition] = useState<THREE.Vector2 | null>(null);
    const [preventDefault, setPreventDefault] = useState(false);
    const { size } = useThree();

    const getTouchPos = (touch: Touch) => {
        return new THREE.Vector2(
            (touch.clientX / size.width) * 2 - 1,
            -(touch.clientY / size.height) * 2 + 1
        );
    };

    const TOUCH_SENSITIVITY = 3;

    useEffect(() => {
        if (dragged) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            setPreventDefault(true);

            return () => {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                setPreventDefault(false);
            };
        }
    }, [dragged]);

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            if (preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (dragged && touchStartPosition && card.current && typeof dragged === 'object') {
                const touchPos = getTouchPos(e.touches[0]);
                const deltaX = (touchPos.x - touchStartPosition.x) * TOUCH_SENSITIVITY;
                const deltaY = (touchPos.y - touchStartPosition.y) * TOUCH_SENSITIVITY;

                const newPosition = new THREE.Vector3(
                    dragged.x + deltaX,
                    dragged.y + deltaY,
                    dragged.z
                );

                card.current.setNextKinematicTranslation(newPosition);

                const currentPoint = new THREE.Vector3(e.touches[0].clientX, e.touches[0].clientY, 0);
                trackDragDistance(currentPoint);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            setTouchStartPosition(null);
            onDragEnd();
        };

        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [dragged, touchStartPosition, preventDefault, card, onDragEnd, trackDragDistance, size.width, size.height]);

    return {
        handlers: {
            onTouchStart: (evt: React.TouchEvent) => {
                evt.preventDefault();
                evt.stopPropagation();

                if (!card.current) return;

                const touchPos = getTouchPos(evt.touches[0]);
                setTouchStartPosition(touchPos);
                onDragStart(card.current.translation().clone());
            }
        }
    };
}; 