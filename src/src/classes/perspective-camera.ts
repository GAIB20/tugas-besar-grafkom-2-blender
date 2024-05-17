export class PerspectiveCamera {
    fov: number;
    aspect: number;
    near: number; 
    far: number; 
    projectionMatrix: Float32Array;

    constructor(fov: number, aspect: number, near: number, far: number) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.projectionMatrix = new Float32Array(16);

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix(): void {
        const top = this.near * Math.tan((this.fov * Math.PI) / 360);
        const height = 2 * top;
        const width = this.aspect * height;
        const left = -0.5 * width;
        const right = 0.5 * width;
        const bottom = -top;

        const X = (2 * this.near) / (right - left);
        const Y = (2 * this.near) / (top - bottom);
        const A = (right + left) / (right - left);
        const B = (top + bottom) / (top - bottom);
        const C = -(this.far + this.near) / (this.far - this.near);
        const D = (-2 * this.far * this.near) / (this.far - this.near);

        this.projectionMatrix[0] = X;
        this.projectionMatrix[1] = 0;
        this.projectionMatrix[2] = 0;
        this.projectionMatrix[3] = 0;

        this.projectionMatrix[4] = 0;
        this.projectionMatrix[5] = Y;
        this.projectionMatrix[6] = 0;
        this.projectionMatrix[7] = 0;

        this.projectionMatrix[8] = A;
        this.projectionMatrix[9] = B;
        this.projectionMatrix[10] = C;
        this.projectionMatrix[11] = -1;

        this.projectionMatrix[12] = 0;
        this.projectionMatrix[13] = 0;
        this.projectionMatrix[14] = D;
        this.projectionMatrix[15] = 0;
    }

    setAspectRatio(aspect: number): void {
        this.aspect = aspect;
        this.updateProjectionMatrix();
    }

    setFOV(fov: number): void {
        this.fov = fov;
        this.updateProjectionMatrix();
    }

    setNearPlane(near: number): void {
        this.near = near;
        this.updateProjectionMatrix();
    }

    setFarPlane(far: number): void {
        this.far = far;
        this.updateProjectionMatrix();
    }
}
