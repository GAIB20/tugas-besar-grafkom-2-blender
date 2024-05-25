interface KeyFrameData {
    nodeId: number;
    translation: { x: number, y: number, z: number };
    rotation: { x: number, y: number, z: number };
    scale: { x: number, y: number, z: number };
}

interface FrameData {
    keyframes: KeyFrameData[]
}

export interface IAnimation {
    frames: FrameData[]
}