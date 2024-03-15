import { Position } from "./Position";
import { v4 as uuidv4 } from 'uuid';

export class Piece{
    number: number;
    position: Position;

    constructor(number: number, position: Position){
        this.position = position;
        this.number = number;
    }
}