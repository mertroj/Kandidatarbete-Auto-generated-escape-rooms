import {EscapeRoom, point} from "./types";

function getRandomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateEscapeRoom(players: number, difficulty: number) : EscapeRoom {
    let er = new EscapeRoom();
    return er;
}

let er = generateEscapeRoom(3, 1);
console.log(er);