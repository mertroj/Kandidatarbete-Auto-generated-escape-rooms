import { Puzzle } from "./Puzzle";
import { v4 as uuidv4 } from 'uuid';

function generateNumbers(){ //Generate an array of 3 random numbers
    let numbers : Number[] = new Array(3);
    for(let i = 0; i < 3; i++){
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

export class MastermindPuzzle implements Puzzle {
    private static puzzles: {[key: string]: MastermindPuzzle} = {}

    id: string = uuidv4();
    type: string = 'mastermindPuzzle';
    question: string = '';
    description: string = 'Figure out the 3 digit combination';
    hintLevel: number = 2;
    solved: boolean = false;
    private hints: string[] = ['The solution is: ', 
                            'Green numbers are correct and in correct position, yellow are correct but wrong position', 
                            'After each guess some numbers change colours, maybe that means something'];
    solution: Number[];
    
    constructor(){
        this.solution = generateNumbers();
        MastermindPuzzle.puzzles[this.id] = this
    }

    static get(puzzleId: string): MastermindPuzzle {
        return MastermindPuzzle.puzzles[puzzleId]
    }


    getSolution(): Number[]{
        return this.solution;
    }
    getHint(): string{
        if(this.hintLevel > 0){
            this.hintLevel--;
            return this.hints[this.hintLevel + 1];
        }
        else if(this.hintLevel == 0){
            return this.hints[this.hintLevel] + this.getSolution();
        }
        return 'No more hints.';
    }
    getDescription(): string {
        return this.question;
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
        return bools;
        }
    }