import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";

export class CubeGeometry extends BufferGeometry {
    size: number;


    constructor(size=1) {
        super();
        this.size = size;

        const hs = size / 2;
        const vertices = new Float32Array([
            // Front face
            -hs, -hs,  hs,
            hs, -hs,  hs,
            hs,  hs,  hs,
            -hs,  hs,  hs,

            // Back face
            -hs, -hs, -hs,
            -hs,  hs, -hs,
            hs,  hs, -hs,
            hs, -hs, -hs,

            // Top face
            -hs,  hs, -hs,
            -hs,  hs,  hs,
            hs,  hs,  hs,
            hs,  hs, -hs,

            // Bottom face
            -hs, -hs, -hs,
            hs, -hs, -hs,
            hs, -hs,  hs,
            -hs, -hs,  hs,

            // Right face
            hs, -hs, -hs,
            hs,  hs, -hs,
            hs,  hs,  hs,
            hs, -hs,  hs,

            // Left face
            -hs, -hs, -hs,
            -hs, -hs,  hs,
            -hs,  hs,  hs,
            -hs,  hs, -hs,
        ]);

        this.setAttribute('position', new BufferAttribute(vertices, 3));
        this.calculateNormals();
    }
}
