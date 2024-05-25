import { M4 } from "../../libs/m4.ts";
import {Camera} from "./camera.ts";

export class PerspectiveCamera extends Camera {
  private _fovY: number;
  private _aspect: number;
  private _near: number;
  private _far: number;

  constructor(
    name: string,
    fovY: number,
    aspect: number,
    near: number,
    far: number
  ) {
    super(name);
    this._fovY = fovY;
    this._aspect = aspect;
    this._near = near;
    this._far = far;
  }

  get fovY() {
    return this._fovY;
  }

  get aspect() {
    return this._aspect;
  }

  get near() {
    return this._near;
  }

  get far() {
    return this._far;
  }

  computeProjectionMatrix(): M4 {
    // Implementasi
    
    throw new Error("Method not implemented.");
  }
}