import { Observable, Observer } from '../ObserverPattern';
import { v4 as uuidv4 } from "uuid";
import { Theme } from "../Theme";
import {generateThemedPuzzleText} from "../ChatGPTTextGenerator";
import { choice } from '../Helpers';

const spotTheDifferenceData = require('../../data/spotTheDifference.json');

interface Difference {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    found: boolean;
}

export class SpotTheDifference implements Observable, Observer {
    private static puzzles: { [key: string]: SpotTheDifference } = {};
    static type = 'spotTheDifference';

    private observers: Observer[] = [];
    private dependentPuzzles: string[] = [];
    
    id: string = uuidv4();
    type: string = SpotTheDifference.type;
    description: string = "Wait, are these the same?";
    estimatedTime: number = 5;
    hintLevel: number = 0;
    question: string = "Somethings not right over here";
    isSolved: boolean = false;
    isLocked: boolean = false;

    differences: Difference[] = [];
    originalImagePath: string = "";
    changedImagePath: string = "";
    theme: Theme;
    width: number = 1024; //for now all images have these dimensions, if that's not the case in the future change this to a dynamic value
    height: number = 1024;

    constructor(difficulty: number, dependentPuzzles: string[], theme: Theme) { // TODO: add theme as a parameter when a solution is found
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        // TODO: implement difficulty levels
        this.theme = theme;
        this.initializePuzzle(this.theme);
        SpotTheDifference.puzzles[this.id] = this;
    }

    static get(puzzleId: string): SpotTheDifference {
        return SpotTheDifference.puzzles[puzzleId]
    }

    getFoundDifferences() {
        return this.differences.filter((diff) => diff.found);
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

    addObserver(observer: Observer): void {
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
    
    async applyTheme(theme: Theme): Promise<void> {
        this.theme = theme;
    }

    checkSolved(): boolean {
        if (this.isSolved || this.isLocked) return false;

        
        if (this.differences.every(difference => difference.found)) {
            this.isSolved = true;
            this.notifyObservers();
        }

        return this.isSolved
    }

    getHint(): boolean {
        if (this.isSolved || this.isLocked) return false;

        const unfoundDifferences = this.differences.filter(difference => !difference.found);

        if (unfoundDifferences.length === 0) return false;

        choice(unfoundDifferences).found = true;

        this.hintLevel++;
        this.checkSolved();

        return true;
    }

    checkSelection(x: number, y: number): boolean {
        if (this.isSolved || this.isLocked) return false;

        const tolerance = this.width / 100; // Define the tolerance

        let difference = this.differences.find((difference) => (
            x >= difference.x1 - tolerance && x <= difference.x2 + tolerance &&
            y >= difference.y1 - tolerance && y <= difference.y2 + tolerance
        ));

        if (difference) {
            difference.found = true;
            this.checkSolved();
            return true; // Difference found
        }
        return false; // No difference found
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

            differences: this.differences.filter((difference) => difference.found),
            originalImagePath: this.originalImagePath,
            changedImagePath: this.changedImagePath,
            width: this.width,
            height: this.height,
            maximumHints: this.differences.length
        };
    }
}
