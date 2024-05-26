import {Node} from "../classes/node.ts"
import {Mesh} from "../classes/mesh.ts";
import {BasicMaterial} from "../classes/basic-material.ts";
import {ProgramInfo} from "../types/web-gl.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";
import {degToRad, setAttributes, setUniform, setUniforms} from "./web-gl.ts";
import {M4} from "../libs/m4.ts";
import {Camera} from "../classes/camera/camera.ts";
import {PhongMaterial} from "../classes/phong-material.ts";
import {ShaderMaterial} from "../classes/shader-material.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {Texture} from "../classes/texture.ts";
import {Vector3} from "../libs/vector3.ts";
import BoxGeometry from "../geometries/box-geometry.ts";
import {Light} from "../classes/light/light.ts";

export const cleanupObjects = (): void => {
    Node.nodes = []
    Node.nodeIdx = 0
    ShaderMaterial.Materials = []
    ShaderMaterial.idCounter = 0
    Texture.Textures = []
    Texture.idText = 0
    BufferAttribute.Buffers = []
    BufferAttribute.BufferIdx = 0
}

export const removeNode = (node: Node) => {
    let found = false;
    for (let i = 0; i < Node.nodes.length; i++) {
        if (found) {
            Node.nodes[i].idNode--;
            Node.nodes[i-1] = Node.nodes[i]
        }
        if (Node.nodes[i] === node) {
            found = true;
        }
    }
}

export const setupScene = (onloadCallback: () => void, meshCallback: (node: Node) => void): Node => {
    // const geometry = new CubeGeometry(100);
    const geometry = new BoxGeometry(150, 150, 150, 1);

    const material = new BasicMaterial({color: [1, 0, 0, 1]})

    const diffuseTexture = new Texture();
    diffuseTexture.setData('/spiral/diffuse.png')
    diffuseTexture.onLoad(() => onloadCallback())
    const specularTexture = new Texture();
    specularTexture.setData('/spiral/specular.png');
    specularTexture.onLoad(() => onloadCallback())
    const normalTexture = new Texture();
    normalTexture.setData('/spiral/normal-map.png')
    normalTexture.onLoad(() => onloadCallback())
    const displacementTexture = new Texture();
    displacementTexture.setData('/spiral/displacement-map.png')
    displacementTexture.onLoad(() => onloadCallback())
    const material2 = new PhongMaterial({
        color: [1, 0, 0, 1],
        diffuseTexture: diffuseTexture,
        specularTexture: specularTexture,
        normalTexture: normalTexture,
        displacementTexture: displacementTexture
    })

    const mesh = new Mesh('test', geometry, material, material2, meshCallback)
    mesh.material = mesh.phongMaterial;
    mesh.translation = (new Vector3(0, 0, 0))
    mesh.rotation = (new Vector3(degToRad(0), degToRad(0), degToRad(180)));
    mesh.scale = new Vector3(1, 1, 1);


    const childMesh = new Mesh('child1', geometry, material, material2, meshCallback)
    childMesh.material = childMesh.phongMaterial;
    childMesh.translation = (new Vector3(100, 150, 0))
    childMesh.rotation = (new Vector3(degToRad(40), degToRad(180), degToRad(145)));
    childMesh.scale = new Vector3(1, 1, 1);

    console.log(Mesh.Meshes)

    mesh.add(childMesh)

    return mesh
}

export const drawMesh = (mesh: Node, camera: Camera | null, light: Light, gl: WebGLRenderingContext, basicProgramInfo: ProgramInfo, phongProgramInfo: ProgramInfo, lastUsedProgramInfo: ProgramInfo | null, lastUsedGeometry: BufferGeometry | null, pickProgramInfo?: ProgramInfo) => {
    if (!(mesh instanceof Mesh)) return

    mesh.geometry.calculateNormals()
    let meshProgramInfo;
    if (pickProgramInfo) {
        meshProgramInfo = pickProgramInfo
    }
    else {
        meshProgramInfo = mesh.material instanceof BasicMaterial ? basicProgramInfo : phongProgramInfo;
    }

    let bindBuffers = false;
    if (meshProgramInfo !== lastUsedProgramInfo) {
        lastUsedProgramInfo = meshProgramInfo;
        gl.useProgram(meshProgramInfo.program);

        bindBuffers = true;
    }

    if (bindBuffers || lastUsedGeometry !== mesh.geometry) {
        lastUsedGeometry = mesh.geometry;
        mesh.geometry.setDirty();
        setAttributes(meshProgramInfo, mesh.geometry.attributes);
    }

    let projection = camera?.viewProjectionMatrix ?? M4.projection(gl.canvas.width, gl.canvas.height, 1000);
    projection = M4.multiply(projection, mesh.worldMatrix);
    setUniform(meshProgramInfo, 'worldViewProjection', projection.matrix);
    // setUniform(meshProgramInfo, 'id', [1, 1, 0, 1])
    setUniforms(meshProgramInfo, mesh.material.uniforms)
    if (mesh.material instanceof PhongMaterial && !pickProgramInfo) {
        setUniform(meshProgramInfo, 'world', mesh.worldMatrix.matrix);
        if (camera)
            camera.computeWorldMatrix()
        let viewWorld = camera ? [camera.worldMatrix[12], camera.worldMatrix[13], camera.worldMatrix[14]] : [0,0,0];
        setUniform(meshProgramInfo, 'viewWorldPosition', viewWorld)
        setUniforms(meshProgramInfo, light.uniforms)
    }
    if (pickProgramInfo) {
        const id = mesh.meshId;
        setUniform(meshProgramInfo, 'id', [
            ((id >> 0) & 0xff) / 0xff,
            ((id >> 8) & 0xff) / 0xff,
            ((id >> 16) & 0xff) / 0xff,
            ((id >> 24) & 0xff) / 0xff,
        ]);
    }

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = mesh.geometry.getAttribute('position').count;

    gl.drawArrays(primitiveType, offset, count);

    mesh.children.forEach((child) => {
        drawMesh(child, camera, light, gl, basicProgramInfo, phongProgramInfo, lastUsedProgramInfo, lastUsedGeometry, pickProgramInfo);
    });
}

export const calculateTransformation = (node: Node) => {
    node.computeWorldMatrix()
    node.children.forEach((child) => {
        child.computeWorldMatrix()
    })
}
export function handleClick(
    gl: WebGLRenderingContext,
    mouseX: number,
    mouseY: number,
    pickerFrameBuffer: WebGLFramebuffer,
    canvas: HTMLCanvasElement
) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, pickerFrameBuffer);
    const pixelX = mouseX * gl.canvas.width / canvas.clientWidth;
    const pixelY = gl.canvas.height - mouseY * gl.canvas.height / canvas.clientHeight - 1;
    const data = new Uint8Array(4);
    gl.readPixels(
        pixelX,            // x
        pixelY,            // y
        1,                 // width
        1,                 // height
        gl.RGBA,           // format
        gl.UNSIGNED_BYTE,  // type
        data);             // typed array to hold result
    const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
    if (id > 0) {
        console.log(Mesh.Meshes[id - 1]);
        Mesh.Meshes[id - 1].click()
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
