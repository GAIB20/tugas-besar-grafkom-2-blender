
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
}