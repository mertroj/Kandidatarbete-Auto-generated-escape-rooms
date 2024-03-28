import { v4 as uuidv4 } from 'uuid';
import { choice, randomIntRange } from '../Helpers'
import { Observable, Observer } from './ObserverPattern';


export class OperatorMathPuzzle implements Observable, Observer {
    private static puzzles: {[key:string]: [OperatorMathPuzzle, string]} = {}
    
    private numberOfOperands: number;
    private observers: Observer[] = [];
    private dependentPuzzles: string[];
    id: string = uuidv4();
    type: string = "operatorMathPuzzle"
    question: string;
    description: string = "What is the sequence of operators used in the following expression?"
    hintLevel : number = 0;
    isSolved: boolean = false;
    estimatedTime: number;
    isLocked: boolean = false;

    constructor(difficulty: number, dependentPuzzles: string[]) {
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        this.estimatedTime = difficulty; //tests gave 1 min average for easy. We can assume 2 min for medium and 3 min for hard
        this.numberOfOperands = 4 + (difficulty - 1); //easy: 4, medium: 5, hard: 6
        let [question, answer] = this.init();
        this.question = question;
        OperatorMathPuzzle.puzzles[this.id] = [this, answer]
    }

    static get(puzzleId: string): OperatorMathPuzzle {
        return OperatorMathPuzzle.puzzles[puzzleId][0]
    }

    private getAnswer(): string {
        return OperatorMathPuzzle.puzzles[this.id][1]
    }

    getHint(): string{
        if(this.hintLevel < this.numberOfOperands-1){
            return 'The next operations is ' + this.getAnswer()[this.hintLevel++];
        }else{
            return 'No more hints.'
        }
    }

    checkAnswer(answer: string): boolean {
        let res: boolean = answer === this.getAnswer();
        if (!this.isSolved) this.isSolved = res
        if (res) this.notifyObservers();
        return res
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

    private init(): [string, string] {
        let numbers: number[] = [];
        for (let i = 0; i < this.numberOfOperands; i++) {
            numbers.push(randomIntRange(1, 11));
        }
        
        let operator: string;
        let answer: string = ''
        let expression: string = numbers[0].toString();
        for (let i = 1; i < this.numberOfOperands; i++) {
            operator = choice(['+', '-', '*']);
            answer += operator;
            expression += operator;
            expression += numbers[i].toString();
        }
        let question = numbers.join(" □ ") + ` = ${eval(expression)}`

        return [question, answer]
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
        }
    }
}