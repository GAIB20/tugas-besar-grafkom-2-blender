import {Node} from "../node.ts"
import {UniformSet} from "../../types/web-gl.ts";
import {ILight} from "../../interfaces/light.ts";

export type LightOptions = {
    color?: Color;
    uniforms?: UniformSet;
};
export class Light extends Node {
    private _uniforms: UniformSet = {};
    private _color: Color = [1.0, 1.0, 1.0, 1.0];


    constructor(name: string, options?: LightOptions) {
        super(name);
        const { color, uniforms } = options || {};
        this._uniforms = uniforms || this._uniforms;
        this._uniforms['lightColor'] = color || this._color; // La
    }


    get color() { return this._color; }
    get uniforms() { return this._uniforms; }

    set color(color: Color) {
        this._color = color;
        this._uniforms['lightColor'] = color;
    }

    toObjectLight(): ILight {
        throw new Error("Light.toObjectLight() must be implemented in derived classes.");
    }
}
