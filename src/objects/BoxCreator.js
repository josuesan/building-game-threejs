import { Mesh, BoxBufferGeometry, MeshStandardMaterial, TextureLoader } from 'three';
const loader = new TextureLoader();
class BoxCreator extends Mesh {
  constructor({ width, height, alt = 40, color }) {
    super();
    this.geometry = new BoxBufferGeometry(width, alt, height);

    this.material = new MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: .15,
      // map: loader.load('https://josuesan.github.io/building-game-threejs/assets/textures/wood.jpg')

    });
    this.material.color.convertSRGBToLinear();

    /* CUSTOM PROPERITIES */
    this.color = color;
    this.dimension = { width, height };
  }
}

export default BoxCreator;