declare module 'meshline' {
    import { BufferGeometry, Material } from 'three';

    export class MeshLineGeometry extends BufferGeometry {
        setPoints(points: any[]): void;
    }

    export class MeshLineMaterial extends Material {
        constructor(parameters?: {
            color?: string | number;
            lineWidth?: number;
            depthTest?: boolean;
        });
    }
} 