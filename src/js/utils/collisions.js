import * as THREE from "three"

export default function getCollisions(mesh, collidableMeshList) {
  const meshBox = new THREE.Box3().setFromObject(mesh);
  const collidableMeshListBox = collidableMeshList.map(collidableMesh => (
    new THREE.Box3().setFromObject(collidableMesh)
  ))

  const hits = collidableMeshListBox.map((collidableMesh) => (
    collidableMesh.intersectsBox(meshBox)
  ))

  return hits.reduce((out, hit, idx) => hit ? out.concat(idx) : out, []);
}
