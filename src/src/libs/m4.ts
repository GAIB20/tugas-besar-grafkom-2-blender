import {Vector3} from "./vector3.ts";

export class M4 {
    constructor() {
        for (let i = 0; i < 16; i++) {
            this[i] = 0;
        }
    }

    get matrix(): number[] {
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

    static transpose(m: M4): M4 {
        const result = new M4();
        result[0] = m[0];
        result[1] = m[4];
        result[2] = m[8];
        result[3] = m[12];
        result[4] = m[1];
        result[5] = m[5];
        result[6] = m[9];
        result[7] = m[13];
        result[8] = m[2];
        result[9] = m[6];
        result[10] = m[10];
        result[11] = m[14];
        result[12] = m[3];
        result[13] = m[7];
        result[14] = m[11];
        result[15] = m[15];
        return result;
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
        let a00 = a[0 * 4 + 0];
        let a01 = a[0 * 4 + 1];
        let a02 = a[0 * 4 + 2];
        let a03 = a[0 * 4 + 3];
        let a10 = a[1 * 4 + 0];
        let a11 = a[1 * 4 + 1];
        let a12 = a[1 * 4 + 2];
        let a13 = a[1 * 4 + 3];
        let a20 = a[2 * 4 + 0];
        let a21 = a[2 * 4 + 1];
        let a22 = a[2 * 4 + 2];
        let a23 = a[2 * 4 + 3];
        let a30 = a[3 * 4 + 0];
        let a31 = a[3 * 4 + 1];
        let a32 = a[3 * 4 + 2];
        let a33 = a[3 * 4 + 3];
        let b00 = b[0 * 4 + 0];
        let b01 = b[0 * 4 + 1];
        let b02 = b[0 * 4 + 2];
        let b03 = b[0 * 4 + 3];
        let b10 = b[1 * 4 + 0];
        let b11 = b[1 * 4 + 1];
        let b12 = b[1 * 4 + 2];
        let b13 = b[1 * 4 + 3];
        let b20 = b[2 * 4 + 0];
        let b21 = b[2 * 4 + 1];
        let b22 = b[2 * 4 + 2];
        let b23 = b[2 * 4 + 3];
        let b30 = b[3 * 4 + 0];
        let b31 = b[3 * 4 + 1];
        let b32 = b[3 * 4 + 2];
        let b33 = b[3 * 4 + 3];
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
        m4[5] = 2 / height;
        m4[10] = -2 / depth;
        m4[12] = 0;
        m4[13] = 0;
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



    static inverse(m: M4): M4 {
        let m00 = m[0 * 4 + 0];
        let m01 = m[0 * 4 + 1];
        let m02 = m[0 * 4 + 2];
        let m03 = m[0 * 4 + 3];
        let m10 = m[1 * 4 + 0];
        let m11 = m[1 * 4 + 1];
        let m12 = m[1 * 4 + 2];
        let m13 = m[1 * 4 + 3];
        let m20 = m[2 * 4 + 0];
        let m21 = m[2 * 4 + 1];
        let m22 = m[2 * 4 + 2];
        let m23 = m[2 * 4 + 3];
        let m30 = m[3 * 4 + 0];
        let m31 = m[3 * 4 + 1];
        let m32 = m[3 * 4 + 2];
        let m33 = m[3 * 4 + 3];
        let tmp_0 = m22 * m33;
        let tmp_1 = m32 * m23;
        let tmp_2 = m12 * m33;
        let tmp_3 = m32 * m13;
        let tmp_4 = m12 * m23;
        let tmp_5 = m22 * m13;
        let tmp_6 = m02 * m33;
        let tmp_7 = m32 * m03;
        let tmp_8 = m02 * m23;
        let tmp_9 = m22 * m03;
        let tmp_10 = m02 * m13;
        let tmp_11 = m12 * m03;
        let tmp_12 = m20 * m31;
        let tmp_13 = m30 * m21;
        let tmp_14 = m10 * m31;
        let tmp_15 = m30 * m11;
        let tmp_16 = m10 * m21;
        let tmp_17 = m20 * m11;
        let tmp_18 = m00 * m31;
        let tmp_19 = m30 * m01;
        let tmp_20 = m00 * m21;
        let tmp_21 = m20 * m01;
        let tmp_22 = m00 * m11;
        let tmp_23 = m10 * m01;

        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        let result = new M4()

        result[0] = d * t0;
        result[1] = d * t1;
        result[2] = d * t2;
        result[3] = d * t3;
        result[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        result[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        result[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        result[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        result[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        result[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        result[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        result[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        result[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        result[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        result[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        result[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))

        return result;
    }

    static lookAt(position: Vector3, target: Vector3, up: Vector3): M4 {
        const zAxis = position.subtract(target).normalize();
        const xAxis = up.cross(zAxis).normalize();
        const yAxis = zAxis.cross(xAxis).normalize();

        let result = new M4();
        result[0] = xAxis[0];
        result[1] = xAxis[1];
        result[2] = xAxis[2];
        result[3] = 0;
        result[4] = yAxis[0];
        result[5] = yAxis[1];
        result[6] = yAxis[2];
        result[7] = 0;
        result[8] = zAxis[0];
        result[9] = zAxis[1];
        result[10] = zAxis[2];
        result[11] = 0;
        result[12] = position[0];
        result[13] = position[1];
        result[14] = position[2];
        result[15] = 1;

        return result;
    }

    static orthographic(width: number, height: number, near: number, far: number): M4 {
        let result = new M4();
        result[0] = 2 / width;
        result[5] = 2 / height;
        result[10] = 2 / (near - far);
        result[14] = (near + far) / (near - far);
        result[15] = 1;

        return result;
    }

    static perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        let rangeInv = 1.0 / (near - far);

        let result = new M4()
        result[0]  = f / aspect
        result[5] = f
        result[10] = (near + far) * rangeInv
        result[11] = -1
        result[14] = near * far * rangeInv * 2

        return result;
    }

    static oblique(width: number, height: number, near: number, far: number, angleXInRadians: number, angleYInRadians: number) {
        const STMatrix = M4.orthographic(width, height, near, far);

        let shearMatrix = M4.identity()
        const shearX = 1 / Math.tan(angleXInRadians);
        const shearY = 1 / Math.tan(angleYInRadians);
        shearMatrix[8] = shearX
        shearMatrix[9] = shearY

        return this.multiply(shearMatrix, STMatrix);
    }

}