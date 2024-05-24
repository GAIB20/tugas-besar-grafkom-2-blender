import { Keyframe } from "./keyframe"
import { Node } from "../node"

interface Frame {
    Keyframes: Keyframe[];
}

export class AnimationController {

    private _playing: boolean = false;
    private _frames: Frame[] = [];
    private _currentFrame: number = 0;
    private _objectRoot: Node;
    private _deltaFrame: number = 0;
    private _frameDisplay: HTMLElement | undefined;
    private _reverse : boolean = false;
    private _loop : boolean = true;
    private _drawScene: () => void;
    
    fps: number = 24;
    speed: number = 0.6;

    constructor(root : Node, animFilePath : string, drawCallback: () => void) {
        this._drawScene = drawCallback;
    
        fetch(animFilePath)
            .then(response => response.json())
            .then(json => this.loadFrames(json))
            .catch(error => console.error('Error:', error));
        
        this._frameDisplay = this.createFrameDisplay();
        this.createFrameControlButton(document.getElementById("animation")!);
        
        let div = document.createElement("div");
        div.className = "flex flex-wrap gap-2 my-2 mb-4"; 

        this.createFpsControl(div);
        this.createSpeedControl(div);
        document.getElementById("animation")!.appendChild(div);

        this.appendButton();

        this._objectRoot = root;
    }

    play() {
        this._playing = true;
    }

    isPlaying() {
        return this._playing;
    }

    stop() {
        this._playing = false;
    }

    update(secElapsed: number) {

        if (this._playing) {
            this._deltaFrame += (secElapsed * this.fps * this.speed);
            if(this._deltaFrame >= 1){
                if (this._reverse) {
                    this._currentFrame = (this._currentFrame - Math.floor(this._deltaFrame)) % this._frames.length;
                    if (this._currentFrame < 0) {
                        this._currentFrame += this._frames.length;
                    }
                } else {
                    this._currentFrame = (this._currentFrame + Math.floor(this._deltaFrame)) % this._frames.length;
                }
                this._deltaFrame %= 1;

                this.updateFrameDisplay();
                if(this._currentFrame == 0 && !this._loop){
                    this.stop();
                }
                this.animateNode();
            }
        }
    }
    // update(deltaSecond: number) {
    //     if (this.isPlaying) {
    //         this.deltaFrame += deltaSecond * this.fps;
    //         if (this.deltaFrame >= 1) { // 1 frame
    //             this.currentFrame = (this.currentFrame + Math.floor(this.deltaFrame)) % this.length;
    //             this.deltaFrame %= 1;
    //             this.updateSceneGraph();
    //         }
    //     }
    // }

    animateNode(){
        const frame = this._frames[this._currentFrame];

        for (let i = 0; i < frame.Keyframes.length; i++) {
            const keyframe = frame.Keyframes[i];
            const node = this._objectRoot.findNodeById(keyframe.nodeId);
            if (node) {
                if(keyframe.translation){
                    node.translation = keyframe.translation;
                }
                if(keyframe.rotation){
                    // console.log("masuk");
                    // keyframe.rotation.toAngle();
                    node.rotation = keyframe.rotation;
                }
                if(keyframe.scale){
                    node.scale = keyframe.scale;
                }
            } else {
                console.error(`Node with id ${keyframe.nodeId} not found`);
            
            }
        }
        
    }

    loadFrames(data : any) {

        for (let i = 0; i < data.frames.length; i++) {
            const frame = data.frames[i];
            const keyframes = frame.keyframes;
            const keyframeList: Keyframe[] = [];

            for (let j = 0; j < keyframes.length; j++) {
                const keyframe = keyframes[j];
                keyframeList.push(new Keyframe(keyframe));
            }
            this._frames.push({ Keyframes: keyframeList });
        }
    
    }

    createFrameDisplay() {
        const parent = document.getElementById("animation");
        if (!parent) {
            return;
        }

        let frameCounter = document.createElement("p");
        frameCounter.innerHTML = "Frame: " + this._currentFrame + " / " + (this._frames.length-1);
        
        frameCounter.className = 'text-lg font-bold text-white-500';

        parent.appendChild(frameCounter);
        return frameCounter;
    }

    updateFrameDisplay() {
        if (this._frameDisplay) {
            this._frameDisplay.innerHTML = "Frame: " + this._currentFrame + " / " + (this._frames.length-1);
        }
    }

