import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";

export class CubeGeometry extends BufferGeometry {
    size: number;

    constructor(size = 1) {
        super();
        this.size = size;

        const hs = size / 2;
        const vertices = [
            // Front face
            -hs, -hs, hs,
            hs, -hs, hs,
            hs, hs, hs,
            -hs, hs, hs,

            // Back face
            -hs, -hs, -hs,
            -hs, hs, -hs,
            hs, hs, -hs,
            hs, -hs, -hs,

            // Top face
            -hs, hs, -hs,
            -hs, hs, hs,
            hs, hs, hs,
            hs, hs, -hs,

            // Bottom face
            -hs, -hs, -hs,
            hs, -hs, -hs,
            hs, -hs, hs,
            -hs, -hs, hs,

            // Right face
            hs, -hs, -hs,
            hs, hs, -hs,
            hs, hs, hs,
            hs, -hs, hs,

            // Left face
            -hs, -hs, -hs,
            -hs, -hs, hs,
            -hs, hs, hs,
            -hs, hs, -hs,
        ];

        const drawVertices = [
            // Front face
            ...vertices.slice(0, 3), ...vertices.slice(3, 6), ...vertices.slice(6, 9),
            ...vertices.slice(0, 3), ...vertices.slice(6, 9), ...vertices.slice(9, 12),

            // Back face
            ...vertices.slice(12, 15), ...vertices.slice(15, 18), ...vertices.slice(18, 21),
            ...vertices.slice(12, 15), ...vertices.slice(18, 21), ...vertices.slice(21, 24),

            // Top face
            ...vertices.slice(24, 27), ...vertices.slice(27, 30), ...vertices.slice(30, 33),
            ...vertices.slice(24, 27), ...vertices.slice(30, 33), ...vertices.slice(33, 36),

            // Bottom face
            ...vertices.slice(36, 39), ...vertices.slice(39, 42), ...vertices.slice(42, 45),
            ...vertices.slice(36, 39), ...vertices.slice(42, 45), ...vertices.slice(45, 48),

            // Right face
            ...vertices.slice(48, 51), ...vertices.slice(51, 54), ...vertices.slice(54, 57),
            ...vertices.slice(48, 51), ...vertices.slice(54, 57), ...vertices.slice(57, 60),

            // Left face
            ...vertices.slice(60, 63), ...vertices.slice(63, 66), ...vertices.slice(66, 69),
            ...vertices.slice(60, 63), ...vertices.slice(66, 69), ...vertices.slice(69, 72),
        ];

        this.setAttribute('position', new BufferAttribute(new Float32Array(drawVertices), 3));
        this.calculateNormals();
    }
}
