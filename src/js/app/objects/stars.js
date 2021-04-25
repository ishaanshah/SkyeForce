import Model from "../model/model";
import TWEEN from "@tweenjs/tween.js";
import Config from "../../data/config";
import Store from "../../data/store";

class Star extends Model { } 

function setupAnimations(star) {
  // Postion animations
  new TWEEN.Tween(star.ref.position)
    .to({ z: -120}, Config.models.star.animationInterval)
    .onComplete(() => {
      star.unload();
      star.deleted = true;
    })
    .start();
  
  new TWEEN.Tween(star.ref.rotation)
    .to({y: 2*Math.PI}, Config.models.star.animationInterval / 4)
    .repeat(Infinity)
    .start();
}

function spawnStars(star) {
  const stars = []

  // Spawn stars
  if (Store.star.canSpawn) {
    Store.star.canSpawn = false;
    
    // Spawn in 1 lane with 0.4 probability
    const positions = []
    let done = false
    if(Math.random() < 0.4) {
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
    if (Math.random() < 0.3 / 0.4 && !done) {
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

    // Spawn three stars with 0.3 probability
    if (!done) {
      positions.push([7, 0, 150]);
      positions.push([0, 0, 150]);
      positions.push([-7, 0, 150]);
    }
    
    setTimeout(() => {
      Store.star.canSpawn = true;
    }, Config.models.star.canSpawnInterval);
    
    positions.forEach(position => {
      const newStar = star.clone();
      newStar.ref.position.set(...position);
      setupAnimations(newStar);
      stars.push(newStar);
    })
  }
  return stars;
}

export { spawnStars };
export default Star;
