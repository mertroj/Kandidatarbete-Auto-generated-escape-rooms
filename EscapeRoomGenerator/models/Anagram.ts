import { v4 as uuidv4 } from 'uuid';
import {getRandomInt, getRandomIntRange} from './Helpers'

const anagramsData = require('../anagrams.json')

export class Anagram {
    id: string;
    type: string = 'anagram';
    question: string = '';
    description: string = 'Find the hidden word';
    hintLevel: number;

    constructor(question: string) {
        this.id = uuidv4();
        this.hintLevel = 0;
        this.question = question;
    }
}
const anagrams: {[key: string]: Anagram} = {}

export function createAnagram(estimatedTime: number): Anagram {
    let minLength: number;
    let maxLength: number;
    if (estimatedTime >= 1 && estimatedTime <= 3) {
        [minLength, maxLength] = [3, 4];
    } else if (estimatedTime >= 4 && estimatedTime <= 7) {
        [minLength, maxLength] = [5, 6];
    } else {
        [minLength, maxLength] = [7, 8];
    }
    const randomLength = getRandomIntRange(minLength, maxLength + 1);
    const possibleAnagrams = anagramsData[randomLength.toString()];

    if (!possibleAnagrams) {
        throw new Error(`No anagrams found for length ${randomLength}.`);
    }

    const anagramData = possibleAnagrams[getRandomInt(possibleAnagrams.length)];
    const anagram = new Anagram(anagramData[0]);
    anagrams[anagram.id] = anagram;

    return anagram
}

function getAnagramData(anagram: Anagram): string[] {
    return anagramsData[`${anagram.question.length}`].find((a: string[]) => a[0] == anagram.question)
}

export function getAnagram(puzzleId: string): Anagram {
    return anagrams[puzzleId]
}

export function getHint(anagram: Anagram): string {
    const anagramData = getAnagramData(anagram)

    if (anagram.hintLevel === anagram.question.length) {
        return 'Bro..... you got the whole word already, what you doing with your life even?'
    }
    if (!anagramData[1].length) return '';

    const hint = `I know the ${anagram.hintLevel == 0 ? 'first' : 'next'} letter is ${anagramData[1][anagram.hintLevel]}, but what's the rest?`;
    anagram.hintLevel++;

    return hint
}

export function testAnswer(anagram: Anagram, answer: string): boolean {
    const anagramData = getAnagramData(anagram)
    const answerLowerCase = answer.toLowerCase();

    if (anagramData[1].includes(';')) {
        return !!anagramData[1]
                    .split(';')
                    .map(subAnswer => subAnswer.trim())
                    .find((subAnswer) => subAnswer === answerLowerCase)
    } else {
        return anagramData[1].toLowerCase() === answerLowerCase;
    }
}