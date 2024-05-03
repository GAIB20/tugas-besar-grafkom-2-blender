import {BufferGeometry} from "./buffer-geometry.ts";

export class Mesh extends Node {
    geometry: BufferGeometry
    // material: ShaderMaterial


    constructor(geometry: BufferGeometry) {
        super();
        this.geometry = geometry;
    }
}
