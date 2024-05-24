export interface IMesh {
    attributes: { [name: string]: number },
    material: 'basic' | 'phong',
    basicMaterial: number,
    phongMaterial: number
}