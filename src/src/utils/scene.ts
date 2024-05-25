import {Node} from "../classes/node.ts"
import {Mesh} from "../classes/mesh.ts";
import {BasicMaterial} from "../classes/basic-material.ts";
import {ProgramInfo} from "../types/web-gl.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";
import {degToRad, setAttributes, setUniform, setUniforms} from "./web-gl.ts";
import {M4} from "../libs/m4.ts";
import {Camera} from "../classes/camera.ts";
import {PhongMaterial} from "../classes/phong-material.ts";
import {DirectionalLight} from "../classes/directional-light.ts";
import {ShaderMaterial} from "../classes/shader-material.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {Texture} from "../classes/texture.ts";
import {Vector3} from "../libs/vector3.ts";
import BoxGeometry from "../geometries/box-geometry.ts";

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

export const setupScene = (onloadCallback: () => void): Node => {
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

    const mesh = new Mesh('test', geometry, material, material2)
    mesh.material = mesh.phongMaterial;
    mesh.translation = (new Vector3(0, 0, 0))
    mesh.rotation = (new Vector3(degToRad(0), degToRad(0), degToRad(180)));
    mesh.scale = new Vector3(1, 1, 1);


    const childMesh = new Mesh('child1', geometry, material, material2)
    childMesh.material = childMesh.phongMaterial;
    childMesh.translation = (new Vector3(100, 150, 0))
    childMesh.rotation = (new Vector3(degToRad(40), degToRad(180), degToRad(145)));
    childMesh.scale = new Vector3(1, 1, 1);

    mesh.add(childMesh)

    return mesh
}

export const drawMesh = (mesh: Node, camera: Camera | null, light: DirectionalLight, gl: WebGLRenderingContext, basicProgramInfo: ProgramInfo, phongProgramInfo: ProgramInfo, lastUsedProgramInfo: ProgramInfo | null, lastUsedGeometry: BufferGeometry | null) => {
    if (!(mesh instanceof Mesh)) return

    mesh.geometry.calculateNormals()
    let meshProgramInfo = mesh.material instanceof BasicMaterial ? basicProgramInfo : phongProgramInfo;

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
    setUniforms(meshProgramInfo, mesh.material.uniforms)
    if (mesh.material instanceof PhongMaterial) {
        setUniform(meshProgramInfo, 'world', mesh.worldMatrix.matrix);
        if (camera)
            camera.computeWorldMatrix()
        let viewWorld = camera ? [camera.worldMatrix[12], camera.worldMatrix[13], camera.worldMatrix[14]] : [0,0,0];
        setUniform(meshProgramInfo, 'viewWorldPosition', viewWorld)
        setUniforms(meshProgramInfo, light.uniforms)
    }

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = mesh.geometry.getAttribute('position').count;

    gl.drawArrays(primitiveType, offset, count);

    mesh.children.forEach((child) => {
        drawMesh(child, camera, light, gl, basicProgramInfo, phongProgramInfo, lastUsedProgramInfo, lastUsedGeometry);
    });
}

export const calculateTransformation = (node: Node) => {
    node.computeWorldMatrix()
    node.children.forEach((child) => {
        child.computeWorldMatrix()
    })
}