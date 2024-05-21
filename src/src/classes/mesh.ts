import {BufferGeometry} from "./buffer-geometry.ts";
import {Node} from "./node.ts";
import {IMesh} from "../interfaces/mesh.ts";
import {BasicMaterial} from "./basic-material.ts";
import {ShaderMaterial} from "./shader-material.ts";

export class Mesh extends Node {
    static MeshIdx = 0;
    geometry: BufferGeometry
    material: ShaderMaterial
    basicMaterial: BasicMaterial
    // phongMaterial: PhongMaterial
    idMesh: number;


    constructor(name: string, geometry: BufferGeometry, basicMaterial: BasicMaterial) {
        super(name);
        this.idMesh = Mesh.MeshIdx;
        Mesh.MeshIdx++;
        this.geometry = geometry;
        this.basicMaterial = basicMaterial;
        this.material = this.basicMaterial;
    }

    toObjectMesh(): IMesh {
        return {
            attributes: this.geometry.toObject(),
            material: parseInt(this.basicMaterial.id.slice(1))
        }
    }

    // static fromObject(object: IModel): Mesh[] {
    //     let result = [];
    //     for (let objectNode of object.nodes) {
    //         if ('mesh' in objectNode) {
    //
    //             let positionAttributes = new BufferAttribute(new Float32Array(object.buffers[]))
    //             let newMesh = new Mesh()
    //         }
    //     }
    // }
}
