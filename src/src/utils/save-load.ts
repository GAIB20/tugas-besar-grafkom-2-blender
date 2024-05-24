import {Node} from "../classes/node.ts";
import {INode} from "../interfaces/node.ts";
import {IMesh} from "../interfaces/mesh.ts";
import {IAccessor, IBuffer, IBufferView} from "../interfaces/buffer.ts";
import {Mesh} from "../classes/mesh.ts";
import {ICamera} from "../interfaces/camera.ts";
import {Camera} from "../classes/camera.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {IMaterial} from "../interfaces/material.ts";
import {ITexture} from "../interfaces/texture.ts";
import {ShaderMaterial} from "../classes/shader-material.ts";
import {Texture} from "../classes/texture.ts";


interface IScene {
    nodes: number[]
}

export interface IModel {
    scene: number
    scenes: IScene[]
    nodes: INode[]
    meshes: IMesh[]
    buffers: IBuffer[],
    bufferViews: IBufferView[],
    accessors: IAccessor[],
    cameras: ICamera[],
    materials: IMaterial[],
    textures: ITexture[]
    //TODO: add animation
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
        accessors: [],
        cameras: [],
        materials: [],
        textures: []
    }
    let counterMesh = 0;
    for (let i = 0; i < Node.nodes.length; i++) {
        let node = Node.nodes[i]
        result.nodes.push(node.toObject());
        if (node instanceof Mesh) {
            result.nodes[i]['mesh'] = counterMesh++;
            result.meshes.push(node.toObjectMesh())
        }
        else if (node instanceof Camera) {
            result.nodes[i]['camera'] = 0;
            result.cameras.push(node.toObjectCamera())
        }
    }

    for (const attribute of BufferAttribute.Buffers) {
        result.buffers.push(attribute.toObjectBuffer());
        result.bufferViews.push(attribute.toObjectBufferView());
        result.accessors.push(attribute.toObjectAccessor());
    }

    ShaderMaterial.Materials.forEach((material) => {
        result.materials.push(material.toObject())
    })

    Texture.Textures.forEach((texture) => {
        result.textures.push(texture.toObject())
    })


    const jsonStr = JSON.stringify(result, null, 2); // Pretty print with 2 spaces

    const blob = new Blob([jsonStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'model';

    a.click();

    URL.revokeObjectURL(url);
}

export const loadFromJson = () => {

}