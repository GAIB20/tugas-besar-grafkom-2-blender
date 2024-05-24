export const basicVert = `
    attribute vec4 a_position;
    
    uniform mat4 u_worldViewProjection;
    
    void main() {
      // Multiply the position by the matrix.
      gl_Position = u_worldViewProjection * a_position;
    
    }`

export const basicFrag = `
    precision mediump float;

    uniform vec4 u_color;
    
    void main() {
       gl_FragColor = u_color;
    }`
