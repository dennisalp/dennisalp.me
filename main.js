import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({ color: 0x151136 });
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill().forEach(addStar);


// Add moving stars

function getRandomFireColor(radius) {
  // Calculate hue based on the radius
  const minRadius = Math.pow(3, 0.03); // Minimum radius for yellow color
  const maxRadius = Math.pow(63, 0.03); // Maximum radius for red color
    const hue = THREE.MathUtils.mapLinear(Math.pow(radius, 0.03)+0.04*Math.random(), minRadius, maxRadius, 0.1667, 0); // Map radius to hue within the range of yellow to red

  // Convert hue to RGB
  const rgbColor = new THREE.Color().setHSL(hue, 0.9, 0.4);

  return rgbColor;
}

function addMovingStar() {

  // Define animation for the star to move around the origin
  const radius = 3 + 60*Math.random()
  const nu =  13 * 2 * Math.PI / Math.pow(radius,2); // Frequency
  const wobblyness = 1 + 0.*Math.random()

  // Randomize fire color based on radius
  const color = getRandomFireColor(radius);
  const material = new THREE.MeshStandardMaterial({ color });

  // Enable roughness and metalness for PBR
  material.roughness = 0.75;
  material.metalness = 0.25;

  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const star = new THREE.Mesh(geometry, material);

  // Calculate position of the star on a sphere
  // const inclination = Math.acos(THREE.MathUtils.randFloatSpread(2) - 1); // Random inclination angle between 0 and PI
  const inclination = 1.5707963267948966;
  const azimuth = THREE.MathUtils.randFloatSpread(1) * Math.PI * 2; // Random azimuth angle

  const x = Math.sin(inclination) * Math.cos(azimuth);
  const y = Math.sin(inclination) * Math.sin(azimuth);
  const z = Math.cos(inclination) + 0.2 * radius * (2*Math.random()-1);

  star.position.set(x, y, z);
  scene.add(star);

  function update() {
    const time = performance.now() * 0.001; // Current time in seconds
    const angle = time * nu; // Update angle based on time
    const rho = radius + 0.2*Math.cos(azimuth+wobblyness*angle); // Radius of the sphere


    // Update position based on spherical coordinates
    const newX = rho * Math.sin(inclination) * Math.cos(azimuth + angle);
    const newY = rho * Math.sin(inclination) * Math.sin(azimuth + angle);
    const newZ = rho * Math.cos(inclination) + z;

    star.position.set(newX+2, newY, newZ-5);
  }

  // Add update function to the render loop
  function render() {
    update();
    requestAnimationFrame(render);
  }
  render();
}

Array(400).fill().forEach(addMovingStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('assets/space.jpg');
scene.background = spaceTexture;

// Avatar

const alpTexture = new THREE.TextureLoader().load('assets/alp.jpg');
const alp = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: alpTexture }));
scene.add(alp);

// Moon

const moonTexture = new THREE.TextureLoader().load('assets/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('assets/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 6;
moon.position.setX(1);

alp.position.z = -5;
alp.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  alp.rotation.y += 0.01;
  alp.rotation.z += 0.01;

  camera.position.z = t * -0.003;
  camera.position.x = t * -0.01;
  // camera.position.x = t * 0.02;
  camera.rotation.y = t * -0.0003;
  camera.rotation.z = t * -0.0003;
}

document.body.onscroll = moveCamera;
moveCamera();

// Setup code...

let animationEnabled = true;
let animationId = null; // Variable to hold the requestAnimationFrame ID

const toggleButton = document.getElementById('toggleButton');
updateToggleButton(); // Call the function to set initial button text

toggleButton.addEventListener('click', () => {
    animationEnabled = !animationEnabled;
    updateToggleButton(); // Call the function to update button text

    if (animationEnabled) {
        animate(); // Restart the animation loop if it's enabled
    } else {
        cancelAnimationFrame(animationId); // Cancel the animation loop if it's disabled
    }
});

function updateToggleButton() {
    if (animationEnabled) {
        toggleButton.innerText = "Make it stop! (and save my CPU and battery)"; // Set button text to indicate animation is on
    } else {
        toggleButton.innerText = "Actually, resume the progress of time!"; // Set button text to indicate animation is off
    }
}

// Animation Loop

function animate() {
  if (!animationEnabled) return; // Exit animation loop if animation is disabled

  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
