import {Light} from "./light.ts";
import {Node} from "./node.ts"
import {Vector3} from "../libs/vector3.ts";

export class DirectionalLight extends Light {
    public target?: Node;
    private _direction: Vector3 = new Vector3();


    constructor(name: string) {
        super(name);
    }

    get direction() {
        // direction = target.pos -  this.pos (in world space)
        if (this.target) {
            this._direction = this.target.translation.subtract(this.translation).normalize();
        } else {
            // Asumsi target = (0,0,0), direction = -this.pos
            this._direction = this.translation.mul(-1).normalize();
        }
        return this._direction;
    }


    get uniforms() {
        return {
            ...super.uniforms,
            lightDirection: this.direction.toArray(),
            lightIsDirectional: true, // menandakan directional light di shader
        }
    }
}
