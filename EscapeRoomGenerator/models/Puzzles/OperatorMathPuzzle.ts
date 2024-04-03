import { v4 as uuidv4 } from 'uuid';
import { choice, randomIntRange, repeat } from '../Helpers'
import { Observable, Observer } from './ObserverPattern';


export class OperatorMathPuzzle implements Observable, Observer {
    private static puzzles: {[key:string]: OperatorMathPuzzle} = {}
    
    private numberOfOperands: number;
    private numbers: number[];
    private operands: string;
    private answer: number;
    private observers: Observer[] = [];
    private dependentPuzzles: string[];
    id: string = uuidv4();
    type: string = "operatorMathPuzzle"
    question: string;
    description: string = "What is the sequence of operators used in the following expression?"
    hints: string[] = [];
    isSolved: boolean = false;
    estimatedTime: number;
    isLocked: boolean;

    constructor(difficulty: number, dependentPuzzles: string[]) {
        this.dependentPuzzles = dependentPuzzles;
        this.isLocked = this.dependentPuzzles.length > 0
        this.estimatedTime = difficulty; //tests gave 1 min average for easy. We can assume 2 min for medium and 3 min for hard
        this.numberOfOperands = 3 + difficulty; //easy: 4, medium: 5, hard: 6
        this.numbers = repeat(this.numberOfOperands, () => randomIntRange(1, 11))
        this.operands = repeat(this.numberOfOperands-1, () => choice(['+', '-', '*'])).join('')
        this.answer = this.calcAnswer();
        this.question = this.formulateQuestion();
        OperatorMathPuzzle.puzzles[this.id] = this;
    }

    static get(puzzleId: string): OperatorMathPuzzle {
        return OperatorMathPuzzle.puzzles[puzzleId]
    }

    getHint(): string{
        if (this.hints.length === this.numberOfOperands)
            return 'No more hints.'

        let hint = 'The next operation is ' + this.operands[this.hints.length];

        this.hints.push(hint)
        return hint
    }

    checkAnswer(answer: string): boolean {
        if (answer.length != this.operands.length) return false

        let expression: string = this.numbers[0].toString();
        for (let i = 1; i < this.numberOfOperands; i++) {
            expression += answer[i-1];
            expression += this.numbers[i].toString();
        }
        let answerRes = eval(expression) as number
        let res: boolean = answerRes === this.answer;
        if (!this.isSolved && res) this.notifyObservers();
        if (!this.isSolved) this.isSolved = res
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

    private calcAnswer(): number {
        let expression: string = this.numbers[0].toString();
        for (let i = 1; i < this.numberOfOperands; i++) {
            expression += this.operands[i-1];
            expression += this.numbers[i].toString();
        }
        return eval(expression)
    }

    private formulateQuestion(): string {
        let question: string[] = [];
        question.push(this.numbers[0].toString());
        for (let i = 1; i < this.numberOfOperands; i++) {
            question.push(this.hints.length < i ? "□" : this.operands[i-1]);
            question.push(this.numbers[i].toString());
        }
        question.push("=");
        question.push(this.answer.toString());

        return question.join(' ')
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