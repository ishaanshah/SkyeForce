// Global imports -
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

// Local imports -
// Components
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Light from "./components/light";

// Helpers
import Stats from "./helpers/stats";

// Model
import Texture from "./model/texture";

// Managers
import Interaction from "./managers/interaction";

// data
import Config from "./../data/config";
import Store from "../data/store";

// objects
import Player from "./objects/player";
import Asteroid, { spawnAsteroids } from "./objects/asteroid";
import Star, { spawnStars } from "./objects/stars";

// utils
import getCollisions from "../utils/collisions"
// -- End of imports

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor(container) {
    // Set container property to container element
    this.container = container;

    // Start Three clock
    this.clock = new THREE.Clock();

    // Main scene creation
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Get Device Pixel Ratio first for retina
    if (window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    // Main renderer constructor
    this.renderer = new Renderer(this.scene, container);

    // Components instantiations
    this.camera = new Camera(this.renderer.threeRenderer);
    this.light = new Light(this.scene);

    // Create and place lights in scene
    const lights = ["ambient", "directional", "point", "hemi"];
    lights.forEach((light) => this.light.place(light));

    // Set up rStats if dev environment
    if (Config.isDev && Config.isShowingStats) {
      this.stats = new Stats(this.renderer);
      this.stats.setUp();
    }

    // Instantiate score and health
    this.health = 100;
    this.score = 0;

    // Instantiate texture class
    this.texture = new Texture();

    // Start loading the textures and then go on to load the model after the texture Promises have resolved
    this.texture.load().then(() => {
      this.manager = new THREE.LoadingManager();

      this.scene.background = this.texture.textures.Background;

      // Load models
      // Load player model
      this.player = new Player(this.scene, this.manager, this.texture.textures);
      this.player.load(Config.models.player);

      // Load asteroid models
      this.asteroidOne = new Asteroid(this.scene, this.manager, this.textures);
      const asteroidOneData = {
        position: [1000, 1000, 1000],
        path: Config.models.asteroid.paths[0],
        ...Config.models.asteroid
      }
      this.asteroidOne.load(asteroidOneData);

      this.asteroidTwo = new Asteroid(this.scene, this.manager, this.textures);
      const asteroidTwoData = {
        position: [1000, 1000, 1000],
        path: Config.models.asteroid.paths[1],
        ...Config.models.asteroid
      }
      this.asteroidTwo.load(asteroidTwoData);

      // Load star model
      this.star = new Star(this.scene, this.manager, this.textures);
      this.star.load({
        position: [1000, 1000, 1000],
        ...Config.models.star
      })

      // Array to store asteroids, bullets and stars
      this.asteroids = [];
      this.bullets = [];
      this.stars = [];

      // onProgress callback
      this.manager.onProgress = (item, loaded, total) => {
        console.log(`${item}: ${loaded} ${total}`);
      };

      // All loaders done now
      this.manager.onLoad = () => {
        // Set up interaction manager with the app now that the model is finished loading
        new Interaction(
          this.renderer.threeRenderer,
          this.scene,
        );

        // Everything is now fully loaded
        Config.isLoaded = true;
        this.container.querySelector("#status").style.display = "none";

        setTimeout(() => {
          Store.star.canSpawn = true
        }, Config.models.star.canSpawnInterval / 2);

        // TODO: Remove this
        setInterval(() => {
          console.log(this.score, this.health);
        }, 3000)
        
        // Start rendering now
        this.render();
      };
    });
  }

  render() {
    // Render rStats if Dev
    if (Config.isDev && Config.isShowingStats) {
      Stats.start();
    }

    // Call render function and pass in created scene and camera
    this.renderer.render(this.scene, this.camera.threeCamera);

    // rStats has finished determining render call now
    if (Config.isDev && Config.isShowingStats) {
      Stats.end();
    }

    if (this.health <= 0) {
      Store.gameOver = true;
      this.container.querySelector("#status").style.display = "initial";
      this.container.querySelector("#status").style.fontSize = "48";
      this.container.querySelector("#status").innerHTML = "Game Over!";
      return;
    }

    // Delta time is sometimes needed for certain updates
    // const delta = this.clock.getDelta();

    // Call any vendor or module frame updates here
    TWEEN.update();

    // Get bullets shot
    this.bullets = this.bullets.concat(this.player.update());

    // Get asteroid spawned
    this.asteroids = this.asteroids.concat(spawnAsteroids(this.asteroidOne, this.asteroidTwo))

    // Get stars spawned
    this.stars = this.stars.concat(spawnStars(this.star));

    // Check collisions
    const collidableAsteroids = this.asteroids.filter(asteroid => !asteroid.deleted);
    const collidableBullets = this.bullets.filter(bullet => !bullet.deleted);
    const collidableStars = this.stars.filter(star=> !star.deleted);

    // Player - Asteroid
    let collisions= getCollisions(this.player.ref, collidableAsteroids.map(asteroid => asteroid.ref));
    if(collisions.length > 0) {
      this.health += Config.models.asteroid.health;
    }
    collisions.forEach(asteroidIdx => {
      collidableAsteroids[asteroidIdx].unload();
      collidableAsteroids[asteroidIdx].deleted = true;
    })

    // Player - Star
    collisions = getCollisions(this.player.ref, collidableStars.map(star => star.ref));
    if(collisions.length > 0) {
      this.score += Config.models.star.score;
    }
    collisions.forEach(starIdx => {
      collidableStars[starIdx].unload();
      collidableStars[starIdx].deleted = true;
    })

    // Bullet - Asteroid
    // Iterate in pairs, because bullets are stored as pairs
    for (let i = 0; i < collidableBullets.length; i += 2) {

      // Delete asteroids
      const collisions = getCollisions(collidableBullets[i].ref.mesh, collidableAsteroids.map(asteroid => asteroid.ref));
      console.log(collisions.length);
      collisions.forEach(asteroidIdx => {
        collidableAsteroids[asteroidIdx].unload();
        collidableAsteroids[asteroidIdx].deleted = true;
        this.score += Config.models.asteroid.score;
      })

      // Delete bullets
      if (collisions.length) {
        collidableBullets[i].unload();
        collidableBullets[i].deleted = true;
        collidableBullets[i+1].unload();
        collidableBullets[i+1].deleted = true;
      }
    }

    // Update HUD
    this.container.querySelector("#healthHUD").innerHTML = this.health;
    this.container.querySelector("#scoreHUD").innerHTML = this.score;

    // RAF
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
