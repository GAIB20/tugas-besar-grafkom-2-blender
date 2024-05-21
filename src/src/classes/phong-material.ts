import { phongFrag, phongVert } from "../shaders/phong";
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
                color: color || [0, 0, 0, 1],
            }
        })
        this.#color = this.uniforms['color'] as Color;
    }

    get color() { return this.#color; }

    set color(color: [number, number, number, number]) {
        this.#color = color;
        this.uniforms['color'] = color;
    }
}
