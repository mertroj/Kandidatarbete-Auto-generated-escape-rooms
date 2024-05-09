import { v4 as uuidv4 } from 'uuid';
import { choice, randomIntRange, repeat } from '../Helpers'
import { Observable, Observer } from '../ObserverPattern';
import {generateThemedPuzzleText } from '../ChatGPTTextGenerator';
import { Theme } from '../Theme';


export class OperatorMathPuzzle implements Observable, Observer {
    private static puzzles: {[key:string]: OperatorMathPuzzle} = {};
    static type = 'operatorMathPuzzle';
    
    private observers: Observer[] = [];
    private dependentPuzzles: string[];

    id: string = uuidv4();
    type: string = OperatorMathPuzzle.type;
    description: string = "What is the sequence of operators used in the following expression?"
    hints: string[] = [];
    isSolved: boolean = false;
    estimatedTime: number = 100;
    isLocked: boolean;
    
    numberOfOperands: number;
    private numbers: number[];
    private operators: string;
    private answer: number;

    constructor(difficulty: number, dependentPuzzles: string[]) {
        if (difficulty === 1) this.estimatedTime = 1;
        if (difficulty === 2) this.estimatedTime = 4;
        if (difficulty === 3) this.estimatedTime = 5;
        
        this.dependentPuzzles = dependentPuzzles;
        this.isLocked = this.dependentPuzzles.length > 0;
    
        this.numberOfOperands = 3 + difficulty; //easy: 4, medium: 5, hard: 6
        this.numbers = repeat(this.numberOfOperands, () => randomIntRange(1, 11));
        this.operators = repeat(this.numberOfOperands-1, () => choice(['+', '-', '*'])).join('');
        this.answer = this.calcAnswer(this.operators);

        while (this.operators.includes('*'))
            this.operators = this.operators.replace('*', '×');
        OperatorMathPuzzle.puzzles[this.id] = this;
    }

    static get(puzzleId: string): OperatorMathPuzzle {
        return OperatorMathPuzzle.puzzles[puzzleId];
    }
    
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.map(observer => observer.update(this.id));
    }
    update(id: string): void {
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }

    private calcAnswer(operators: string): number {
        let expression: string = this.numbers[0].toString();
        for (let i = 1; i < this.numberOfOperands; i++) {
            expression += operators[i-1];
            expression += this.numbers[i].toString();
        }
        return eval(expression);
    }

    formulateQuestion(): string {
        let question: string[] = [];
        question.push(this.numbers[0].toString());
        for (let i = 1; i < this.numberOfOperands; i++) {
            question.push(this.hints.length < i ? "□" : this.operators[i-1]);
            question.push(this.numbers[i].toString());
        }
        question.push("=");
        question.push(this.answer.toString());

        return question.join(' ');
    }
    async applyTheme(theme: Theme): Promise<void> {
        this.description = await generateThemedPuzzleText(this.description, theme);
    }

    getHint(): string | null {
        if (this.isSolved || this.isLocked || this.hints.length === this.numberOfOperands-1) return null;

        let hint = `The ${this.hints.length === 0 ? 'first':'next'} operator is ${this.operators[this.hints.length]}`;

        this.hints.push(hint);
        return hint;
    }

    checkAnswer(answer: string): boolean {
        if (this.isSolved || this.isLocked || answer.length !== this.operators.length) return false;

        let result = this.calcAnswer(answer) === this.answer;

        if (result && !this.isSolved) {
            this.isSolved = true;
            this.notifyObservers();
        }
        return result;
    }

    strip() {
        return {
            type: this.type,
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hints,
            numberOfOperators: this.numberOfOperands-1,

            question: this.formulateQuestion(),
            description: this.description,
        };
    }
}