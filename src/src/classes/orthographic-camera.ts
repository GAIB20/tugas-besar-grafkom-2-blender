import {M4} from "../libs/m4.ts";
import {Camera} from "./camera.ts";

export class OrthographicCamera extends Camera {
  private _width: number;
  private _height: number;
  private _near: number;
  private _far: number;

  constructor(
    name: string,
    width: number,
    height: number,
    near: number,
    far: number
  ) {
    super(name);
    this._width = width;
    this._height = height;
    this._near = near;
    this._far = far;
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

  computeProjectionMatrix(): M4 {
    return M4.orthographic(this.width, this.height, this.near, this.far);
  }
}