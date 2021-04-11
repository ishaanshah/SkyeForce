import Config from "../../data/config";

import Geometry from "../components/geometry";

export default class Bullet {
  constructor(scene, shipPosition, side) {
    this.scene = scene;

    this.ref = new Geometry(scene);
    this.ref.make("cylinder")(
      Config.models.bullets.radius,
      Config.models.bullets.length,
      Config.models.bullets.segments
    );
    const posX = side * Config.models.bullets.position[0] + shipPosition.x;
    const posY = Config.models.bullets.position[1] + shipPosition.y;
    const posZ = Config.models.bullets.position[2] + shipPosition.z;
    this.ref.place(
      [posX, posY, posZ],
      Config.models.bullets.rotation,
      Config.models.bullets.material
    );

    // TODO: add animation
  }

  unload() {
    this.ref.unload();
  }
}
