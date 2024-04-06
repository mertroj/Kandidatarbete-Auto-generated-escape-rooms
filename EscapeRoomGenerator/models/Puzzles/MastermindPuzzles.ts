import { generateThemedPuzzleText } from "../ChatGPTTextGenerator";
import { Theme } from "../Theme";
import { Observable, Observer } from "./ObserverPattern";
import { Puzzle } from "./Puzzle";
import { v4 as uuidv4 } from 'uuid';

function generateNumbers(length: number): Number[]{ //Generate an array of 3 random numbers
    let numbers : Number[] = new Array(length);
    for(let i = 0; i < length; i++){
        numbers[i] = Math.floor(Math.random() * 9)
    }
    return numbers;
}

function stringToNumberArray(string: string): Number[]{
    let numbers : Number[] = new Array(string.length);
    for(let i = 0; i < string.length; i++){
        numbers[i] = +string.charAt(i);
    }
    return numbers;
}

export class MastermindPuzzle implements Observable, Observer {
    private static puzzles: {[key: string]: MastermindPuzzle} = {}

    id: string = uuidv4();
    type: string = 'mastermindPuzzle';
    question: string;
    hintLevel: number = 0;
    isSolved: boolean = false;
    isLocked: boolean = false;
    estimatedTime: number = 3; //TODO - Testing
    length: number; //Decides the length of the array - Easy: 3 | Medium: 4 | Hard: 5
    previousGuesses: Map<number, [string, string]> = new Map();
    private observers: Observer[] = []; //All puzzles that depend on this one (outgoing)
    private dependentPuzzles: string[]; //All puzzles that need to be solved before this one can be attempted (incoming)
    private hints: string[] = ['After each guess some numbers change colours, maybe that means something', 
                            'Green numbers are correct and in correct position, yellow are correct but wrong position', 
                            'The solution is: '];

    solution: Number[];
    
    constructor(diff: number, dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        this.isLocked = this.dependentPuzzles.length > 0;
        this.length = diff + 2;
        this.solution = generateNumbers(this.length);
        this.question = 'Figure out the ' + this.length + ' digit combination';
        MastermindPuzzle.puzzles[this.id] = this
    }
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.forEach(observer => {
            observer.update(this.id);
        });
    }
    update(id: string): void{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }

    static get(puzzleId: string): MastermindPuzzle {
        return MastermindPuzzle.puzzles[puzzleId];
    }

    getSolution(): Number[]{
        return this.solution;
    }
    getHint(): string{
        if(this.hintLevel < 2){
            let hint = this.hints[this.hintLevel];
            this.hintLevel++;
            return hint;
        }
        else if(this.hintLevel === 2){
            let hint = this.hints[this.hintLevel] + this.getSolution();
            this.hintLevel++;
            return hint;
        }
        return 'No more hints.';
    }

    checkAnswer(answer: string): Number[]{
        let bools: Number[] = new Array(this.solution.length);
        let numAns = stringToNumberArray(answer);

        for(let i = 0; i < this.solution.length; i++){
            bools[i] = 2; //Base value 2 for incorrect
            if(numAns[i] == this.solution[i]) //If correct set 0
                bools[i] = 0;
            else
                for(let j = 0; j < this.solution.length; j++){
                    if(numAns[i] == this.solution[j]) //if somewhere is correct set 1
                        bools[i] = 1; 
                }
        }
        if(bools.every(x => x === 0)){
            this.isSolved = true;
            this.notifyObservers();
        }
        this.previousGuesses.set(this.previousGuesses.size, [answer, bools.join('')]);
        return bools;
    }
    async applyTheme(theme: Theme): Promise<void> {
        for (let i = 0; i < this.hints.length - 1; i++){
            this.hints[i] = await generateThemedPuzzleText(this.hints[i], theme);
        }
    }

    strip() {
        return {
            id: this.id,
            type: this.type,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hintLevel: this.hintLevel,
            length: this.length,
            question: this.question
        }
    }
}