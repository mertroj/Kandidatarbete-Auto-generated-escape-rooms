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
function mapLettersToNumbers(letters: string[], word: string): number {
    return Number(word.split('').map(letter => letters.indexOf(letter)).join(''));
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
    private hint: string = '';
    generate(): PuzzleInfo{
        return this.puzzle.generate();
    }
    checkSolution(submittedAnswer: string): boolean{
        return this.puzzle.checkSolution(submittedAnswer);
    }
    getHint(): string{
        const newHint: string = this.puzzle.getHint();
        if(newHint !== 'No more hints.'){
            this.appendHint(newHint);
        }
        return this.hint;
    }
    private appendHint(hint: string): void{
        this.hint += '|' + hint;
    }
    constructor(){
        this.id = Number(new Date());
        const puzzleChoice: Number = getRandomInt(0, 1);
        if(puzzleChoice === 0){
            this.puzzle = new LettersMathPuzzle();
        }
        else{
            this.puzzle = new OperatorMathPuzzle();
        }
    }
}

class LettersMathPuzzle{
    private letters: string[] = shuffleArray(("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split(''));
    private question: string;
    private answers: string[];
    private questionVars: string[];
    private answer: number;
    private hintLevel: number = 2;
    constructor(){
        this.answer = Math.floor((Math.random() * 9000) + 1001);
        this.questionVars = this.init();
        const lettersWithHint = this.questionVars[0].slice(0, -1) + (this.answer%10).toString();
        this.question = `What is the mapping of each letter in ${this.questionVars[0]} to numbers so that the equation ${lettersWithHint} - ${this.questionVars[1]} = ${this.questionVars[2]} is satisfied?`;
        this.answers = this.generateAllMappings(
            this.questionVars[0], 
            this.questionVars[2], 
            Number(this.questionVars[1]), 
            this.questionVars[0][3], 
            this.answer%10
        );
    }
    checkSolution(submittedAnswer: string): boolean{
        console.log('submitted answer: ' + submittedAnswer);
        console.log('possible answers: ' + this.answers);
        return this.answers.includes(submittedAnswer);
    }
    generate(): PuzzleInfo {
        return new PuzzleInfo(5, this.question);
    }
    getHint(): string{
        if(this.hintLevel >= 0){
            const number: String = this.answer.toString()[this.hintLevel];
            const letter: String = this.letters[Number(this.answer.toString()[this.hintLevel])];
            this.hintLevel--;
            return 'The letter ' + letter + ' is ' + number + '.';
        }
        return 'No more hints.';
    }
    
    private init(): string[] {
        let answerSlice: string;
        let remainder: number;
        let answerLetters: string;
        let sliceLetters: string; 
        do {
            answerSlice = shuffleArray(this.answer.toString().split("")).join(""); //shuffle the same four digits as the answer.
            remainder = this.answer - Number(answerSlice);
        } while(!this.checkValidity(remainder)); //valid if shuffled number is less than the answer
        
        answerLetters = mapNumbersToLetters(this.answer.toString(), this.letters);
        sliceLetters = mapNumbersToLetters(answerSlice, this.letters);
        //answerLetters = answerLetters.slice(0, -1) + (this.answer%10).toString();

        //should randomize the operation as well
        //return `What is the mapping of each letter in ${answerLetters} to numbers so that the equation ${answerLetters} - ${remainder} = ${sliceLetters} is satisfied?`;
        return[answerLetters, remainder.toString(), sliceLetters];
    }
    private checkValidity(remainder: number): boolean {
        if(remainder <= 0){
            return false;
        }
        return true;
    }

    private generateAllMappings(original: string, shuffled: string, remainder: number, givenLetter: string, givenDigit: number): string[] {
        let allMappings: string[] = [];
        let originalLetters = original.split('');
        let allPermutations: number[][] = this.generatePermutations(10, originalLetters.length);

        // Filter out permutations that do not map the given letter to the given digit
        allPermutations = allPermutations.filter(
            permutation => 
            permutation[permutation.length-1] === givenDigit &&
            mapNumbersToLetters(permutation[permutation.length-1].toString(), this.letters) === givenLetter
        );
        // For each permutation, create a mapping and check if it satisfies the equation
        for (let permutation of allPermutations) {
            let mapping = new Map<string, number>();
            for (let i = 0; i < originalLetters.length; i++) {
                mapping.set(originalLetters[i], permutation[i]);
            }
            if (this.checkMapping(original, shuffled, remainder, mapping)) {
                // Convert the mapping to a string of numbers in the same order as the original letters
                let mappingString = originalLetters.map(letter => mapping.get(letter)).join('');
                allMappings.push(mappingString);
            }
        }
        //allMappings.push(this.answer.toString());
        return [...new Set(allMappings)];
    }
    
    private generatePermutations(n: number, r: number): number[][] {
        // Generate all numbers from 0 to n-1
        let numbers = Array.from({length: n}, (_, i) => i);
    
        // Generate all permutations of these numbers of length r
        let permutations: number[][] = [];
        this.generatePermutationsHelper(numbers, [], r, permutations);
        //console.log('Permutations' + permutations);
        return permutations;
    }
    
    private generatePermutationsHelper(numbers: number[], current: number[], r: number, permutations: number[][]) {
        if (current.length === r) {
            permutations.push(current);
        } else {
            for (let i = 0; i < numbers.length; i++) {
                this.generatePermutationsHelper(numbers.filter((_, index) => index !== i), current.concat(numbers[i]), r, permutations);
            }
        }
    }
    
    private checkMapping(original: string, shuffled: string, remainder: number, mapping: Map<string, number>): boolean {
        let originalMapped = parseInt(original.split('').map(letter => mapping.get(letter)).join(''));
        let shuffledMapped = parseInt(shuffled.split('').map(letter => mapping.get(letter)).join(''));
        return originalMapped - remainder === shuffledMapped;
    }
}
class OperatorMathPuzzle{
    private numbers: number[];
    private operators: string[];
    private usedOperators: string[];
    private question: string;
    private hintLevel : number = 0; //hintLevel 0-2 since we have three operations (numbered 0, 1, and 2)

    constructor() {
        this.numbers = [];
        this.usedOperators = [];
        this.operators = ['+', '-', '*', '/'];
        this.init();
        const result: number = this.applyOperations();
        this.question = this.formQuestion(result);
    }

    checkSolution(submittedAnswer: string): boolean{
        return this.usedOperators.join('') === submittedAnswer;
    }

    generate(): PuzzleInfo {
        return new PuzzleInfo(2, this.question);
    }
    getHint(): string{
        if(this.hintLevel <= 2){
            const hint: string = 'The next operations is ' + this.usedOperators[this.hintLevel];
            this.hintLevel++;
            return hint;
        }else{
            return 'No more hints.'
        }
    }

    private init(): void {
        for (let i = 0; i < 4; i++) {
            this.numbers.push(getRandomInt(1, 50));
        }
    }
    private formQuestion(result: number): string {
        return `What is the sequence of operators used in the following operation (use left to right order of operation): ${this.numbers[0]} □ ${this.numbers[1]} □ ${this.numbers[2]} □ ${this.numbers[3]} = ${result}?`;
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