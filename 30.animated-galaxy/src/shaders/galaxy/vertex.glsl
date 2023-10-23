uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    /* Spin */
    // Calculate angle of the point between x and z axis
    float angle = atan(modelPosition.x, modelPosition.z);
    // Distance from the center
    float distanceToCenter = length(modelPosition.xz);
    // Calculate the angle offset
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    // Update the angle
    angle += angleOffset;

    // Animate the position
    modelPosition.x = distanceToCenter * cos(angle);
    modelPosition.z = distanceToCenter * sin(angle);
    // Very fun effect below
    // modelPosition.x = distanceToCenter + cos(angle);
    // modelPosition.z = distanceToCenter + sin(angle);

    // Randmonness
    modelPosition.xyz += aRandomness.xyz;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    // Size
    // Apply size with randomness with aScale attribute
    gl_PointSize = uSize * aScale;
    // Make sizeAttenuation : Closer fragments are bigger, and farther fragments are smaller
    gl_PointSize *= ( 1.0 / - viewPosition.z );

    /* Color */
    vColor = color;
}