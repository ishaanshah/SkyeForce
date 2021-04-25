import Model from "../model/model";
import TWEEN from "@tweenjs/tween.js";
import Config from "../../data/config";
import Store from "../../data/store";

class Asteroid extends Model { } 

function setupAnimations(asteroid) {
  // Postion animations
  new TWEEN.Tween(asteroid.ref.position)
    .to({ z: -120}, Config.models.asteroid.animationInterval)
    .onComplete(() => {
      asteroid.unload();
      asteroid.deleted = true;
    })
    .start();
  
  // Rotation animation
  let finalRotation;
  if (Math.random() < 0.5) {
    finalRotation = {
      x: `+${2*Math.PI}`,
      y: `+${2*Math.PI}`
    }
  } else {
    finalRotation = {
      x: `+${2*Math.PI}`,
      z: `+${2*Math.PI}`
    }
  }
  new TWEEN.Tween(asteroid.ref.rotation).to(finalRotation, Config.models.asteroid.animationInterval).repeat(Infinity).start();
}

function spawnAsteroids(asteroidOne, asteroidTwo) {
  const asteroids = []

  // Spawn asteroids
  if (Store.asteroid.canSpawn) {
    Store.asteroid.canSpawn = false;
    
    // Spawn in 1 lane with 0.6 probability
    const positions = []
    let done = false
    if(Math.random() < 0.5) {
      const lane = Math.floor(Math.random() * 3);
      switch(lane) {
        case 0:
          positions.push([7, 0, 150]);
          break;
        case 1:
          positions.push([0, 0, 150]);
          break;
        case 2:
          positions.push([-7, 0, 150]);
          break;
      }
      done = true;
    }
    
    // Spawn in 2 lanes with 0.3 probability
    if (Math.random() < 0.3 / 0.7 && !done) {
      const lane1 = Math.floor(Math.random() * 3);
      let lane2 = lane1
      while (lane1 === lane2) {
        lane2 = Math.floor(Math.random() * 3);
      }
      switch(lane1) {
        case 0:
          positions.push([7, 0, 150]);
          break;
        case 1:
          positions.push([0, 0, 150]);
          break;
        case 2:
          positions.push([-7, 0, 150]);
          break;
      }
      switch(lane2) {
        case 0:
          positions.push([7, 0, 150]);
          break;
        case 1:
          positions.push([0, 0, 150]);
          break;
        case 2:
          positions.push([-7, 0, 150]);
          break;
      }
      done = true;
    }

    // Spawn three asteroids with 0.2 probability
    if (!done) {
      positions.push([7, 0, 150]);
      positions.push([0, 0, 150]);
      positions.push([-7, 0, 150]);
    }
    
    setTimeout(() => {
      Store.asteroid.canSpawn = true;
    }, Config.models.asteroid.canSpawnInterval);
    
    positions.forEach(position => {
      const asteroid = Math.floor(Math.random() * 2) ? asteroidOne.clone() : asteroidTwo.clone();
      asteroid.ref.position.set(...position);
      setupAnimations(asteroid);
      asteroids.push(asteroid);
    })
  }
  return asteroids;
}

export { spawnAsteroids };
export default Asteroid;
