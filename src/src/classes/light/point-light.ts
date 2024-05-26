import {Light} from "./light.ts";
import {ILight} from "../../interfaces/light.ts";

export class PointLight extends Light {
    public attenuationA: number = 1;
    public attenuationB: number = 1;
    public attenuationC: number = 1;


    constructor(name: string) {
        super(name);
    }


    get uniforms() {
        return {
            ...super.uniforms,
            lightIsDirectional: false,
            lightWorldPosition: this.translation.toArray(),
            attenuationA: this.attenuationA,
            attenuationB: this.attenuationB,
            attenuationC: this.attenuationC,
        }
    }

    toObjectLight(): ILight {
        return {
            type: 'point',
            point: {
                attA: this.attenuationA,
                attB: this.attenuationB,
                attC: this.attenuationC,
            }
        }
    }

    fromObjectLight(light: ILight): void {
        this.attenuationA = light.point?.attA ?? 1
        this.attenuationB = light.point?.attB ?? 1
        this.attenuationC = light.point?.attC ?? 1
    }
}
