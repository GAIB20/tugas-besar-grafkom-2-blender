import {BufferAttribute} from "./buffer-attribute.ts";
import {Vector3} from "../libs/vector3.ts";

export class BufferGeometry {
    private _attributes: {[name: string]: BufferAttribute};
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
    calculateNormals(forceNewAttribute=false) {
        const position = this.getAttribute('position');
        if (!position) return;
        let normal = this.getAttribute('normal');
        if (forceNewAttribute || !normal) {
            normal = new BufferAttribute(new Float32Array(position.length), position.size);
            for (let i = 0; i < position.length; i+=(3*position.size)) {
                const size = position.size
                let A: Vector3 = new Vector3(position.data[i] - position.data[i+size], position.data[i+1] - position.data[i+1+size], position.data[i+2] - position.data[i+2+size]);
                let B: Vector3 = new Vector3(position.data[i+(2*size)] - position.data[i+size], position.data[i+(2*size)+1] - position.data[i+1+size], position.data[i+2+(2*size)] - position.data[i+2+size]);
                let result = B.cross(A)
                for (let j = 0; j < 3*position.size; j+=position.size) {
                    for (let k = 0; k < position.size; k++) {
                        normal.data[i+j+k] = result[k];
                    }
                }
            }
        }
        this.setAttribute('normal', normal);
    }
}
