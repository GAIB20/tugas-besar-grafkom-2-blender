import {Node} from "../classes/node.ts";
import {INode} from "../interfaces/node.ts";
import {IMesh} from "../interfaces/mesh.ts";
import {IAccessor, IBuffer, IBufferView} from "../interfaces/buffer.ts";
import {Mesh} from "../classes/mesh.ts";


interface IScene {
    nodes: number[]
}

interface IModel {
    scene: number
    scenes: IScene[]
    nodes: INode[]
    meshes: IMesh[]
    buffers: IBuffer[],
    bufferViews: IBufferView[],
    accessors: IAccessor[]
    //TODO: add camera, animation, and material
}

export const saveToJson = (rootNode: Node) => {
    let result: IModel = {
        scene: 0,
        scenes: [
            {
                nodes: [rootNode.idNode]
            }
        ],
        nodes: [],
        meshes: [],
        buffers: [],
        bufferViews: [],
        accessors: []
    }
    for (let node of Node.nodes) {
        result.nodes.push(node.toObject());
        if (node instanceof Mesh) {
            result.meshes.push(node.toObjectMesh())
            for (let attr of ['position', 'normal']) {
                result.buffers.push(node.geometry.getAttribute(attr).toObjectBuffer());
                result.bufferViews.push(node.geometry.getAttribute(attr).toObjectBufferView());
                result.accessors.push(node.geometry.getAttribute(attr).toObjectAccessor());
            }
        }
    }
}

export const loadFromJson = () => {

}