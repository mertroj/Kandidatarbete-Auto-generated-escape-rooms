import { v4 as uuidv4 } from 'uuid';
import { randomInt, randomIntRange } from './Helpers'
import { Observer, Puzzle } from './Puzzle';

const anagramsData = require('../anagrams.json')

export class Anagram implements Puzzle {
    private static puzzles: {[key: string]: Anagram} = {}

    private difficulty: number;
    private observers: Observer[] = []; //All puzzles that depend on this one (outgoing)
    private dependentPuzzles: string[]; //All puzzles that need to be solved before this one can be attempted (incoming)
    id: string = uuidv4();
    type: string = 'anagram';
    question: string;
    description: string = 'Find the hidden word';
    hintLevel: number = 0;
    estimatedTime: number;
    solved: boolean = false;
    isLocked: boolean = false;

    constructor(difficulty: number, dependentPuzzlez: string[]) {
        this.dependentPuzzles = dependentPuzzlez;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        this.difficulty = difficulty;
        this.estimatedTime = 2*this.difficulty;
        this.question = this.getQuestion();
        Anagram.puzzles[this.id] = this
    }

    static get(puzzleId: string): Anagram {
        return Anagram.puzzles[puzzleId]
    }

    private getAnswers(): string {
        return anagramsData[`${this.question.length}`].find((a: string[]) => a[0] == this.question)[1]
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

    getHint(): string {
        const answers = this.getAnswers()
    
        if (this.hintLevel === this.question.length) {
            return 'No more hints.';
        }
        if (!answers.length) return '';
    
        const hint = `I know the ${this.hintLevel == 0 ? 'first' : 'next'} letter is ${answers[this.hintLevel]}, but what's the rest?`;
        this.hintLevel++;
    
        return hint
    }
    
    checkAnswer(answer: string): boolean {
        const answers = this.getAnswers()
        const answerLowerCase = answer.toLowerCase();
    
        let res: boolean;
        if (answers.includes(';')) {
            res = !!answers
                        .split(';')
                        .map(subAnswer => subAnswer.trim())
                        .find((subAnswer) => subAnswer === answerLowerCase)
        } else {
            res = answers.toLowerCase() === answerLowerCase;
        }
        if (!this.solved) this.solved = res;
        if (res) this.notifyObservers();
        return res
    }

    getQuestion(): string {
        let minLength: number;
        let maxLength: number;
        if (this.difficulty === 1) {
            [minLength, maxLength] = [3, 4];
        } else if (this.difficulty === 2) {
            [minLength, maxLength] = [5, 6];
        } else { // difficulty === 3
            [minLength, maxLength] = [7, 8];
        }
        const randomLength = randomIntRange(minLength, maxLength+1);
        const possibleAnagrams = anagramsData[randomLength.toString()];
    
        if (!possibleAnagrams) {
            throw new Error(`No anagrams found for length ${randomLength}.`);
        }
    
        const anagramData = possibleAnagrams[randomInt(possibleAnagrams.length)];
        return anagramData[0]
    }
}