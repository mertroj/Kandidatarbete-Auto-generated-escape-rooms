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
function generateOperation(array: any[]): string {
    return array[Math.floor(Math.random() * array.length)];
}
function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class PuzzleInfo{
    time: number;
    question: string;
    constructor(t: number, q: string){
        this.time = t;
        this.question = q;
    }
}

export class MathPuzzle{
    id: number;
    puzzle: OperatorMathPuzzle | LettersMathPuzzle;
    generate(): PuzzleInfo{
        return this.puzzle.generate();
    };
    getSolution(): string{
        return this.puzzle.getSolution();
    };
    constructor(){
        this.id = Number(new Date());
        this.puzzle = new LettersMathPuzzle();
    }
}

class LettersMathPuzzle{
    private letters: string[] = shuffleArray(("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split(''));
    private question: string;
    private answer: number;
    constructor(){
        this.answer = Math.floor((Math.random() * 9000) + 1001);
        this.question = this.init();
    }
    getSolution(): string{
        return this.answer.toString();
    }
    generate(): PuzzleInfo {
        return new PuzzleInfo(5, this.question);
    }
    
    private init(): string {
        let answerSlice: string;
        let remainder: number;
        let answerLetters: string;
        let sliceLetters: string; 
        do {
            answerSlice = shuffleArray(this.getSolution().split("")).join(""); //shuffle the same four digits as the answer.
            remainder = this.answer - Number(answerSlice);
        } while(!this.checkValidity(remainder)); //valid if shuffled number is less than the answer
        
        answerLetters = mapNumbersToLetters(this.getSolution(), this.letters);
        sliceLetters = mapNumbersToLetters(answerSlice, this.letters);
        //answerLetters = answerLetters.slice(0, -1) + (this.answer%10).toString();

        //should randomize the operation as well
        return `What is the mapping of ${answerLetters} to numbers so that the equation ${answerLetters} - ${remainder} = ${sliceLetters} is satisfied?`;
    }
    private checkValidity(remainder: number): boolean {
        if(remainder <= 0){
            return false;
        }
        return true;
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
class OperatorMathPuzzle{
    private numbers: number[];
    private operators: string[];
    private usedOperators: string[];
    private question: string;

    constructor() {
        this.numbers = [];
        this.usedOperators = [];
        this.operators = ['+', '-', '*', '/'];
        this.init();
        const result: number = this.applyOperations();
        this.question = this.formQuestion(result);
    }

    getSolution(): string{
        return this.usedOperators.join('');
    }

    generate(): PuzzleInfo {
        return new PuzzleInfo(2, this.question);
    }

    private init(): void {
        for (let i = 0; i < 4; i++) {
            this.numbers.push(getRandomInt(1, 100));
        }
    }
    private formQuestion(result: number): string {
        return `What is the sequence of operators used in the following operation ("not (not wrong)" to "not wrong"): ${this.numbers[0]} □ ${this.numbers[1]} □ ${this.numbers[2]} □ ${this.numbers[3]} = ${result}?`;
    }

    private applyOperations(): number {
        let result = this.numbers[0];
        for (let i = 1; i < 4; i++) {
            const operator = generateOperation(this.operators);
            const operand = this.numbers[i];
            switch (operator) {
                case '+':
                    result += operand;
                    this.usedOperators.push('+');
                    break;
                case '-':
                    result -= operand;
                    this.usedOperators.push('-');
                    break;
                case '*':
                    result *= operand;
                    this.usedOperators.push('*');
                    break;
                case '/':
                    if (operand !== 0 && result % operand === 0 && result / operand > 0) {
                        result /= operand;
                        this.usedOperators.push('/');
                    } else i--;
                    break;
            }
        }
        return result;
    }
}

