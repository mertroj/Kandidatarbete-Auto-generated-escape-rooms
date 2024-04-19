import { Observable, Observer } from './ObserverPattern';
import { v4 as uuidv4 } from "uuid";
import * as fs from 'fs'; // Import file system module to read JSON file

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

    private difficulty: number;
    private observers: Observer[] = [];
    private dependentPuzzles: string[] = [];
    private differences: Difference[] = [];
    description: string = "Wait, are these the same?";
    estimatedTime: number;
    hints: string[] = [];
    question: string = "";
    isSolved: boolean = false;
    isLocked: boolean = false;
    type: string = 'spotTheDifference';
    originalImagePath: string = "";
    changedImagePath: string = "";

    constructor(dependentPuzzles: string[]) { // TODO: add theme as a parameter when a solution is found
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        this.difficulty = 1; // TODO: implement difficulty levels
        this.initializePuzzle("MagicalWorkshop");
        SpotTheDifference.puzzles[this.id] = this;
    }
    initializePuzzle(theme: string) {
        const jsonData: PuzzleData[] = this.readPuzzleDataFromJSON();
        const themePuzzles = jsonData.filter(puzzle => puzzle.theme === theme);
        if (themePuzzles.length === 0) {
            throw new Error(`No puzzles found for theme '${theme}'.`);
        }
        const randomPuzzle = themePuzzles[Math.floor(Math.random() * themePuzzles.length)];
        this.estimatedTime = randomPuzzle.estimatedTime;
        this.differences = randomPuzzle.differences.map(difference => ({
            ...difference,
            found: false // Initialize all differences as unfound
        }));
        this.originalImagePath = randomPuzzle.originalImagePath;
        this.changedImagePath = randomPuzzle.changedImagePath;
    }

    static get(puzzleId: string): SpotTheDifference {
        return SpotTheDifference.puzzles[puzzleId]
    }



    private readPuzzleDataFromJSON(): PuzzleData[] {
        const jsonData = fs.readFileSync('spotTheDifference.json', 'utf-8');
        return JSON.parse(jsonData);
    }


    private selectRandomImage(): string {
        // Read image paths from JSON or fetch from a directory
        const images = ["image1.jpg", "image2.jpg", "image3.jpg"]; // Example image paths
        // Choose a random image
        return images[Math.floor(Math.random() * images.length)];
    }

    checkSelection(x: number, y: number): boolean {
        // Loop through differences and check if the selection matches any
        for (const difference of this.differences) {
            // Check if click is within the boundaries of the difference square
            if (
                x >= Math.min(difference.x1, difference.x2, difference.x3, difference.x4) &&
                x <= Math.max(difference.x1, difference.x2, difference.x3, difference.x4) &&
                y >= Math.min(difference.y1, difference.y2, difference.y3, difference.y4) &&
                y <= Math.max(difference.y1, difference.y2, difference.y3, difference.y4)
            ) {
                difference.found = true; // Mark the difference as found
                return true; // Difference found
            }
        }
        return false; // No difference found
    }

    checkAnswer(): void {
        this.isSolved = this.differences.every(difference => difference.found);
    }

    getHint(): string {
        const unfoundDifferences = this.differences.filter(difference => !difference.found);

        if (unfoundDifferences.length === 0) {
            return "You've found all the differences!";
        }

        const number = unfoundDifferences.length;
        const hint = `I found a difference! that should make it ${number} in total!`;
        this.hints.push(hint);

        return hint;
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    notifyObservers(): string[] {
        return this.observers.map(observer => observer.update(this.id)).filter((id) => id);
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
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hints,
            question: this.question,
            description: this.description,
            originalImagePath: this.originalImagePath,
            changedImagePath: this.changedImagePath
        }
    }
}
