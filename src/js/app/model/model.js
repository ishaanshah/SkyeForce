import * as THREE from "three";

import Helpers from "../../utils/helpers";
import { BufferGeometryUtils } from "../../utils/bufferGeometryUtils";
import { GLTFLoader } from "../loaders/GLTFLoader";
import Config from "../../data/config";

// Loads in a single object from the config file (May contain multiple components)
export default class Model {
  constructor(scene, manager, textures) {
    this.scene = scene;
    this.textures = textures;
    this.manager = manager;

    this.ref = null;
  }

  load(modelData) {
    // Manager is passed in to loader to determine when loading done in main
    new GLTFLoader(this.manager).load(
      modelData.path,
      (gltf) => {
        const scene = gltf.scene;
        let mesh;

        const nodes = [];
        scene.traverse(function (node) {
          if (node.isMesh || node.isLight) {
            node.castShadow = Config.shadow.enabled;
          }
          if (node.isMesh) {
            node.material.wireframe = Config.mesh.wireframe;
            mesh = node;
            nodes.push(node);
          }
        });

        const group = new THREE.Group();
        nodes.forEach((node) => group.add(node));
        group.scale.multiplyScalar(modelData.scale);
        group.position.set(...modelData.position);

        BufferGeometryUtils.computeTangents(mesh.geometry);

        this.ref = group;
        this.scene.add(group);

        // To make sure that the matrixWorld is up to date for the boxhelpers
        group.updateMatrixWorld(true);

        // Add to scene
        this.scene.add(scene);
      },
      Helpers.logProgress(),
      Helpers.logError()
    );
  }

  unload() {
    this.scene.remove(this.ref);
  }

  update() {}
}
