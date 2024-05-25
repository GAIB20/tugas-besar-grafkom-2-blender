import {Light} from "./light.ts";

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
}
