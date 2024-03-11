import { v4 as uuidv4 } from 'uuid';
import { randomIntRange } from './Helpers';
import { Puzzle } from './Puzzle';

const allLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class LettersMathPuzzle implements Puzzle{
    private static puzzles: {[key: string]: [LettersMathPuzzle, string, number]} = {}

    id: string = uuidv4();
    type: string = "lettersMathPuzzle";
    question: string;
    description: string = `What is the mapping of each letter to numbers so that the equation is satisfied?`;
    hintLevel: number = 0;
    solved: boolean = false;

    constructor(){
        let [question, letters, answer] = this.init();
        this.question = question;
        LettersMathPuzzle.puzzles[this.id] = [this, letters, answer]
    }

    private init(): [string, string, number] {
        let answerSlice: string;
        let remainder: number;
        let letters = shuffleArray((allLetters).split(''));
        let firstTerm = randomIntRange(1001, 10000);
        do {
            answerSlice = shuffleArray(firstTerm.toString().split("")).join(""); //shuffle the same four digits as the answer.
            remainder = firstTerm - Number(answerSlice);
        } while(remainder <= 0); //valid if shuffled number is less than the answer
        
        let firstTermLetters = mapNumbersToLetters(firstTerm.toString(), letters);
        let answerLetters = mapNumbersToLetters(answerSlice, letters);
        firstTermLetters = firstTermLetters.slice(0, -1) + (firstTerm%10).toString();

        //should randomize the operation as well
        let question = `${firstTermLetters} - ${remainder} = ${answerLetters}`

        return [question, letters.join(''), firstTerm-remainder]
    }

    static get(puzzleId: string): LettersMathPuzzle {
        return LettersMathPuzzle.puzzles[puzzleId][0]
    }

    private getLetters():string {
        return LettersMathPuzzle.puzzles[this.id][1]
    }

    private getAnswer():number {
        return LettersMathPuzzle.puzzles[this.id][2]
    }

    getHint(): string{
        if(this.hintLevel < 3){
            const number: string = this.getAnswer().toString()[this.hintLevel++];
            const letter: string = this.getLetters().charAt(Number(number));
            return 'The letter ' + letter + ' is ' + number + '.';
        }
        return 'No more hints.';
    }

    checkAnswer(answer: string): boolean {
        let res: boolean = parseInt(answer) === this.getAnswer();
        if (!this.solved) this.solved = res
        return res
    }

    //TODO: possible recursive function to validate a unique answer for the equation
    //private validateEquation(): boolean {
        //1. map the first 3 letters to random unique numbers and mark the used numbers as "used"
    
        //2. test the validity of the equation for each digit for the final number (recursively maybe)
        //3. if the equation is valid, add 1 to possible solutions
            //if the possible solutions > 1, return false
        //4. if the equation is invalid, recursively move back and change the second last number and repeat from step 2.
    //}
}

function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function mapNumbersToLetters(numbers: string, letters: string[]): string {
    return numbers.split('').map(num => letters[Number(num)]).join('');
}