import { Observable, Observer } from './ObserverPattern';
import { v4 as uuidv4 } from "uuid";
import {Theme} from "../Theme";
import {generateThemedPuzzleText} from "../ChatGPTTextGenerator";

const spotTheDifferenceData = require('../../spotTheDifference.json');

interface PuzzleData {
    theme: string;
    changedImagePath: string;
    originalImagePath: string;
    difficulty: number;
    estimatedTime: number;
    differences: Difference[];
}

interface Difference {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    x4: number;
    y4: number;
    found: boolean;
}

export class SpotTheDifference implements Observable, Observer {
    private static puzzles: { [key: string]: SpotTheDifference } = {}
    id: string = uuidv4();
    static objectCounter: number = 0;

    private difficulty: number;
    private observers: Observer[] = [];
    private dependentPuzzles: string[] = [];
    private differences: Difference[] = [];
    description: string = "Wait, are these the same?";
    estimatedTime: number = 3;
    hints: string[] = [];
    question: string = "Somethings not right over here";
    isSolved: boolean = false;
    isLocked: boolean = false;
    type: string = 'spotTheDifference';
    originalImagePath: string = "";
    changedImagePath: string = "";
    theme: Theme;
    width: number = 1024; //for now all images have these dimensions, if that's not the case in the future change this to a dynamic value
    height: number = 1024;

    constructor(difficulty: number, dependentPuzzles: string[], theme: Theme) { // TODO: add theme as a parameter when a solution is found
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        this.difficulty = difficulty; // TODO: implement difficulty levels
        this.theme = theme;
        this.initializePuzzle(this.theme);
        SpotTheDifference.puzzles[this.id] = this;
    }
    initializePuzzle(theme: string) {
        const themePuzzles = spotTheDifferenceData[theme];
        if (!themePuzzles || themePuzzles.length === 0) {
            throw new Error(`No puzzles found for theme '${theme}'.`);
        }
        const randomIndex = Math.floor(Math.random() * themePuzzles.length);
        const randomPuzzle = themePuzzles[randomIndex];

        // Set the properties of the SpotTheDifference instance based on the randomly selected puzzle
        this.estimatedTime = randomPuzzle.estimatedTime;
        this.originalImagePath = randomPuzzle.originalImagePath;
        this.changedImagePath = randomPuzzle.changedImagePath;

        // Initialize the differences array for the selected puzzle
        this.differences = randomPuzzle.differences.map((difference: any) => ({
            ...difference,
            found: false // Initialize all differences as unfound
        }));
    }


    static get(puzzleId: string): SpotTheDifference {
        return SpotTheDifference.puzzles[puzzleId]
    }

    checkSelection(x: number, y: number): {res: boolean, difference?: Difference} {
        const tolerance = this.width / 100; // Define the tolerance

        let difference = this.differences.find((difference) => (
            x >= Math.min(difference.x1, difference.x2, difference.x3, difference.x4) - tolerance &&
            x <= Math.max(difference.x1, difference.x2, difference.x3, difference.x4) + tolerance &&
            y >= Math.min(difference.y1, difference.y2, difference.y3, difference.y4) - tolerance &&
            y <= Math.max(difference.y1, difference.y2, difference.y3, difference.y4) + tolerance
        ));

        if (difference && !this.isSolved) {
            difference.found = true;
            this.checkAnswer();
            return {res: true, difference}; // Difference found
        }
        return {res: false}; // No difference found
    }

    checkAnswer(): void {
        this.isSolved = this.differences.every(difference => difference.found);
    }

    getHint(): {hint: string, difference?: Difference} {
        const unfoundDifferences = this.differences.filter(difference => !difference.found);

        if (unfoundDifferences.length === 0) {
            return {hint: "You've found all the differences!"};
        }

        // Randomly select one of the unfound differences
        const randomIndex = Math.floor(Math.random() * unfoundDifferences.length);
        const randomDifference = unfoundDifferences[randomIndex];

        // Mark the randomly selected difference as found
        randomDifference.found = true;

        const number = unfoundDifferences.length - 1; // Subtract 1 because one difference has been found
        const hint = `I found a difference! that should make it ${number} left to find!`;
        this.hints.push(hint);
        this.checkAnswer();

        return {hint, difference: randomDifference};
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    notifyObservers(): string[] {
        return this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }

    async applyTheme(theme: Theme): Promise<void> {
       this.theme = theme;
    }

    increaseCounter(): void {
        SpotTheDifference.objectCounter++;
    }

    update(id: string): string {
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
            return this.id;
        }
        return '';
    }

    strip() {
        return {
            type: this.type,
            differences: this.differences.filter((difference) => difference.found),
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hints,
            question: this.question,
            description: this.description,
            originalImagePath: this.originalImagePath,
            changedImagePath: this.changedImagePath,
            width: this.width,
            height: this.height,
            maximumHints: this.differences.length
        }
    }
}
