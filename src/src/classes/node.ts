import {M4} from "../libs/m4.ts";
import {Vector3} from "../libs/vector3.ts";

export class Node {
    static nodes: Node[] = [];
    static nodeIdx = 0;
    private _translation: Vector3 = new Vector3();
    private _rotation: Vector3 = new Vector3();
    private _scale: Vector3 = new Vector3(1, 1, 1);
    private _localMatrix: M4 = M4.identity();
    private _worldMatrix: M4 = M4.identity();
    private _parent?: Node;
    private _children: Node[] = []
    visible = true
    idNode: number;
    name: string;

    constructor(name: string) {
        this.idNode = Node.nodeIdx;
        Node.nodeIdx++;
        this.name = name;
        Node.nodes.push(this);
    }

    // Public getter, prevent re-instance new object
    get translation() {
        return this._translation;
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

    set translation(vec3: Vector3) {
        this._translation = vec3;
    }

    set rotation(vec3: Vector3) {
        this._rotation = vec3;
    }
    set scale(vec3: Vector3) {
        this._scale = vec3;
    }


    computeLocalMatrix() {
        this._localMatrix = M4.multiply(
            M4.translation3d(this._translation),
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
        return this.idNode === node.idNode;
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

    // toObject(): INode {
    //     if (this instanceof Mesh) {
    //         return {
    //             mesh: this.idMesh,
    //             name: this.name,
    //             translation: this.translation.toArray(),
    //             rotation: this.rotation.toArray(),
    //             scale: this.scale.toArray()
    //         }
    //     }
    //     //TODO: change this to node camera
    //     else {
    //         return {
    //             mesh: 0,
    //             name: this.name,
    //             translation: this.translation.toArray(),
    //             rotation: this.rotation.toArray(),
    //             scale: this.scale.toArray()
    //         }
    //     }
    // }
}
