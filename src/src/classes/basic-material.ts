import { basicVert, basicFrag } from "../shaders/basic";
import { ShaderMaterial } from "./shader-material";
import {IBasicMaterial} from "../interfaces/material.ts";

type BasicMaterialOptions = {
    color: Color;
}

export class BasicMaterial extends ShaderMaterial {
    #color: Color;

    constructor(options?: BasicMaterialOptions) {
        const { color } = options || {};
        super({
            vertexShader: basicVert,
            fragmentShader: basicFrag,
            uniforms: {
                color: color || [1.0, 1.0, 1.0],
            }
        })
        this.#color = this.uniforms['color'] as Color;
    }

    get color() { return this.#color; }

    set color(color: [number, number, number, number]) {
        this.#color = color;
        this.uniforms['color'] = color;
    }

    toObject(): IBasicMaterial {
        return {
            type: 'basic',
            color: this.color
        }
    }
}
