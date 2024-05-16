import {BufferGeometry} from "./buffer-geometry.ts";
import {Node} from "./node.ts";
import {IMesh} from "../interfaces/mesh.ts";
import {ShaderMaterial} from "./shader-material.ts";

export class Mesh extends Node {
    static MeshIdx = 0;
    geometry: BufferGeometry
    material: ShaderMaterial
    idMesh: number;


    constructor(name: string, geometry: BufferGeometry, material: ShaderMaterial) {
        super(name);
        this.idMesh = Mesh.MeshIdx;
        Mesh.MeshIdx++;
        this.geometry = geometry;
        this.material = material;
    }

    toObjectMesh(): IMesh {
        return {
            attributes: this.geometry.toObject(),
            material: parseInt(this.material.id.slice(1))
        }
    }
}
