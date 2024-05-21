export class Vector3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }

    // Indexer for direct access to data array
    [index: number]: number;

    get length(): number {
        return 3;
    }

    isEqual(vector3: Vector3) {
        return this[0] === vector3[0] && this[1] === vector3[1] && this[2] === vector3[2]
    }

    toAngle() {
        this[0] *= Math.PI / 180;
        this[1] *= Math.PI / 180;
        this[2] *= Math.PI / 180;
    }

    cross(b: Vector3) {
        let result = new Vector3()
        result[0] = this[1] * b[2] - this[2] * b[1];
        result[1] = this[2] * b[0] - this[0] * b[2];
        result[2] = this[0] * b[1] - this[1] * b[0];
        return result;
    }

    toArray() {
        return [this[0], this[1], this[2]];
    }

    normalize() {
        let length = Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
        if (length > 0.00001) {
            this[0] = this[0] / length;
            this[1] = this[1] / length;
            this[2] = this[2] / length;
        } else {
            this[0] = 0;
            this[1] = 0;
            this[2] = 0;
        }
        return this
    }

    mul(s: number) {
        this[0] *=s;
        this[1] *=s;
        this[1] *=s;
        return this
    }

    subtract(v: Vector3) {
        this[0] -= v[0];
        this[1] -= v[1];
        this[1] -= v[1];
        return this
    }
}