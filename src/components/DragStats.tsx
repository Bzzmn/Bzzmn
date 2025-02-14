import React from 'react';

interface DragStatsProps {
    count: number;
    totalDistance: number;
    className?: string;
}

export function DragStats({ count, totalDistance, className = '' }: DragStatsProps) {
    const avgDistance = count ? totalDistance / count : 0;

    return (
        <div className={`text-sm ${className}`}>
            <div>Drags: {count}</div>
            <div>Total Distance: {totalDistance.toFixed(2)}</div>
            <div>Avg Distance: {avgDistance.toFixed(2)}</div>
        </div>
    );
}