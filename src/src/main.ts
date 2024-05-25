import './style.css'
import {createProgramInfo, createShader, radToDeg, resizeCanvasToDisplaySize} from "./utils/web-gl.ts";
import {
    clearDirectionalLightProp,
    clearPointLightProp,
    createObjectHierarcy,
    setupColorPicker,
    setupSlider
} from "./utils/ui.ts";
import {
    adjustCanvasSizetoCam,
    getTexturePath,
    setupCamera,
    setupCanvas,
    setupContext,
    setupLight
} from "./utils/setup.ts";
import {BufferGeometry} from "./classes/buffer-geometry.ts";
import {basicFrag, basicVert} from "./shaders/basic.ts";
import {Mesh} from "./classes/mesh.ts";
import {ProgramInfo} from "./types/web-gl.ts";
import {
    calculateTransformation,
    cleanupObjects,
    drawMesh,
    removeNode,
    setupScene
} from "./utils/scene.ts";
import {Node} from "./classes/node.ts";
import {AnimationController} from "./classes/animation/animation-controller.ts";
import {createButton} from "./utils/ui.ts";
import {hexToRgb, rgbToHex} from "./utils/color.ts";
import {phongFrag, phongVert} from "./shaders/phong.ts";
import {IModel, loadFromJson, saveToJson} from "./utils/save-load.ts";
import {DirectionalLight} from "./classes/light/directional-light.ts";
import {PointLight} from "./classes/light/point-light.ts";

