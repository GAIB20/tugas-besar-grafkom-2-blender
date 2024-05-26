import {BufferGeometry} from "../classes/buffer-geometry.ts";
import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {Vector3} from "../libs/vector3.ts";

export default class HollowCube extends BufferGeometry {
    length: number;
    thickness: number;

    constructor(length = 1, thickness = 0.5) {
        super();
        this.length = length;
        this.thickness = thickness;

        const pos = new Array<number>(3 * 3 * 2 * (4 * 6 + 8 * 4));
        const uv = new Array<number>(2 * 3 * 2 * (4 * 6 + 8 * 4));

        this.generatePos(pos);
        this.generateUv(uv);

        this.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
        this.setAttribute('texcoord', new BufferAttribute(new Float32Array(uv), 2));
        this.calculateNormals();
    }

    private generateUv(uv: number[]) {
        const nFaces = 4 * 6 + 8 * 4;
        const elmtPerFace = 2 * 3 * 2;
        for (let i = 0; i < nFaces; i++) {
            this.setUvData(uv, i * elmtPerFace + 0, [0,1]);
            this.setUvData(uv, i * elmtPerFace + 2, [0,0]);
            this.setUvData(uv, i * elmtPerFace + 4, [1,1]);

            this.setUvData(uv, i * elmtPerFace + 6, [1,0]);
            this.setUvData(uv, i * elmtPerFace + 8, [1,1]);
            this.setUvData(uv, i * elmtPerFace + 10, [0,0]);
        }
    }

    private setUvData(uv: number[], startIdx: number, data: number[]) {
        uv[startIdx + 0] = data[0];
        uv[startIdx + 1] = data[1];
    }

    private generatePos(pos: number[]) {
        const fullCubeElmntCount = 3 * 3 * 2 * 6;

        this.generateFullCube(pos, fullCubeElmntCount * 0, [- this.length / 2, this.length / 2, this.length / 2]);
        this.generateFullCube(pos, fullCubeElmntCount * 1, [- this.length / 2, (-this.length / 2) + this.thickness, this.length / 2]);
        this.generateFullCube(pos, fullCubeElmntCount * 2, [- this.length / 2, this.length / 2, (-this.length / 2) + this.thickness]);
        this.generateFullCube(pos, fullCubeElmntCount * 3, [- this.length / 2, (-this.length / 2) + this.thickness, (-this.length / 2) + this.thickness]);

        const sideOnlyStartFwd = fullCubeElmntCount * 4;
        const sideOnlyElmtCount = 3 * 3 * 2 * 4;

        this.generateSideOnlyCubeFwd(pos, sideOnlyStartFwd + sideOnlyElmtCount * 0, [-this.length/2, this.length/2, (-this.length/2) + this.thickness]);
        this.generateSideOnlyCubeFwd(pos, sideOnlyStartFwd + sideOnlyElmtCount * 1, [-this.length/2, (-this.length/2) + this.thickness, (-this.length/2) + this.thickness]);
        this.generateSideOnlyCubeFwd(pos, sideOnlyStartFwd + sideOnlyElmtCount * 2, [(this.length/2) - this.thickness, this.length/2, (-this.length/2) + this.thickness]);
        this.generateSideOnlyCubeFwd(pos, sideOnlyStartFwd + sideOnlyElmtCount * 3, [(this.length/2) - this.thickness, (-this.length/2) + this.thickness, (-this.length/2) + this.thickness]);

        const sideOnlyStartVert = sideOnlyStartFwd + sideOnlyElmtCount * 4;

        this.generateSideOnlyCubeVert(pos, sideOnlyStartVert + sideOnlyElmtCount * 0, [-this.length/2, this.length/2 - this.thickness, this.length/2]);
        this.generateSideOnlyCubeVert(pos, sideOnlyStartVert + sideOnlyElmtCount * 1, [this.length/2 - this.thickness, this.length/2 - this.thickness, this.length/2]);
        this.generateSideOnlyCubeVert(pos, sideOnlyStartVert + sideOnlyElmtCount * 2, [-this.length/2, this.length/2 - this.thickness, (-this.length/2) + this.thickness]);
        this.generateSideOnlyCubeVert(pos, sideOnlyStartVert + sideOnlyElmtCount * 3, [this.length/2 - this.thickness, this.length/2 - this.thickness, (-this.length/2) + this.thickness]);
    }

