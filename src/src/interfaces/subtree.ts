import {IBasicMaterial} from "./material.ts";
import {ITexture} from "./texture.ts";

export interface IBufferSubtree {
    data: number[],
    componentType: number,
    byteLength: number,
    count: number,
}

export interface IPhongSubtree {
    type: 'phong'
    color: [number, number, number, number]
    shininess: number;
    ambientColor: [number, number, number, number];
    specularColor: [number, number, number, number];
    diffuseTexture: ITexture;
    specularTexture: ITexture;
    normalTexture: ITexture;
    displacementTexture: ITexture;
    displacementFactor: number;
    displacementBias: number;
}

export interface IMeshSubtree {
    name: string,
    translation: number[],
    rotation: number[],
    scale: number[],
    attributes: { [name: string]: IBufferSubtree },
    material: 'basic' | 'phong',
    basicMaterial: IBasicMaterial,
    phongMaterial: IPhongSubtree
    children?: IMeshSubtree[],
}