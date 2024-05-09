import { v4 as uuidv4 } from 'uuid';
import { randomInt, randomIntRange } from '../Helpers'
import { Observable, Observer } from '../ObserverPattern';
import { Theme } from '../Theme';
import { generateThemedPuzzleText } from '../ChatGPTTextGenerator';

const anagramsData = require('../../Data/Anagrams.json')

export class Anagram implements Observable, Observer {
    private static puzzles: {[key: string]: Anagram} = {};
    static type = 'anagram';

    private observers: Observer[] = []; //All puzzles that depend on this one (outgoing)
    private dependentPuzzles: string[]; //All puzzles that need to be solved before this one can be attempted (incoming)

    id: string = uuidv4();
    type: string = Anagram.type;
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
        Anagram.puzzles[this.id] = this;
    }

    static get(puzzleId: string): Anagram {
        return Anagram.puzzles[puzzleId];
    }
    private getAnswers(): string {
        return anagramsData[`${this.question.length}`].find((a: string[]) => a[0] === this.question)[1];
    }
    
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }
    update(id: string): void {
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }

    pickQuestion(difficulty: number): string {
        let minLength: number = difficulty*2+1;
        let maxLength: number = difficulty*2+2;
        const randomLength = randomIntRange(minLength, maxLength+1);
        const possibleAnagrams = anagramsData[randomLength.toString()];
    
        if (!possibleAnagrams) {
            throw new Error(`No anagrams found for length ${randomLength}.`);
        }
    
        const anagramData = possibleAnagrams[randomInt(possibleAnagrams.length)];
        return anagramData[0];
    }

    async applyTheme(theme: Theme): Promise<void> {
        this.description = await generateThemedPuzzleText(this.description, theme);
    }

    getHint(): string | null {
        if (this.isSolved || this.isLocked) return null;

        const answers = this.getAnswers();
    
        if (this.hints.length === this.question.length || !answers.length) return null;
    
        const hint = `I know the ${this.hints.length === 0 ? 'first' : 'next'} letter is ${answers[this.hints.length]}, but what's the rest?`;
        this.hints.push(hint);
        return hint;
    }
    
    checkAnswer(answer: string): boolean{
        if (this.isSolved || this.isLocked) return false;
        
        const answers = this.getAnswers();
        const answerLowerCase = answer.toLowerCase();
    
        let result: boolean;
        if (answers.includes(';')) {
            result = !!answers
                        .split(';')
                        .map(subAnswer => subAnswer.trim())
                        .find((subAnswer) => subAnswer === answerLowerCase);
        } else {
            result = answers.toLowerCase() === answerLowerCase;
        }

        if (result && !this.isSolved) {
            this.isSolved = result;
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
            
            question: this.question,
            description: this.description,
        };
    }
}