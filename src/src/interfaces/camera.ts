interface IOrthographic {
    width: number,
    height: number,
    near: number,
    far: number
}

interface IPerspective {
    fovY: number,
    aspect: number,
    near: number,
    far: number
}

interface IOblique {
    width: number,
    height: number,
    near: number,
    far: number
    angleX: number
    angleY: number
}


export interface ICamera {
    type: 'orthographic' | 'perspective' | 'oblique',
    orthographic?: IOrthographic,
    perspective?: IPerspective
    oblique?: IOblique
}