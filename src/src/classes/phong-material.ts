import {phongFrag, phongVert} from "../shaders/phong";
import {ShaderMaterial} from "./shader-material";
import {Texture} from "./texture.ts";
import {IMaterial} from "../interfaces/material.ts";

type PhongMaterialOptions = {
    color: Color;
    shininess?: number;
    ambientColor?: Color;
    specularColor?: Color;
    diffuseTexture?: Texture;
    specularTexture?: Texture;
    normalTexture?: Texture;
    displacementTexture?: Texture;
    displacementFactor?: number;
    displacementBias?: number;
}

export class PhongMaterial extends ShaderMaterial {
    #color: Color;
    #shininess: number;
    #ambientColor: Color;
    #specularColor: Color;

    #diffuseTexture: Texture;
    #specularTexture: Texture;

    #normalTexture: Texture;
    #displacementTexture: Texture;
    #displacementFactor: number;
    #displacementBias: number;

    constructor(options?: PhongMaterialOptions) {
        const {color, shininess, ambientColor, specularColor, diffuseTexture, specularTexture, normalTexture, displacementTexture, displacementFactor, displacementBias} = options || {};
        let blankTexture = Texture.getBlankTexture();
        super({
            vertexShader: phongVert,
            fragmentShader: phongFrag,
            uniforms: {
                color: color || [0, 0, 0, 1],
                shininess: shininess || 100,
                ambientColor: ambientColor || [0, 0, 0, 1],
                specularColor: specularColor || [1, 1, 1, 1],
                displacementTexture: displacementTexture || Texture.getBlankDisplacementMap(),
                displacementFactor: displacementFactor || 100,
                displacementBias: displacementBias || -60,
                diffuseTexture: diffuseTexture || blankTexture,
                specularTexture: specularTexture || blankTexture,
                normalTexture: normalTexture || Texture.getBlankNormalMap(),
            }
        })
        this.#color = this.uniforms['color'] as Color;
        this.#shininess = this.uniforms['shininess'] as number;
        this.#ambientColor = this.uniforms['ambientColor'] as Color;
        this.#specularColor = this.uniforms['specularColor'] as Color;
        this.#diffuseTexture = this.uniforms['diffuseTexture'] as Texture;
        this.#specularTexture = this.uniforms['specularTexture'] as Texture;
        this.#normalTexture = this.uniforms['normalTexture'] as Texture;
        this.#displacementTexture = this.uniforms['displacementTexture'] as Texture;
        this.#displacementFactor = this.uniforms['displacementFactor'] as number;
        this.#displacementBias = this.uniforms['displacementBias'] as number;
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

    get normalTexture() {
        return this.#normalTexture
    }

    get displacementTexture() {
        return this.#displacementTexture
    }

    get displacementFactor() {
        return this.#displacementFactor
    }

    get displacementBias() {
        return this.#displacementBias
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

    set normalTexture(texture: Texture) {
        this.#normalTexture = texture;
        this.uniforms['normalTexture'] = texture;
    }

    set displacementTexture(texture: Texture) {
        this.#displacementTexture = texture;
        this.uniforms['displacementTexture'] = texture;
    }

    set displacementFactor(factor: number) {
        this.#displacementFactor = factor;
        this.uniforms['displacementFactor'] = factor;
    }

    set displacementBias(bias: number) {
        this.#displacementBias = bias;
        this.uniforms['displacementBias'] = bias;
    }

    toObject(): IMaterial {
        return {
            type: 'phong',
            color: this.color,
            shininess: this.shininess,
            ambientColor: this.ambientColor,
            specularColor: this.specularColor,
            diffuseTexture: this.diffuseTexture.id,
            specularTexture: this.specularTexture.id,
            normalTexture: this.normalTexture.id,
            displacementTexture: this.displacementTexture.id,
            displacementFactor: this.displacementFactor,
            displacementBias: this.displacementBias,
        }
    }
}