    createFrameControlButton(parent: HTMLElement) {
        
        const frameControl = document.createElement("div");
        frameControl.className = "flex flex-row gap-0 my-2 mb-4";

        let nextButton = document.createElement("button");
        nextButton.textContent = ">";
        nextButton.className = 'gman-widget-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4';
        nextButton.addEventListener('click', () => {
            this._currentFrame = (this._currentFrame + 1) % this._frames.length;
            this.animateNode();
            this.updateFrameDisplay();
            this._drawScene();
        });

        let prevButton = document.createElement("button");
        prevButton.textContent = "<";
        prevButton.className = 'gman-widget-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4';
        prevButton.addEventListener('click', () => {
            this._currentFrame = (this._currentFrame - 1) % this._frames.length;
            this.animateNode();
            this.updateFrameDisplay();
            this._drawScene();
        });

        let endButton = document.createElement("button");
        endButton.textContent = "<<";
        endButton.className = 'gman-widget-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l';
        endButton.addEventListener('click', () => {
            this._currentFrame = 0;
            this.animateNode();
            this.updateFrameDisplay();
            this._drawScene();
        });

        let finButton = document.createElement("button");
        finButton.textContent = ">>";
        finButton.className = 'gman-widget-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r';
        finButton.addEventListener('click', () => {
            this._currentFrame = this._frames.length - 1;
            this.animateNode();
            this.updateFrameDisplay();
            this._drawScene();
        });

        frameControl.appendChild(endButton);
        frameControl.appendChild(prevButton);
        frameControl.appendChild(nextButton);
        frameControl.appendChild(finButton);

        parent.appendChild(frameControl);
    
    }

    appendButton(){
        const parent = document.getElementById("animation");
        if (!parent) {
            return;
        }

        const buttonDiv = document.createElement("div");
        buttonDiv.className = "flex flex-row gap-2";
        

        this.createReverseButton(buttonDiv);
        this.createLoopButton(buttonDiv);

        parent.appendChild(buttonDiv);
    }

    createReverseButton(parent: HTMLElement) {
        if (!parent) {
            return;
        }

        let button = document.createElement("button");
        button.className = this._reverse ? 'gman-widget-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                                        : 'gman-widget-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
        
        button.innerHTML = "Reverse";
        button.onclick = () => {
            this._reverse = !this._reverse;
            button.className = this._reverse ? 'gman-widget-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                                          : 'gman-widget-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
        
        }

        parent.appendChild(button);
    }

    createFpsControl(parent: HTMLElement) {
        
        const fpsControl = document.createElement("div");
        fpsControl.className = "flex flex-wrap justify-center items-center gap-2";

        if (!parent) {
            return;
        }

        let label = document.createElement("p");
        label.innerHTML = "FPS: ";
        label.className = 'text-white bold';

        let input = document.createElement("input");
        input.type = "number";
        input.value = this.fps.toString();
        input.onchange = (event) => {
            this.fps = parseInt((event.target as HTMLInputElement).value);
        }

        input.className = 'bg-purple-900 text-white w-16 p-1 rounded border-none';

        fpsControl.appendChild(label);
        fpsControl.appendChild(input);

        parent.appendChild(fpsControl);
    }

    createSpeedControl(parent: HTMLElement) {
        const speedControl = document.createElement("div");
        speedControl.className = "flex flex-wrap justify-center items-center gap-2";
    
        if (!parent) {
            return;
        }
    
        let label = document.createElement("p");
        label.innerHTML = "Speed: ";
    
        let select = document.createElement("select");
        select.className = 'bg-purple-900 text-white w-16 p-1 border-none rounded';
        let speeds = [0.2, 0.5, 1, 1.5, 2, 3];
    
        speeds.forEach(speed => {
            let option = document.createElement("option");
            option.value = speed.toString();
            option.text = speed.toString();
            if (speed === this.speed) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    
        select.onchange = (event) => {
            this.speed = parseFloat((event.target as HTMLSelectElement).value);
        }
    
        speedControl.appendChild(label);
        speedControl.appendChild(select);
    
        parent.appendChild(speedControl);
    }

    createLoopButton(parent: HTMLElement) {
        if (!parent) {
            return;
        }

        let button = document.createElement("button");
        button.className = this._loop ? 'gman-widget-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                                          : 'gman-widget-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
        button.innerHTML = "Loop";
        button.onclick = () => {
            this._loop = !this._loop;
            button.className = this._loop ? 'gman-widget-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                                          : 'gman-widget-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
        }

        parent.appendChild(button);
    }
}