import { basicVert, basicFrag } from "../shaders/basic";
import { Color } from "./color";
import { ShaderMaterial } from "./shader-material";

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
                color: color || Color.white(),
            }
        })
        this.#color = this.uniforms['color'] as Color;
    }

    get color() { return this.#color; }
}
