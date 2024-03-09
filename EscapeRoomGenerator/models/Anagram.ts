import { v4 as uuidv4 } from 'uuid';
import { randomInt, randomIntRange } from './Helpers'

const anagramsData = require('../anagrams.json')

export class Anagram {
    private static puzzles: {[key: string]: Anagram} = {}

    private type: string = 'anagram';
    private description: string = 'Find the hidden word';

    private id: string = uuidv4();
    private question: string;
    private hintLevel: number = 0;
    private solved: boolean = false;

    constructor(estimatedTime: number) {
        this.question = this.getQuestion(estimatedTime);
        Anagram.puzzles[this.id] = this
    }

    static get(puzzleId: string): Anagram {
        return Anagram.puzzles[puzzleId]
    }

    private getAnswers(): string {
        return anagramsData[`${this.question.length}`].find((a: string[]) => a[0] == this.question)[1]
    }

    getHint(): string {
        const answers = this.getAnswers()
    
        if (this.hintLevel === this.question.length) {
            return 'Bro..... you got the whole word already, what you doing with your life even?'
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
        if (!this.solved) this.solved = res
        return res
    }

    getQuestion(estimatedTime: number): string {
        let minLength: number;
        let maxLength: number;
        if (estimatedTime >= 1 && estimatedTime <= 3) {
            [minLength, maxLength] = [3, 4];
        } else if (estimatedTime >= 4 && estimatedTime <= 7) {
            [minLength, maxLength] = [5, 6];
        } else {
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