import BoxCreator from './BoxCreator';
import generateColor from '../helpers/generateColors';
import Observer, { EVENTS } from '../Observer';

class Box extends BoxCreator {
  constructor({ width, height, last }) {
    super({ width, height, color: generateColor() });
    this.last = last;
    this.position.y = last.position.y + last.geometry.parameters.height / 2 + this.geometry.parameters.height / 2;
    this.maxPosition = 360;
    this.isStopped = false;
    this.direction = 1;
    this.velocity = 4;
    this.currentAxis = (Math.random() >= 0.5) ? 'x' : 'z';
    this.oppositeAxis = (this.currentAxis === 'x') ? 'z' : 'x';
    this.position[this.currentAxis] -= this.maxPosition * this.direction;
    this.position[this.oppositeAxis] = last.position[this.oppositeAxis];
  }

  place() {
    const plane = (this.currentAxis === 'x') ? 'width' : 'height';
    const distanceToCenter = this.position[this.currentAxis] - this.last.position[this.currentAxis];
    const overlay = this.last.dimension[plane] - Math.abs(distanceToCenter);

    if (overlay <= 0) {
      Observer.emit(EVENTS.gameover);
      return;
    }

    const cut = this.last.dimension[plane] - overlay;
    const newBox = {
      base: {
        width: (plane === 'width') ? overlay : this.dimension.width,
        height: (plane === 'height') ? overlay : this.dimension.height,
      },
      cut: {
        width: (plane === 'width') ? cut : this.dimension.width,
        height: (plane === 'height') ? cut : this.dimension.height,
      },
      color: this.color,
      axis: this.currentAxis,
      lastPosition: this.position,
      direction: distanceToCenter / Math.abs(distanceToCenter) || 1
    }
    Observer.emit(EVENTS.stack, newBox);
  }

  update() {
    if (!this.isStopped) {
      this.position[this.currentAxis] += this.direction * this.velocity;
      if (Math.abs(this.position[this.currentAxis]) >= this.maxPosition) {
        this.direction *= -1;
      }
    }
  }
}

export default Box;