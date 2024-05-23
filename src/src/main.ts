import './style.css'
import {createProgramInfo, createShader, degToRad, radToDeg, resizeCanvasToDisplaySize} from "./utils/web-gl.ts";
import {createObjectHierarcy, setupColorPicker, setupSlider} from "./utils/ui.ts";
import {Vector3} from "./libs/vector3.ts";
import {setupCamera, setupCanvas, setupContext} from "./utils/setup.ts";
import {BufferGeometry} from "./classes/buffer-geometry.ts";
import {basicFrag, basicVert} from "./shaders/basic.ts";
import {BasicMaterial} from "./classes/basic-material.ts";
import {Mesh} from "./classes/mesh.ts";
import {ProgramInfo} from "./types/web-gl.ts";
import {calculateTransformation, cleanupObjects, drawMesh} from "./utils/scene.ts";
import {Node} from "./classes/node.ts";
import {AnimationController} from "./classes/animation/animation-controller.ts";
import {createButton} from "./utils/ui.ts";
import {hexToRgb, rgbToHex} from "./utils/color.ts";
import {phongFrag, phongVert} from "./shaders/phong.ts";
import {PhongMaterial} from "./classes/phong-material.ts";
import {DirectionalLight} from "./classes/directional-light.ts";
import {Texture} from "./classes/texture.ts";
import BoxGeometry from "./geometries/box-geometry.ts";

let playAnimationTime: number | undefined = undefined;

