import Keyboard from "../../utils/keyboard";
import Helpers from "../../utils/helpers";
import Config from "../../data/config";
import Store from "../../data/store";

// Manages all input interactions
export default class Interaction {
  constructor(renderer, scene) {
    // Properties
    this.renderer = renderer;
    this.scene = scene;

    this.timeout = null;

    // Instantiate keyboard helper
    this.keyboard = new Keyboard();

    // Listeners
    // Mouse events
    this.renderer.domElement.addEventListener(
      "mousemove",
      (event) => Helpers.throttle(this.onMouseMove(event), 250),
      false
    );
    this.renderer.domElement.addEventListener(
      "mouseleave",
      (event) => this.onMouseLeave(event),
      false
    );
    this.renderer.domElement.addEventListener(
      "mouseover",
      (event) => this.onMouseOver(event),
      false
    );

    // Keyboard events
    this.keyboard.domElement.addEventListener("keydown", (event) => {
      if (event.repeat) {
        return;
      }

      if (this.keyboard.pressed("a")) {
        Store.player.direction = "left";
      } else if (this.keyboard.pressed("d")) {
        Store.player.direction = "right";
      }

      if (this.keyboard.pressed("space")) {
        Store.player.shoot = true;
      }
    });
  }

  onMouseOver(event) {
    event.preventDefault();

    Config.isMouseOver = true;
  }

  onMouseLeave(event) {
    event.preventDefault();

    Config.isMouseOver = false;
  }

  onMouseMove(event) {
    event.preventDefault();

    clearTimeout(this.timeout);

    this.timeout = setTimeout(function () {
      Config.isMouseMoving = false;
    }, 200);

    Config.isMouseMoving = true;
  }
}
