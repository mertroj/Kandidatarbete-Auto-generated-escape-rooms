import { v4 as uuidv4 } from 'uuid';
import { randomIntRange, removeDuplicates } from '../Helpers';
import { Observable, Observer } from './ObserverPattern';
import { shuffleArray } from '../Helpers';

const allLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class LettersMathPuzzle implements Observable, Observer {
    private static puzzles: {[key: string]: [LettersMathPuzzle, string, number, string[]]} = {}

    id: string = uuidv4();
    type: string = "lettersMathPuzzle";
    question: string;
    description: string = `Hmm, all the numbers in this equation have been replaced with letters. What is the result of the equation in numbers?`;
    hintLevel: number = 0;
    solved: boolean = false;
    estimatedTime: number = 3; //Average based on tests
    isLocked: boolean = false;
    private observers: Observer[] = [];
    private dependentPuzzles: string[];

    constructor(dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        let [question, letters, mainAnswer, shuffledAnswer] = this.init();
        this.question = question;
        let possibleAnswers = this.generateAllMappings(
            mapNumbersToLetters(mainAnswer.toString(), letters), //expected answer
            mapNumbersToLetters(shuffledAnswer.toString(), letters), //shuffled answer
            mainAnswer-shuffledAnswer, //remainder
            letters[mainAnswer%10],
            mainAnswer%10,
            letters
        );
        LettersMathPuzzle.puzzles[this.id] = [this, letters, mainAnswer, possibleAnswers];
    }

    private init(): [string, string, number, number] {
        let answerSlice: string;
        let remainder: number;
        let firstTerm: number;
        let letters: string = shuffleArray<string>((allLetters).split('')).join('');
        do {
            firstTerm = randomIntRange(1001, 10000);
            answerSlice = shuffleArray(firstTerm.toString().split("")).join(""); //shuffle the same four digits as the answer.
            remainder = firstTerm - Number(answerSlice);
        } while(!this.checkTermsValidity(remainder, firstTerm, Number(answerSlice))); //valid if shuffled number is less than the answer
        
        let firstTermLetters = mapNumbersToLetters(firstTerm.toString(), letters);
        let answerLetters = mapNumbersToLetters(answerSlice, letters);
        firstTermLetters = firstTermLetters.slice(0, -1) + (firstTerm%10).toString();

        //TODO: Randomize the operation as well
        let question = `${firstTermLetters} - ${remainder} = ${answerLetters}`
        return [question, letters, firstTerm-remainder, firstTerm]
    }

    static get(puzzleId: string): LettersMathPuzzle {
        return LettersMathPuzzle.puzzles[puzzleId][0]
    }

    private getLetters(): string {
        return LettersMathPuzzle.puzzles[this.id][1]
    }

    private getMainAnswer(): number {
        return LettersMathPuzzle.puzzles[this.id][2]
    }
    private getPossibleAnswers(): string[] {
        return LettersMathPuzzle.puzzles[this.id][3]
    }

    private checkTermsValidity(remainder: number, firstTerm: number, firstTermsShuffled: number): boolean {
        return remainder <= 0 || firstTermsShuffled < 1000 || hasRepeats(firstTerm.toString()) || hasRepeats(firstTermsShuffled.toString()) ? false : true;
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

    getHint(): string{
        if(this.hintLevel < 4){
            const number: string = this.getMainAnswer().toString()[this.hintLevel++];
            const letter: string = this.getLetters().charAt(Number(number));
            return 'The letter ' + letter + ' is ' + number;
        }
        return 'No more hints.';
    }

    checkAnswer(answer: string): boolean {
        let res = this.getPossibleAnswers().includes(answer);
        if (!this.solved) this.solved = res
        if (res) this.notifyObservers();
        return res
    }

    private generateAllMappings(original: string, shuffled: string, remainder: number, givenLetter: string, givenDigit: number, letters: string): string[] {
        let allMappings: string[] = [];
        let originalLetters = original.split('');
        let allPermutations: number[][] = this.generatePermutations(10, originalLetters.length);

        // Filter out permutations that do not satisfy the given helping digit
        allPermutations = allPermutations.filter(
            permutation => 
            permutation[permutation.length-1] === givenDigit &&
            mapNumbersToLetters(permutation[permutation.length-1].toString(), letters) === givenLetter
        );

        for (let permutation of allPermutations) {
            let mapping = new Map<string, number>();
            for (let i = 0; i < originalLetters.length; i++) {
                mapping.set(originalLetters[i], permutation[i]);
            }
            if (this.checkMapping(original, shuffled, remainder, mapping)) {
                let mappingString = originalLetters.map(letter => mapping.get(letter)).join('');
                allMappings.push(mappingString);
            }
        }
        return removeDuplicates(allMappings);
    }
    
    private generatePermutations(n: number, r: number): number[][] {
        let numbers = Array.from({length: n}, (_, i) => i);
        let permutations: number[][] = [];

        this.generatePermutationsHelper(numbers, [], r, permutations);
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

    strip() {
        return {
            type: this.type,
            id: this.id,
            solved: this.solved,
            isLocked: this.isLocked,
            hintLevel: this.hintLevel,

            question: this.question,
            description: this.description,
        }
    }
}

function mapNumbersToLetters(numbers: string, letters: string): string {
    return numbers.split('').map(num => letters[Number(num)]).join('');
}

function mapLettersToNumbers(letters: string[], word: string): number {
    return Number(word.split('').map(letter => letters.indexOf(letter)).join(''));
}

function hasRepeats (str: string): boolean {
    return /(.).*\1/.test(str);
}