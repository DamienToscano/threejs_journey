uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
    modelPosition.x += sin(uTime + modelPosition.z) * 0.05;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    // Adapt the point size to the pixel ratio
    gl_PointSize = uSize * aScale * uPixelRatio;
    // Scale the point size by the distance to the camera
    gl_PointSize *= (1.0 / -viewPosition.z);
}