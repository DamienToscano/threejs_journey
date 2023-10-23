// Types exemples
// int
// float
// bool
// vec2 (2d coordinates : x and y) -> vec2 foo = vec2(1.0,2.0);
// vec3 (3d coordinates : x, y and z OR r, g and b for colors) -> vec3 foo = vec3(1.0,2.0,3.0);
// We can create a vector3 from a vector2 -> vec3 foo = vec3(vec2(1.0,2.0),3.0);
// We can create a vecot2 from partially using a vector3 -> vec2 bar = foo.xz;
// vec4 (4d coordinates : x, y, z and w OR r, g, b, a) -> vec4 foo = vec4(1.0,2.0,3.0,4.0);

// We have access to practical functions like : cross, dot, mix, step, smoothstep, length, distance, reflect, refract, normalize

// We have access to uniforms,
// For having the same shader but with different results
// Being able to tweak values
// Animating values

// Online docs: https://shaderific.com/ , https://www.khronos.org/registry/ , https://thebookofshaders.com/

// Usefull to position the vertices in the render
// projectionMatrix = transform transform the coordinates into the final clip space coordinates
// uniform mat4 projectionMatrix;
// viewMatrix = apply transformations relative to the camera position, rotation, fov, near, far
// uniform mat4 viewMatrix;
// modelMatrix = Apply transormations relative to the Mesh position, rotation, scale
// uniform mat4 modelMatrix;
// Get the uniforms defined in the RawShaderMaterial
uniform vec2 uFrequency;
uniform float uTime;

// position attribute is coming from the PlaneBufferGeometry
// attribute vec3 position;
// aRandom attribute
// attribute float aRandom;
// Get uv from material
// attribute vec2 uv;
// Send it in the fragment shader
varying vec2 vUv;
varying float vElevation;

// Varying to send the value to the fragment shader
// varying float vRandom;

// main function is called automatically by the GPU
// Does nor return anything
// gl_Position is a special variable that is used to store the final position of the vertex, it already exists, we don't have to instanciate it
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime * 4.0) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y  - uTime * 2.0) * 0.1;

    // We can create a flag effect by updating z position according to x position
    modelPosition.z += elevation;
    // modelPosition.z = aRandom * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Update the varying random with the attribute value
    // vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}