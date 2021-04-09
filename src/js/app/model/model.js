import * as THREE from 'three';

import Material from '../components/material';
import Helpers from '../../utils/helpers';
import { BufferGeometryUtils } from '../../utils/bufferGeometryUtils';
import { GLTFLoader } from '../loaders/GLTFLoader';
import Config from '../../data/config';

// Loads in a single object from the config file
export default class Model {
  constructor(scene, manager, textures) {
    this.scene = scene;
    this.textures = textures;
    this.manager = manager;

    this.obj = null;
    this.ref = null;
  }

  load(modelData) {
    // Manager is passed in to loader to determine when loading done in main
    new GLTFLoader(this.manager).load(
      modelData.path,
      (gltf) => {
        const scene = gltf.scene;
        let mesh;
        if (Config.shadow.enabled) {
          scene.traverse(function(node) {
            if (node.isMesh || node.isLight) node.castShadow = true;
            if (node.isMesh) {
              node.material.wireframe = Config.mesh.wireframe;
              mesh = node;
              mesh.scale.multiplyScalar(modelData.scale);
              // mesh.position.set(...modelData.position)
            }
          });
        }

        this.obj = mesh;

        BufferGeometryUtils.computeTangents(mesh.geometry);

        var group = new THREE.Group();
        group.scale.multiplyScalar(0.25);
        this.scene.add( group );

        this.ref = group;

        // To make sure that the matrixWorld is up to date for the boxhelpers
        group.updateMatrixWorld(true);
        group.add(mesh);

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
}
