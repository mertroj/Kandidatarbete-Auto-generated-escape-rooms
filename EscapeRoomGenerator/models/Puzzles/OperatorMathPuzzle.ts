import { v4 as uuidv4 } from 'uuid';
import { choice, randomIntRange, repeat } from '../Helpers'
import { Observable, Observer } from './ObserverPattern';


export class OperatorMathPuzzle implements Observable, Observer {
    private static puzzles: {[key:string]: OperatorMathPuzzle} = {}
    
    private observers: Observer[] = [];
    private dependentPuzzles: string[];

    id: string = uuidv4();
    type: string = "operatorMathPuzzle"
    description: string = "What is the sequence of operators used in the following expression?"
    hints: string[] = [];
    isSolved: boolean = false;
    estimatedTime: number;
    isLocked: boolean;

    private numberOfOperands: number;
    private numbers: number[];
    private operators: string;
    private answer: number;

    constructor(difficulty: number, dependentPuzzles: string[]) {
        this.dependentPuzzles = dependentPuzzles;
        this.isLocked = this.dependentPuzzles.length > 0
        this.estimatedTime = difficulty; //tests gave 1 min average for easy. We can assume 2 min for medium and 3 min for hard
        this.numberOfOperands = 3 + difficulty; //easy: 4, medium: 5, hard: 6
        this.numbers = repeat(this.numberOfOperands, () => randomIntRange(1, 11))
        this.operators = repeat(this.numberOfOperands-1, () => choice(['+', '-', '*'])).join('')
        this.answer = this.calcAnswer();
        OperatorMathPuzzle.puzzles[this.id] = this;
    }

    static get(puzzleId: string): OperatorMathPuzzle {
        return OperatorMathPuzzle.puzzles[puzzleId]
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): string[] {
        return this.observers.map(observer => observer.update(this.id));
    }
    update(id: string): string{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
            return this.id
        }
        return ''
    }

    private calcAnswer(): number {
        let expression: string = this.numbers[0].toString();
        for (let i = 1; i < this.numberOfOperands; i++) {
            expression += this.operators[i-1];
            expression += this.numbers[i].toString();
        }
        return eval(expression)
    }

    private formulateQuestion(): string {
        let question: string[] = [];
        question.push(this.numbers[0].toString());
        for (let i = 1; i < this.numberOfOperands; i++) {
            question.push(this.hints.length < i ? "□" : this.operators[i-1]);
            question.push(this.numbers[i].toString());
        }
        question.push("=");
        question.push(this.answer.toString());

        return question.join(' ')
    }

    getHint(): {hint: string, question: string} {
        if (this.hints.length === this.numberOfOperands-1)
            return {hint: 'No more hints.', question: this.formulateQuestion()}

        let hint = 'The next operation is ' + this.operators[this.hints.length];

        this.hints.push(hint)
        return {hint, question: this.formulateQuestion()}
    }

    checkAnswer(answer: string): {result: boolean, unlockedPuzzles: string[]} {
        if (answer.length !== this.operators.length) 
            return {result: false, unlockedPuzzles: []};

        let expression: string = this.numbers[0].toString();
        for (let i = 1; i < this.numberOfOperands; i++) {
            expression += answer[i-1];
            expression += this.numbers[i].toString();
        }
        let answerRes = eval(expression) as number
        let result: boolean = answerRes === this.answer;
        
        if (result && !this.isSolved) {
            this.isSolved = result;
            let unlockedPuzzles = this.notifyObservers();
            return {result, unlockedPuzzles};
        } 
        return {result, unlockedPuzzles: []};
    }

    strip() {
        return {
            type: this.type,
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hints,

            question: this.formulateQuestion(),
            description: this.description,
        }
    }
}