export function easeInSine(start : number, end : number, x : number) : number {

    let easedX = 1 - Math.cos((x * Math.PI) / 2);

    let result = (easedX * (end - start)) + start;

    return result;
}

export function easeInQuad(start : number, end : number, x : number) : number {

    let result = (end - start) * x * x + start;

    return result;
}

export function easeInCubic(start : number, end : number, x : number) : number {

    let result = (end - start) * x * x * x + start;

    return result;
}

export function easeInQuart(start : number, end : number, x : number) : number {

    let result = (end - start) * x * x * x * x + start;

    return result;
}

export function easeInExpotential(start : number, end : number, x : number) : number {

    let result = (end - start) * Math.pow(2, 10 * (x - 1)) + start;

    return result;
}

export function easeInCircular(start : number, end : number, x : number) : number {

    let result = (end - start) * (1 - Math.sqrt(1 - x * x)) + start;

    return result;
}

export function easeInBack(start : number, end : number, x : number) : number {

    let c1 = 1.70158;
    let c3 = c1 + 1;

    let result = (end - start) * c3 * x * x * x - c1 * x * x + start;

    return result;
}
