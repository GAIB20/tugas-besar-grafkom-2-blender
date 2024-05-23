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

        const uvs = [
            // Front face
            0, 0, 1, 0, 1, 1, 0, 1,
            // Back face
            0, 0, 0, 1, 1, 1, 1, 0,
            // Top face
            0, 1, 0, 0, 1, 0, 1, 1,
            // Bottom face
            0, 0, 1, 0, 1, 1, 0, 1,
            // Right face
            1, 0, 1, 1, 0, 1, 0, 0,
            // Left face
            0, 0, 1, 0, 1, 1, 0, 1,
        ];

        const drawUVs = [
            // Front face
            ...uvs.slice(0, 2), ...uvs.slice(2, 4), ...uvs.slice(4, 6),
            ...uvs.slice(0, 2), ...uvs.slice(4, 6), ...uvs.slice(6, 8),

            // Back face
            ...uvs.slice(8, 10), ...uvs.slice(10, 12), ...uvs.slice(12, 14),
            ...uvs.slice(8, 10), ...uvs.slice(12, 14), ...uvs.slice(14, 16),

            // Top face
            ...uvs.slice(16, 18), ...uvs.slice(18, 20), ...uvs.slice(20, 22),
            ...uvs.slice(16, 18), ...uvs.slice(20, 22), ...uvs.slice(22, 24),

            // Bottom face
            ...uvs.slice(24, 26), ...uvs.slice(26, 28), ...uvs.slice(28, 30),
            ...uvs.slice(24, 26), ...uvs.slice(28, 30), ...uvs.slice(30, 32),

            // Right face
            ...uvs.slice(32, 34), ...uvs.slice(34, 36), ...uvs.slice(36, 38),
            ...uvs.slice(32, 34), ...uvs.slice(36, 38), ...uvs.slice(38, 40),

            // Left face
            ...uvs.slice(40, 42), ...uvs.slice(42, 44), ...uvs.slice(44, 46),
            ...uvs.slice(40, 42), ...uvs.slice(44, 46), ...uvs.slice(46, 48),
        ];
        this.setAttribute('texcoord', new BufferAttribute(new Float32Array(drawUVs), 2));
        this.calculateNormals();
    }
}
