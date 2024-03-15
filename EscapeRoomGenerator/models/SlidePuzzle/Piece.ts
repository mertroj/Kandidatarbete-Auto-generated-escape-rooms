import { Position } from "./Position";
import { v4 as uuidv4 } from 'uuid';

export class Piece{
    id: string;
    number: number;
    position: Position;

    constructor(number: number, position: Position){
        this.id = uuidv4();
        this.position = position;
        this.number = number;
    }
}