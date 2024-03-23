import { Anagram } from "./Anagram";
import { frequencies, repeat } from "./Helpers";
import { LettersMathPuzzle } from "./LettersMathPuzzle";
import { OperatorMathPuzzle } from "./OperatorMathPuzzle";
import { Puzzle } from "./Puzzle";
import { SlidePuzzle } from "./SlidePuzzle/SlidePuzzle";

export class PuzzleFactory{
    static createRandomPuzzle(difficulty: number): Puzzle{
        return frequencies<() => Puzzle>([
            [1, () => new Anagram(difficulty)], //false converging
            [1, () => new LettersMathPuzzle()], //false converging
            [1, () => new OperatorMathPuzzle(difficulty)], //false converging
            [1, () => new SlidePuzzle(difficulty)], //false converging
            //Add Mastermind
        ])();
    }
    static createRandomConvergingPuzzle(difficulty: number, dependentPuzzles: Puzzle[]): Puzzle{
        let puzzle = new SlidePuzzle(difficulty, dependentPuzzles);
        for (let dp of dependentPuzzles){
            dp.addObserver(puzzle);
        }
        return puzzle;
    }
    static createRandomEndPuzzle(difficulty: number, dependentPuzzles: Puzzle[]): Puzzle{
        let puzzle = new SlidePuzzle(difficulty, dependentPuzzles);
        for (let dp of dependentPuzzles){
            dp.addObserver(puzzle);
        }
        return puzzle;
        //Add Jigsaw puzzle
    }
}