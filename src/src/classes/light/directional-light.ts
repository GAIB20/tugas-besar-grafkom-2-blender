import {Light} from "./light.ts";
import {Vector3} from "../../libs/vector3.ts";
import {ILight} from "../../interfaces/light.ts";

export class DirectionalLight extends Light {
    private _direction: Vector3 = new Vector3();


    constructor(name: string) {
        super(name);
        console.trace()
    }

    get direction() {
        this._direction = Vector3.multiply(this.translation, -1).normalize();
        return this._direction;
    }


    get uniforms() {
        return {
            ...super.uniforms,
            reverseLightDirection: this.direction.mul(-1).toArray(),
            lightIsDirectional: true,
        }
    }

    toObjectLight(): ILight {
        return {
            type: 'directional',
        }
    }
}
