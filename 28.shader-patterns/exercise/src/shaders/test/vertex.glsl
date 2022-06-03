varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // Sending the uv coordinate to the fragment shader
    vUv = uv;
}