export interface INode {
    name: string,
    translation: number[],
    rotation: number[],
    scale: number[],
    children?: number[],
    camera?: number,
    mesh?: number,
    light?: number
}