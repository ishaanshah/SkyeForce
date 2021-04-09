import { Vector3 } from "three";
import Model from "../model/model";
import TWEEN from "@tweenjs/tween.js";
import Store from "../../data/store";

class Player extends Model {
  update(velocity) {
    this.ref.position.add(new Vector3(Store.player.direction * velocity, 0, 0));
    Store.player.direction = 0;
  }
}

export default Player;
