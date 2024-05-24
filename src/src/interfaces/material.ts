interface IBasicMaterial {
    type: 'basic'
    color: [number, number, number, number]
}

interface IPhongMaterial {
    type: 'phong'
    color: [number, number, number, number]
    shininess: number;
    ambientColor: [number, number, number, number];
    specularColor: [number, number, number, number];
    diffuseTexture: number;
    specularTexture: number;
    normalTexture: number;
    displacementTexture: number;
    displacementFactor: number;
    displacementBias: number;
}

export type IMaterial = IBasicMaterial | IPhongMaterial;