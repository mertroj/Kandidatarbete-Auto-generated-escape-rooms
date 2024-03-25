import { v4 as uuidv4 } from 'uuid';
import { randomInt, randomIntRange } from './Helpers'
import { Puzzle } from './Puzzle';

const anagramsData = require('../anagrams.json')

export class Anagram implements Puzzle {
    private static puzzles: {[key: string]: Anagram} = {}

    id: string = uuidv4();
    type: string = 'anagram';
    question: string;
    description: string = 'Find the hidden word';
    hintLevel: number = 0;
    solved: boolean = false;
    estimatedTime: number;

    constructor(estimatedTime: number) {
        this.estimatedTime = estimatedTime
        this.question = this.getQuestion();
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
        if (!this.solved) this.solved = res
        return res
    }

    getQuestion(): string {
        let minLength: number;
        let maxLength: number;
        if (this.estimatedTime >= 1 && this.estimatedTime <= 3) {
            [minLength, maxLength] = [3, 4];
        } else if (this.estimatedTime >= 4 && this.estimatedTime <= 7) {
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