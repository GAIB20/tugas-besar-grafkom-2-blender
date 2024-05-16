import {BufferAttribute} from "../classes/buffer-attribute.ts";
import {BufferGeometry} from "../classes/buffer-geometry.ts";

export class SphereGeometry extends BufferGeometry {
    radius: number;

    constructor(radius = 1, widthSegments = 32, heightSegments = 16) {
        super();
        this.radius = radius;

        const vertices = [];
        const normals = [];
        const uvs = [];

        for (let y = 0; y <= heightSegments; y++) {
            const theta = y * Math.PI / heightSegments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let x = 0; x <= widthSegments; x++) {
                const phi = x * 2 * Math.PI / widthSegments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const ux = cosPhi * sinTheta;
                const uy = cosTheta;
                const uz = sinPhi * sinTheta;

                const vx = ux * radius;
                const vy = uy * radius;
                const vz = uz * radius;

                vertices.push(vx, vy, vz);
                normals.push(ux, uy, uz);
                uvs.push(x / widthSegments, y / heightSegments);
            }
        }

        // Generate the vertices in the correct order for drawArrays
        const drawVertices = [];
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < widthSegments; x++) {
                const a = y * (widthSegments + 1) + x;
                const b = a + widthSegments + 1;

                // First triangle
                drawVertices.push(...vertices.slice(a * 3, a * 3 + 3));
                drawVertices.push(...vertices.slice(b * 3, b * 3 + 3));
                drawVertices.push(...vertices.slice((a + 1) * 3, (a + 1) * 3 + 3));

                // Second triangle
                drawVertices.push(...vertices.slice((a + 1) * 3, (a + 1) * 3 + 3));
                drawVertices.push(...vertices.slice(b * 3, b * 3 + 3));
                drawVertices.push(...vertices.slice((b + 1) * 3, (b + 1) * 3 + 3));
            }
        }

        this.setAttribute('position', new BufferAttribute(new Float32Array(drawVertices), 3));
        this.calculateNormals();
    }
}
