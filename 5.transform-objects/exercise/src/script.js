import './style.css'
import * as THREE from 'three'

// 4 properties to tranform an object
// Position 
// Scale
// Rotation
// Quaternion : rotation in 3D space

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// // mesh.position.x = 0.7;
// // mesh.position.y = -0.6;
// // mesh.position.z = 0.5;

// /* Position */
// // It's possible to update 3 positions at once with set methods
// mesh.position.set(0.7, -0.6, 0.5);

// scene.add(mesh)

// // mesh.position.normalize();
// // normalize will reduce the vector length to 1

// // Position is a Vector3, which has a lot of properties and method
// console.log('Length -> ' + mesh.position.length());

// // Scale -> Resize element in the three axes
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;

// // Can use set too
// // mesh.scale.set(2, 0.5, 0.5);

// // Rotation. Use rotation or quaternion. Updating one will automatically update the other

// // With rotation. Has properties x, y and z. Imagine you put a stick in the center of the object and move it around the stick. The good property is the angle of the stick.
// // For half a rotation, use PI
// // mesh.rotation.y = Math.PI;

// // ATTENTION: Be careful with the axes changes after each rotation. The order of rotations is important, it can lock an axe. In case of problem, change order
// // mesh.rotation.reorder('YXZ');
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.1;

// With quaternion avoid the rotations problems. But it is based on mathematical approach, it is much harder to understand

/* We recreate cubes but within a group */

const group = new THREE.Group();
scene.add(group);

// We can instantiate geometry and Material directly in the mesh
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

// Add the cube to the group
group.add(cube1);

// Cube 2
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xfff000 })
);
group.add(cube2);
cube2.position.set(-2, 0, 0);

// Cube 3
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xfffff0 })
);
group.add(cube3);
cube3.position.set(2, 0, 0);

// Affect the whole group
group.position.set(0, 0, -1);
group.scale.y = 2;
group.rotation.x = Math.PI * 0.25;


// Axes Helper -> Create some axes to the scene, to help visualize the object on the scene
const axesHelpers = new THREE.AxesHelper(2);

scene.add(axesHelpers);

// It is possible to create a group of elements ina scene. And this group can be modified with position, rotattion, scale, quaternion

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// lookAt, it is possible to make the camera look at the center at the object
// camera.lookAt(mesh.position);

// Calcul the distance between the object and the camera
// console.log('Distance to camera -> ' + mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)