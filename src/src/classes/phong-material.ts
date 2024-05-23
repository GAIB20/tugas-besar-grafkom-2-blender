import {phongFrag, phongVert} from "../shaders/phong";
import {ShaderMaterial} from "./shader-material";
import {Texture} from "./texture.ts";

type PhongMaterialOptions = {
    color: Color;
    shininess?: number;
    ambientColor?: Color;
    specularColor?: Color;
    diffuseTexture: Texture;
    specularTexture: Texture;
}

export class PhongMaterial extends ShaderMaterial {
    #color: Color;
    #shininess: number;
    #ambientColor: Color;
    #specularColor: Color;

    #diffuseTexture: Texture;
    #specularTexture: Texture;

    constructor(options: PhongMaterialOptions) {
        const {color, shininess, ambientColor, specularColor, diffuseTexture, specularTexture} = options || {};
        super({
            vertexShader: phongVert,
            fragmentShader: phongFrag,
            uniforms: {
                color: color || [0, 0, 0, 1],
                shininess: shininess || 100,
                ambientColor: ambientColor || [0, 0, 0, 1],
                specularColor: specularColor || [1, 1, 1, 1],
                diffuseTexture: diffuseTexture,
                specularTexture: specularTexture
            }
        })
        this.#color = this.uniforms['color'] as Color;
        this.#shininess = this.uniforms['shininess'] as number;
        this.#ambientColor = this.uniforms['ambientColor'] as Color;
        this.#specularColor = this.uniforms['specularColor'] as Color;
        this.#diffuseTexture = this.uniforms['diffuseTexture'] as Texture;
        this.#specularTexture = this.uniforms['specularTexture'] as Texture;
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

    get diffuseTexture() {
        return this.#diffuseTexture
    }
    get specularTexture() {
        return this.#specularTexture
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

    set diffuseTexture(texture: Texture) {
        this.#diffuseTexture = texture;
        this.uniforms['diffuseTexture'] = texture;
    }

    set specularTexture(texture: Texture) {
        this.#specularTexture = texture;
        this.uniforms['specularTexture'] = texture;
    }
}
