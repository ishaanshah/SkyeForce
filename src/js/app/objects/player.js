import Model from "../model/model";
import TWEEN from "@tweenjs/tween.js";
import Store from "../../data/store";
import Config from "../../data/config";

class Player extends Model {
  update() {
    if (!Store.player.animating) {
      if (Store.player.direction === "left" && Store.player.position > -1) {
        new TWEEN.Tween(this.ref.position)
          .to({ x: "+7" }, Config.models.player.animationInterval)
          .easing(Config.easing)
          .onStart(() => (Store.player.animating = true))
          .onComplete(() => (Store.player.animating = false))
          .start();
        new TWEEN.Tween(this.ref.rotation)
          .to({ z: -Math.PI / 6 }, Config.models.player.animationInterval / 2)
          .easing(Config.easing)
          .chain(
            new TWEEN.Tween(this.ref.rotation)
              .to({ z: 0 }, Config.models.player.animationInterval / 2)
              .easing(Config.easing)
          )
          .start();
        Store.player.position -= 1;
      } else if (
        Store.player.direction === "right" &&
        Store.player.position < 1
      ) {
        new TWEEN.Tween(this.ref.position)
          .to({ x: "-7" }, Config.models.player.animationInterval)
          .easing(Config.easing)
          .onStart(() => (Store.player.animating = true))
          .onComplete(() => (Store.player.animating = false))
          .start();
        new TWEEN.Tween(this.ref.rotation)
          .to({ z: Math.PI / 6 }, Config.models.player.animationInterval / 2)
          .easing(Config.easing)
          .chain(
            new TWEEN.Tween(this.ref.rotation)
              .to({ z: 0 }, Config.models.player.animationInterval / 2)
              .easing(Config.easing)
          )
          .start();
        Store.player.position += 1;
      }
    }
    Store.player.direction = "";
  }
}

export default Player;
