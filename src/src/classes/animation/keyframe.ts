import { Vector3 } from '../../libs/vector3.ts';

interface KeyframeData {
    nodeId: number;
    translation: Vector3;
    rotation: Vector3;
    scale: Vector3;
}

export class Keyframe {
    
    nodeId: number = 0;
    translation: Vector3 | undefined = undefined;
    rotation: Vector3 | undefined = undefined;
    scale: Vector3 | undefined = undefined;

    constructor(nodeIdOrData?: number | KeyframeData, translation?: Vector3, rotation?: Vector3, scale?: Vector3) {
        if (typeof nodeIdOrData === 'number') {
            this.nodeId = nodeIdOrData;
            this.translation = translation!;
            this.rotation = rotation!;
            this.scale = scale!;
        } else if (nodeIdOrData) {
            this.nodeId = nodeIdOrData.nodeId;
            if(nodeIdOrData.translation){
                this.translation = new Vector3(
                    nodeIdOrData.translation.x,
                    nodeIdOrData.translation.y,
                    nodeIdOrData.translation.z);
            }
            if(nodeIdOrData.rotation){
                this.rotation = new Vector3(
                    nodeIdOrData.rotation.x,
                    nodeIdOrData.rotation.y,
                    nodeIdOrData.rotation.z);
            }
            if(nodeIdOrData.scale){
                this.scale = new Vector3(
                    nodeIdOrData.scale.x,
                    nodeIdOrData.scale.y,
                    nodeIdOrData.scale.z);
            }
        }
    }

    


}