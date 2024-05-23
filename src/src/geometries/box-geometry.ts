import {BufferGeometry} from "../classes/buffer-geometry.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {Vector3} from "../libs/vector3.ts";

export default class BoxGeometry extends BufferGeometry {
    width: number;
    height: number;
    depth: number;
    segments: number;
    segmentLengthPos: number;
    segmentLengthUv: number;

    constructor(width = 1, height = 1, depth = 1, segments = 1) {
        super();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.segments = segments;
        this.segmentLengthPos = width / segments;
        this.segmentLengthUv = 1 / segments;

        const vertArray = new Array<number>(3 * 3 * 2 * 6 * segments * segments);
        const uvArray = new Array<number>(2 * 3 * 2 * 6 * segments * segments);
        this.generateBoxPos(vertArray);
        this.generateUv(uvArray);

        this.setAttribute('position', new BufferAttribute(new Float32Array(vertArray), 3));
        this.setAttribute('texcoord', new BufferAttribute(new Float32Array(uvArray), 2));
        this.calculateNormals();
    }

    private generateUv(uvArray: number[]) {
        for (let i = 0; i < 6; i++) {
            const elmtPerFace = 2 * 3 * 2 * this.segments * this.segments;
            this.generateFaceUv(uvArray, i * elmtPerFace);
        }
    }

    private generateFaceUv(uvArray: number[], startIdx: number) {
        for (let i = 0; i < this.segments; i++) {
            for (let j = 0; j < this.segments; j++) {
                const localElmtIdx = (i * this.segments + j) * 6 * 2;
                const origin: [number, number] = [this.segmentLengthUv * j, this.segmentLengthUv * i];

                this.generateQuadUv(uvArray, startIdx + localElmtIdx, origin);
            }
        }
    }

    private generateQuadUv(uvArray: number[], startIdx: number, origin: [number, number]) {
        const originX = origin[0];
        const originY = origin[1];
        const endX = originX + this.segmentLengthUv;
        const endY = originY + this.segmentLengthUv;

        this.setUvData(uvArray, startIdx, [originX, originY]);
        this.setUvData(uvArray, startIdx + 2, [originX, endY]);
        this.setUvData(uvArray, startIdx + 4, [endX, originY]);
        this.setUvData(uvArray, startIdx + 6, [endX, endY]);
        this.setUvData(uvArray, startIdx + 8, [endX, originY]);
        this.setUvData(uvArray, startIdx + 10, [originX, endY]);
    }

    private setUvData(uvArray: number[], startIdx: number, data: [number, number]) {
        uvArray[startIdx] = data[0];
        uvArray[startIdx + 1] = data[1];
    }

    private generateBoxPos(vertArray: number[]) {
        const elmtPerFace = 3 * 3 * 2 * this.segments * this.segments;
        // front
        this.generateFacePos(vertArray, 0, new Vector3(-this.width / 2, this.height / 2, this.depth / 2), new Vector3(1, 0, 0), new Vector3(0, -1, 0));
        // right
        this.generateFacePos(vertArray, 1 * elmtPerFace, new Vector3(this.width / 2, this.height / 2, this.depth / 2), new Vector3(0, 0, -1), new Vector3(0, -1, 0));
        // back
        this.generateFacePos(vertArray, 2 * elmtPerFace, new Vector3(this.width / 2, this.height / 2, -this.depth / 2), new Vector3(-1, 0, 0), new Vector3(0, -1, 0));
        // left
        this.generateFacePos(vertArray, 3 * elmtPerFace, new Vector3(-this.width / 2, this.height / 2, -this.depth / 2), new Vector3(0, 0, 1), new Vector3(0, -1, 0));
        // top
        this.generateFacePos(vertArray, 4 * elmtPerFace, new Vector3(-this.width / 2, this.height / 2, -this.depth / 2), new Vector3(1, 0, 0), new Vector3(0, 0, 1));
        // bottom
        this.generateFacePos(vertArray, 5 * elmtPerFace, new Vector3(-this.width / 2, -this.height / 2, this.depth / 2), new Vector3(1, 0, 0), new Vector3(0, 0, -1));
    }

    private generateFacePos(vertArray: number[], startIdx: number, origin: Vector3, horizVec: Vector3, vertVec: Vector3) {
        for (let i = 0; i < this.segments; i++) {
            for (let j = 0; j < this.segments; j++) {
                const localElmtIdx = (i * this.segments + j) * 6 * 3;

                const localHoriz = Vector3.multiply(horizVec, j * this.segmentLengthPos);
                const localVert = Vector3.multiply(vertVec, i * this.segmentLengthPos);
                const localOrigin = Vector3.add(localHoriz, localVert);

                const quadOrigin = Vector3.add(origin, localOrigin);
                this.generateQuad(vertArray, startIdx + localElmtIdx, quadOrigin, horizVec, vertVec);
            }
        }
    }

    private generateQuad(vertArray: number[], startIdx: number, origin: Vector3, horizVec: Vector3, vertVec: Vector3) {
        horizVec = Vector3.multiply(horizVec, this.segmentLengthPos);
        vertVec =Vector3.multiply(vertVec, this.segmentLengthPos);
        this.setVertArrayData(vertArray, startIdx, origin);
        this.setVertArrayData(vertArray, startIdx + 3, Vector3.add(origin, vertVec));
        this.setVertArrayData(vertArray, startIdx + 6, Vector3.add(origin, horizVec));
        this.setVertArrayData(vertArray, startIdx + 9, Vector3.add(Vector3.add(origin, vertVec), horizVec));
        this.setVertArrayData(vertArray, startIdx + 12, Vector3.add(origin, horizVec));
        this.setVertArrayData(vertArray, startIdx + 15, Vector3.add(origin, vertVec));
    }

    private setVertArrayData(vertArray: number[], startIdx: number, data: Vector3) {
        vertArray[startIdx] = data[0];
        vertArray[startIdx + 1] = data[1];
        vertArray[startIdx + 2] = data[2];
    }
}