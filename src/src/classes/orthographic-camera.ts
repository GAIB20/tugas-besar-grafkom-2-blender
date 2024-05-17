import { Node } from "./node.ts";
import {M4} from "../libs/m4.ts";

export class OrthographicProjection extends Node {
  private _left: number;
  private _right: number;
  private _top: number;
  private _bottom: number;
  private _near: number;
  private _far: number;

  constructor(
    name: string,
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ) {
    super(name);
    this._left = left;
    this._right = right;
    this._top = top;
    this._bottom = bottom;
    this._near = near;
    this._far = far;
  }

  get left() {
    return this._left;
  }

  get right() {
    return this._right;
  }

  get top() {
    return this._top;
  }

  get bottom() {
    return this._bottom;
  }

  get near() {
    return this._near;
  }

  get far() {
    return this._far;
  }

  computeProjectionMatrix(): M4 {
    // implementasi

    throw new Error("Method not implemented.");
  }
}