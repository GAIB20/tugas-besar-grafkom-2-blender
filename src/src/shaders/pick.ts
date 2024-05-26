export const pickVert = `
    attribute vec4 a_position;
    
    uniform mat4 u_worldViewProjection;
    
    void main() {
      // Multiply the position by the matrix.
      gl_Position = u_worldViewProjection * a_position;
    
    }`

export const pickFrag = `
    precision mediump float;
  
  uniform vec4 u_id;
  
  void main() {
     gl_FragColor = u_id;
  }`
