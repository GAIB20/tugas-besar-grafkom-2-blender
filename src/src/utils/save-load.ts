import {Node} from "../classes/node.ts";
import {INode} from "../interfaces/node.ts";
import {IMesh} from "../interfaces/mesh.ts";
import {IAccessor, IBuffer, IBufferView} from "../interfaces/buffer.ts";
import {Mesh} from "../classes/mesh.ts";
import {ICamera} from "../interfaces/camera.ts";
import {Camera} from "../classes/camera/camera.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {IMaterial} from "../interfaces/material.ts";
import {ITexture} from "../interfaces/texture.ts";
import {ShaderMaterial} from "../classes/shader-material.ts";
import {Texture} from "../classes/texture.ts";
import {BasicMaterial} from "../classes/basic-material.ts";
import {PhongMaterial} from "../classes/phong-material.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";
import {IAnimation} from "../interfaces/animation.ts";
import {Light} from "../classes/light/light.ts";
import {ILight} from "../interfaces/light.ts";
import {OrthographicCamera} from "../classes/camera/orthographic-camera.ts";
import {ObliqueCamera} from "../classes/camera/oblique-camera.ts";
import {degToRad} from "./web-gl.ts";
import {PerspectiveCamera} from "../classes/camera/perspective-camera.ts";
import {PointLight} from "../classes/light/point-light.ts";
import {DirectionalLight} from "../classes/light/directional-light.ts";


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
    lights: ILight[],
    materials: IMaterial[],
    textures: ITexture[]
    animation: IAnimation[]
}

export const saveToJson = (rootNode: Node, animationData?: IAnimation) => {
    console.log(Node.nodes)
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
        lights: [],
        materials: [],
        textures: [],
        animation: []
    }
    let counterMesh = 0;
    for (let i = 0; i < Node.nodes.length; i++) {
        let node = Node.nodes[i]
        result.nodes.push(node.toObject());
        if (node instanceof Mesh) {
            result.nodes[i]['mesh'] = counterMesh++;
            result.meshes.push(node.toObjectMesh())
        } else if (node instanceof Camera) {
            result.nodes[i]['camera'] = 0;
            result.cameras.push(node.toObjectCamera())
        } else if (node instanceof Light) {
            result.nodes[i]['light'] = 0;
            result.lights.push(node.toObjectLight())
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

    if (animationData) {
        result.animation.push(animationData)
    }


    const jsonStr = JSON.stringify(result, null, 2); // Pretty print with 2 spaces

    const blob = new Blob([jsonStr], {type: "application/json"});

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'model';

    a.click();

    URL.revokeObjectURL(url);
}

export interface ILoadModel {
    rootNode: Node
    animation: IAnimation
    camera?: Camera
    light?: DirectionalLight | PointLight
}

export const loadFromJson = (model: IModel, onloadCallback: () => void, meshCallback: (node: Node) => void): ILoadModel => {
    model.textures.forEach((texture) => {
        let newText = new Texture()
        newText.setData(texture.src)
        newText.onLoad(onloadCallback)
    })
    model.materials.forEach((material) => {
        if (material.type === 'basic') {
            new BasicMaterial({color: material.color});
        } else if (material.type === 'phong') {
            new PhongMaterial({
                color: material.color,
                ambientColor: material.ambientColor,
                specularColor: material.specularColor,
                shininess: material.shininess,
                normalTexture: Texture.Textures[material.normalTexture],
                specularTexture: Texture.Textures[material.specularTexture],
                diffuseTexture: Texture.Textures[material.diffuseTexture],
                displacementTexture: Texture.Textures[material.displacementTexture],
                displacementBias: material.displacementBias,
                displacementFactor: material.displacementFactor
            });
        }
    })
    for (let i = 0; i < model.buffers.length; i++) {
        let size = model.bufferViews[i].byteLength / model.accessors[i].count
        new BufferAttribute(new Float32Array(model.buffers[i].data), size, {
            dtype: model.accessors[i].componentType,
            offset: model.accessors[i].byteOffset
        });
    }

    let camera: Camera;
    let light: DirectionalLight | PointLight;

    model.nodes.forEach((node) => {
        if (node.mesh !== undefined) {
            let newGeometry = new BufferGeometry()
            let attributes = model.meshes[node.mesh].attributes
            for (const key in attributes) {
                newGeometry.setAttribute(key, BufferAttribute.Buffers[attributes[key]])
            }
            let basicMaterial = ShaderMaterial.Materials[model.meshes[node.mesh].basicMaterial]
            let phongMaterial = ShaderMaterial.Materials[model.meshes[node.mesh].phongMaterial]
            if (basicMaterial instanceof BasicMaterial && phongMaterial instanceof PhongMaterial) {
                let newMesh = new Mesh(node.name, newGeometry, basicMaterial, phongMaterial, meshCallback)
                newMesh.fromObject(node)
                newMesh.material = model.meshes[node.mesh].material === 'basic' ? newMesh.basicMaterial : newMesh.phongMaterial;
            }
        } else if (node.camera !== undefined) {
            let typeCam = model.cameras[0].type
            if (typeCam === 'orthographic' && model.cameras[0].orthographic) {
                camera = new OrthographicCamera(typeCam, model.cameras[0].orthographic.width, model.cameras[0].orthographic.height, model.cameras[0].orthographic.near, model.cameras[0].orthographic.far);
            } else if (typeCam === 'oblique' && model.cameras[0].oblique) {
                camera = new ObliqueCamera(typeCam, model.cameras[0].oblique.width, model.cameras[0].oblique.height, model.cameras[0].oblique.near, model.cameras[0].oblique.far, degToRad(55), degToRad(55));
            } else if (typeCam === 'perspective' && model.cameras[0].perspective) {
                camera = new PerspectiveCamera(typeCam, model.cameras[0].perspective.fovY, model.cameras[0].perspective.aspect, model.cameras[0].perspective.near, model.cameras[0].perspective.far)
            }
            if (camera) {
                camera.fromObject(node)
            }
        } else if (node.light !== undefined) {
            let typeLight = model.lights[0].type
            if (typeLight == "point" && model.lights[0].point) {
                light = new PointLight(typeLight)
                light.fromObjectLight(model.lights[0])
            }
            light.fromObject(node)
        } else {
            let newNode = new Node(node.name)
            newNode.fromObject(node)
        }
    })

    for (let i = 0; i < model.nodes.length; i++) {
        if (model.nodes[i].mesh !== undefined && model.nodes[i].children !== undefined) {
            model.nodes[i].children!.forEach((child) => Node.nodes[i].add(Node.nodes[child]))
        }
    }

    const rootNodeIdx = model.scenes[model.scene].nodes[0];
    console.log(rootNodeIdx)
    console.log(Node.nodes)

    let result: ILoadModel = {
        rootNode: Node.nodes[rootNodeIdx], animation: model.animation[0]
    }
    // @ts-ignore
    if (camera) {
        result["camera"] = camera
    }
    // @ts-ignore
    if (light) {
        result["light"] = light
    }

    return result
}