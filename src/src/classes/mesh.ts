import {BufferGeometry} from "./buffer-geometry.ts";
import {Node} from "./node.ts";

export class Mesh extends Node {
    static MeshIdx = 0;
    geometry: BufferGeometry
    // material: ShaderMaterial
    idMesh: number;


    constructor(name: string, geometry: BufferGeometry) {
        super(name);
        this.idMesh = Mesh.MeshIdx;
        Mesh.MeshIdx++;
        this.geometry = geometry;
    }

    toObjectNode() {
        return {
            mesh: this.idMesh,
            name: this.name,
            translation: this.translation.toArray(),
            rotation: this.rotation.toArray(),
            scale: this.scale.toArray()
        }
    }

    toObjectMesh() {

    }
}
