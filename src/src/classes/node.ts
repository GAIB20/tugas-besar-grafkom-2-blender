import {M4} from "../libs/m4.ts";
import {Vector3} from "../libs/vector3.ts";
import {INode} from "../interfaces/node.ts";

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

    // Public setter for animation
    set translation(translation: Vector3) {
        this._translation = translation;
        this.computeWorldMatrix(false, true);
    }

    set rotation(rotation: Vector3) {
        this._rotation = rotation;
        this.computeWorldMatrix(false, true);
    }

    set scale(scale: Vector3) {
        this._scale = scale;
        this.computeWorldMatrix(false, true);
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

    findNodeById(id: number): Node | undefined {
        if (this.idNode === id) {
            return this;
        }
        for (let i = 0; i < this._children.length; i++) {
            const node = this._children[i].findNodeById(id);
            if (node) {
                return node;
            }
        }
        return undefined;
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

    toObject(): INode {
        let result: INode = {
            name: this.name,
            translation: this.translation.toArray(),
            rotation: this.rotation.toArray(),
            scale: this.scale.toArray(),
        }
        if (this.children.length > 0) {
            result['children'] = this.children.map((child) => child.idNode)
        }
        return result;
    }
}
