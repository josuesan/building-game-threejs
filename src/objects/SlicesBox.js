
import BoxCreator from './BoxCreator';

class SlicesBox {
  constructor(newBox) {
    this.base = new BoxCreator({
      width: newBox.base.width,
      height: newBox.base.height,
      color: newBox.color
    });

    const moveBaseX = newBox.cut.width / 2 * newBox.direction;
    const moveBaseZ = newBox.cut.height / 2 * newBox.direction;

    this.base.position.set(
      (newBox.axis === 'x') ? newBox.lastPosition.x - moveBaseX : newBox.lastPosition.x,
      newBox.lastPosition.y,
      (newBox.axis === 'z') ? newBox.lastPosition.z - moveBaseZ : newBox.lastPosition.z,
    );

    //THE BLOCK CUT

    this.cut = new BoxCreator({
      width: newBox.cut.width,
      height: newBox.cut.height,
      color: newBox.color
    });

    const moveCutX = newBox.base.width / 2 * newBox.direction;
    const moveCutZ = newBox.base.height / 2 * newBox.direction;

    this.cut.position.set(
      (newBox.axis === 'x') ? newBox.lastPosition.x + moveCutX : newBox.lastPosition.x,
      newBox.lastPosition.y,
      (newBox.axis === 'z') ? newBox.lastPosition.z + moveCutZ : newBox.lastPosition.z,
    );
  }

  getBase() {
    return this.base;
  }
  getCut() {
    return this.cut;
  }

}
export default SlicesBox;