import { v4 as uuidv4 } from 'uuid';
import { generateThemedPuzzleText } from "../ChatGPTTextGenerator";
import { Theme } from "../Theme";
import { Observable, Observer } from "../ObserverPattern";
import { randomInt, repeat } from '../Helpers';

export class MastermindPuzzle implements Observable, Observer {
    private static puzzles: {[key: string]: MastermindPuzzle} = {};
    private static possibleHints: string[] = ['After each guess some numbers change colours, maybe that means something', 
                            'Green numbers are correct and in correct position, yellow are correct but wrong position', 
                            'The solution is: '];
    static type = 'mastermindPuzzle';

    private observers: Observer[] = [];
    private dependentPuzzles: string[];

    id: string = uuidv4();
    type: string = MastermindPuzzle.type;
    question: string;
    hints: string[] = [];
    isSolved: boolean = false;
    isLocked: boolean = false;
    description: string = 'The code seems to have disappeared, but maybe you can figure it out by guessing';
    estimatedTime: number = 3; //TODO - Testing

    length: number; //Decides the length of the array - Easy: 3 | Medium: 4 | Hard: 5
    previousGuesses: [string, string][] = [];
    solution: number[];

    constructor(diff: number, dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        this.isLocked = this.dependentPuzzles.length > 0;
        this.length = diff + 2;
        this.solution = repeat(this.length, () => randomInt(10));
        this.question = 'Figure out the ' + this.length + ' digit combination';
        MastermindPuzzle.puzzles[this.id] = this;
    }

    static get(puzzleId: string): MastermindPuzzle {
        return MastermindPuzzle.puzzles[puzzleId];
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

    getHint(): string | null {
        if (this.isSolved || this.isLocked || this.hints.length === 3) return null;

        let hint: string = '';
        if(this.hints.length < 2){
            hint = MastermindPuzzle.possibleHints[this.hints.length];
        } else {
            hint = MastermindPuzzle.possibleHints[2] + this.solution.map(x => String(x)).join('');
        }
        this.hints.push(hint);
        return hint;
    }

    checkAnswer(answer: string): boolean {
        if (this.isSolved || this.isLocked) return false;
        
        let numAns = answer.split('').map((x) => parseInt(x));
        let bools: number[] = new Array(this.length).fill(0); //Base value 0 for incorrect
        let incorrectNums: number[] = [];

        
        for(let i = 0; i < this.length; i++){
            if(numAns[i] == this.solution[i]) bools[i] = 2; //If correct set 2
            else incorrectNums.push(this.solution[i]);
        }
        
        for(let i = 0; i < this.length; i++){
            if (bools[i] === 2) continue;
            let index = incorrectNums.indexOf(numAns[i]);
            if (index !== -1) {
                incorrectNums.splice(index, 1);
                bools[i] = 1; //if somewhere is correct set 1
            }
        }

        let boolsStr = bools.join('');
        
        this.previousGuesses.push([answer, boolsStr]);
        
        let result = bools.every(x => x === 2)
        if(result && !this.isSolved){
            this.isSolved = true;
            this.notifyObservers();
        }
        return result;
    }
    async applyTheme(theme: Theme): Promise<void> {
        for (let i = 0; i < this.hints.length - 1; i++){
            this.hints[i] = await generateThemedPuzzleText(this.hints[i], theme);
        }
        this.description = await generateThemedPuzzleText(this.description, theme);
    }

    strip() {
        return {
            id: this.id,
            type: this.type,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hints,
            description: this.description,
            length: this.length,
            question: this.question,
            previousGuesses: this.previousGuesses
        };
    }
}