// GLOBAL VARIABLE
let playAnimationTime: number | undefined = undefined;
let rootNode: Node | null = null;
let selectedNode: Node | null = null;
let animator: AnimationController | null = null;

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

    const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement
    resizeCanvasToDisplaySize(canvas, gl);

    rootNode = setupScene(drawScene);
    selectedNode = rootNode

    // animator = new AnimationController(selectedNode, 'src/classes/animation/anim.json', drawScene);
    createButton(document.getElementById('animation'), {
        name: "Play / Pause", onClick: () => {
            if (!animator) {
                alert('Load model first')
                return
            }
            if (animator.isPlaying()) {
                animator.stop();
                // if (animButton) animButton.textContent = "Play";
            } else {
                animator.play();
                requestAnimationFrame(playAnimation);
                // if (animButton) animButton.textContent = "Pause";
            }
        }
    })


    // Setup a ui.
    setupSlider("#x", {
        name: "Translate x",
        value: selectedNode.translation[0],
        slide: updatePosition(0, selectedNode),
        min: -gl.canvas.width,
        max: gl.canvas.width
    });
    setupSlider("#y", {
        name: "Translate y",
        value: selectedNode.translation[1],
        slide: updatePosition(1, selectedNode),
        min: -gl.canvas.height,
        max: gl.canvas.height
    });
    setupSlider("#z", {
        name: "Translate z",
        value: selectedNode.translation[2],
        slide: updatePosition(2, selectedNode),
        min: -gl.canvas.height,
        max: gl.canvas.height
    });
    setupSlider("#angleX", {
        name: "Rotate x",
        value: radToDeg(selectedNode.rotation[0]),
        slide: updateRotation(0, selectedNode),
        max: 360
    });
    setupSlider("#angleY", {
        name: "Rotate y",
        value: radToDeg(selectedNode.rotation[1]),
        slide: updateRotation(1, selectedNode),
        max: 360
    });
    setupSlider("#angleZ", {
        name: "Rotate z",
        value: radToDeg(selectedNode.rotation[2]),
        slide: updateRotation(2, selectedNode),
        max: 360
    });
    setupSlider("#scaleX", {
        value: selectedNode.scale[0],
        slide: updateScale(0, selectedNode),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "Scale x",
    });
    setupSlider("#scaleY", {
        value: selectedNode.scale[1],
        slide: updateScale(1, selectedNode),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "Scale y",
    });
    setupSlider("#scaleZ", {
        value: selectedNode.scale[2],
        slide: updateScale(2, selectedNode),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2,
        name: "Scale z",
    });

    // Camera
    const projectionSelect = document.getElementById('projection') as HTMLSelectElement
    let selectedCamera = setupCamera(projectionSelect.value, gl)

    const originNode = new Node("origin");
    originNode.add(selectedCamera)
    selectedCamera.translation[2] = 850;

    projectionSelect.addEventListener('change', () => {
        originNode.remove(selectedCamera)
        removeNode(selectedCamera)
        selectedCamera = setupCamera(projectionSelect.value, gl)
        originNode.add(selectedCamera)
        selectedCamera.translation[2] = 850;
        drawScene()
        setupRadiusCam()
    })

    document.getElementById("resetCamera")?.addEventListener("click", () => {
        selectedCamera.translation[2] = 850
        setupRadiusCam()
        originNode.rotation[0] = 0
        originNode.rotation[1] = 0
        originNode.computeWorldMatrix()
        selectedCamera.computeWorldMatrix();
        drawScene()
    });

    function setupRadiusCam() {
        setupSlider("#radiusCam", {
            name: "Radius",
            value: selectedCamera.translation[2],
            slide: updatePosition(2, selectedCamera),
            min: 0,
            max: 3000
        });
    }

    setupRadiusCam()

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
        selectedCamera.computeWorldMatrix();
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
        if (!animator) return
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

    const objectList = document.getElementById('objectList') as HTMLElement;

    function updatePosition(index: number, node: Node) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: number; }) {
            node.translation[index] = ui.value;
            drawScene();
        };
    }

    function updateRotation(index: number, node: Node) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: any; }) {
            let angleInDegrees = ui.value;
            node.rotation[index] = angleInDegrees * Math.PI / 180;
            drawScene();
        };
    }

    function updateScale(index: number, node: Node) {
        if (!selectedNode) return
        return function (_event: any, ui: { value: number; }) {
            node.scale[index] = ui.value;
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
                selectedLight.color = hexToRgb(ui.value)
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
        setupLightProp()
        drawScene()
        if (!rootNode) return
        createObjectHierarcy(rootNode, objectList, setSelectedNode);
    })

    // Texture
    const diffTextureSelect = document.getElementById('diffuseTexture') as HTMLSelectElement;
    const specTextureSelect = document.getElementById('specularTexture') as HTMLSelectElement;
    const normalTextureSelect = document.getElementById('normalTexture') as HTMLSelectElement;
    const dispTextureSelect = document.getElementById('displacementTexture') as HTMLSelectElement;

    diffTextureSelect.addEventListener('change', () => {
        let path = getTexturePath('diffuse', diffTextureSelect.value)
        if (!(selectedNode instanceof Mesh)) return
        selectedNode.phongMaterial.diffuseTexture.setData(path);
        drawScene()
    })
    specTextureSelect.addEventListener('change', () => {
        let path = getTexturePath('specular', specTextureSelect.value)
        if (!(selectedNode instanceof Mesh)) return
        selectedNode.phongMaterial.specularTexture.setData(path);
        drawScene()
    })
    normalTextureSelect.addEventListener('change', () => {
        let path = getTexturePath('normal', normalTextureSelect.value)
        if (!(selectedNode instanceof Mesh)) return
        selectedNode.phongMaterial.normalTexture.setData(path);
        drawScene()
    })
    dispTextureSelect.addEventListener('change', () => {
        let path = getTexturePath('displacement', dispTextureSelect.value)
        if (!(selectedNode instanceof Mesh)) return
        selectedNode.phongMaterial.displacementTexture.setData(path);
        drawScene()
    })

    // Light
    const lightSelect = document.getElementById('light') as HTMLSelectElement
    let selectedLight = setupLight(lightSelect.value)

    function updateAttenuation(variable: 'A' | 'B' | 'C') {
        if (!(selectedLight instanceof PointLight)) return
        return function (_event: any, ui: { value: number; }) {
            if (!(selectedLight instanceof PointLight)) return
            if (variable === 'A') {
                selectedLight.attenuationA = ui.value
            } else if (variable === 'B') {
                selectedLight.attenuationB = ui.value
            } else {
                selectedLight.attenuationC = ui.value
            }
            drawScene()
        };
    }

    function setupLightProp() {
        if (!selectedLight) return
        setupLightColor()
        if (selectedLight instanceof DirectionalLight) {
            clearPointLightProp()
            setupSlider("#lightDirX", {
                value: selectedLight.translation[0],
                slide: updatePosition(0, selectedLight),
                min: -100,
                max: 100,
                step: 1,
                name: "Rotation X",
            });
            setupSlider("#lightDirY", {
                value: selectedLight.translation[1],
                slide: updatePosition(1, selectedLight),
                min: -100,
                max: 100,
                step: 1,
                name: "Rotation Y",
            });
            setupSlider("#lightDirZ", {
                value: selectedLight.translation[2],
                slide: updatePosition(2, selectedLight),
                min: -100,
                max: 100,
                step: 1,
                name: "Rotation Z",
            });
        } else {
            clearDirectionalLightProp()
            setupSlider("#lightPosX", {
                value: selectedLight.translation[0],
                slide: updatePosition(0, selectedLight),
                min: -100,
                max: 100,
                step: 1,
                name: "Position X",
            });
            setupSlider("#lightPosY", {
                value: selectedLight.translation[1],
                slide: updatePosition(1, selectedLight),
                min: -100,
                max: 100,
                step: 1,
                name: "Position Y",
            });
            setupSlider("#lightPosZ", {
                value: selectedLight.translation[2],
                slide: updatePosition(2, selectedLight),
                min: -300,
                max: 3000,
                step: 1,
                name: "Position Z",
            });
            setupSlider("#lightAttA", {
                value: selectedLight.attenuationA,
                slide: updateAttenuation('A'),
                min: 1,
                max: 100,
                step: 1,
                name: "Attenuation A",
            });
            setupSlider("#lightAttB", {
                value: selectedLight.attenuationB,
                slide: updateAttenuation('B'),
                min: 1,
                max: 100,
                step: 1,
                name: "Attenuation B",
            });
            setupSlider("#lightAttC", {
                value: selectedLight.attenuationC,
                slide: updateAttenuation('C'),
                min: 1,
                max: 100,
                step: 1,
                name: "Attenuation C",
            });
        }
    }

    function setupLightColor() {
        setupColorPicker('#lightColor', {
            name: "Light Color",
            value: rgbToHex(selectedLight.color),
            picker: updateColor('lightColor')
        })
    }

    lightSelect.addEventListener('change', () => {
        removeNode(selectedLight)
        selectedLight = setupLight(lightSelect.value)
        setupLightProp()
        drawScene()
    })

    // Save and Load
    document.getElementById("downloadButton")?.addEventListener("click", () => {
        if (!rootNode) return;
        saveToJson(rootNode, animator?.data);
    });

    document.getElementById('loadModelButton')!.addEventListener('click', () => {
        const input = document.getElementById('modelInput') as HTMLInputElement;
        if (input.files && input.files[0]) {
            cleanupObjects()
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                if (event.target && typeof event.target.result === 'string') {
                    try {
                        const jsonObject: IModel = JSON.parse(event.target.result);
                        console.log(jsonObject);
                        let {
                            rootNode: newRoot, animation
                        } = loadFromJson(jsonObject, drawScene)
                        rootNode = newRoot
                        selectedNode = rootNode
                        createObjectHierarcy(rootNode, objectList, setSelectedNode);
                        animator = new AnimationController(rootNode, animation, drawScene)
                        drawScene()
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please select a JSON file first.');
        }
    });

    // Draw the scene.
    function drawScene() {
        setupCanvas(<HTMLCanvasElement>gl.canvas, gl)
        adjustCanvasSizetoCam(selectedCamera, gl)
        selectedCamera.computeWorldMatrix()

        let lastUsedProgramInfo: ProgramInfo | null = null;
        let lastUsedGeometry: BufferGeometry | null = null;

        if (!selectedNode || !rootNode || !basicProgramInfo || !phongProgramInfo) return
        calculateTransformation(selectedNode)
        drawMesh(rootNode, selectedCamera, selectedLight, gl, basicProgramInfo, phongProgramInfo, lastUsedProgramInfo, lastUsedGeometry)

        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = 3

        gl.drawArrays(primitiveType, offset, count);
    }

    // requestAnimationFrame(drawScene);
}


main();