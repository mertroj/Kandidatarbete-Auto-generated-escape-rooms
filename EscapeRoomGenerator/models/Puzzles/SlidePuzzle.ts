import { v4 as uuidv4 } from 'uuid';
import {range, repeat, shuffleArray} from "../Helpers";
import { Observable, Observer } from '../ObserverPattern';
import { Theme } from '../Theme';
import { generateThemedPuzzleText } from '../ChatGPTTextGenerator';

export interface Position {
    row: number;
    col: number;
}

type Cells = (number | null)[][];

export class SlidePuzzle implements Observer, Observable{
    private static puzzles: {[key: string]: SlidePuzzle} = {};
    static type = "slidePuzzle";

    private observers: Observer[] = [];
    private dependentPuzzles: string[];

    id: string = uuidv4();
    type: string = SlidePuzzle.type;
    question: string = "Someone messed up the the order of the numbers here. Can you fix it?";
    description: string = "The last squares are the ones to be empty, the rest should be in order";
    isSolved: boolean = false;
    hintLevel: number = 0;
    estimatedTime: number;
    isLocked: boolean = false;
    
    pieces: Cells;
    private rows: number;
    private cols: number;

    constructor(difficulty: number, dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        this.isLocked = dependentPuzzles.length > 0;
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
    notifyObservers(): void {
        this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }
    update(id: string): void {
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }

    private init(): Cells {
        let tempPieces: Cells = repeat(this.rows, () => repeat(this.cols, () => null))
        let numbers: number[] = shuffleArray(range(1, this.rows*this.cols));
        let inversionCounter: number = 0;
        //iterate over numbers as if it were a matrix
        for (let index = 0; index < numbers.length; index++){
            let currentNumber = numbers[index];
            for (let precedingIndex = 0; precedingIndex < index; precedingIndex++) {
                if (numbers[precedingIndex] > currentNumber) {
                    inversionCounter++;
                }
            }
            let row = Math.floor(index / this.cols);
            let col = index % this.cols;
            tempPieces[row][col] = currentNumber;
        }
        //if the puzzle isn't solvable, swap the first two pieces to increase/decrease inversion counter 
            //since they are never null and do not affect the rest of the inversionCounter results
        if (inversionCounter % 2 !== 0) {
            let temp = tempPieces[0][0];
            tempPieces[0][0] = tempPieces[0][1];
            tempPieces[0][1] = temp;
            inversionCounter++;
        }
        return tempPieces;
    }

    async applyTheme(theme: Theme): Promise<void> {
        this.question = await generateThemedPuzzleText(this.question, theme);
        this.description = await generateThemedPuzzleText(this.description, theme);
    }

    private checkValidMove(newPos: Position): boolean {
        if (newPos.row < 0 || newPos.row >= this.rows || newPos.col < 0 || newPos.col >= this.cols) {
            return false;
        }
        if (this.pieces[newPos.row][newPos.col] === null){
            return true;
        }
        return false;
    }
    
    movePiece(pos: Position, newPos?: Position): boolean {
        if (this.isSolved || this.isLocked) return false;

        if (!newPos && this.hintLevel > 0) return false;

        let piece = this.pieces[pos.row][pos.col];
        if (piece === null) return false;
        if(newPos === undefined){
            const possiblePositions = [
                { row: pos.row, col: pos.col-1 }, //left
                { row: pos.row, col: pos.col+1 }, //right
                { row: pos.row-1, col: pos.col }, //up
                { row: pos.row+1, col: pos.col }, //down
            ];
            newPos = possiblePositions.find(pos => this.checkValidMove(pos));
        }
        
        if (!newPos) return false;
        
        this.pieces[pos.row][pos.col] = null;
        this.pieces[newPos.row][newPos.col] = piece;
        this.checkAnswer();
        return true;
    }

    getHint(): boolean {
        if (this.isSolved || this.isLocked || this.hintLevel === 2) return false;

        //replace the biggest number with the null piece
        let number = this.rows*this.cols - 1 - this.hintLevel++;

        this.pieces = this.pieces.map((row) => {
            return row.map((piece) => {
                if (piece === number) 
                    return null;
                return piece;
            })
        })
        this.checkAnswer();
        return true;
    }

    private checkAnswer(): boolean {
        if (this.isSolved || this.isLocked) return false;

        let previousNumber: number = 0; //numbers start at 1
        let result = this.pieces.flat().slice(0, -1-this.hintLevel).every((val) => {
            if (val === null || val < previousNumber) return false;
            previousNumber = val;
            return true;
        });
        if (result && !this.isSolved) {
            this.isSolved = true;
            this.notifyObservers();
        } 
        return result;
    }

    strip() {
        return {
            type: this.type,
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hintLevel,

            question: this.question,
            description: this.description,
            pieces: this.pieces
        };
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