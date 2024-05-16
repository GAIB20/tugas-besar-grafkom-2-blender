export const phongVert = `
attribute vec4 a_position;
attribute vec3 normal;

uniform mat4 u_worldMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_viewProjectionMatrix;

uniform vec4 u_ligthColor; // La
uniform vec4 u_color; // Ka
uniform vec4 u_diffuseColor; // Kd
uniform vec4 u_specularColor; // Ks
uniform float u_shininess; // e'

varying vec4 v_color;

void main() {
   gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;

   vec4 vertPos4 = u_viewMatrix * a_position;
   vec3 vertPos = vec3(vertPos4) / vertPos4.w;
   
   vec3 N = normalize(normal);
   vec3 L = normalize(-vertPos);
   
   float lambertian = max(dot(N, L), 0.0);
   float specular = 0.0;
   if (lambertian > 0.0) {
      vec3 R = reflect(-L, N);
      vec3 V = normalize(-vertPos);
      float specAngle = max(dot(R, V), 0.0);
      specular = pow(specAngle, shininess);
   }
   v_color = u_color * u_ligthColor + u_diffuseColor * lambertian + u_specularColor * specular;
}
`

export const phongFrag = `
precision mediump float;

varying vec4 v_color;

void main() {
   gl_FragColor = v_color;
}
`
