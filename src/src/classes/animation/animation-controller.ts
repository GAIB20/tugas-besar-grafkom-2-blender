import { Keyframe } from "./keyframe"
import { Node } from "../node"
import fs from 'fs';

interface Frame {
    Keyframes: Keyframe[];
}

export class AnimationController {

    private _playing: boolean = false;
    private _frames: Frame[] = [];
    private _currentFrame: number = 0;
    private _objectRoot: Node;
    private _deltaFrame: number = 0;
    fps: number = 24;
    speed: number = 0.6;

    constructor(root : Node, animFilePath : string) {
        fetch(animFilePath)
            .then(response => response.json())
            .then(json => this.loadFrames(json))
            .catch(error => console.error('Error:', error));

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
                this._currentFrame = (this._currentFrame + Math.floor(this._deltaFrame)) % this._frames.length;
                
                this._deltaFrame %= 1;
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
        console.log("frame played: ", this._currentFrame);

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

    load(animFilePath : string) {
        const data = fs.readFileSync(animFilePath, 'utf8');
        return JSON.parse(data);
    }


}