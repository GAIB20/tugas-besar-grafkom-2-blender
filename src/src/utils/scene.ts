import {Node} from "../classes/node.ts"
import {Mesh} from "../classes/mesh.ts";
import {BasicMaterial} from "../classes/basic-material.ts";
import {ProgramInfo} from "../types/web-gl.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";
import {setAttributes, setUniform} from "./web-gl.ts";
import {M4} from "../libs/m4.ts";
import {Camera} from "../classes/camera.ts";

export const cleanupObjects = (): void => {
    Node.nodes = []
}

export const drawMesh = (mesh: Node, camera: Camera | null, gl: WebGLRenderingContext, basicProgramInfo: ProgramInfo, phongProgramInfo: ProgramInfo, lastUsedProgramInfo: ProgramInfo | null, lastUsedGeometry: BufferGeometry | null) => {
    if (!(mesh instanceof Mesh)) return

    let meshProgramInfo = mesh.material instanceof BasicMaterial ? basicProgramInfo : phongProgramInfo;
    if (!meshProgramInfo) return;

    let bindBuffers = false;
    if (meshProgramInfo !== lastUsedProgramInfo) {
        lastUsedProgramInfo = meshProgramInfo;
        gl.useProgram(meshProgramInfo.program);

        bindBuffers = true;
    }

    if (bindBuffers || lastUsedGeometry !== mesh.geometry) {
        lastUsedGeometry = mesh.geometry;
        setAttributes(meshProgramInfo, mesh.geometry.attributes);
    }

    let projection = camera?.viewProjectionMatrix ?? M4.projection(gl.canvas.width, gl.canvas.height, 1000);
    projection = M4.multiply(projection, mesh.worldMatrix);
    setUniform(meshProgramInfo, 'matrix', gl.FLOAT_MAT4, projection.matrix);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = mesh.geometry.getAttribute('position').count;

    gl.drawArrays(primitiveType, offset, count);

    mesh.children.forEach((child) => {
        drawMesh(child, camera, gl, basicProgramInfo, phongProgramInfo, lastUsedProgramInfo, lastUsedGeometry);
    });
}

export const calculateTransformation = (node: Node) => {
    node.computeWorldMatrix()
    node.children.forEach((child) => {
        child.computeWorldMatrix()
    })
}