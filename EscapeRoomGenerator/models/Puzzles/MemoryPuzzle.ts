import { v4 as uuidv4 } from 'uuid';
import { Observer, Observable } from "../ObserverPattern";
import { range, repeat, shuffleArray } from '../Helpers';
import { Theme } from '../Theme';
import path from "path";
import { generateThemedPuzzleText } from '../ChatGPTTextGenerator';
const imagesData = require('../../data/themedImages.json');

export class MemoryPuzzle implements Observer, Observable{
    private static puzzles: {[key: string]: MemoryPuzzle} = {};
    static type = "memoryPuzzle";

    private dependentPuzzles: string[];
    private observers: Observer[] = [];

    id: string = uuidv4();
    type: string = MemoryPuzzle.type;
    question: string = "Can you memorize in which places each group of symbols is located?";
    description: string;
    isSolved: boolean = false;
    hintLevel: number = 0;
    estimatedTime: number;
    isLocked: boolean = false;

    cellsToMatch: number; //number of similar symbols in a group to be matched
    cells: Cell[];
    valuesToSymbols: Array<[number, string]>;
    difficulty: number;
    currentlyFlipped: number[] = [];

    constructor(difficulty: number, dependentPuzzles: string[], theme: Theme){
        this.difficulty = difficulty;
        this.dependentPuzzles = dependentPuzzles;
        this.cellsToMatch = Math.max(2, difficulty); //2 for easy and medium, 3 for hard
        this.description = `Pair each group of ${this.cellsToMatch} symbols with their corresponding location by clicking to flip.`;
        this.isLocked = dependentPuzzles.length > 0
        this.estimatedTime = difficulty + 2; //Arbitrary at the moment
        this.cells = this.initCells(difficulty);
        this.valuesToSymbols = this.assignSymbols(theme);
        MemoryPuzzle.puzzles[this.id] = this;
    }

    static get(puzzleId: string): MemoryPuzzle {
        return MemoryPuzzle.puzzles[puzzleId];
    }

    initCells(difficulty: number): Cell[] {
        return shuffleArray(range(0, difficulty * 12 / this.cellsToMatch)
                                .map((val) => repeat(this.cellsToMatch, () => val))
                                .flat()
                            ).map((val) => newCell(val));
    }

    private assignSymbols(theme: Theme): Array<[number, string]> {
        const imageDir = path.join(__dirname, '../../Images/symbols');
        const imageFilenames = imagesData[theme].symbols;
        const uniqueValues = [...new Set(this.cells.flat().map(cell => cell.value))];
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
    async applyTheme(theme: Theme): Promise<void> {
        this.question = await generateThemedPuzzleText(this.question, theme);
        this.description = await generateThemedPuzzleText(this.description, theme);
    }
    
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }
    update(id: string): void{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }

    flipCell(i: number): boolean {
        if (this.isSolved || this.isLocked || this.cells[i].isFlipped) return false;

        this.cells[i].isFlipped = true;
        this.currentlyFlipped.push(i);

        return true
    }

    checkForMatch(): boolean {
        if (this.currentlyFlipped.length !== this.cellsToMatch) return false;
    
        let val = this.cells[this.currentlyFlipped[0]].value;
        let isMatched = this.currentlyFlipped.every((cell) => this.cells[cell].value === val);

        if (isMatched) {
            this.currentlyFlipped.forEach((cell) => this.cells[cell].isMatched = true);
            this.checkSolved();
        } else {
            this.currentlyFlipped.forEach((cell) => this.cells[cell].isFlipped = false);
        }
        this.currentlyFlipped = [];
        return isMatched;
    }

    private checkSolved(): boolean{
        if(this.cells.every(cell => cell.isFlipped) && !this.isSolved){
            this.isSolved = true;
            this.notifyObservers();
        }
        return this.isSolved;
    }

    getHint(): {duration: number, cells: Cell[]} {
        if (this.isSolved || this.isLocked || this.hintLevel === 3) return {duration: 0, cells: this.cells};

        let duration = 1000 + (this.difficulty - 1) * 250 + this.hintLevel++ * 500;
        let cells = this.cells.map((cell) => {
            return {
                value: cell.value,
                isFlipped: true,
                isMatched: cell.isMatched
            }
        })

        return {duration, cells}
    }

    strip() {
        return {
            type: this.type,
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hintLevel, //to solve the toggle caused hints increment
            question: this.question,
            description: this.description,
            difficulty: this.difficulty,

            cells: this.cells,
            valuesToSymbols: this.valuesToSymbols
        };
    }
}

interface Cell {
    value: number;
    isFlipped: boolean;
    isMatched: boolean;
}

function newCell(value: number): Cell {
    return {
        value,
        isFlipped: false,
        isMatched: false
    }
}