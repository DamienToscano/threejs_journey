varying vec3 vColor;

void main()
{
    // We can get vertex coordinates from the gl_pointCoord variable
    // It's the same than the vUv in the previous lessons


    // Disc point pattern
    // Get the distance of the gl_PointCoord from the center
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // Use step to draw a circle
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // Diffuse point pattern
    // Get the distance *2 from the center
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // Invert
    // strength = 1.0 - strength;

    // Light point pattern
    // Get the distance from the center
    float strength = distance(gl_PointCoord, vec2(0.5));
    // Invert the value
    strength = 1.0 - strength;
    // Use pow to have non linear light decrease.
    strength = pow(strength, 10.0);

    // Final color
    // Mix the color with black depending on the strength
    vec3 color = mix(vec3(0.0), vColor, strength);


    gl_FragColor = vec4(vec3(color), 1.0);
}