interface IPoint {
    attA: number
    attB: number
    attC: number
}


export interface ILight {
    type: 'directional' | 'point',
    point?: IPoint
}