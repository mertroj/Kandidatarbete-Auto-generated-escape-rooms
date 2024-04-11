import { v4 as uuidv4 } from 'uuid';
import { Observer, Observable } from "../ObserverPattern";
import { Piece } from "../SlidePuzzle/Piece";
import { choice, randomInt, shuffleArray } from '../../Helpers';
import { Cell } from './Cell';
import { Theme } from '../../Theme';
import path from "path";
const imagesData = require('../../../themedImages.json');

export class MemoryPuzzle implements Observer, Observable{
    private static puzzles: {[key: string]: MemoryPuzzle} = {}

    id: string = uuidv4();
    type: string = "memoryPuzzle";
    question: string = "Can you memorize in which places each group of symbols is located?";
    description: string;
    isSolved: boolean = false;
    hintLevel: number = 0;
    estimatedTime: number;
    isLocked: boolean = false;
    matchedCells: number; //number of similar symbols in a group to be matched
    cellsMatrix: Cell[][];
    valuesToSymbols: Array<[number, string]>;
    private currentlyFlipped: number[][] = [];
    private rows: number;
    private cols: number;
    private dependentPuzzles: string[];
    private observers: Observer[] = [];

    constructor(difficulty: number, dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        this.matchedCells = Math.max(2, difficulty); //2 for easy and medium, 3 for hard
        this.description = `Pair each group of ${this.matchedCells} symbols with their corresponding location by clicking to flip.`;
        if (dependentPuzzles.length > 0){
            this.isLocked = true;
        }
        this.estimatedTime = difficulty * 3; //Arbitrary at the moment
        if (difficulty === 1) {
            [this.rows, this.cols] = choice([[3, 4], [4, 3]]);
        } else if (difficulty === 2) {
            [this.rows, this.cols] = choice([[3, 8], [4, 6], [6, 4]]);
        } else { //difficulty === 3 => 36 cells
            [this.rows, this.cols] = choice([[6, 6], [4, 9]]);
        }
        this.cellsMatrix = this.initCells();
        this.valuesToSymbols = this.assignSymbols();
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
        const res: boolean = this.cellsMatrix.every(row => row.every(cell => cell.isFlipped));

        if (!res) return false;
        this.isSolved = true;
        this.notifyObservers();
        return true;
    }

    flipPiece(row: number, col: number): void {
        if (this.cellsMatrix[row][col].isFlipped) return;
        this.cellsMatrix[row][col].flip();
        this.currentlyFlipped.push([row, col]);
        if (this.currentlyFlipped.length === this.matchedCells) {
            if (!this.checkMatch(row, col)) { //resetting in case the answer is false by unflipping the cells
                for (let pos of this.currentlyFlipped){
                    this.cellsMatrix[pos[0]][pos[1]].flip();
                }
                this.currentlyFlipped = [];
            }

        }
    }

    //TODO: Implement hint system
    getHint(): boolean{
        return false;
    }

    initCells(): Cell[][] {
        const totalCells = this.rows * this.cols;
        const elements: Cell[] = [];
    
        for (let i = 1; i <= (totalCells / this.matchedCells); i++) {
            for (let j = 0; j < this.matchedCells; j++) {
                elements.push(new Cell(i));
            }
        }
        shuffleArray(elements);
    
        const grid: Cell[][] = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(new Cell(0)));
    
        const isValidPosition = (r: number, c: number, value: number): boolean => {
            if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && grid[r][c].value === 0) {
                const directions = [
                    [-1, 0], [1, 0], [0, -1], [0, 1],
                    [-1, -1], [-1, 1], [1, -1], [1, 1]
                ];
                for (const [dr, dc] of directions) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && grid[nr][nc].value === value) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }

        let placed = 0;
        let attempts = 0;
        while (elements.length > 0) {
            const randomIndex = Math.floor(Math.random() * elements.length);
            const currentElement = elements[randomIndex];
            let placedCurrentElement = false;
        
            for (let i = 0; i < totalCells; i++) {
                const r = Math.floor(i / this.cols);
                const c = i % this.cols;
                if (grid[r][c].value === 0 && (isValidPosition(r, c, currentElement.value) || attempts > 100)) {
                    grid[r][c] = currentElement;
                    placedCurrentElement = true;
                    placed++;
                    break;
                }
            }
        
            if (placedCurrentElement) {
                elements.splice(randomIndex, 1);
                attempts = 0;
            } else {
                shuffleArray(elements);
                attempts++;
            }
        }
        
        return grid;
    }

    static get(puzzleId: string): MemoryPuzzle {
        return MemoryPuzzle.puzzles[puzzleId];
    }

    private checkMatch(row: number, col: any): boolean {
        let matchedValue = this.cellsMatrix[row][col].value;

        let matchedCount = 0;
        for (let r = 0; r < this.currentlyFlipped.length; r++){
            if (this.cellsMatrix[this.currentlyFlipped[r][0]][this.currentlyFlipped[r][1]].value === matchedValue){
                matchedCount++;
            }
        }
        if (matchedCount !== this.matchedCells){ 
            return false;
        }
        return true
    }
    private assignSymbols(): Array<[number, string]> {
        const imageDir = path.join(__dirname, '../../../Images/symbols');
        const imageFilenames = imagesData[Theme.MAGICALWORKSHOP].symbols; //TODO: Change to dynamic theme
        const uniqueValues = [...new Set(this.cellsMatrix.flat().map(cell => cell.value))];
        if (uniqueValues.length > imageFilenames.length) {
            throw new Error('Not enough unique images for the number of unique symbols in memory puzzle');
        }
        const shuffledImages: string[] = shuffleArray(imageFilenames);
        const valuesToImages = new Map<number, string>();
        uniqueValues.forEach((value, index) => {
            valuesToImages.set(value, path.join(imageDir, shuffledImages[index]));
        });
        return Array.from(valuesToImages.entries());
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
            cellsMatrix: this.cellsMatrix.map(row => row.map(cell => cell.strip())),
            valuesToSymbols: this.valuesToSymbols
        }
    }
}