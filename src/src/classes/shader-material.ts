import {UniformSet} from "../types/web-gl.ts";
import {IMaterial} from "../interfaces/material.ts";

type ShaderMaterialOptions = {
    vertexShader: string;
    fragmentShader: string;
    uniforms?: UniformSet;
};

export class ShaderMaterial {
    static Materials: ShaderMaterial[] = [];
    static idCounter = 0;

    private readonly _id: string = "M" + (ShaderMaterial.idCounter++);
    private readonly _vertexShader: string;
    private readonly _fragmentShader: string;
    private _uniforms: UniformSet = {};

    /**
     * Create new instance of shader material.
     */
    constructor(options: ShaderMaterialOptions) {
        const { vertexShader, fragmentShader, uniforms } = options;
        this._vertexShader = vertexShader;
        this._fragmentShader = fragmentShader;
        this._uniforms = uniforms || this._uniforms;
        ShaderMaterial.Materials.push(this);
    }

    get id() { return this._id; }
    get vertexShader() { return this._vertexShader; }
    get fragmentShader() { return this._fragmentShader; }
    get uniforms() { return this._uniforms; }

    equals(material: ShaderMaterial) {
        return this._id == material._id;
    }

    toObject(): IMaterial {
        throw new Error("ShaderMaterial.toObjectCamera() must be implemented in derived classes.");
    }
}
