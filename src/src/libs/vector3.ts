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
}