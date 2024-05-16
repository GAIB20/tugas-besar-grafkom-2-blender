export interface IBuffer {
    data: number[]
}

export interface IBufferView {
    buffer: number,
    byteOffset: number,
    byteLength: number
}

export interface IAccessor {
    bufferView: number,
    byteOffset: number,
    componentType: number,
    count: number
}