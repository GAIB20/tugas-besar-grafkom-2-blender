export class OrthographicCamera {
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
    projectionMatrix: Float32Array;

    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.projectionMatrix = new Float32Array(16);

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix(): void {
        const lr = 1 / (this.left - this.right);
        const bt = 1 / (this.bottom - this.top);
        const nf = 1 / (this.near - this.far);

        this.projectionMatrix[0] = -2 * lr;
        this.projectionMatrix[1] = 0;
        this.projectionMatrix[2] = 0;
        this.projectionMatrix[3] = 0;

        this.projectionMatrix[4] = 0;
        this.projectionMatrix[5] = -2 * bt;
        this.projectionMatrix[6] = 0;
        this.projectionMatrix[7] = 0;

        this.projectionMatrix[8] = 0;
        this.projectionMatrix[9] = 0;
        this.projectionMatrix[10] = 2 * nf;
        this.projectionMatrix[11] = 0;

        this.projectionMatrix[12] = (this.left + this.right) * lr;
        this.projectionMatrix[13] = (this.top + this.bottom) * bt;
        this.projectionMatrix[14] = (this.far + this.near) * nf;
        this.projectionMatrix[15] = 1;
    }

    setViewSize(width: number, height: number): void {
        const aspectRatio = width / height;
        const viewHeight = (this.top - this.bottom) / 2;
        const viewWidth = viewHeight * aspectRatio;

        this.left = -viewWidth;
        this.right = viewWidth;
        this.updateProjectionMatrix();
    }
}
