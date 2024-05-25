import {M4} from "../../libs/m4.ts";
import {Camera} from "./camera.ts";
import {ICamera} from "../../interfaces/camera.ts";

export class ObliqueCamera extends Camera {
    private _width: number;
    private _height: number;
    private _near: number;
    private _far: number;
    private _angleX: number;
    private _angleY: number;

    constructor(
        name: string,
        width: number,
        height: number,
        near: number,
        far: number,
        angleX: number,
        angleY: number,
    ) {
        super(name);
        this._width = width;
        this._height = height;
        this._near = near;
        this._far = far;
        this._angleX = angleX
        this._angleY = angleY
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get near() {
        return this._near;
    }

    get far() {
        return this._far;
    }

    get angleX() {
        return this._angleX
    }

    get angleY() {
        return this._angleY
    }

    computeProjectionMatrix() {
        this._projectionMatrix = M4.oblique(this.width, this.height, -this.near, -this.far, this.angleX, this.angleY);
    }

    toObjectCamera(): ICamera {
        return {
            type: 'orthographic',
            orthographic: {
                near: this.near,
                far: this.far,
                width: this.width,
                height: this.height
            }
        }
    }
}