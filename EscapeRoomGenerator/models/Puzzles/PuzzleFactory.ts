import { Anagram } from "./Anagram";
import { frequencies, repeat } from "../Helpers";
import { LettersMathPuzzle } from "./LettersMathPuzzle";
import { OperatorMathPuzzle } from "./OperatorMathPuzzle";
import { Puzzle } from "./Puzzle";
import { SlidePuzzle } from "./SlidePuzzle/SlidePuzzle";
import { Jigsaw } from "./Jigsaw";
import { MastermindPuzzle } from "./MastermindPuzzles";
import { MemoryPuzzle } from "./MemoryPuzzle/MemoryPuzzle";
import { Theme } from "../Theme";

export class PuzzleFactory{
    private static anagramCounter = 0;
    private static lettersCounter = 0;
    private static operatorCounter = 0;
    private static slideCounter = 0;
    private static mastermindCounter = 0;
    private static memoryCounter = 0;

    //1000 gives more granularity than 100 or 10 whitout affecting the relative probabilities since the weight are relative, not absolute
    static createRandomPuzzle(difficulty: number, theme: Theme, dependentPuzzles: string[] = []): Puzzle{
        return frequencies<() => Puzzle>([
            [1000 - (this.anagramCounter/1000), () =>
                {
                    this.anagramCounter++;
                    return new Anagram(difficulty, dependentPuzzles);
                }
            ],            
            [1000 - (this.lettersCounter/1000), () =>
                {
                    this.lettersCounter++;
                    return new LettersMathPuzzle(dependentPuzzles);
                }
            ],
            [1000 - (this.operatorCounter/1000), () =>
                {
                    this.operatorCounter++;
                    return new OperatorMathPuzzle(difficulty, dependentPuzzles);
                }
            ],
            [1000 - (this.slideCounter/1000), () => 
                {
                    this.slideCounter++;
                    return new SlidePuzzle(difficulty, dependentPuzzles);
                }
            ],
            [1000 - (this.mastermindCounter/1000), () =>
                {
                    this.mastermindCounter++;
                    return new MastermindPuzzle(difficulty, dependentPuzzles);
                }
            ],
            [1000 - (this.memoryCounter/1000), () =>
                {
                    this.memoryCounter++;
                    return new MemoryPuzzle(difficulty, dependentPuzzles, theme);
                }
            ]

        ])();
    }
    static createRandomConvergingPuzzle(difficulty: number, dependentPuzzles: string[]): Puzzle{
        let puzzle = new SlidePuzzle(difficulty, dependentPuzzles); //TODO: Add more types of converging puzzles
        return puzzle;
    }
    static createRandomEndPuzzle(difficulty: number, dependentPuzzles: string[]): Puzzle{
        return frequencies<() => Puzzle>([
            [1, () => new Jigsaw(difficulty, dependentPuzzles)]
        ])();
    }
}