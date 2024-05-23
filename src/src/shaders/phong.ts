// export const phongVert = `
// attribute vec4 a_position;
// attribute vec3 normal;
//
// uniform mat4 u_worldMatrix;
// uniform mat4 u_viewMatrix;
// uniform mat4 u_viewProjectionMatrix;
//
// uniform vec4 u_ligthColor; // La
// uniform vec4 u_color; // Ka
// uniform vec4 u_diffuseColor; // Kd
// uniform vec4 u_specularColor; // Ks
// uniform float u_shininess; // e'
//
// varying vec4 v_color;
//
// void main() {
//    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
//
//    vec4 vertPos4 = u_viewMatrix * a_position;
//    vec3 vertPos = vec3(vertPos4) / vertPos4.w;
//
//    vec3 N = normalize(normal);
//    vec3 L = normalize(-vertPos);
//
//    float lambertian = max(dot(N, L), 0.0);
//    float specular = 0.0;
//    if (lambertian > 0.0) {
//       vec3 R = reflect(-L, N);
//       vec3 V = normalize(-vertPos);
//       float specAngle = max(dot(R, V), 0.0);
//       specular = pow(specAngle, shininess);
//    }
//    v_color = u_color * u_ligthColor + u_diffuseColor * lambertian + u_specularColor * specular;
// }
// `
//
// export const phongFrag = `
// precision mediump float;
//
// varying vec4 v_color;
//
// void main() {
//    gl_FragColor = v_color;
// }
// `


export const phongVert = `
    attribute vec4 a_position;
    attribute vec3 a_normal;

    uniform mat4 u_worldViewProjection;
    uniform mat4 u_world;
    uniform vec3 u_viewWorldPosition;

    varying vec3 v_normal;
    varying vec3 v_surfaceToView;

    void main() {
      // Multiply the position by the matrix.
      gl_Position = u_worldViewProjection * a_position;
     
      // orient the normals and pass to the fragment shader
      v_normal = mat3(u_world) * a_normal;
      
      vec3 surfaceWorldPosition = (u_world * a_position).xyz;
      
      v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
    }`

export const phongFrag = `
    precision mediump float;

    varying vec3 v_normal;
    varying vec3 v_surfaceToView;

    uniform vec3 u_reverseLightDirection;

    uniform vec4 u_ambientColor;
    uniform vec4 u_color;

    uniform float u_shininess;
    uniform vec3 u_lightColor;
    uniform vec3 u_specularColor;


    void main() {
       vec3 normal = normalize(v_normal);
       vec3 lightDirection = normalize(u_reverseLightDirection);

       float light = max(dot(normal, u_reverseLightDirection), 0.0);
       
       vec3 surfaceToViewDirection = normalize(v_surfaceToView);
       vec3 halfVector = normalize(lightDirection + surfaceToViewDirection);
       float specular = 0.0;
      if (light > 0.0) {
        specular = max(pow(dot(normal, halfVector), u_shininess), 0.0);
      }

       gl_FragColor = u_ambientColor;
       
       // Lets multiply just the color portion (not the alpha)
       // by the light
       gl_FragColor.rgb += (u_color.rgb * light * u_lightColor);

       // Just add in the specular
      gl_FragColor.rgb += (specular * u_specularColor);
      // gl_FragColor.rgb += (specular * vec3(1,0,0) * u_lightColor);
    }`

