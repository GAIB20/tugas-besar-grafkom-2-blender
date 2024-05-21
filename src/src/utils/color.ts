export function hexToRgb(hex: string): [number, number, number, number] {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');

    // Parse the hexadecimal string
    let bigint = parseInt(hex, 16);

    // Extract the red, green, and blue components
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    let a = (bigint & 255) / 255;

    // If the hex value doesn't include alpha, assume 1.0 (fully opaque)
    if (hex.length === 6) {
        a = 1.0;
        r = (bigint >> 16) & 255;
        g = (bigint >> 8) & 255;
        b = bigint & 255;
    }

    // Convert to normalized float (0.0 - 1.0)
    return [r / 255, g / 255, b / 255, a];
}

export function rgbToHex(rgba: [number, number, number, number]): string {
    // Convert normalized float (0.0 - 1.0) to 0-255 integer
    let r = Math.round(rgba[0] * 255);
    let g = Math.round(rgba[1] * 255);
    let b = Math.round(rgba[2] * 255);
    let a = Math.round(rgba[3] * 255);

    // Convert to a hexadecimal string
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase() + (a < 16 ? '0' : '') + a.toString(16).toUpperCase();
}