function main() {
    const _gl = setupContext();
    if (!_gl) return;
    const gl = _gl!;

    let basicVertexShader = createShader(gl, gl.VERTEX_SHADER, basicVert);
    let basicFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, basicFrag);
    if (!basicFragmentShader || !basicVertexShader) return;
    let basicProgramInfo = createProgramInfo(gl, basicVertexShader, basicFragmentShader)

    let phongVertexShader = createShader(gl, gl.VERTEX_SHADER, phongVert);
    let phongFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, phongFrag);
    if (!phongFragmentShader || !phongVertexShader) return;
    let phongProgramInfo = createProgramInfo(gl, phongVertexShader, phongFragmentShader)

    cleanupObjects();

    // GLOBAL VARIABLE
    let rootNode: Node | null = null;
    let selectedNode: Node | null = null;

    resizeCanvasToDisplaySize(<HTMLCanvasElement>gl.canvas);

    const orthoCamera = setupCamera('orthographic', gl)
    let selectedCamera = orthoCamera;

    // const geometry = new CubeGeometry(100);
    const geometry = new BoxGeometry(150, 150, 150, 30);

    const material = new BasicMaterial({color: [1, 0, 0, 1]})

    const diffuseTexture = new Texture();
    diffuseTexture.setData('/spiral/diffuse.png')
    diffuseTexture.onLoad(() => drawScene())
    const specularTexture = new Texture();
    specularTexture.setData('/spiral/specular.png');
    specularTexture.onLoad(() => drawScene())
    const normalTexture = new Texture();
    normalTexture.setData('/spiral/normal-map.png')
    normalTexture.onLoad(() => drawScene())
    const displacementTexture = new Texture();
    displacementTexture.setData('/spiral/displacement-map.png')
    displacementTexture.onLoad(() => drawScene())
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

    rootNode = mesh;
    selectedNode = mesh

    const animator = new AnimationController(selectedNode, 'src/classes/animation/anim.json');
    const animButton = createButton(document.getElementById('rightContainer'), {
        name: "Play", onClick: () => {
            if (animator.isPlaying()) {
                animator.stop();
                if (animButton) animButton.textContent = "Play";
            } else {
                animator.play();
                requestAnimationFrame(playAnimation);
                if (animButton) animButton.textContent = "Pause";
            }
        }
    })

    // Setup a ui.
    setupSlider("#x", {
        name: "Translate x",
        value: mesh.translation[0],
        slide: updatePosition(0),
        min: -gl.canvas.width,
        max: gl.canvas.width
    });
    setupSlider("#y", {
        name: "Translate y",
        value: mesh.translation[1],
        slide: updatePosition(1),
        min: -gl.canvas.height,
        max: gl.canvas.height
    });
    setupSlider("#z", {
        name: "Translate z",
        value: mesh.translation[2],
        slide: updatePosition(2),
        min: -gl.canvas.height,
        max: gl.canvas.height
    });
    setupSlider("#angleX", {name: "Rotate x", value: radToDeg(mesh.rotation[0]), slide: updateRotation(0), max: 360});
    setupSlider("#angleY", {name: "Rotate y", value: radToDeg(mesh.rotation[1]), slide: updateRotation(1), max: 360});
    setupSlider("#angleZ", {name: "Rotate z", value: radToDeg(mesh.rotation[2]), slide: updateRotation(2), max: 360});
    setupSlider("#scaleX", {
        value: mesh.scale[0],
        slide: updateScale(0),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "Scale x",
    });
    setupSlider("#scaleY", {
        value: mesh.scale[1],
        slide: updateScale(1),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "Scale y",
    });
    setupSlider("#scaleZ", {
        value: mesh.scale[2],
        slide: updateScale(2),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "Scale z",
    });


    const originNode = new Node("origin");
    const canvas = document.getElementById("webgl-canvas")
    if (!canvas) return;
    originNode.add(orthoCamera)
    orthoCamera.translation[2] = 200;

    setupSlider("#radiusCam", {
        name: "Radius",
        value: selectedCamera.translation[2],
        slide: updateRadius(2),
        min: 0,
        max: 2000
    });

    let isMouseDown = false;
    let startX = 0;
    let startY = 0;

    function handleMouseDown(event: MouseEvent) {
        isMouseDown = true;
        startX = event.clientX;
        startY = event.clientY;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isMouseDown) return;

        const currentX = event.clientX;
        const currentY = event.clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        startX = currentX;
        startY = currentY;

        originNode.rotation[0] += (-deltaY / 100);
        originNode.rotation[1] += (-deltaX / 100);
        originNode.computeWorldMatrix();
        orthoCamera.computeWorldMatrix();
        drawScene()
    }

    function handleMouseUp() {
        isMouseDown = false;
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    const playAnimation = (time: number) => {
        if (playAnimationTime === undefined) {
            playAnimationTime = time;
        }
        const deltaSecond = (time - playAnimationTime) / 1000;
        animator.update(deltaSecond);
        // animator.update(time);
        drawScene();

        playAnimationTime = time;
        if (animator.isPlaying()) {
            requestAnimationFrame(playAnimation);
        }
    }

    const setSelectedNode = (node: Node) => {
        selectedNode = node;
    }

    const objectList = document.getElementById('objectList');
    if (objectList !== null) {
        createObjectHierarcy(rootNode, objectList, setSelectedNode);
    } else {
        console.error("Parent HTML Element is not found");
    }

    function updateRadius(index: number) {
        if (!selectedCamera) return
        return function (_event: any, ui: { value: number; }) {
            selectedCamera!.translation[index] = ui.value;
            drawScene();
        };
    }

    function updatePosition(index: number) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: number; }) {
            selectedNode!.translation[index] = ui.value;
            drawScene();
        };
    }

    function updateRotation(index: number) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: any; }) {
            let angleInDegrees = ui.value;
            selectedNode!.rotation[index] = angleInDegrees * Math.PI / 180;
            drawScene();
        };
    }

    function updateScale(index: number) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: number; }) {
            selectedNode!.scale[index] = ui.value;
            drawScene();
        };
    }

    // Material
    let selectedMaterialOpt = 'phong';
    const materialSelect = document.getElementById('material') as HTMLSelectElement;

    function updateColor(type: string) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: string; }) {
            if (!(selectedNode instanceof Mesh)) return
            if (type === 'basic') {
                selectedNode.basicMaterial.color = hexToRgb(ui.value)
            } else if (type === 'phongDiffuse') {
                selectedNode.phongMaterial.color = hexToRgb(ui.value)
            } else if (type === 'phongAmbient') {
                selectedNode.phongMaterial.ambientColor = hexToRgb(ui.value)
            } else if (type === 'phongSpecular') {
                selectedNode.phongMaterial.specularColor = hexToRgb(ui.value)
            } else if (type === 'lightColor') {
                directionalLight.color = hexToRgb(ui.value)
            }
            drawScene();
        };
    }

    function updateMaterialProp(type: 'shininess' | 'dispFactor' | 'dispBias') {
        if (!selectedNode) return
        return function (_event: any, ui: { value: number; }) {
            if (!(selectedNode instanceof Mesh)) return
            if (type === 'shininess') {
                selectedNode.phongMaterial.shininess = ui.value
            } else if (type === 'dispFactor') {
                selectedNode.phongMaterial.displacementFactor = ui.value
            } else if (type === 'dispBias') {
                selectedNode.phongMaterial.displacementBias = ui.value
            }
            drawScene();
        };
    }

    function setupMaterialProp() {
        if (!(selectedNode instanceof Mesh)) return
        selectedMaterialOpt = materialSelect.value
        if (selectedMaterialOpt === 'basic') {
            document.getElementById('phongProp')!.innerHTML = ''
            selectedNode.material = selectedNode.basicMaterial;
            setupColorPicker('#basicProp', {
                name: "Color Basic",
                value: rgbToHex(selectedNode.basicMaterial.color),
                picker: updateColor('basic')
            })
        } else {
            document.getElementById('basicProp')!.innerHTML = ''
            selectedNode.material = selectedNode.phongMaterial;
            setupColorPicker('#diffuseColor', {
                name: "Diffuse Color",
                value: rgbToHex(selectedNode.phongMaterial.color),
                picker: updateColor('phongDiffuse')
            })
            setupColorPicker('#ambientColor', {
                name: "Ambient Color",
                value: rgbToHex(selectedNode.phongMaterial.ambientColor),
                picker: updateColor('phongAmbient')
            })
            setupColorPicker('#specularColor', {
                name: "Specular Color",
                value: rgbToHex(selectedNode.phongMaterial.specularColor),
                picker: updateColor('phongSpecular')
            })
            setupSlider("#shininess", {
                value: selectedNode.phongMaterial.shininess,
                slide: updateMaterialProp('shininess'),
                min: 1,
                max: 300,
                step: 1,
                name: "Shininess",
            });
            setupSlider("#displacementFactor", {
                value: selectedNode.phongMaterial.displacementFactor,
                slide: updateMaterialProp('dispFactor'),
                min: 1,
                max: 300,
                step: 1,
                name: "Displacement Factor",
            });
            setupSlider("#displacementBias", {
                value: selectedNode.phongMaterial.displacementBias,
                slide: updateMaterialProp('dispBias'),
                min: -100,
                max: 100,
                step: 1,
                name: "Displacement Bias",
            });
        }
    }

    materialSelect.addEventListener('change', () => {
        setupMaterialProp()
        drawScene()
    });
    document.addEventListener('DOMContentLoaded', () => {
        setupMaterialProp()
        drawScene()
    })

    // Texture
    const diffTextureSelect = document.getElementById('diffuseTexture') as HTMLSelectElement;
    const specTextureSelect = document.getElementById('specularTexture') as HTMLSelectElement;
    const normalTextureSelect = document.getElementById('normalTexture') as HTMLSelectElement;
    const dispTextureSelect = document.getElementById('displacementTexture') as HTMLSelectElement;

    diffTextureSelect.addEventListener('change', () => {
        let path = diffTextureSelect.value === 'blank' ? '/blank/blank.png' : `/${diffTextureSelect.value}/diffuse.png`
        diffuseTexture.setData(path);
        drawScene()
    })
    specTextureSelect.addEventListener('change', () => {
        let path = specTextureSelect.value === 'blank' ? '/blank/blank.png' : `/${specTextureSelect.value}/specular.png`
        specularTexture.setData(path);
        drawScene()
    })
    normalTextureSelect.addEventListener('change', () => {
        let path = normalTextureSelect.value === 'blank' ? '/blank/blank-normal.png' : `/${normalTextureSelect.value}/normal-map.png`
        normalTexture.setData(path);
        drawScene()
    })
    dispTextureSelect.addEventListener('change', () => {
        let path = dispTextureSelect.value === 'blank' ? '/blank/blank-displacement.png' : `/${dispTextureSelect.value}/displacement-map.png`
        displacementTexture.setData(path);
        drawScene()
    })

    // Light
    const directionalLight = new DirectionalLight('directional')
    directionalLight.translation = new Vector3(0, 0, 1000);
    directionalLight.target = selectedNode;
    setupColorPicker('#lightColor', {
        name: "Light Color",
        value: rgbToHex(directionalLight.color),
        picker: updateColor('phongAmbient')
    })

    // Draw the scene.
    function drawScene() {
        setupCanvas(<HTMLCanvasElement>gl.canvas, gl)

        selectedCamera.computeWorldMatrix()

        let lastUsedProgramInfo: ProgramInfo | null = null;
        let lastUsedGeometry: BufferGeometry | null = null;

        if (!selectedNode || !rootNode || !basicProgramInfo || !phongProgramInfo) return
        calculateTransformation(selectedNode)
        drawMesh(rootNode, selectedCamera, directionalLight, gl, basicProgramInfo, phongProgramInfo, lastUsedProgramInfo, lastUsedGeometry)

        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = mesh.geometry.getAttribute('position').count

        gl.drawArrays(primitiveType, offset, count);
    }

    // requestAnimationFrame(drawScene);
}


main();