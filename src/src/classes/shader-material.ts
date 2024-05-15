type UniformType = Iterable<number>;
type UniformSet<T = UniformType> = { [key: string]: T };
type ShaderMaterialOptions = {
    vertexShader: string;
    fragmentShader: string;
    uniforms?: UniformSet;
};

export class ShaderMaterial {
    static #idCounter = 0;

    private readonly _id: string = "M" + (ShaderMaterial.#idCounter++);
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
    }

    get id() { return this._id; }
    get vertexShader() { return this._vertexShader; }
    get fragmentShader() { return this._fragmentShader; }
    get uniforms() { return this._uniforms; }

    equals(material: ShaderMaterial) {
        return this._id == material._id;
    }
}
