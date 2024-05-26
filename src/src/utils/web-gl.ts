import {
    AttributeDataType,
    AttributeMapSetters,
    AttributeSetters,
    AttributeSingleDataType,
    ProgramInfo, UniformDataType, UniformMapSetters, UniformSetters, UniformSetterWebGLType
} from "../types/web-gl.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {Texture} from "../classes/texture.ts";

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    const dpr = window.devicePixelRatio;
    const { width, height } = canvas.getBoundingClientRect();
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);
    const needResize =
        gl.canvas.width != displayWidth || gl.canvas.height != displayHeight;

    if (needResize) {
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    return needResize
}

export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
    let shader = gl.createShader(type);
    if (!shader) {
        return;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}


export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (!program) {
        return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}

export function bindBuffer(gl: WebGLRenderingContext, arr: Float32Array, buffer: WebGLBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
}

export function degToRad(d: number) {
    return d * Math.PI / 180;
}

export function radToDeg(r: number) {
    return r * 180 / Math.PI;
}

export function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function emod(x: number, n: number) {
    return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
}

function createAttributeSetters(gl: WebGLRenderingContext, program: WebGLProgram): AttributeMapSetters {
    function createAttributeSetter(info: WebGLActiveInfo): AttributeSetters {
        // Initialization Time
        const loc = gl.getAttribLocation(program, info.name);
        const buf = gl.createBuffer();
        return (...values) => {
            // Render Time (saat memanggil setAttributes() pada render loop)
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            const v = values[0];
            if (v instanceof BufferAttribute) {
                if (v.isDirty) {
                    // Data Changed Time (note that buffer is already binded)
                    gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);
                    v.consume();
                }
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, v.size, v.dtype, v.normalize, v.stride, v.offset);
            } else {
                gl.disableVertexAttribArray(loc);
                if (v instanceof Float32Array) {
                    // @ts-ignore
                    gl[`vertexAttrib${v.length}fv`](loc, v);
                } else {
                    // @ts-ignore
                    gl[`vertexAttrib${values.length}f`](loc, ...values);
                }
            }
        }
    }


    const attribSetters: AttributeMapSetters = {};
    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; i++) {
        const info = gl.getActiveAttrib(program, i);
        if (!info) continue;

        attribSetters[info.name] = createAttributeSetter(info);
    }
    return attribSetters;
}

function setAttribute(programInfo: ProgramInfo, attributeName: string, ...data: AttributeDataType) {
    const setters = programInfo.attributeSetters;
    const shaderName = `a_${attributeName}`;
    if (shaderName in setters) {
        setters[shaderName](...data);
    }
}

export function setAttributes(
    programInfo: ProgramInfo,
    attributes: { [attributeName: string]: AttributeSingleDataType },
) {
    for (let attributeName in attributes)
        setAttribute(programInfo, attributeName, attributes[attributeName]);
}

// function createUniformSetters(
//     gl: WebGLRenderingContext,
//     program: WebGLProgram
// ): UniformMapSetters {
//     function createUniformSetter(info: WebGLActiveInfo): UniformSetters {
//         // Initialization Time
//         const loc = gl.getUniformLocation(program, info.name);
//         return (uniformType: UniformTypes, ...values) => {
//             const v = values[0];
//             if (Array.isArray(v)) {
//                 // @ts-ignore
//                 gl[`uniform${UniformSetterWebGLType[uniformType]}`](
//                     loc,
//                     false,
//                     v
//                 );
//             } else {
//                 // @ts-ignore
//                 gl[`uniform${UniformSetterWebGLType[uniformType]}`](
//                     loc,
//                     ...values
//                 );
//             }
//         };
//     }
//
//     const uniformSetters: UniformMapSetters = {};
//     const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
//     for (let i = 0; i < numUniforms; i++) {
//         const info = gl.getActiveUniform(program, i);
//         if (!info) continue;
//         uniformSetters[info.name] = createUniformSetter(info);
//     }
//     return uniformSetters;
// }
//
// export function setUniform(
//     programInfo: ProgramInfo,
//     uniformName: string,
//     uniformType: UniformTypes,
//     ...data: UniformDataType
// ) {
//     const uniforms = programInfo.uniformSetters;
//     const shaderName = `u_${uniformName}`;
//     if (shaderName in uniforms) {
//         uniforms[shaderName](uniformType, ...data);
//     }
// }

