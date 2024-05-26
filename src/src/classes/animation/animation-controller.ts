import { Keyframe } from "./keyframe"
import { Node } from "../node"
import {IAnimation} from "../../interfaces/animation.ts";
import { easeInSine, easeInBack, easeInCircular, easeInCubic, easeInExpotential, easeInQuad, easeInQuart } from "../../utils/easing.ts";
import { Vector3 } from "../../libs/vector3.ts";

interface Frame {
    Keyframes: Keyframe[];
}

export class AnimationController {
    private _data: IAnimation;
    private _playing: boolean = false;
    private _frames: Frame[] = [];
    private _currentFrame: number = 0;
    private _objectRoot: Node;
    private _deltaFrame: number = 0;
    private _frameDisplay: HTMLElement | undefined;
    private _reverse : boolean = false;
    private _loop : boolean = true;
    private _drawScene: () => void;
    private _tweening: string = "None";
    
    fps: number = 24;
    speed: number = 0.2;

    constructor(root : Node, data : any, drawCallback: () => void) {
        this._drawScene = drawCallback;

        this.loadFrames(data)
        this._data = data;

        this._frameDisplay = this.createFrameDisplay();
        this.createFrameControlButton(document.getElementById("animation")!);
        
        let div = document.createElement("div");
        div.className = "flex flex-wrap gap-2 my-2 mb-4"; 

        this.createFpsControl(div);
        this.createSpeedControl(div);
        document.getElementById("animation")!.appendChild(div);

        this.appendButton();

        this.createTweenControl(document.getElementById("animation")!);

        this._objectRoot = root;
    }

    get data() {
        return this._data;
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

    currentFrame() {
        return this._currentFrame;
    }

    setDeltaFrame(delta: number) {
        this._deltaFrame = delta;
    }

    update(secElapsed: number) {
        if (this._playing) {
            this._deltaFrame += (secElapsed * this.fps * this.speed);
            if(this._deltaFrame >= 1 && this._tweening == "None"){
                console.log("frame before:" + this._currentFrame);
                if (this._reverse) {
                    this._currentFrame = (this._currentFrame - Math.floor(this._deltaFrame)) % this._frames.length;
                    if (this._currentFrame < 0) {
                        this._currentFrame += this._frames.length;
                    }
                } else {
                    this._currentFrame = (this._currentFrame + Math.floor(this._deltaFrame)) % this._frames.length;
                }

                console.log("frame:" + this._currentFrame);
                console.log("delta:" + this._deltaFrame);
                this._deltaFrame %= 1;

                this.updateFrameDisplay();
                if(this._currentFrame == 0 && !this._loop){
                    this.stop();
                }
                this.animateNode();
            }
            else if (this._deltaFrame > 0 && this._tweening != "None") {
                console.log("tweening, delta: " + this._deltaFrame);
                this.animateNodeTween(this._deltaFrame);
            }
        }
    }


    animateNodeTween(xProgress : number){
        const frame = this._frames[this._currentFrame];

        for (let i = 0; i < frame.Keyframes.length; i++){
            const keyframe = frame.Keyframes[i];
            const nextKeyframe = this.findNextKeyframe(keyframe.nodeId);

            const node = this._objectRoot.findNodeById(keyframe.nodeId);
            if (node) {
                if(keyframe.translation && nextKeyframe?.translation){
                    node.translation = this.tweenValue(keyframe.translation, nextKeyframe.translation, xProgress);
                }
                if(keyframe.rotation && nextKeyframe?.rotation){
                    console.log(node.rotation);
                    node.rotation = this.tweenValue(keyframe.rotation, nextKeyframe.rotation, xProgress);
                    console.log(node.rotation);
                }
                if(keyframe.scale && nextKeyframe?.scale){
                    node.scale = this.tweenValue(keyframe.scale, nextKeyframe.scale, xProgress);
                }

                // if(keyframe.translation){
                //     node.translation = keyframe.translation;
                    
                // }
                // if(keyframe.rotation){
                //     node.rotation = keyframe.rotation;
                // }
                // if(keyframe.scale){
                //     node.scale = keyframe.scale;
                // }
            } else {
                console.error(`Node with id ${keyframe.nodeId} not found`);
                
            }
        }
    }

    findNextKeyframe(nodeId : number): Keyframe | null{
        if(this._reverse){
            console.log("reverse");
            let i = (this._currentFrame - 1) % this._frames.length;
            while (i != this._currentFrame){
                const frame = this._frames[i];
                const keyframe = frame.Keyframes.find((keyframe) => keyframe.nodeId == nodeId);
                if(keyframe){
                    return keyframe;
                }
                i--;
            }
            return null;
        }

        let i = (this._currentFrame + 1) % this._frames.length;
        
        while (i != this._currentFrame){
            const frame = this._frames[i];
            const keyframe = frame.Keyframes.find((keyframe) => keyframe.nodeId == nodeId);
            if(keyframe){
                return keyframe;
            }
            i++;
        }
        
        return null
    }

    tweenValue(start : Vector3, end : Vector3, xProgress : number): Vector3{
        let x : number = 0;
        let y : number = 0;
        let z : number = 0;


        if (this._tweening == "Back") {
            x = easeInBack(start[0], end[0], xProgress);
            y = easeInBack(start[1], end[1], xProgress);
            z = easeInBack(start[2], end[2], xProgress);
        } else if (this._tweening == "Circular") {
            x = easeInCircular(start[0], end[0], xProgress);
            y = easeInCircular(start[1], end[1], xProgress);
            z = easeInCircular(start[2], end[2], xProgress);
        } else if (this._tweening == "Cubic") { 
            x = easeInCubic(start[0], end[0], xProgress);
            y = easeInCubic(start[1], end[1], xProgress);
            z = easeInCubic(start[2], end[2], xProgress);
        } else if (this._tweening == "Expotential") {
            x = easeInExpotential(start[0], end[0], xProgress);
            y = easeInExpotential(start[1], end[1], xProgress);
            z = easeInExpotential(start[2], end[2], xProgress);
        } else if (this._tweening == "Quad") {
            x = easeInQuad(start[0], end[0], xProgress);
            y = easeInQuad(start[1], end[1], xProgress);
            z = easeInQuad(start[2], end[2], xProgress);
        } else if (this._tweening == "Quart") {
            x = easeInQuart(start[0], end[0], xProgress);
            y = easeInQuart(start[1], end[1], xProgress);
            z = easeInQuart(start[2], end[2], xProgress);
        } else {
            x = easeInSine(start[0], end[0], xProgress);
            y = easeInSine(start[1], end[1], xProgress);
            z = easeInSine(start[2], end[2], xProgress);
        }

        return new Vector3(x, y, z);

    }

    createTweenControl(parent: HTMLElement) {
        let dropdown = document.createElement("select");
        dropdown.className = 'bg-purple-900 text-white w-32 p-1 border-none rounded mt-3';
        let tweenings = ["None", "Back", "Circular", "Cubic", "Expotential", "Quad", "Quart", "Sine"];
        tweenings.forEach(tweening => {
            let option = document.createElement("option");
            option.value = tweening;
            option.text = tweening;
            if (tweening === this._tweening) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });

        dropdown.onchange = (event) => {
            this._tweening = (event.target as HTMLSelectElement).value;
        }

        parent.appendChild(dropdown);
    }

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