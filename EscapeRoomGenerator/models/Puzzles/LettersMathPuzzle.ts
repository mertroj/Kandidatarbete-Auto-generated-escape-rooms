import { v4 as uuidv4 } from 'uuid';
import { randomIntRange, removeDuplicates } from '../Helpers';
import { Observable, Observer } from './ObserverPattern';
import { shuffleArray } from '../Helpers';

const allLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class LettersMathPuzzle implements Observable, Observer {
    private static puzzles: {[key: string]: LettersMathPuzzle} = {}

    private observers: Observer[] = [];
    private dependentPuzzles: string[];

    id: string = uuidv4();
    type: string = "lettersMathPuzzle";
    question: string;
    description: string = `Hmm, all the numbers in this equation have been replaced with letters. What is the result of the equation in numbers?`;
    hints: string[] = [];
    isSolved: boolean = false;
    estimatedTime: number = 7; //Average based on tests
    isLocked: boolean = false;

    letters: string;
    mainAnswer: number;
    possibleAnswers: string[];

    constructor(dependentPuzzles: string[]){
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        let [question, letters, mainAnswer, shuffledAnswer] = this.init();
        this.question = question;
        this.letters = letters;
        this.mainAnswer = mainAnswer;
        this.possibleAnswers = generateAllMappings(
            mapNumbersToLetters(mainAnswer.toString(), letters), //expected answer
            mapNumbersToLetters(shuffledAnswer.toString(), letters), //shuffled answer
            mainAnswer-shuffledAnswer, //remainder
            letters[mainAnswer%10],
            mainAnswer%10,
            letters
        );
        LettersMathPuzzle.puzzles[this.id] = this;
    }

    static get(puzzleId: string): LettersMathPuzzle {
        return LettersMathPuzzle.puzzles[puzzleId]
    }

    private init(): [string, string, number, number] {
        const checkTermsValidity = (remainder: number, firstTerm: number, firstTermsShuffled: number): boolean => {
            return remainder <= 0 || firstTermsShuffled < 1000 || hasRepeats(firstTerm.toString()) || hasRepeats(firstTermsShuffled.toString()) ? false : true;
        }
        let answerSlice: string;
        let remainder: number;
        let firstTerm: number;
        let letters: string = shuffleArray<string>((allLetters).split('')).join('');
        do {
            firstTerm = randomIntRange(101, 1000);
            answerSlice = shuffleArray(firstTerm.toString().split("")).join(""); //shuffle the same four digits as the answer.
            remainder = firstTerm - Number(answerSlice);
        } while(!checkTermsValidity(remainder, firstTerm, Number(answerSlice))); //valid if shuffled number is less than the answer
        
        let firstTermLetters = mapNumbersToLetters(firstTerm.toString(), letters);
        let answerLetters = mapNumbersToLetters(answerSlice, letters);
        firstTermLetters = firstTermLetters.slice(0, -1) + (firstTerm%10).toString();

        //TODO: Randomize the operation as well
        let question = `${firstTermLetters} - ${remainder} = ${answerLetters}`
        return [question, letters, firstTerm-remainder, firstTerm]
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
        return remainder <= 0 || firstTermsShuffled < 100 || hasRepeats(firstTerm.toString()) || hasRepeats(firstTermsShuffled.toString()) ? false : true;
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): string[] {
        return this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }
    update(id: string): string{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
            return this.id;
        }
        return '';
    }

    getHint(): string{
        if (this.hints.length === 3)
            return 'No more hints.';

        const number: string = this.mainAnswer.toString()[this.hints.length];
        const letter: string = this.letters.charAt(Number(number));
        let hint = 'The letter ' + letter + ' is ' + number;
        this.hints.push(hint)
        return hint
    }

    checkAnswer(answer: string): {result: boolean, unlockedPuzzles: string[]} {
        let result = this.possibleAnswers.includes(answer);

        if (result && !this.isSolved) {
            this.isSolved = result;
            let unlockedPuzzles = this.notifyObservers();
            return {result, unlockedPuzzles}
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

function checkMapping(original: string, shuffled: string, remainder: number, mapping: Map<string, number>): boolean {
    let originalMapped = parseInt(original.split('').map(letter => mapping.get(letter)).join(''));
    let shuffledMapped = parseInt(shuffled.split('').map(letter => mapping.get(letter)).join(''));
    return originalMapped - remainder === shuffledMapped;
}

function generatePermutations(n: number, r: number): number[][] {
    const generatePermutationsHelper = (numbers: number[], current: number[], r: number, permutations: number[][]) => {
        if (current.length === r) {
            permutations.push(current);
        } else {
            for (let i = 0; i < numbers.length; i++) {
                generatePermutationsHelper(numbers.filter((_, index) => index !== i), current.concat(numbers[i]), r, permutations);
            }
        }
    }

    let numbers = Array.from({length: n}, (_, i) => i);
    let permutations: number[][] = [];

    generatePermutationsHelper(numbers, [], r, permutations);
    return permutations;
}

function generateAllMappings(original: string, shuffled: string, remainder: number, givenLetter: string, givenDigit: number, letters: string): string[] {
    let allMappings: string[] = [];
    let originalLetters = original.split('');
    let allPermutations: number[][] = generatePermutations(10, originalLetters.length);

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
        if (checkMapping(original, shuffled, remainder, mapping)) {
            let mappingString = originalLetters.map(letter => mapping.get(letter)).join('');
            allMappings.push(mappingString);
        }
    }
    return removeDuplicates(allMappings);
}