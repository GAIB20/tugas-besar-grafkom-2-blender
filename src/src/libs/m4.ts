import {Vector3} from "../libs/vector3.ts";

export class M4 {
    constructor() {
        for (let i = 0; i < 16; i++) {
            this[i] = 0;
        }
    }
    get matrix() {
        let data = new Array(16).fill(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = this[i];
        }
        return data
    }

    static identity(): M4 {
        const m4 = new M4();
        m4[0] = m4[5] = m4[10] = m4[15] = 1;
        return m4;
    }

    [index: number]: number;

    get length(): number {
        return 16;
    }

    static translation3d(translation: Vector3): M4 {
        const m4 = M4.identity();
        m4[12] = translation[0];
        m4[13] = translation[1];
        m4[14] = translation[2];
        return m4;
    }

    static scale3d(scaling: Vector3): M4 {
        const m4 = M4.identity();
        m4[0] = scaling[0];
        m4[5] = scaling[1];
        m4[10] = scaling[2];
        return m4;
    }

    static rotationX(angleInRadians: number): M4 {
        const m4 = M4.identity();
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        m4[5] = c;
        m4[6] = s;
        m4[9] = -s;
        m4[10] = c;
        return m4;
    }

    static rotationY(angleInRadians: number): M4 {
        const m4 = M4.identity();
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        m4[0] = c;
        m4[2] = -s;
        m4[8] = s;
        m4[10] = c;
        return m4;
    }

    static rotationZ(angleInRadians: number): M4 {
        const m4 = M4.identity();
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        m4[0] = c;
        m4[1] = s;
        m4[4] = -s;
        m4[5] = c;
        return m4;
    }

    static rotation3d(rotation: Vector3): M4 {
        const res = M4.multiply(M4.rotationX(rotation[0]), M4.rotationY(rotation[1]))
        return M4.multiply(res, M4.rotationZ(rotation[2]))
    }

    static multiply(a: M4, b: M4) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        let result = new M4();
        result[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        result[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        result[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        result[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        result[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        result[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        result[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        result[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        result[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        result[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        result[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        result[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        result[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        result[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        result[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        result[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return result;
    }

    static projection(width: number, height: number, depth: number): M4 {
        const m4 = new M4();
        m4[0] = 2 / width;
        m4[5] = -2 / height;
        m4[10] = 2 / depth;
        m4[12] = -1;
        m4[13] = 1;
        m4[15] = 1;
        return m4;
    }

    clone(): M4 {
        const clonedM4 = new M4();
        for (let i = 0; i < this.length; i++) {
            clonedM4[i] = this[i];
        }
        return clonedM4;
    }
}