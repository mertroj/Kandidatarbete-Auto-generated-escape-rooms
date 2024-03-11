import { Anagram } from "./Anagram";
import { MathPuzzle } from "./MathPuzzles";
import { Puzzle } from "./PuzzleTreePopulator";

export function createAnagramPuzzle(requiredTime: number): Puzzle{
    //return new Anagram(requiredTime); //Check how new Anagram looks and convert it to desired format
    return {
        question: "Anagram question",
        solution: "Anagram solution",
        hint: "Anagram hint",
        et: 5,
        difficulty: "easy"
    }
}
export function createMathPuzzle(requiredTime: number): Puzzle{ //The time needs to be tested with users in order to return correct time from MathPuzzle
    //return new MathPuzzle(requiredTime); //Check how new MathPuzzle looks and convert it to desired format
    return {
        question: "Math question",
        solution: "Math solution",
        hint: "Math hint",
        et: 5,
        difficulty: "easy"
    }
}