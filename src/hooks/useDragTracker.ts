import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

interface DragStats {
    count: number;
    totalDistance: number;
    lastPosition: THREE.Vector3 | null;
}

interface DragTrackerReturn {
    dragStats: DragStats;
    trackDragStart: () => void;
    trackDragEnd: () => void;
    trackDragMove: (currentPoint: THREE.Vector3) => void;
}

const STORAGE_KEY = 'badgeDragStats';

export function useDragTracker(): DragTrackerReturn {
    const [dragStats, setDragStats] = useState<DragStats>({
        count: 0,
        totalDistance: 0,
        lastPosition: null
    });

    // Cargar estadísticas guardadas
    useEffect(() => {
        try {
            const savedStats = localStorage.getItem(STORAGE_KEY);
            if (savedStats) {
                const parsed = JSON.parse(savedStats);
                setDragStats(prev => ({
                    ...prev,
                    count: Number(parsed.count) || 0,
                    totalDistance: Number(parsed.totalDistance) || 0,
                    lastPosition: null
                }));
            }
        } catch (error) {
            console.error('Error loading drag stats:', error);
        }
    }, []);

    const saveToStorage = useCallback((stats: DragStats) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                count: stats.count,
                totalDistance: Number(stats.totalDistance.toFixed(2))
            }));
        } catch (error) {
            console.error('Error saving drag stats:', error);
        }
    }, []);

    const trackDragStart = useCallback(() => {
        setDragStats(prev => {
            const newStats = {
                ...prev,
                count: prev.count + 1,
                lastPosition: null
            };
            saveToStorage(newStats);
            return newStats;
        });
    }, [saveToStorage]);

    const trackDragMove = useCallback((currentPoint: THREE.Vector3) => {
        setDragStats(prev => {
            if (!prev.lastPosition) {
                return {
                    ...prev,
                    lastPosition: currentPoint.clone()
                };
            }

            // Calcular la distancia en píxeles
            const distance = Math.sqrt(
                Math.pow(currentPoint.x - prev.lastPosition.x, 2) +
                Math.pow(currentPoint.y - prev.lastPosition.y, 2)
            ) * 100; // Multiplicamos por 100 para tener una escala más manejable

            // Solo actualizar si hay un movimiento significativo
            if (distance > 1) { // Umbral de 1 píxel
                const newStats = {
                    ...prev,
                    totalDistance: prev.totalDistance + distance,
                    lastPosition: currentPoint.clone()
                };

                // Solo guardar cada cierto intervalo para no sobrecargar el localStorage
                if (Math.floor(newStats.totalDistance) !== Math.floor(prev.totalDistance)) {
                    saveToStorage(newStats);
                }

                return newStats;
            }

            return prev;
        });
    }, [saveToStorage]);

    const trackDragEnd = useCallback(() => {
        setDragStats(prev => {
            // Guardar el estado final
            saveToStorage(prev);
            return {
                ...prev,
                lastPosition: null
            };
        });
    }, [saveToStorage]);

    return {
        dragStats,
        trackDragStart,
        trackDragEnd,
        trackDragMove
    };
}