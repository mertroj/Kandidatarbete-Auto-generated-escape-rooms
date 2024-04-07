import { v4 as uuidv4 } from 'uuid';
import { Observable, Observer } from "./ObserverPattern";
import { randomInt, repeat } from '../Helpers';

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
    previousGuesses: [string, string][] = [];
    solution: number[];

    private observers: Observer[] = []; //All puzzles that depend on this one (outgoing)
    private dependentPuzzles: string[]; //All puzzles that need to be solved before this one can be attempted (incoming)
    private possibleHints: string[] = ['After each guess some numbers change colours, maybe that means something', 
                            'Green numbers are correct and in correct position, yellow are correct but wrong position', 
                            'The solution is: '];

    
    constructor(diff: number, dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        this.isLocked = this.dependentPuzzles.length > 0;
        this.length = diff + 2;
        this.solution = repeat(this.length, () => randomInt(10));
        this.question = 'Figure out the ' + this.length + ' digit combination';
        MastermindPuzzle.puzzles[this.id] = this
    }
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.forEach(observer => observer.update(this.id));
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

    getHint(): string{
        if(this.hintLevel < 2){
            return this.possibleHints[this.hintLevel++];
        }
        else if(this.hintLevel === 2){
            return this.possibleHints[this.hintLevel++] + this.solution;
        }
        return 'No more hints.';
    }

    checkAnswer(answer: string): number[]{
        let numAns = answer.split('').map((x) => parseInt(x));
        let bools: number[] = new Array(this.length).fill(0); //Base value 0 for incorrect
        let incorrectNums: number[] = [];

        
        for(let i = 0; i < this.length; i++){
            if(numAns[i] == this.solution[i]) bools[i] = 2; //If correct set 2
            else incorrectNums.push(this.solution[i])
        }
        
        for(let i = 0; i < this.length; i++){
            if (bools[i] === 2) continue
            let index = incorrectNums.indexOf(numAns[i])
            if (index !== -1) {
                incorrectNums.splice(index, 1)
                bools[i] = 1; //if somewhere is correct set 1
            }
        }

        if(bools.every(x => x === 2)){
            this.isSolved = true;
            this.notifyObservers();
        }

        this.previousGuesses.push([answer, bools.join('')]);
        return bools;
    }
    strip() {
        return {
            id: this.id,
            type: this.type,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.possibleHints.slice(0, this.hintLevel),
            length: this.length,
            question: this.question,
            previousGuesses: this.previousGuesses
        }
    }
}