export const basicVert = `
attribute vec4 a_position;

uniform mat4 u_worldMatrix;
uniform mat4 u_viewProjectionMatrix;

void main() {
   gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
   v_color = a_color;
}
`

export const basicFrag = `
precision mediump float;

uniform vec4 u_ligthColor;
varying vec4 u_color;

void main() {
   gl_FragColor = u_color * u_ligthColor; // Ia = ka * La
}
`
