import { useState, useEffect } from 'react';
import * as THREE from 'three';

interface DragStats {
    count: number;
    totalDistance: number;
    lastPosition: THREE.Vector3 | null;
    currentDistance: number;
}

interface DragTrackerReturn {
    dragStats: DragStats;
    trackDragStart: () => void;
    trackDragEnd: () => void;
    trackDragMove: (currentPoint: THREE.Vector3) => void;
}

export function useDragTracker(storageKey = 'dragStats'): DragTrackerReturn {
    const [dragStats, setDragStats] = useState<DragStats>({
        count: 0,
        totalDistance: 0,
        lastPosition: null,
        currentDistance: 0
    });

    // Cargar estadísticas guardadas
    useEffect(() => {
        const savedStats = localStorage.getItem(storageKey);
        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            setDragStats(prev => ({
                ...prev,
                count: parsed.count,
                totalDistance: parsed.totalDistance
            }));
        }
    }, [storageKey]);

    // Guardar estadísticas
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify({
            count: dragStats.count,
            totalDistance: dragStats.totalDistance
        }));
    }, [dragStats.count, dragStats.totalDistance, storageKey]);

    const trackDragStart = () => {
        setDragStats(prev => ({
            ...prev,
            count: prev.count + 1,
            lastPosition: null,
            currentDistance: 0
        }));
    };

    const trackDragEnd = () => {
        console.log('Drag Stats:', {
            totalDrags: dragStats.count,
            totalDistance: dragStats.totalDistance.toFixed(2),
            averageDistance: (dragStats.totalDistance / dragStats.count).toFixed(2)
        });
    };

    const trackDragMove = (currentPoint: THREE.Vector3) => {
        if (!dragStats.lastPosition) {
            setDragStats(prev => ({
                ...prev,
                lastPosition: currentPoint.clone()
            }));
            return;
        }

        const distance = currentPoint.distanceTo(dragStats.lastPosition);
        setDragStats(prev => ({
            ...prev,
            totalDistance: prev.totalDistance + distance,
            lastPosition: currentPoint.clone(),
            currentDistance: distance
        }));
    };

    return {
        dragStats,
        trackDragStart,
        trackDragEnd,
        trackDragMove
    };
}