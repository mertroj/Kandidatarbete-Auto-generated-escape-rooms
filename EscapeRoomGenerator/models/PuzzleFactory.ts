import { Anagram } from "./Anagram";
import { frequencies, repeat } from "./Helpers";
import { LettersMathPuzzle } from "./LettersMathPuzzle";
import { OperatorMathPuzzle } from "./OperatorMathPuzzle";
import { Puzzle } from "./Puzzle";

export class PuzzleFactory{
    static createRandomPuzzle(difficulty: number): Puzzle{
        return frequencies<() => Puzzle>([
            [1, () => new Anagram(difficulty)], //false converging
            [1, () => new LettersMathPuzzle()], //false converging
            [1, () => new OperatorMathPuzzle(difficulty)] //false converging
            //Add slide puzzle and Mastermind
        ])();
    }
    static createRandomConvergingPuzzle(difficulty: number, incomingPuzzles: Puzzle[]): Puzzle{
        return new OperatorMathPuzzle(difficulty);
        throw new Error("Not implemented");
        //Add Slide Puzzle with default of being locked
    }
    static createRandomEndPuzzle(difficulty: number, incomingPuzzles: Puzzle[]): Puzzle{
        return new LettersMathPuzzle();
        throw new Error("Not implemented");
        //Add Jigsaw puzzle
    }
}