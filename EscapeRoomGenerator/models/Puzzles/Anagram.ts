import { v4 as uuidv4 } from 'uuid';
import { randomInt, randomIntRange } from '../Helpers'
import { Observable, Observer } from './ObserverPattern';

const anagramsData = require('../../anagrams.json')

export class Anagram implements Observable, Observer {
    private static puzzles: {[key: string]: Anagram} = {}

    private observers: Observer[] = []; //All puzzles that depend on this one (outgoing)
    private dependentPuzzles: string[]; //All puzzles that need to be solved before this one can be attempted (incoming)

    id: string = uuidv4();
    type: string = 'anagram';
    question: string;
    description: string = 'Find the hidden word';
    hints: string[] = [];
    estimatedTime: number;
    isSolved: boolean = false;
    isLocked: boolean = false;

    constructor(difficulty: number, dependentPuzzles: string[]) {
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;
        this.estimatedTime = 2*difficulty;
        this.question = this.pickQuestion(difficulty);
        Anagram.puzzles[this.id] = this
    }

    static get(puzzleId: string): Anagram {
        return Anagram.puzzles[puzzleId]
    }
    private getAnswers(): string {
        return anagramsData[`${this.question.length}`].find((a: string[]) => a[0] === this.question)[1]
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
            return this.id
        }
        return ''
    }

    pickQuestion(difficulty: number): string {
        let minLength: number;
        let maxLength: number;
        if (difficulty === 1) {
            [minLength, maxLength] = [3, 4];
        } else if (difficulty === 2) {
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

    getHint(): string {
        const answers = this.getAnswers();
    
        if (this.hints.length === this.question.length) {
            return 'No more hints.';
        }
        if (!answers.length) return '';
    
        const hint = `I know the ${this.hints.length === 0 ? 'first' : 'next'} letter is ${answers[this.hints.length]}, but what's the rest?`;
        this.hints.push(hint)
        return hint
    }
    
    checkAnswer(answer: string): {result: boolean, unlockedPuzzles: string[]} {
        const answers = this.getAnswers();
        const answerLowerCase = answer.toLowerCase();
    
        let result: boolean;
        if (answers.includes(';')) {
            result = !!answers
                        .split(';')
                        .map(subAnswer => subAnswer.trim())
                        .find((subAnswer) => subAnswer === answerLowerCase)
        } else {
            result = answers.toLowerCase() === answerLowerCase;
        }

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