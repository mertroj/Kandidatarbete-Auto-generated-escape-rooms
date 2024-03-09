import { v4 as uuidv4 } from 'uuid';
import { randomChoice, randomIntRange } from './Helpers'


export class OperatorMathPuzzle{
    private static puzzles: {[key:string]: [OperatorMathPuzzle, string]} = {}

    private type: string = "operatorMathPuzzle"
    private description: string = "What is the sequence of operators used in the following expression?"
    
    private id: string = uuidv4();
    private question: string;
    private hintLevel : number = 0;
    solved: boolean = false;

    constructor() {
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
        if(this.hintLevel < 3){
            return 'The next operations is ' + this.getAnswer()[this.hintLevel++];
        }else{
            return 'No more hints.'
        }
    }

    checkAnswer(answer: string): boolean {
        let res: boolean = answer === this.getAnswer();
        if (!this.solved) this.solved = res
        return res
    }

    private init(): [string, string] {
        let numbers: number[] = [];
        for (let i = 0; i < 4; i++) {
            numbers.push(randomIntRange(1, 11));
        }
        
        let operator: string;
        let answer: string = ''
        let expression: string = numbers[0].toString();
        for (let i = 1; i < 4; i++) {
            operator = randomChoice(['+', '-', '*']);
            answer += operator;
            expression += operator;
            expression += numbers[i].toString();
        }
        let question = numbers.join(" □ ") + ` = ${eval(expression)}`

        return [question, answer]
    }
}