import {M4} from "../libs/m4.ts";
import {Vector3} from "../libs/vector3.ts";

export class Node {
    private _position: Vector3 = new Vector3();
    private _rotation: Vector3 = new Vector3();
    private _scale: Vector3 = new Vector3(1, 1, 1);
    private _localMatrix: M4 = M4.identity();
    private _worldMatrix: M4 = M4.identity();
    private _parent?: Node;
    private _children: Node[] = []
    visible = true
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    // Public getter, prevent re-instance new object
    get position() {
        return this._position;
    }

    get rotation() {
        return this._rotation;
    }

    get scale() {
        return this._scale;
    }

    get parent() {
        return this._parent;
    }

    get localMatrix() {
        return this._localMatrix;
    }

    get worldMatrix() {
        return this._worldMatrix;
    }

    get children() {
        return this._children;
    }


    // Public setter
    // Should update world matrix if parent changed
    set parent(parent) {
        if (this._parent !== parent) {
            this._parent = parent;
            this.computeWorldMatrix(false, true);
        }
    }


    computeLocalMatrix() {
        this._localMatrix = M4.multiply(
            M4.translation3d(this._position),
            M4.rotation3d(this._rotation),
        );
        this._localMatrix = M4.multiply(
            this._localMatrix,
            M4.scale3d(this._scale)
        );
    }


    computeWorldMatrix(updateParent = true, updateChildren = true) {
        // If updateParent, update world matrix of our ancestors
        // (.parent, .parent.parent, .parent.parent.parent, ...)
        if (updateParent && this.parent)
            this.parent.computeWorldMatrix(true, false);
        // Update this node
        this.computeLocalMatrix();
        if (this.parent) {
            this._worldMatrix = M4.multiply(
                this.parent.worldMatrix,
                this._localMatrix
            );
        } else {
            this._worldMatrix = this._localMatrix.clone();
        }
        // If updateChildren, update our children
        // (.children, .children.children, .children.children.children, ...)
        if (updateChildren)
            for (let i = 0; i < this._children.length; i++)
                this._children[i].computeWorldMatrix(false, true);
    }

    /**
     * Tambah node sebagai child dari node ini.
     *
     * Jika node sudah memiliki parent, maka node akan
     * dilepas dari parentnya terlebih dahulu.
     */
    add(node: Node): Node {
        if (node.parent !== this) {
            node.removeFromParent();
            node.parent = this;
        }
        this.children.push(node);
        return this;
    }

    isEqual(node: Node) {
        return this.id === node.id;
    }


    remove(node: Node) {
        for (let i = 0; i < this._children.length; i++) {
            if (this._children[i].isEqual(node)) {
                this._children.splice(i, 1);
                break;
            }
        }
        node.parent = undefined;
        return this;
    }


    removeFromParent() {
        if (this.parent) this.parent.remove(this);
        return this;
    }
}
