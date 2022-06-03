// Define how precise can be a float
// Usually use mediump precision, good performance and work evreywhere
// precision mediump float;

uniform vec3 uColor;
// sampler2D is the type for textures
uniform sampler2D uTexture;

// Get the varying from the vertex shader
// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

// Called automatically
void main()
{
    // Values for defining the color (r, g, b, a)
    // gl_FragColor = vec4(vRandom * 0.5, vRandom, 1.0, 1.0);
    // Use the color setted in the material
    // gl_FragColor = vec4(uColor, 1.0);

    // Use the color of our texture to color the flag
    // texture2D is a function used to take a color from a texture
    // uTexture is the texture we want to use
    // The second parameter is the position on the texture we want to grab the color
    vec4 textureColor = texture2D(uTexture, vUv);
    // Update the color textures according to elevation
    textureColor.rgb *= vElevation * 2.0 + 0.7;
    // !!! If we want to debug a value, send it to gl_FragColor
    gl_FragColor = textureColor;
}