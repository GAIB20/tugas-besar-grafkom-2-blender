import {phongFrag, phongVert} from "../shaders/phong";
import {ShaderMaterial} from "./shader-material";

type PhongMaterialOptions = {
    color: Color;
    shininess?: number;
    ambientColor?: Color;
    specularColor?: Color;
}

export class PhongMaterial extends ShaderMaterial {
    #color: Color;
    #shininess: number;
    #ambientColor: Color;
    #specularColor: Color;

    constructor(options?: PhongMaterialOptions) {
        const {color, shininess, ambientColor, specularColor} = options || {};
        super({
            vertexShader: phongVert,
            fragmentShader: phongFrag,
            uniforms: {
                color: color || [0, 0, 0, 1],
                shininess: shininess || 100,
                ambientColor: ambientColor || [0, 0, 0, 1],
                specularColor: specularColor || [1, 1, 1, 1]
            }
        })
        this.#color = this.uniforms['color'] as Color;
        this.#shininess = this.uniforms['shininess'] as number;
        this.#ambientColor = this.uniforms['ambientColor'] as Color;
        this.#specularColor = this.uniforms['specularColor'] as Color;
    }

    get color() {
        return this.#color;
    }

    get shininess() {
        return this.#shininess
    }

    get ambientColor() {
        return this.#ambientColor
    }

    get specularColor() {
        return this.#specularColor
    }

    set color(color: [number, number, number, number]) {
        this.#color = color;
        this.uniforms['color'] = color;
    }

    set ambientColor(ambientColor: [number, number, number, number]) {
        this.#ambientColor = ambientColor;
        this.uniforms['ambientColor'] = ambientColor;
    }

    set specularColor(specularColor: [number, number, number, number]) {
        this.#specularColor = specularColor;
        this.uniforms['specularColor'] = specularColor;
    }

    set shininess(shininess: number) {
        this.#shininess = shininess;
        this.uniforms['shininess'] = shininess;
    }
}
