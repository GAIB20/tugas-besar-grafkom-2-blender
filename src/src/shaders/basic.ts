export const basicVert = `
    attribute vec4 a_position;
    
    uniform mat4 u_matrix;
    
    void main() {
      // Multiply the position by the matrix.
      gl_Position = u_matrix * a_position;
    
    }`

export const basicFrag = `
    precision mediump float;

    uniform vec3 u_color;
    
    void main() {
       gl_FragColor = vec4(u_color, 1.0);
    }`
