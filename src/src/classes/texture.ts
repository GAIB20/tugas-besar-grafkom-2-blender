type TextureData = HTMLImageElement | Uint8Array;
type TextureDataInput = string | TextureData;
type ValueOf<T> = T[keyof T];
// Lihat MSDN texParameter[fi] untuk informasi lebih lanjut.
export const WrapMode = Object.freeze({
    ClampToEdge         : WebGLRenderingContext.CLAMP_TO_EDGE,
    Repeat              : WebGLRenderingContext.REPEAT,
    MirroredRepeat      : WebGLRenderingContext.MIRRORED_REPEAT,
})
export const MagFilter = Object.freeze({
    Nearest             : WebGLRenderingContext.NEAREST,
    Linear              : WebGLRenderingContext.LINEAR,
})
export const MinFilter = Object.freeze({
    Nearest             : WebGLRenderingContext.NEAREST,
    Linear              : WebGLRenderingContext.LINEAR,
    NearestMipmapNearest: WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
    NearestMipmapLinear : WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
    LinearMipmapNearest : WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
    LinearMipmapLinear  : WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
})
// Lihat MSDN texImage2D untuk informasi lebih lanjut.
export const ImageFormat = Object.freeze({
    RGBA                : WebGLRenderingContext.RGBA,
    RGB                 : WebGLRenderingContext.RGB,
    LuminanceAlpha      : WebGLRenderingContext.LUMINANCE_ALPHA,
    Luminance           : WebGLRenderingContext.LUMINANCE,
})
export const ImageType = Object.freeze({
    UnsignedByte        : WebGLRenderingContext.UNSIGNED_BYTE,
    UnsignedShort4444   : WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4,
    UnsignedShort5551   : WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1,
    UnsignedShort565    : WebGLRenderingContext.UNSIGNED_SHORT_5_6_5,
})


export class Texture {
    private _img = new Image();
    private _data?: TextureData;
    private _callbackFn?: Function;
    private _width: number = 0;
    private _height: number = 0;
    private _defaultColor: Color = [1, 1, 1];

    public wrapS: ValueOf<typeof WrapMode> = WrapMode.Repeat;
    public wrapT: ValueOf<typeof WrapMode> = WrapMode.Repeat;
    public minFilter: ValueOf<typeof MinFilter> = MinFilter.NearestMipmapLinear;
    public magFilter: ValueOf<typeof MagFilter> = MagFilter.Linear;
    public format: ValueOf<typeof ImageFormat> = ImageFormat.RGBA;
    public type: ValueOf<typeof ImageType> = ImageType.UnsignedByte;

    // JANGAN DIUBAH! Hanya untuk renderer.
    public _texture: WebGLTexture | null = null;
    // JANGAN DIUBAH! Hanya untuk renderer.
    public needsUpload = true;
    // Ubah parameter tekstur di awal minimal sekali.
    public parameterChanged = true;


    get isLoaded() { return this._data !== undefined; }
    // Default color dipakai ketika tidak ada data
    get defaultColor() { return this._defaultColor; }
    get width() { return this._width; }
    get height() { return this._height; }
    get data() { return this._data; }


    constructor() {
        this._setLoader(this._img);
    }


    private _setLoader(image: HTMLImageElement) {
        image.onload = () => {
            this._data = this._img;
            this._callbackFn?.call(this);
            this.needsUpload = true;
        };
    }


    setData(data: string): void;
    setData(data: HTMLImageElement): void;
    setData(data: Uint8Array, width: number, height: number): void;
    setData(data?: TextureDataInput, width?: number, height?: number): void {
        if (typeof data === 'string') {
            this._img.src = data;
        } else {
            this._img.src = '';
            this._data = data;
            if (data === undefined) {
                this._data = undefined;
            } else if (data instanceof Uint8Array) {
                this._width = width!;
                this._height = height!;
            } else if (data instanceof HTMLImageElement) {
                // Asumsi gambar sudah ke load.
                this._data = data;
            }
        }
        this.needsUpload = true;
    }


    onLoad(callbackFn: Function) { this._callbackFn = callbackFn; }
}
