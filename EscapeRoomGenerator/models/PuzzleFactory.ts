import { Anagram } from "./Anagram";
import { frequencies, repeat } from "./Helpers";
import { LettersMathPuzzle } from "./LettersMathPuzzle";
import { OperatorMathPuzzle } from "./OperatorMathPuzzle";
import { Puzzle } from "./Puzzle";
import { SlidePuzzle } from "./SlidePuzzle/SlidePuzzle";
import {Jigsaw} from "./Jigsaw";

export class PuzzleFactory{
    private static anagramCounter = 0;
    private static lettersCounter = 0;
    private static operatorCounter = 0;
    private static slideCounter = 0;

    ////THE BUG IS HERE... DO NOT ADD THE OBSERVERS BEFORE MAKING SURE THAT THE PUZZLE IT ACCEPTED IN THE RECURSION
    static createRandomPuzzle(difficulty: number, dependentPuzzles: string[] = []): Puzzle{
        return frequencies<() => Puzzle>([
            [100 - (this.anagramCounter/100), () =>
                {
                    this.anagramCounter++;
                    return new Anagram(difficulty, dependentPuzzles);
                }
            ],            
            [100 - (this.lettersCounter/100), () =>
                {
                    this.lettersCounter++;
                    return new LettersMathPuzzle(dependentPuzzles);
                }
            ],
            [100 - (this.operatorCounter/100), () =>
                {
                    this.operatorCounter++;
                    return new OperatorMathPuzzle(difficulty, dependentPuzzles);
                }
            ],
            [100 - (this.slideCounter/100), () => 
                {
                    this.slideCounter++;
                    return new SlidePuzzle(difficulty, dependentPuzzles);
                }
            ],
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