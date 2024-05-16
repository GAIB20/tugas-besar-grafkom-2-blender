import './style.css'
import {createProgram, createShader, resizeCanvasToDisplaySize} from "./utils/web-gl.ts";
import {VertexShaderSource} from "./shaders/vertex-shader.ts";
import {FragmentShaderSource} from "./shaders/fragment-shader.ts";
import {setupSlider} from "./utils/ui.ts";
import { createObjectHierarcy } from './utils/ui.ts';
import {M4} from "./libs/m4.ts";
import {Vector3} from "./libs/vector3.ts";
import {BufferGeometry} from "./classes/buffer-geometry.ts";
import {BufferAttribute} from "./classes/buffer-attribute.ts";
import {Node} from "./classes/node.ts";

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

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // look up where the vertex data needs to go.
    let positionLocation = gl.getAttribLocation(program, "a_position");
    let colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    let matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer to put positions in
    let positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Make geometry
    let object = new BufferGeometry();
    let position = new BufferAttribute(getGeometry(), gl.FLOAT)
    object.setAttribute('a_position', position)
    // // Put geometry data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, object.attributes['a_position'].data, gl.STATIC_DRAW)

    // Create a buffer to put colors in
    let colorBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let colors = new BufferAttribute(getColors(), gl.FLOAT)
    object.setAttribute('a_color', colors)
    // // Put geometry data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, object.attributes['a_color'].data, gl.STATIC_DRAW)

    function radToDeg(r: number) {
        return r * 180 / Math.PI;
    }

    function degToRad(d: number) {
        return d * Math.PI / 180;
    }

    let translation = new Vector3(45, 150, 0);
    let rotation = new Vector3(degToRad(40), degToRad(25), degToRad(325));
    let scaler = new Vector3(1, 1, 1);

    drawScene();

    // Setup a ui.
    setupSlider("#x", {name: "x", value: translation[0], slide: updatePosition(0), max: gl.canvas.width});
    setupSlider("#y", {name: "y",value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    setupSlider("#z", {name: "z",value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
    setupSlider("#angleX", {name: "angle-x",value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
    setupSlider("#angleY", {name: "angle-y",value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
    setupSlider("#angleZ", {name: "angle-z",value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
    setupSlider("#scaleX", {
        value: scaler[0],
        slide: updateScale(0),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "scale-x",
    });
    setupSlider("#scaleY", {
        value: scaler[1],
        slide: updateScale(1),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "szale-y",
    });
    setupSlider("#scaleZ", {
        value: scaler[2],
        slide: updateScale(2),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "scale-z",
    });

    // testing
    let test = new Node("test");
    let test1 = new Node("test1");
    let test11 = new Node("test11");
    let test12 = new Node("test12");
    let test111 = new Node("test111");
    let test2 = new Node("test2");
    let test21 = new Node("test21");
    let test211 = new Node("test211");

    test.children.push(test1);
    test.children.push(test2);
    test1.children.push(test11);
    test1.children.push(test12);
    test11.children.push(test111);
    test2.children.push(test21);
    test21.children.push(test211);


    const objectList = document.getElementById('objectList');
    if(objectList !== null){
        console.log('masuk');
        createObjectHierarcy(test, objectList);
    }
    else{
        console.error("Parent HTML Element is not found");
    }
    

    function updatePosition(index: number) {
        return function (_event: any, ui: { value: number; }) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateRotation(index: number) {
        return function (_event: any, ui: { value: any; }) {
            let angleInDegrees = ui.value;
            let angleInRadians = angleInDegrees * Math.PI / 180;
            rotation[index] = angleInRadians;
            drawScene();
        };
    }

    function updateScale(index: number) {
        return function (_event: any, ui: { value: number; }) {
            scaler[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        resizeCanvasToDisplaySize(<HTMLCanvasElement>gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Turn on culling. By default backfacing triangles
        // will be culled.
        gl.enable(gl.CULL_FACE);

        // Enable the depth buffer
        gl.enable(gl.DEPTH_TEST);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program!);

        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 3;          // 3 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, 0);

        // Turn on the color attribute
        gl.enableVertexAttribArray(colorLocation);

        // Bind the color buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        size = 3;                 // 3 components per iteration
        // the data is 8bit unsigned values
        normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
             // start at the beginning of the buffer
        gl.vertexAttribPointer(
            colorLocation, size, gl.UNSIGNED_BYTE, normalize, stride, 0);

        // Compute the matrices
        let matrix = M4.projection(canvas.clientWidth, canvas.clientHeight, 400);
        matrix = M4.multiply(matrix, M4.translation3d(translation));
        matrix = M4.multiply(matrix, M4.rotation3d(rotation));
        matrix = M4.multiply(matrix, M4.scale3d(scaler));

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix.matrix);

        // Draw the geometry.
        let primitiveType = gl.TRIANGLES;
        let offset = 0;
        let count = 16 * 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    requestAnimationFrame(drawScene);
}

function getGeometry() {
    return new Float32Array([
        // left column front
        0,   0,  0,
        0, 150,  0,
        30,   0,  0,
        0, 150,  0,
        30, 150,  0,
        30,   0,  0,

        // top rung front
        30,   0,  0,
        30,  30,  0,
        100,   0,  0,
        30,  30,  0,
        100,  30,  0,
        100,   0,  0,

        // middle rung front
        30,  60,  0,
        30,  90,  0,
        67,  60,  0,
        30,  90,  0,
        67,  90,  0,
        67,  60,  0,

        // left column back
        0,   0,  30,
        30,   0,  30,
        0, 150,  30,
        0, 150,  30,
        30,   0,  30,
        30, 150,  30,

        // top rung back
        30,   0,  30,
        100,   0,  30,
        30,  30,  30,
        30,  30,  30,
        100,   0,  30,
        100,  30,  30,

        // middle rung back
        30,  60,  30,
        67,  60,  30,
        30,  90,  30,
        30,  90,  30,
        67,  60,  30,
        67,  90,  30,

        // top
        0,   0,   0,
        100,   0,   0,
        100,   0,  30,
        0,   0,   0,
        100,   0,  30,
        0,   0,  30,

        // top rung right
        100,   0,   0,
        100,  30,   0,
        100,  30,  30,
        100,   0,   0,
        100,  30,  30,
        100,   0,  30,

        // under top rung
        30,   30,   0,
        30,   30,  30,
        100,  30,  30,
        30,   30,   0,
        100,  30,  30,
        100,  30,   0,

        // between top rung and middle
        30,   30,   0,
        30,   60,  30,
        30,   30,  30,
        30,   30,   0,
        30,   60,   0,
        30,   60,  30,

        // top of middle rung
        30,   60,   0,
        67,   60,  30,
        30,   60,  30,
        30,   60,   0,
        67,   60,   0,
        67,   60,  30,

        // right of middle rung
        67,   60,   0,
        67,   90,  30,
        67,   60,  30,
        67,   60,   0,
        67,   90,   0,
        67,   90,  30,

        // bottom of middle rung.
        30,   90,   0,
        30,   90,  30,
        67,   90,  30,
        30,   90,   0,
        67,   90,  30,
        67,   90,   0,

        // right of bottom
        30,   90,   0,
        30,  150,  30,
        30,   90,  30,
        30,   90,   0,
        30,  150,   0,
        30,  150,  30,

        // bottom
        0,   150,   0,
        0,   150,  30,
        30,  150,  30,
        0,   150,   0,
        30,  150,  30,
        30,  150,   0,

        // left side
        0,   0,   0,
        0,   0,  30,
        0, 150,  30,
        0,   0,   0,
        0, 150,  30,
        0, 150,   0])
}
// Fill the buffer with colors for the 'F'.
function getColors() {
    return new Uint8Array([
        // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

        // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

        // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

        // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

        // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

        // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

        // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

        // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

        // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

        // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

        // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

        // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

        // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220])
}

main();