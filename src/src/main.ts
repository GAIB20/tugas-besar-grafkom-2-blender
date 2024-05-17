import './style.css'
import {createProgramInfo, createShader, degToRad, radToDeg} from "./utils/web-gl.ts";
import {createObjectHierarcy, setupSlider} from "./utils/ui.ts";
import {Vector3} from "./libs/vector3.ts";
import {setupCanvas, setupContext} from "./utils/setup.ts";
import {BufferGeometry} from "./classes/buffer-geometry.ts";
import {BufferAttribute} from "./classes/buffer-attribute.ts";
import {basicFrag, basicVert} from "./shaders/basic.ts";
import {BasicMaterial} from "./classes/basic-material.ts";
import {Mesh} from "./classes/mesh.ts";
import {ProgramInfo} from "./types/web-gl.ts";
import {calculateTransformation, cleanupObjects, drawMesh} from "./utils/scene.ts";
import {Node} from "./classes/node.ts";

let playAnimationTime = 0;

function playAnimation(currentTime : number) {
    if(playAnimationTime === 0){
        playAnimationTime = currentTime;
    }

    // TODO : Integrate animation controller to the main
    requestAnimationFrame(playAnimation);
}

function main() {
    const _gl = setupContext();
    if (!_gl) return;
    const gl = _gl!;

    let basicVertexShader = createShader(gl, gl.VERTEX_SHADER, basicVert);
    let basicFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, basicFrag);
    if (!basicFragmentShader || !basicVertexShader) return;
    let basicProgramInfo = createProgramInfo(gl, basicVertexShader, basicFragmentShader)

    // let phongVertexShader = createShader(gl, gl.VERTEX_SHADER, phongVert);
    // let phongFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, phongFrag);
    // if (!phongFragmentShader || !phongVertexShader) return;
    let phongProgramInfo = createProgramInfo(gl, basicVertexShader, basicFragmentShader)

    cleanupObjects();

    // GLOBAL VARIABLE
    let rootNode: Node | null = null;
    let selectedNode: Node | null = null;

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(getGeometry(), 3))
    geometry.setAttribute('color', new BufferAttribute(getColors(), 3, {dtype: gl.UNSIGNED_BYTE, normalize: true}))

    const material = new BasicMaterial()

    const mesh = new Mesh('test', geometry, material)

    mesh.translation = (new Vector3(45, 150, 0))
    mesh.rotation = (new Vector3(degToRad(40), degToRad(180), degToRad(145)));
    mesh.scale = new Vector3(1, 1, 1);

    rootNode = mesh;
    selectedNode = mesh

    drawScene();

    // Setup a ui.
    setupSlider("#x", {name: "x", value: mesh.translation[0], slide: updatePosition(0), max: gl.canvas.width});
    setupSlider("#y", {name: "y", value: mesh.translation[1], slide: updatePosition(1), max: gl.canvas.height});
    setupSlider("#z", {name: "z", value: mesh.translation[2], slide: updatePosition(2), max: gl.canvas.height});
    setupSlider("#angleX", {name: "angle-x", value: radToDeg(mesh.rotation[0]), slide: updateRotation(0), max: 360});
    setupSlider("#angleY", {name: "angle-y", value: radToDeg(mesh.rotation[1]), slide: updateRotation(1), max: 360});
    setupSlider("#angleZ", {name: "angle-z", value: radToDeg(mesh.rotation[2]), slide: updateRotation(2), max: 360});
    setupSlider("#scaleX", {
        value: mesh.scale[0],
        slide: updateScale(0),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "scale-x",
    });
    setupSlider("#scaleY", {
        value: mesh.scale[1],
        slide: updateScale(1),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "scale-y",
    });
    setupSlider("#scaleZ", {
        value: mesh.scale[2],
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
        createObjectHierarcy(test, objectList);
    }
    else{
        console.error("Parent HTML Element is not found");
    }


    function updatePosition(index: number) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: number; }) {
            selectedNode.translation[index] = ui.value;
            drawScene();
        };
    }

    function updateRotation(index: number) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: any; }) {
            let angleInDegrees = ui.value;
            selectedNode.rotation[index] = angleInDegrees * Math.PI / 180;
            drawScene();
        };
    }

    function updateScale(index: number) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: number; }) {
            selectedNode.scale[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        setupCanvas(<HTMLCanvasElement>gl.canvas, gl)

        let lastUsedProgramInfo: ProgramInfo | null = null;
        let lastUsedGeometry: BufferGeometry | null = null;

        if (!selectedNode || !rootNode || !basicProgramInfo || !phongProgramInfo) return
        calculateTransformation(selectedNode)
        drawMesh(rootNode, gl, basicProgramInfo, phongProgramInfo, lastUsedProgramInfo, lastUsedGeometry)

        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = mesh.geometry.getAttribute('position').count

        gl.drawArrays(primitiveType, offset, count);
    }

    // requestAnimationFrame(drawScene);
}

