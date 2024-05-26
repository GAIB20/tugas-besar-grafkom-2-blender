import {BufferGeometry} from "./buffer-geometry.ts";
import {Node} from "./node.ts";
import {IMesh} from "../interfaces/mesh.ts";
import {BasicMaterial} from "./basic-material.ts";
import {ShaderMaterial} from "./shader-material.ts";
import {PhongMaterial} from "./phong-material.ts";

export class Mesh extends Node {
    static Meshes: Mesh[] = [];
    static MeshId: number = 1;
    meshId: number
    geometry: BufferGeometry
    material: ShaderMaterial
    basicMaterial: BasicMaterial
    phongMaterial: PhongMaterial
    callbackFunc: (node: Node) => void


    constructor(name: string, geometry: BufferGeometry, basicMaterial: BasicMaterial, phongMaterial: PhongMaterial, onClick: (node: Node) => void) {
        super(name);
        this.geometry = geometry;
        this.basicMaterial = basicMaterial;
        this.material = this.basicMaterial;
        this.phongMaterial = phongMaterial;
        this.callbackFunc = onClick;
        this.meshId = Mesh.MeshId;
        Mesh.MeshId++;
        Mesh.Meshes.push(this)
    }

    toObjectMesh(): IMesh {
        return {
            attributes: this.geometry.toObject(),
            material: this.material instanceof BasicMaterial ? 'basic' : 'phong',
            basicMaterial: parseInt(this.basicMaterial.id.slice(1)),
            phongMaterial: parseInt(this.phongMaterial.id.slice(1))
        }
    }

    click() {
        console.log("tes?")
        this.callbackFunc(this);
    }
}
