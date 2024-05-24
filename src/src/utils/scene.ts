import {Node} from "../classes/node.ts"
import {Mesh} from "../classes/mesh.ts";
import {BasicMaterial} from "../classes/basic-material.ts";
import {ProgramInfo} from "../types/web-gl.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";
import {setAttributes, setUniform, setUniforms} from "./web-gl.ts";
import {M4} from "../libs/m4.ts";
import {Camera} from "../classes/camera.ts";
import {PhongMaterial} from "../classes/phong-material.ts";
import {DirectionalLight} from "../classes/directional-light.ts";

export const cleanupObjects = (): void => {
    Node.nodes = []
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