function getGeometry() {
    return new Float32Array([
        // left column front
        0, 0, 0,
        0, 150, 0,
        30, 0, 0,
        0, 150, 0,
        30, 150, 0,
        30, 0, 0,

        // top rung front
        30, 0, 0,
        30, 30, 0,
        100, 0, 0,
        30, 30, 0,
        100, 30, 0,
        100, 0, 0,

        // middle rung front
        30, 60, 0,
        30, 90, 0,
        67, 60, 0,
        30, 90, 0,
        67, 90, 0,
        67, 60, 0,

        // left column back
        0, 0, 30,
        30, 0, 30,
        0, 150, 30,
        0, 150, 30,
        30, 0, 30,
        30, 150, 30,

        // top rung back
        30, 0, 30,
        100, 0, 30,
        30, 30, 30,
        30, 30, 30,
        100, 0, 30,
        100, 30, 30,

        // middle rung back
        30, 60, 30,
        67, 60, 30,
        30, 90, 30,
        30, 90, 30,
        67, 60, 30,
        67, 90, 30,

        // top
        0, 0, 0,
        100, 0, 0,
        100, 0, 30,
        0, 0, 0,
        100, 0, 30,
        0, 0, 30,

        // top rung right
        100, 0, 0,
        100, 30, 0,
        100, 30, 30,
        100, 0, 0,
        100, 30, 30,
        100, 0, 30,

        // under top rung
        30, 30, 0,
        30, 30, 30,
        100, 30, 30,
        30, 30, 0,
        100, 30, 30,
        100, 30, 0,

        // between top rung and middle
        30, 30, 0,
        30, 60, 30,
        30, 30, 30,
        30, 30, 0,
        30, 60, 0,
        30, 60, 30,

        // top of middle rung
        30, 60, 0,
        67, 60, 30,
        30, 60, 30,
        30, 60, 0,
        67, 60, 0,
        67, 60, 30,

        // right of middle rung
        67, 60, 0,
        67, 90, 30,
        67, 60, 30,
        67, 60, 0,
        67, 90, 0,
        67, 90, 30,

        // bottom of middle rung.
        30, 90, 0,
        30, 90, 30,
        67, 90, 30,
        30, 90, 0,
        67, 90, 30,
        67, 90, 0,

        // right of bottom
        30, 90, 0,
        30, 150, 30,
        30, 90, 30,
        30, 90, 0,
        30, 150, 0,
        30, 150, 30,

        // bottom
        0, 150, 0,
        0, 150, 30,
        30, 150, 30,
        0, 150, 0,
        30, 150, 30,
        30, 150, 0,

        // left side
        0, 0, 0,
        0, 0, 30,
        0, 150, 30,
        0, 0, 0,
        0, 150, 30,
        0, 150, 0])
}

// Fill the buffer with colors for the 'F'.
function getColors() {
    return new Uint8Array([
        // left column front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // top rung front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // middle rung front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

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