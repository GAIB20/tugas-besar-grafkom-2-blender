import {BufferAttribute} from "./buffer-attribute.ts";
import {Vector3} from "../libs/vector3.ts";

export class BufferGeometry {
    private _attributes: { [name: string]: BufferAttribute };
    private _indices?: BufferAttribute;


    constructor() {
        this._attributes = {};
    }


    get attributes() {
        return this._attributes;
    }


    get indices() {
        return this._indices;
    }


    setIndices(indices: BufferAttribute) {
        this._indices = indices;
        return this;
    }


    removeIndices() {
        this._indices = undefined;
        return this;
    }


    setAttribute(name: string, attribute: BufferAttribute) {
        this._attributes[name] = attribute;
        return this;
    }


    getAttribute(name: string) {
        return this._attributes[name];
    }


    deleteAttribute(name: string) {
        delete this._attributes[name];
        return this;
    }

    // TODO: still need checking
    calculateNormals(forceNewAttribute = false) {
        const position = this.getAttribute('position');
        if (!position) return;
        const texcoord = this.getAttribute('texcoord');
        if (!texcoord) return;

        let normal = this.getAttribute('normal');
        if (forceNewAttribute || !normal) {
            normal = new BufferAttribute(new Float32Array(position.length), position.size);
        }
        for (let i = 0; i < position.length; i += (3 * position.size)) {
            const size = position.size
            let A: Vector3 = new Vector3(position.data[i] - position.data[i + size], position.data[i + 1] - position.data[i + 1 + size], position.data[i + 2] - position.data[i + 2 + size]);
            let B: Vector3 = new Vector3(position.data[i + (2 * size)] - position.data[i + size], position.data[i + (2 * size) + 1] - position.data[i + 1 + size], position.data[i + 2 + (2 * size)] - position.data[i + 2 + size]);
            let result = B.cross(A)
            for (let j = 0; j < 3 * position.size; j += position.size) {
                for (let k = 0; k < position.size; k++) {
                    normal.data[i + j + k] = result[k];
                }
            }
        }
        this.setAttribute('normal', normal);
        // Ambil atribut normal, atau buat baru jika tidak ada atau forceNewAttribute = true
        // let normal = this.getAttribute('normal');
        // if (forceNewAttribute || !normal)
        //     normal = new BufferAttribute(new Float32Array(position.length), position.size);
        let tangent = this.getAttribute('tangent');
        if (forceNewAttribute || !tangent)
            tangent = new BufferAttribute(new Float32Array(position.length), position.size);
        let bitangent = this.getAttribute('bitangent');
        if (forceNewAttribute || !bitangent)
            bitangent = new BufferAttribute(new Float32Array(position.length), position.size);
        // Karena menggunakan tangent dan bitangent, kita harus punya normal (N)
        // dalam tangent space. Pada tangent space, N selalu bernilai (0, 0, 1).
        // const N = new Vector3(0, 0, 1);

        for (let i = 0; i < position.count; i += 3) {
            const T = new Vector3();
            const B = new Vector3();


            const v1 = new Vector3();
            const v2 = new Vector3();
            const v3 = new Vector3();


            // Untuk koordinat tekstur, gunakan Vector2 jika ada (atau boleh langsung array)
            // Jika hanya memiliki Vector3, pastikan bisa set() hanya x dan y saja.
            const uv1 = new Vector3();
            const uv2 = new Vector3();
            const uv3 = new Vector3();

            // console.log(v1, v2, v3)
            v1 .set(position.get(i + 0));
            v2 .set(position.get(i + 1));
            v3 .set(position.get(i + 2));
            // console.log(position.get(i + 0))


            uv1.set(texcoord.get(i + 0));
            uv2.set(texcoord.get(i + 1));
            uv3.set(texcoord.get(i + 2));

            const e1   = Vector3.sub(v2, v1);
            const e2   = Vector3.sub(v3, v1);
            const dUV1 = Vector3.sub(uv2, uv1);
            const dUV2 = Vector3.sub(uv3, uv1);

            const f = 1.0 / (dUV1[0] * dUV2[1] - dUV2[0] * dUV1[1])

            // console.log(dUV1);
            // console.log(dUV2)


            T.set(
                [f * ( dUV2[1] * e1[0] - dUV1[1] * e2[0]),
                f * ( dUV2[1] * e1[1] - dUV1[1] * e2[1]),
                f * ( dUV2[1] * e1[2] - dUV1[1] * e2[2])]
            );
            B.set(
                [f * (-dUV2[0] * e1[0] + dUV1[0] * e2[0]),
                f * (-dUV2[0] * e1[1] + dUV1[0] * e2[1]),
                f * (-dUV2[0] * e1[2] + dUV1[0] * e2[2])]
            );

            // Set normal, tangent, dan bitangent
            // sebagai atribut dari ketiga vertex
            for (let j = 0; j < 3; j++) {
                // normal   .set(i + j, N.toArray());
                tangent  .set(i + j, T.toArray());
                bitangent.set(i + j, B.toArray());
            }
        }


        // console.log(position.data)

        // this.setAttribute('normal', normal);
        this.setAttribute('tangent', tangent);
        this.setAttribute('bitangent', bitangent);
    }

    toObject() {
        const attributesObject: { [name: string]: number } = {};

        Object.keys(this._attributes).forEach(name => {
            attributesObject[name] = this._attributes[name].id
        });

        return attributesObject;
    }

    setDirty() {
        Object.keys(this._attributes).forEach(name => {
            const attribute = this._attributes[name];
            attribute.isDirty = true;
        });
    }
}
