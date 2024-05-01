import './style.css'
import {createProgram, createShader, resizeCanvasToDisplaySize} from "./utils/web-gl.ts";
import {VertexShaderSource} from "./shaders/vertex-shader.ts";
import {FragmentShaderSource} from "./shaders/fragment-shader.ts";
function main() {
    // Create WebGL program
    let _canvas: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>('#webgl-canvas');
    const canvas = _canvas!!;

    let _gl = canvas.getContext('webgl');
    if (!_gl) {
        return;
    }
    const gl = _gl!!;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
        return;
    }

    let program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
        return;
    }

    resizeCanvasToDisplaySize(<HTMLCanvasElement>canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    const bufferPos = gl.createBuffer();
    const bufferCol = gl.createBuffer();

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, stride, offset);

    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCol);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, stride, offset);

    if (!bufferCol || !bufferPos) {
        return;
    }

    let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
}

main();