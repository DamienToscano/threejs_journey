void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    float strengthSetting = 0.05;
    float strength = strengthSetting / distanceToCenter - strengthSetting * 2.0;
    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}