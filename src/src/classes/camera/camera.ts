import {Node} from "../node.ts"
import {M4} from "../../libs/m4.ts";
import {ICamera} from "../../interfaces/camera.ts";

export class Camera extends Node {
    protected _projectionMatrix = M4.identity();
    private _invWorldMatrix = M4.identity();


    computeWorldMatrix() {
        super.computeWorldMatrix();
        this._invWorldMatrix = M4.inverse(this.worldMatrix);
    }

    get viewProjectionMatrix() {
        this.computeWorldMatrix();
        return M4.multiply(this._projectionMatrix, this._invWorldMatrix)
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }


    computeProjectionMatrix() {
        throw new Error("Camera.computeProjectionMatrix() must be implemented in derived classes.");
    }

    toObjectCamera(): ICamera {
        throw new Error("Camera.toObjectCamera() must be implemented in derived classes.");
    }
}
