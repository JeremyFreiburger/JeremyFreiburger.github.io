// import '../style.css';
import * as THREE from '../node_modules/three/build/three.module.js';
// import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';



// Setup
const scene = new THREE.Scene();

// 3 cameras, fov, aspect ratio, objects visible
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper)


function addRing() {

    const innerRadius = 10;
    const outerRadius = 2.2;
    const thetaSegments = 10;
    const phiSegments = 6;
    const thetaStart = 0;
    const thetaLength = 1;

    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const ring = new THREE.Mesh(geometry, material);



    const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  ring.position.set(x, y, z);
  scene.add(ring);
}
//Array(500).fill().forEach(addRing);

// Create the winding river
const riverWidth = 10;
const riverLength = 200;
const riverSegments = 100;
const riverGeometry = new THREE.PlaneBufferGeometry(riverWidth, riverLength, riverSegments, riverSegments);
const riverMaterial = new THREE.MeshBasicMaterial({ color: 0x0055ff }); // Blue color for the river
const river = new THREE.Mesh(riverGeometry, riverMaterial);

// Apply a winding sinusoidal wave to the river geometry along the X-axis
const waveFrequency = 4; // Adjust this to control the winding frequency
const positionAttribute = riverGeometry.attributes.position;
const widthHalf = riverWidth / 2;

for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);
    const progress = (vertex.y / riverLength) * Math.PI * 2 * waveFrequency;
    vertex.x += Math.sin(progress) * widthHalf;
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
}
riverGeometry.computeVertexNormals();
river.rotation.x = -Math.PI / 2; // Rotate the river to lie flat on the ground

scene.add(river);


const sunRadius = 35;
const sunSegments = 64;
const sunGeometry = new THREE.CircleGeometry(sunRadius, sunSegments, sunSegments);
const sunMaterial = new THREE.MeshPhongMaterial({ color: 0xfdb813 }); // Yellow color for the sun
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

sun.position.x = 0;
sun.position.y = 100;
sun.position.z = -250;


const scaleFactor = 1; // Adjust this value to control the scaling
camera.position.set(0, 15, 35);
// Update the camera's position to move it closer
camera.position.set(
    camera.position.x * scaleFactor,
    camera.position.y * scaleFactor,
    camera.position.z * scaleFactor
);

// Update the camera's lookAt to maintain the same relative view
camera.lookAt(0, 0, 0);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();




// Initialize ambient light with an initial color and intensity
const daytimeColor = new THREE.Color(0xffffff); // White color for daytime
const sunsetColor = new THREE.Color(0xffa500); // Orange color for sunset
const ambientLight = new THREE.AmbientLight(daytimeColor, 0.5); // Adjust the intensity as desired
scene.add(ambientLight);

 // Replace this with the actual calculated sun's color

// Set the CSS custom property (CSS variable) with the sun's color

// Power factor to control fading speed (higher values fade faster)
const fadingPower = 0.1; // Adjust this value as needed
const minAmbientIntensity = .5; // Adjust this value to set the minimum ambient light intensity

// Your existing updateSunPosition function
function updateSunPosition() {
    const scrollPosition = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollPosition / maxScroll;
    const maxHeight = 100; // Adjust this to control how high the sun rises

    sun.position.y = Math.max(maxHeight * (1 - percentage), -maxHeight); // Lower the sun as the user scrolls down


    // Calculate the intensity and color of the ambient light based on sun position
    const maxIntensity = 1.0; // Adjust this to set the maximum ambient light intensity
    const ambientIntensity = Math.max(maxIntensity * Math.pow(1 - percentage, fadingPower), minAmbientIntensity);
    ambientLight.intensity = ambientIntensity;

    // Calculate the color of the ambient light for the sunset effect
    const colorInterpolator = new THREE.Color();
    colorInterpolator.copy(daytimeColor);
    colorInterpolator.lerp(sunsetColor, Math.pow(percentage, fadingPower));
    document.documentElement.style.setProperty('--sun-color', colorInterpolator.getStyle());

    ambientLight.color = colorInterpolator;
}


window.addEventListener('scroll', updateSunPosition);


function animate() {
  requestAnimationFrame(animate);

  updateSunPosition();

   //controls.update();

  renderer.render(scene, camera);
}

animate();
