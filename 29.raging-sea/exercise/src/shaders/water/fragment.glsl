uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultipler;

varying float vElevation;


void main()
{
    // Define color according to wave elevation
    float mixStrength = vElevation * uColorMultipler + uColorOffset;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}