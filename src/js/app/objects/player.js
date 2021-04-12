import Model from "../model/model";
import TWEEN from "@tweenjs/tween.js";
import Store from "../../data/store";
import Config from "../../data/config";
import Bullet from "./bullet";

class Player extends Model {
  update() {
    const bullets = [];
    if (!Store.player.animating) {
      // Get rotations and positions
      let posX = "";
      let rotZ = 0;
      if (Store.player.direction === "left" && Store.player.position > -1) {
        posX = "+7";
        rotZ = -Math.PI / 6;
        Store.player.position -= 1;
      } else if (
        Store.player.direction === "right" &&
        Store.player.position < 1
      ) {
        posX = "-7";
        rotZ = +Math.PI / 6;
        Store.player.position += 1;
      }

      // Animate motion
      if (Store.player.direction && posX && rotZ) {
        new TWEEN.Tween(this.ref.position)
          .to({ x: posX }, Config.models.player.animationInterval)
          .easing(Config.easing)
          .onStart(() => (Store.player.animating = true))
          .onComplete(() => (Store.player.animating = false))
          .start();
        new TWEEN.Tween(this.ref.rotation)
          .to({ z: rotZ }, Config.models.player.animationInterval / 2)
          .easing(Config.easing)
          .chain(
            new TWEEN.Tween(this.ref.rotation)
              .to({ z: 0 }, Config.models.player.animationInterval / 2)
              .easing(Config.easing)
          )
          .start();
      }

      // Shoot
      if (Store.player.shoot && Store.player.canShoot) {
        // Create bullets
        bullets.push(new Bullet(this.scene, this.ref.position, 1));
        bullets.push(new Bullet(this.scene, this.ref.position, -1));

        // Make sure player cant shoot more than rate of fire
        Store.player.canShoot = false;
        setTimeout(
          () => (Store.player.canShoot = true),
          (1 / Config.models.player.fireRate) * 1000
        );

        // Animation
        bullets.forEach((bullet) => {
          new TWEEN.Tween(bullet.ref.mesh.position)
            .to({ z: 150 }, Config.models.bullets.animationInterval)
            .onComplete(() => {
              bullet.unload();
              bullet.deleted = true;
            })
            .start();
        });
      }
    }
    Store.player.direction = "";
    Store.player.shoot = false;

    // Return new objects created
    return bullets;
  }
}

export default Player;
