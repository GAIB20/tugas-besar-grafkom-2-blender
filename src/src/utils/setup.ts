import {resizeCanvasToDisplaySize} from "./web-gl.ts";
import {Camera} from "../classes/camera.ts";
import {OrthographicCamera} from "../classes/orthographic-camera.ts";

export const setupContext = () => {
    let _canvas: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>('#webgl-canvas');
    const canvas = _canvas!!;

    let _gl = canvas.getContext('webgl');
    if (!_gl) {
        alert("WebGL isn't supported")
        return;
    }
    return _gl;
}

export const setupCanvas = (canvas: HTMLCanvasElement, gl: WebGLRenderingContext) => {
    resizeCanvasToDisplaySize(canvas);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);
}

export const setupCamera = (type: string, gl: WebGLRenderingContext): Camera | null => {
    let camera = null;
    if (type === 'orthographic') {
        const near = -1;
        const far = -500;
        camera = new OrthographicCamera(type, gl.canvas.width, gl.canvas.height, near, far);
        camera.computeProjectionMatrix()
    }
    return camera
}