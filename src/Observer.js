import EventEmitter from "eventemitter3";

export const EVENTS = {
    start: 'START',
    click: 'CLICK',
    gameover: 'GAME OVER',
    stack: 'STACK',
    newGame: 'NEW GAME',
    updatePoints: 'UPDATE POINTS',
}

const Observer = new EventEmitter();
export default Observer;