    private generateFullCube(pos: number[], startIdx: number, topLeftFront: number[]) {
        let topRightFront: number[] = [this.length / 2, topLeftFront[1], topLeftFront[2]];
        let bottomLeftFront: number[] = [-this.length / 2, topLeftFront[1] - this.thickness, topLeftFront[2]];

        let topLeftBack: number[] = [-this.length / 2, topLeftFront[1], topLeftFront[2] - this.thickness];
        let topRightBack: number[] = [this.length / 2, topLeftFront[1], topLeftFront[2] - this.thickness];

        const elmtPerQuad = 3 * 3 * 2;

        this.generateQuad(pos, startIdx + elmtPerQuad * 0, topLeftFront, [this.length, 0, 0], [0, -this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 1, topRightFront, [0,0,-this.thickness], [0, -this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 2, topRightBack, [-this.length, 0, 0], [0, -this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 3, topLeftBack, [0,0,this.thickness], [0, -this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 4, topLeftBack, [this.length, 0, 0], [0,0,this.thickness]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 5, bottomLeftFront, [this.length, 0, 0], [0,0,-this.thickness]);
    }

    private generateSideOnlyCubeFwd(pos: number[], startIdx: number, topLeftFront: number[]) {
        let bottomLeftFront: number[] = [topLeftFront[0], topLeftFront[1] - this.thickness, topLeftFront[2]];

        let topLeftBack: number[] = [topLeftFront[0] + this.thickness, topLeftFront[1], topLeftFront[2]];
        let topRightBack: number[] = [topLeftFront[0] + this.thickness, topLeftFront[1], -topLeftFront[2]];

        const elmtPerQuad = 3 * 3 * 2;

        this.generateQuad(pos, startIdx + elmtPerQuad * 0, topLeftFront, [0,0,this.length - 2 * this.thickness], [0, -this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 1, topRightBack, [0,0,-this.length + 2 * this.thickness], [0, -this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 2, topLeftBack, [0,0,this.length - 2 * this.thickness], [-this.thickness, 0, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 3, bottomLeftFront, [0,0,this.length - 2 * this.thickness], [this.thickness, 0, 0]);
    }

    private generateSideOnlyCubeVert(pos: number[], startIdx: number, topLeftFront: number[]) {
        let topRightFront: number[] = [topLeftFront[0] + this.thickness, topLeftFront[1], topLeftFront[2]];

        let topLeftBack: number[] = [topLeftFront[0], topLeftFront[1], topLeftFront[2] - this.thickness];
        let topRightBack: number[] = [topLeftFront[0] + this.thickness, topLeftFront[1], topLeftFront[2] - this.thickness];

        const elmtPerQuad = 3 * 3 * 2;

        this.generateQuad(pos, startIdx + elmtPerQuad * 0, topLeftFront, [this.thickness, 0, 0], [0, -this.length + 2 * this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 1, topRightFront, [0,0,-this.thickness], [0, -this.length + 2 * this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 2, topRightBack, [-this.thickness, 0, 0], [0, -this.length + 2 * this.thickness, 0]);
        this.generateQuad(pos, startIdx + elmtPerQuad * 3, topLeftBack, [0,0,this.thickness], [0, -this.length + 2 * this.thickness, 0]);
    }

    private generateQuad(pos: number[], startIdx: number, topLeft : number[], horiz: number[], vert: number[]) {
        const topLeftV = new Vector3()
        topLeftV.set(topLeft)
        const horizV = new Vector3()
        horizV.set(horiz)
        const vertV = new Vector3()
        vertV.set(vert)
        const bottomLeft = Vector3.add(topLeftV, vertV);
        const topRight = Vector3.add(topLeftV, horizV);
        const bottomRight = Vector3.add(Vector3.add(topLeftV, horizV), vertV);

        this.setPosData(pos, startIdx + 0, topLeftV);
        this.setPosData(pos, startIdx + 3, bottomLeft);
        this.setPosData(pos, startIdx + 6, topRight);

        this.setPosData(pos, startIdx + 9, bottomRight);
        this.setPosData(pos, startIdx + 12, topRight);
        this.setPosData(pos, startIdx + 15, bottomLeft);
    }

    private setPosData(pos: number[], startIdx: number, data: Vector3) {
        pos[startIdx + 0] = data[0];
        pos[startIdx + 1] = data[1];
        pos[startIdx + 2] = data[2];
    }
}