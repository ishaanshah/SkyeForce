import * as THREE from "three";

import Config from "../../data/config";

// This helper class can be used to create and then place geometry in the scene
export default class Geometry {
  constructor(scene) {
    this.scene = scene;
    this.geo = null;
  }

  make(type) {
    if (type === "plane") {
      return (width, height, widthSegments = 1, heightSegments = 1) => {
        this.geo = new THREE.PlaneGeometry(
          width,
          height,
          widthSegments,
          heightSegments
        );
      };
    }

    if (type === "sphere") {
      return (radius, widthSegments = 32, heightSegments = 32) => {
        this.geo = new THREE.SphereGeometry(
          radius,
          widthSegments,
          heightSegments
        );
      };
    }

    if (type === "cylinder") {
      return (radius, height, radialSegments = 32, heightSegments = 1) => {
        this.geo = new THREE.CylinderGeometry(
          radius,
          radius,
          height,
          radialSegments,
          heightSegments
        );
      };
    }
  }

  place(position, rotation, material) {
    this.mesh = new THREE.Mesh(this.geo, material);

    // Use ES6 spread to set position and rotation from passed in array
    this.mesh.position.set(...position);
    this.mesh.rotation.set(...rotation);

    if (Config.shadow.enabled) {
      this.mesh.receiveShadow = true;
    }

    this.scene.add(this.mesh);
  }

  unload() {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
  }
}
