import TWEEN from "@tweenjs/tween.js";

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
      speed: 10,
    },
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
    fov: 35,
    near: 2,
    far: 1000,
    aspect: 16 / 9,
    position: [0, 7.5, -20],
    lookAt: [0, 0, 10],
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
