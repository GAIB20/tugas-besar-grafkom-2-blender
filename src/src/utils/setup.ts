import {degToRad, resizeCanvasToDisplaySize} from "./web-gl.ts";
import {Camera} from "../classes/camera/camera.ts";
import {OrthographicCamera} from "../classes/camera/orthographic-camera.ts";
import {ObliqueCamera} from "../classes/camera/oblique-camera.ts";
import {PerspectiveCamera} from "../classes/camera/perspective-camera.ts";
import {DirectionalLight} from "../classes/light/directional-light.ts";
import {Vector3} from "../libs/vector3.ts";
import {PointLight} from "../classes/light/point-light.ts";

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
    resizeCanvasToDisplaySize(canvas, gl);
    // Tell WebGL how to convert from clip space to pixels
    gl.clearColor(0, 0, 0, 0);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);
}

export const setupCamera = (type: string, gl: WebGLRenderingContext): Camera => {
    let camera = null;
    const near = -1;
    const far = -5000;
    if (type === 'orthographic') {
        camera = new OrthographicCamera(type, gl.canvas.width, gl.canvas.height, near, far);
    } else if (type === 'oblique'){
        camera = new ObliqueCamera(type, gl.canvas.width, gl.canvas.height, near, far, degToRad(55), degToRad(55));
    }
    else {
        camera = new PerspectiveCamera(type, degToRad(60), gl.canvas.width / gl.canvas.height, near, far)
    }
    camera.computeProjectionMatrix()
    return camera
}

export const setupLight = (type: string) => {
    let light;
    if (type === 'directional') {
        light = new DirectionalLight(type)
        light.translation = new Vector3(0, 0, 1000);
    } else {
        light = new PointLight(type)
        light.translation = new Vector3(0, 0, 500);
    }
    return light;
}

export const getTexturePath = (type: 'diffuse' | 'specular' | 'normal' | 'displacement', value: string) => {
    const texturePaths = {
        blank: {
            diffuse: '/blank/blank.png',
            specular: '/blank/blank.png',
            normal: '/blank/blank-normal.png',
            displacement: '/blank/blank-displacement.png'
        },
        spiral: {
            diffuse: '/spiral/diffuse.png',
            specular: '/spiral/specular.png',
            normal: '/spiral/normal-map.png',
            displacement: '/spiral/displacement-map.png'
        }
    }
    // @ts-ignore
    return texturePaths[value][type]
}

export const adjustCanvasSizetoCam = (camera: Camera, gl: WebGLRenderingContext) => {
    if (camera instanceof ObliqueCamera || camera instanceof OrthographicCamera) {
        camera.width = gl.canvas.width
        camera.height = gl.canvas.height
        camera.computeProjectionMatrix()
    }
}