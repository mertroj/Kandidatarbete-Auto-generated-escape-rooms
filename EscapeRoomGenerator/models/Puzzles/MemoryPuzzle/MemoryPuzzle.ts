import { v4 as uuidv4 } from 'uuid';
import { Observer, Observable } from "../ObserverPattern";
import { Piece } from "../SlidePuzzle/Piece";
import { Position } from "../SlidePuzzle/Position";
import { choice } from '../../Helpers';
import { Cell } from './Cell';

export class MemoryPuzzle implements Observer, Observable{
    private static puzzles: {[key: string]: MemoryPuzzle} = {}

    id: string = uuidv4();
    type: string = "memoryPuzzle";
    question: string = "Can you memorize in which places each group of symbols is located?";
    description: string = "Pair each group of symbols with their corresponding location by clicking to flip.";
    isSolved: boolean = false;
    hintLevel: number = 0;
    estimatedTime: number;
    isLocked: boolean = false;
    matchedCells: number; //number of similar symbols in a group to be matched
    cellsMatrix: Cell[][];
    private rows: number;
    private cols: number;
    private dependentPuzzles: string[];
    private observers: Observer[] = [];

    constructor(difficulty: number, dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        this.matchedCells = Math.max(2, difficulty); //2 for easy and medium, 3 for hard
        if (dependentPuzzles.length > 0){
            this.isLocked = true;
        }
        this.estimatedTime = difficulty * 3; //Arbitrary at the moment
        if (difficulty === 1) {
            [this.rows, this.cols] = choice([[3, 4], [4, 3], [2, 6]]);
        } else if (difficulty === 2) {
            [this.rows, this.cols] = choice([[3, 8], [4, 6], [6, 4]]);
        } else { //difficulty === 3 => 36 cells
            [this.rows, this.cols] = choice([[6, 6], [4, 9]]);
        }
        this.cellsMatrix = this.initCells();
        MemoryPuzzle.puzzles[this.id] = this;
    }
    update(id: string): void{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }
    addObserver(observer: Observer): void{
        this.observers.push(observer);
    }
    notifyObservers(): void{
        this.observers.forEach(observer => {
            observer.update(this.id);
        });
    }

    checkAnswer(): boolean {
        for (let row in this.cellsMatrix){
            for (let col in this.cellsMatrix[row]){
                if (this.cellsMatrix[row][col].isMatched){
                    return true;
                }
            }
        }
        return false;
    }

    //TODO: Implement hint system
    getHint(): boolean{
        return false;
    }

    private initCells(): Cell[][] {
        
        return []
    }

    static get(puzzleId: string): MemoryPuzzle {
        return MemoryPuzzle.puzzles[puzzleId];
    }
    
    flipPiece() {
        
    }

    strip() {
        return {
            type: this.type,
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hintLevel: this.hintLevel,
            question: this.question,
            description: this.description,
            cellsMatrix: this.cellsMatrix,
        }
    }
}