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

function addMovingStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
  const star = new THREE.Mesh(geometry, material);

  // Calculate position of the star on a sphere
  // const inclination = Math.acos(THREE.MathUtils.randFloatSpread(2) - 1); // Random inclination angle between 0 and PI
  const inclination = 1.5707963267948966;
  const azimuth = THREE.MathUtils.randFloatSpread(1) * Math.PI * 2; // Random azimuth angle

  const x = Math.sin(inclination) * Math.cos(azimuth);
  const y = Math.sin(inclination) * Math.sin(azimuth);
  const z = Math.cos(inclination);

  star.position.set(x, y, z);
  scene.add(star);

  // Define animation for the star to move around the origin
  const radius = 3 + 60*Math.random()
  const nu =  2 * Math.PI / radius; // Frequency
  const wobblyness = 1 + 0.*Math.random()

  function update() {
    const time = performance.now() * 0.001; // Current time in seconds
    const angle = time * nu; // Update angle based on time
      const rho = radius; // + 0.2*Math.cos(azimuth+wobblyness*angle); // Radius of the sphere


    // Update position based on spherical coordinates
    const newX = rho * Math.sin(inclination) * Math.cos(azimuth + angle);
    const newY = rho * Math.sin(inclination) * Math.sin(azimuth + angle);
    const newZ = rho * Math.cos(inclination);

    star.position.set(newX+2, newY, newZ-5);
  }

  // Add update function to the render loop
  function render() {
    update();
    requestAnimationFrame(render);
  }
  render();
}

Array(200).fill().forEach(addMovingStar);

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

moon.position.z = 30;
moon.position.setX(-10);

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

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
