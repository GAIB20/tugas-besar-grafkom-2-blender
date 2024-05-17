import {
    AttributeDataType,
    AttributeMapSetters,
    AttributeSetters,
    AttributeSingleDataType,
    ProgramInfo, UniformDataType, UniformMapSetters, UniformSetters, UniformSetterWebGLType, UniformTypes
} from "../types/web-gl.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    let multiplier = 1;
    const width = canvas.clientWidth * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
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
                }
                else {
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
    if (attributeName in setters) {
        const shaderName = `a_${attributeName}`;
        setters[shaderName](...data);
    }
}
export function setAttributes(
    programInfo: ProgramInfo,
    attributes: {[attributeName: string]: AttributeSingleDataType},
) {
    for (let attributeName in attributes)
        setAttribute(programInfo, attributeName, attributes[attributeName]);
}

function createUniformSetters(
    gl: WebGLRenderingContext,
    program: WebGLProgram
): UniformMapSetters {
    function createUniformSetter(info: WebGLActiveInfo): UniformSetters {
        // Initialization Time
        const loc = gl.getUniformLocation(program, info.name);
        return (uniformType: UniformTypes, ...values) => {
            const v = values[0];
            if (Array.isArray(v)) {
                // @ts-ignore
                gl[`uniform${UniformSetterWebGLType[uniformType]}`](
                    loc,
                    false,
                    v
                );
            } else {
                // @ts-ignore
                gl[`uniform${UniformSetterWebGLType[uniformType]}`](
                    loc,
                    ...values
                );
            }
        };
    }

    const uniformSetters: UniformMapSetters = {};
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) continue;
        uniformSetters[info.name] = createUniformSetter(info);
    }
    return uniformSetters;
}

export function setUniform(
    programInfo: ProgramInfo,
    uniformName: string,
    uniformType: UniformTypes,
    ...data: UniformDataType
) {
    const uniforms = programInfo.uniformSetters;
    const shaderName = `u_${uniformName}`;
    if (shaderName in uniforms) {
        uniforms[shaderName](uniformType, ...data);
    }
}

export function createProgramInfo(
    gl: WebGLRenderingContext,
    program: WebGLProgram
): ProgramInfo {
    return {
        gl,
        program,
        attributeSetters: createAttributeSetters(gl, program),
        uniformSetters: createUniformSetters(gl, program),
    };
}
