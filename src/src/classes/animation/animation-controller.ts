import { Keyframe } from "./keyframe"
import { Node } from "../node"
import fs from 'fs';

interface Frame {
    Keyframes: Keyframe[];
}

export class AnimatorController {

    private _playing: boolean = false;
    private _frames: Frame[] = [];
    private _currentFrame: number = 0;
    private _objectRoot: Node;
    fps: number = 30;

    constructor(root : Node, animFilePath : string) {
        const json = this.load(animFilePath);
        this.loadFrames(json);

        this._objectRoot = root;
    }

    update(secElapsed: number) {
        if (this._playing) {
            this._currentFrame += secElapsed * this.fps;
            this._currentFrame = Math.floor(this._currentFrame);
            this._currentFrame %= this._frames.length;

            this.animateNode();
            // does it need to drawscene? mungkin drawscene di main.ts
        }
    }

    animateNode(){
        const frame = this._frames[this._currentFrame];

        for (let i = 0; i < frame.Keyframes.length; i++) {
            const keyframe = frame.Keyframes[i];
            const node = this._objectRoot.findNodeById(keyframe.nodeId);
            if (node) {
                node.translation = keyframe.translation;
                node.rotation = keyframe.rotation;
                node.scale = keyframe.scale;
            } else {
                console.error(`Node with id ${keyframe.nodeId} not found`);
            
            }
        }
        
    }

    loadFrames(json : any) {
        for (let i = 0; i < json.frames.length; i++) {
            const frame = json.frames[i];
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