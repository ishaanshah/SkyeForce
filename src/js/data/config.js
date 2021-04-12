import TWEEN from "@tweenjs/tween.js";

import Material from "../app/components/material";

// This object contains the state of the app
export default {
  isDev: false,
  isShowingStats: true,
  isLoaded: false,
  isTweening: false,
  maxAnisotropy: 1,
  dpr: 1,
  easing: TWEEN.Easing.Quadratic.InOut,
  duration: 500,
  models: {
    player: {
      path: "./assets/models/playerSpaceship.glb",
      scale: 1,
      position: [0, 0, 0],
      animationInterval: 600,
      fireRate: 3, // Six bullets per second (one per gun)
    },
    bullets: {
      material: new Material(0x0000ff).standard,
      position: [0.71, -0.7, 1],
      rotation: [Math.PI / 2, 0, 0],
      radius: 0.1,
      length: 2,
      segments: 8,
      animationInterval: 1500,
    },
    asteroid: {
      paths: ["./assets/models/enemyAsteroid1.glb", "./assets/models/enemyAsteroid2.glb"],
      scale: 1,
      animationInterval: 6000,
      canSpawnInterval: 2000
    },
    star: {
      path: "./assets/models/star.glb",
      scale: 1,
      animationInterval: 6000,
      canSpawnInterval: 2000
    }
  },
  texture: {
    path: "./assets/textures/",
    imageFiles: [{ name: "UV", image: "UV_Grid_Sm.jpg" }],
  },
  mesh: {
    enableHelper: false,
    wireframe: false,
    translucent: true,
    material: {
      color: 0xffffff,
      emissive: 0xffffff,
    },
  },
  fog: {
    color: 0x000000,
    near: 0.0008,
  },
  camera: {
    fov: 15,
    near: 2,
    far: 1000,
    aspect: 16 / 9,
    position: [0, 10, -42],
    lookAt: [0, 0, 10],
    // Custom camera, uncomment to move around
    // position: [250, 0, 0],
    // lookAt: [0, 0, 0],
  },
  ambientLight: {
    enabled: true,
    color: 0x141414,
  },
  directionalLight: {
    enabled: true,
    color: 0xf0f0f0,
    intensity: 0.4,
    x: -75,
    y: 280,
    z: 150,
  },
  shadow: {
    enabled: true,
    helperEnabled: true,
    bias: 0,
    mapWidth: 2048,
    mapHeight: 2048,
    near: 250,
    far: 400,
    top: 100,
    right: 100,
    bottom: -100,
    left: -100,
  },
  pointLight: {
    enabled: true,
    color: 0xffffff,
    intensity: 0.34,
    distance: 115,
    x: 0,
    y: 0,
    z: 0,
  },
  hemiLight: {
    enabled: true,
    color: 0xc8c8c8,
    groundColor: 0xffffff,
    intensity: 0.55,
    x: 0,
    y: 0,
    z: 0,
  },
};
