import Observer, { EVENTS } from "../Observer";

class UserInterface {
  constructor() {
    this.points = document.getElementById('points');
    this.btnStart = document.getElementById('btn-start');
    this.gameover = document.getElementById('gameover');
    this.events();
  }

  events() {
    Observer.on(EVENTS.newGame, () => {
      this.btnStart.style.top = '22%';
      this.btnStart.classList.add('animate__fadeInDown');
    });
    Observer.on(EVENTS.start, () => {
      this.btnStart.classList.add('animate__fadeOutUp');
      this.points.style.top = '22%';
      this.points.classList.add('animate__fadeInDown');
      this.gameover.classList.add('animate__fadeOutUp');
    });
    Observer.on(EVENTS.updatePoints, (points) => {
      this.points.innerHTML = points;
    });
    Observer.on(EVENTS.gameover, () => {
      this.points.style.top = '22%';
      this.gameover.style.top = '10%';
      this.gameover.classList.remove('animate__fadeOutUp');
      this.gameover.classList.add('animate__fadeInUp');
    });
  }
}

export default UserInterface;