function isPowerOf2(value: number) {
    return (value & (value - 1)) == 0;
}
function createUniformSetters(gl: WebGLRenderingContext, program: WebGLProgram): UniformMapSetters {
    let textureUnit = 0; // Penghitung tekstur unit yang saat ini digunakan
    function createUniformSetter(name: string, isArray: boolean, info: WebGLActiveInfo): UniformSetters {
        // == Initialization Time
        const loc = gl.getUniformLocation(program, name);
        const type = UniformSetterWebGLType[info.type];
        if (info.type == gl.SAMPLER_2D || info.type == gl.SAMPLER_CUBE) {
            // Kasus tekstur
            const unit = textureUnit; // Claim texture unit
            textureUnit += info.size; // info.size > 1 kalau sampler array
            // Fungsi setup tekstur
            const setupTexture = (v: Texture) => {
                v._texture = v._texture || gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, v._texture); // bind tekstur sementara
                const isPOT = isPowerOf2(v.width) && isPowerOf2(v.height);
                if (v.needsUpload) {
                    // Jika butuh upload data, lakukan upload
                    v.needsUpload = false;
                    if (v.isLoaded) {
                        // Sudah load, gaskan upload
                        const param = [gl.TEXTURE_2D, 0, v.format, v.format, v.type, v.data];
                        if (v.data instanceof Uint8Array) // insert w, h, border untuk array
                            param.splice(3, 0, v.width, v.height, 0);
                        // @ts-ignore: agak curang but hey less code it is :)
                        gl.texImage2D(...param);
                        if (isPOT) gl.generateMipmap(gl.TEXTURE_2D);
                    } else {
                        // Belum load / gak ada data
                        gl.texImage2D(
                            gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
                            gl.RGBA, gl.UNSIGNED_BYTE,
                            new Uint8Array(v.defaultColor)
                        );
                    }
                }
                if (v.parameterChanged) {
                    // Jika parameter berubah, lakukan set parameter
                    v.parameterChanged = false;
                    if (!isPOT) {
                        v.wrapS = v.wrapT = gl.CLAMP_TO_EDGE;
                        v.minFilter = gl.LINEAR;
                        console.log("image is not POT, fallback params", v);
                    }
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S    , v.wrapS    );
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T    , v.wrapT    );
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, v.minFilter);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, v.magFilter);
                }
                // gl.bindTexture(gl.TEXTURE_2D, null); // balikkan bind ke null
            }
            const renderTexture = (v: Texture) => {
                // Pilih tekstur unit, bind tekstur ke unit, set uniform sampler ke unit.
                gl.activeTexture(gl.TEXTURE0 + unit);
                gl.bindTexture(gl.TEXTURE_2D, v._texture);
            }
            const render = (v: any) => {
                if (!(v instanceof Texture)) {
                    console.error(`uniform ${info.name}: found not a Texture!`, v);
                    return;
                }
                setupTexture(v); renderTexture(v);
            }
            return (v) => {
                // == Render Time
                if (isArray)
                    if (Array.isArray(v)) {
                        v.forEach(render);
                        gl.uniform1iv(loc, v.map((_, i) => unit+i));
                    }
                    else console.error(
                        `uniform ${info.name} is an array, but your data is not`)
                else {
                    render(v);
                    gl.uniform1i(loc, unit);
                }
            };
        } else {
            return (v) => {
                // == Render Time (akan dipanggil saat setUniform(nama, v))
                // Disini diasumsikan bahwa v adalah number atau number[]
                // Silahkan modifikasi sendiri jika ingin support untuk tipe lain
                if (isArray) {
                    // Uniform merupakan sebuah array e.g. uniform vec3 u_color[3];
                    // v harus berupa array yang sudah di-flatten
                    // e.g.  [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
                    //    -> [ 1, 0, 0,   0, 1, 0,   0, 0, 1]
                    // @ts-ignore
                    gl[`uniform${type}v`](loc, v);
                } else {
                    // Matriks (uniformMatrix[234]fv) memiliki argumen yang berbeda
                    // Argumen kedua adalah transpose. Karena diasumsikan bahwa matriks
                    // v dalam column major, maka transpose = 'false'.
                    // Argumen kedua bisa diset 'true' jika matriks v dalam row major
                    // ( atau lebih baik .transpose() manual sebelum set uniform,
                    //   silahkan lihat Info Penting > Aturan Matriks )
                    if (type.substr(0, 6) === 'Matrix')
                        { // @ts-ignore
                            gl[`uniform${type}`](loc, false, v);
                        }
                    else {
                        // v bisa number atau number[]
                        // Jika v array (uniform[234][fi]), gunakan spread
                        // Jika tidak (uniform1[fi]), langsung pass nilai saja
                        if (Array.isArray(v)) { // @ts-ignore
                            gl[`uniform${type}`](loc, ...v);
                        }
                        else                  { // @ts-ignore
                            gl[`uniform${type}`](loc,    v);
                        }
                    }
                }
            };
        }
    }


    const uniformSetters = {};
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) break; // may break
        let name = info.name; let isArray = false;
        if (name.substr(-3) === '[0]') {
            isArray = true;
            name = name.substring(0, name.length - 3);
        }
        // @ts-ignore
        uniformSetters[name] = createUniformSetter(name, isArray, info);
    }
    return uniformSetters;
}


export function setUniform(programInfo: ProgramInfo, uniformName: string, value: UniformDataType) {
    const setters = programInfo.uniformSetters;
    const shaderName = `u_${uniformName}`;
    if (shaderName in setters) {
        // console.log({shaderName, setters})
        setters[shaderName](value);
    }
}
export function setUniforms(
    programInfo: ProgramInfo,
    uniforms: {[uniformName: string]: UniformDataType},
) {
    for (let uniformName in uniforms)
        setUniform(programInfo, uniformName, uniforms[uniformName]);
}


export function createProgramInfo(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): ProgramInfo | null {
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) {
        return null;
    }
    return {
        program,
        attributeSetters: createAttributeSetters(gl, program),
        uniformSetters: createUniformSetters(gl, program),
    };
}

export function setFramebufferAttachmentSizes(gl: WebGLRenderingContext, width: number, height: number, texture: WebGLTexture, depthBuffer: WebGLRenderbuffer) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // define size and format of level 0
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border,
        format, type, data);

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
}