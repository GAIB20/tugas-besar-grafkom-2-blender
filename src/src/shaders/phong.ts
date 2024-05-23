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
    attribute vec3 a_tangent;
    attribute vec3 a_bitangent;

    attribute vec2 a_texcoord;

    uniform mat4 u_worldViewProjection;
    uniform mat4 u_world;
    uniform vec3 u_viewWorldPosition;
    
    uniform mat4 u_worldInverseTranspose;
    
    uniform sampler2D u_displacementTexture;
    uniform float u_displacementFactor;
    uniform float u_displacementBias;

    varying vec3 v_normal;
    varying vec3 v_surfaceToView;
    varying vec2 v_texcoord;

    varying mat3 v_tbn;

    void main() {
      // orient the normals and pass to the fragment shader
      v_normal = normalize(a_normal);
      
      float displacement = texture2D(u_displacementTexture, a_texcoord).r;
      vec3 displacementPos = a_position.xyz + v_normal * (displacement * u_displacementFactor + u_displacementBias);
    
      // Multiply the position by the matrix.
      // gl_Position = u_worldViewProjection * a_position;
      gl_Position = u_worldViewProjection * vec4(displacementPos, 1.0);
      
      vec3 surfaceWorldPosition = (u_world * a_position).xyz;
      
      v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
      
      v_texcoord = a_texcoord;
      
      vec3 T = normalize(vec3(u_world * vec4(a_tangent, 0.0)));
      vec3 B = normalize(vec3(u_world * vec4(a_bitangent, 0.0)));
      vec3 N = normalize(vec3(u_world * vec4(a_normal, 0.0)));
      
      v_tbn = mat3(T, B, N);
    }`

export const phongFrag = `
    precision mediump float;

    varying vec3 v_normal;
    varying vec3 v_surfaceToView;
    varying vec2 v_texcoord;

    varying mat3 v_tbn;

    uniform vec3 u_reverseLightDirection;

    uniform vec4 u_ambientColor;
    uniform vec4 u_color;

    uniform float u_shininess;
    uniform vec3 u_lightColor;
    uniform vec3 u_specularColor;
    
    uniform sampler2D u_diffuseTexture;
    uniform sampler2D u_specularTexture;
    uniform sampler2D u_normalTexture;

    void main() {
       // vec3 normal = normalize(v_normal);
       vec3 normal = texture2D(u_normalTexture, v_texcoord).rgb;
       normal = normal -0.5;
       normal = normalize(v_tbn * normal);
       
       vec3 lightDirection = normalize(u_reverseLightDirection);

       float light = max(dot(normal, u_reverseLightDirection), 0.0);
       
       vec3 surfaceToViewDirection = normalize(v_surfaceToView);
       vec3 halfVector = normalize(lightDirection + surfaceToViewDirection);
       float specular = 0.0;
      if (light > 0.0) {
        specular = max(pow(dot(normal, halfVector), u_shininess), 0.0);
      }
      
      vec4 diffuseTex = texture2D(u_diffuseTexture, v_texcoord);
      gl_FragColor = u_ambientColor;

       // Lets multiply just the color portion (not the alpha)
       // by the light
       gl_FragColor.rgb += (diffuseTex.rgb * u_color.rgb * light * u_lightColor);

       // Just add in the specular
       vec4 specularTex = texture2D(u_specularTexture, v_texcoord);
       // float specularGs = (specularTex.r + specularTex.g + specularTex.b) / 3.0;
      gl_FragColor.rgb += (specular * u_specularColor * specularTex.r);
    }`

