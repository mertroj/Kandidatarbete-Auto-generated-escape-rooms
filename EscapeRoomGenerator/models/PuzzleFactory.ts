import { Anagram } from "./Anagram";
import { frequencies, repeat } from "./Helpers";
import { LettersMathPuzzle } from "./LettersMathPuzzle";
import { OperatorMathPuzzle } from "./OperatorMathPuzzle";
import { Puzzle } from "./Puzzle";
import { SlidePuzzle } from "./SlidePuzzle/SlidePuzzle";
import {Jigsaw} from "./Jigsaw";

export class PuzzleFactory{
    ////THE BUG IS HERE... DO NOT ADD THE OBSERVERS BEFORE MAKING SURE THAT THE PUZZLE IT ACCEPTED IN THE RECURSION
    static createRandomPuzzle(difficulty: number, dependentPuzzles: string[] = []): Puzzle{
        return frequencies<() => Puzzle>([
            [1, () => new Anagram(difficulty, dependentPuzzles)], //false converging
            [1, () => new LettersMathPuzzle(dependentPuzzles)], //false converging
            [1, () => new OperatorMathPuzzle(difficulty, dependentPuzzles)], //false converging
            [1, () => new SlidePuzzle(difficulty, dependentPuzzles)], //false converging
            //Add Mastermind
        ])();
    }
    static createRandomConvergingPuzzle(difficulty: number, dependentPuzzles: string[]): Puzzle{
        let puzzle = new SlidePuzzle(difficulty, dependentPuzzles);
        return puzzle;
    }
    static createRandomEndPuzzle(difficulty: number, dependentPuzzles: string[]): Puzzle{
        return frequencies<() => Puzzle>([
            [1, () => new SlidePuzzle(difficulty, dependentPuzzles)]
            //[1, () => new Jigsaw(difficulty, dependentPuzzles)]
        ])();
    }
}