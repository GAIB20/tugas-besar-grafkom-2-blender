import { phongFrag, phongVert } from "../shaders/phong";
import { Color } from "./color";
import { ShaderMaterial } from "./shader-material";

type PhongMaterialOptions = {
    color: Color;
}

export class PhongMaterial extends ShaderMaterial {
    #color: Color;

    constructor(options?: PhongMaterialOptions) {
        const { color } = options || {};
        super({
            vertexShader: phongVert,
            fragmentShader: phongFrag,
            uniforms: {
                color: color || Color.white(),
            }
        })
        this.#color = this.uniforms['color'] as Color;
    }

    get color() { return this.#color; }
}
