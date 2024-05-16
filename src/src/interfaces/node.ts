export interface INodeMesh {
    mesh: number,
    name: string,
    translation: number[],
    rotation: number[],
    scale: number[]
}

export interface INodeCamera {
    name: string,
    camera: number,
    translation: number[],
    rotation: number[],
    scale: number[]
}

export type INode = INodeMesh | INodeCamera;