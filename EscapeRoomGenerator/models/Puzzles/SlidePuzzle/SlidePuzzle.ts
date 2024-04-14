import { v4 as uuidv4 } from 'uuid';
import { Piece } from "./Piece";
import { Position } from "./Position";
import {shuffleArray} from "../../Helpers";
import { Observable, Observer } from '../ObserverPattern';

export class SlidePuzzle implements Observer, Observable{
    private static puzzles: {[key: string]: SlidePuzzle} = {}

    private observers: Observer[] = [];
    private dependentPuzzles: string[];

    id: string = uuidv4();
    type: string = "slidePuzzle";
    question: string = "Someone messed up the the scientist's decorational puzzle. Can you fix it?";
    description: string = "The last squares are the ones to be empty, the rest should be in order";
    isSolved: boolean = false;
    hints: number = 0;
    estimatedTime: number;
    isLocked: boolean = false;
    
    pieces: (Piece | null)[][];
    private rows: number;
    private cols: number;

    constructor(difficulty: number, dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        if (dependentPuzzles.length > 0){
            this.isLocked = true;
        }
        this.estimatedTime = difficulty * 3; //Arbitrary at the moment
        let randomIncrease = Math.floor(Math.random() * difficulty);
        //(row, col) = EASY => (3, 3), MEDIUM => (3, 4) or (4, 3), HARD => (3, 5) or (5, 3) or (4, 4)
        this.rows = 3 + randomIncrease;
        this.cols = 3 + difficulty - 1 - randomIncrease;
        this.pieces = this.init();
        SlidePuzzle.puzzles[this.id] = this;
    }

    static get(puzzleId: string): SlidePuzzle {
        return SlidePuzzle.puzzles[puzzleId];
    }

    addObserver(observer: Observer): void{
        this.observers.push(observer);
    }
    notifyObservers(): string[] {
        return this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }
    update(id: string): string{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
            return this.id
        }
        return ''
    }

    private init(): (Piece | null)[][] {
        let tempPieces: (Piece | null)[][] = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
        let numbers: number[] = shuffleArray(Array.from({length: this.rows*this.cols - 1}, (_, i) => i + 1));
        let inversionCounter: number = 0;
        //iterate over numbers as if it were a matrix
        for (let index = 0; index < numbers.length; index++){
            let currentNumber = numbers[index];
            for (let precedingIndex = 0; precedingIndex < index; precedingIndex++) {
                if (numbers[precedingIndex] > currentNumber) {
                    inversionCounter++;
                }
            }
            let i = Math.floor(index / this.cols);
            let j = index % this.cols;
            tempPieces[i][j] = new Piece(currentNumber, new Position(i, j));
        }
        //if the puzzle isn't solvable, swap the first two pieces to increase/decrease inversion counter 
            //since they are never null and do not affect the rest of the inversionCounter results
        if (inversionCounter % 2 !== 0) {
            let temp = tempPieces[0][0];
            tempPieces[0][0] = tempPieces[0][1];
            tempPieces[0][0]!.position = new Position(0, 0); //safe since when we come here, only the last piece can be null
            tempPieces[0][1] = temp;
            tempPieces[0][1]!.position = new Position(0, 1); //safe since when we come here, only the last piece can be null
            inversionCounter++;
        }
        return tempPieces;
    }
    
    movePiece(piece: Piece | null, newPos?: Position): boolean {
        if (piece === null){
            return false;
        }
        if(newPos === undefined){
            const possiblePositions = [
                { x: piece.position.x - 1, y: piece.position.y }, //up
                { x: piece.position.x + 1, y: piece.position.y }, //down
                { x: piece.position.x, y: piece.position.y - 1 }, //left
                { x: piece.position.x, y: piece.position.y + 1 }, //right
            ];
            newPos = possiblePositions.find(pos => this.checkValidMove(pos));
        }else{
            if (!this.checkValidMove(newPos)){
                return false;
            }
        }
    
        if (newPos) {
            this.pieces[piece.position.x][piece.position.y] = null;
            this.pieces[newPos.x][newPos.y] = piece;
            piece.position = newPos;
            return true;
        }
        return false;
    }
    
    private checkValidMove(newPos: Position): boolean {
        if (newPos.x < 0 || newPos.x >= this.rows || newPos.y < 0 || newPos.y >= this.cols) {
            return false;
        }
        if (this.pieces[newPos.x][newPos.y] === null){
            return true;
        }
        return false;
    }

    getHint(): boolean{
        //replace the biggest number with the null piece
        if (this.hints === 2) return false

        for (let i = 0; i < this.rows; i++){ //should skip the last piece if hints is 0, the last two if hints is 1, etc.
            for (let j = 0; j < this.cols; j++){ //should skip the last piece if hints is 0, the last two if hints is 1, etc.
                if (this.pieces[i][j] === null) continue;

                if (this.pieces[i][j]!.number === this.rows*this.cols - (1+this.hints)){
                    this.pieces[i][j] = null;
                    this.hints++;
                    return true;
                }
            }
        }
        return false
    }

    checkAnswer(): {result: boolean, unlockedPuzzles: string[]} {
        let previousNumber: number = 0; //numbers start at 1
        let flattenedPieces = this.pieces.flat();
        for (let i = 0; i < flattenedPieces.length - (1+this.hints); i++){ 
            if (flattenedPieces[i] === null){ //if there is a null not at the last space
                return {result: false, unlockedPuzzles: []};
            }
            let tempNumber = flattenedPieces[i]!.number; //safe since we checked for null above
            if (tempNumber < previousNumber){
                return {result: false, unlockedPuzzles: []};
            }
            previousNumber = tempNumber;
        }
        if (!this.isSolved) {
            this.isSolved = true;
            let unlockedPuzzles = this.notifyObservers();
            return {result: true, unlockedPuzzles};
        } 
        return {result: true, unlockedPuzzles: []};
    }

    strip() {
        return {
            type: this.type,
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hints,

            question: this.question,
            description: this.description,
            pieces: this.pieces
        }
    }
}
/*
RULES FOR SOLVABLE SLIDE PUZZLES:
IF WIDTH IS EVEN:
1. The inversion count of a puzzle is the number of 
    pairs of tiles when a tile with a higher number 
    appears before a tile with a lower number is even.

2. The blank tile must be on an even row counting from the 
    bottom (always first row from the bottom in this case).

IF WIDTH IS ODD:
1. The inversion count of a puzzle is the number of 
    pairs of tiles when a tile with a higher number 
    appears before a tile with a lower number is even.
*/

//TODO: possible to add a move counter on the popup