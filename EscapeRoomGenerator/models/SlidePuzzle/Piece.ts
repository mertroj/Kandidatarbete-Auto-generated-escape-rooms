import { Position } from "./Position";

export class Piece{
    number: number;
    position: Position;

    constructor(number: number, position: Position){
        this.position = position;
        this.number = number;
    }
}