import {Light} from "./light.ts";
import {Vector3} from "../../libs/vector3.ts";

export class DirectionalLight extends Light {
    private _direction: Vector3 = new Vector3();


    constructor(name: string) {
        super(name);
    }

    get direction() {
        this._direction = this.translation.mul(-1).normalize();
        return this._direction;
    }


    get uniforms() {
        return {
            ...super.uniforms,
            reverseLightDirection: this.direction.mul(-1).toArray(),
            lightIsDirectional: true,
        }
    }
}
