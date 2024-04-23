import { Anagram } from "./Anagram";
import { frequencies, repeat } from "../Helpers";
import { LettersMathPuzzle } from "./LettersMathPuzzle";
import { OperatorMathPuzzle } from "./OperatorMathPuzzle";
import { Puzzle } from "./Puzzle";
import { SlidePuzzle } from "./SlidePuzzle/SlidePuzzle";
import { Jigsaw } from "./Jigsaw";
import { MastermindPuzzle } from "./MastermindPuzzles";
import { SpotTheDifference } from "./SpotTheDifference";
import { MemoryPuzzle } from "./MemoryPuzzle/MemoryPuzzle";
import { Theme } from "../Theme";

export class PuzzleFactory{
    private puzzleInitializers: {[key: string]: (difficulty: number, dependentPuzzles: string[], theme: Theme) => Puzzle};
    private puzzleTypeMap: {
        [key: string]: [number, typeof Anagram | typeof LettersMathPuzzle | typeof OperatorMathPuzzle | typeof SlidePuzzle | typeof MastermindPuzzle | typeof MemoryPuzzle | typeof Jigsaw]
    } = {
        'anagram': [60, Anagram],
        'lettersMathPuzzle': [40, LettersMathPuzzle],
        'operatorMathPuzzle': [40, OperatorMathPuzzle],
        'slidePuzzle': [100, SlidePuzzle],
        'mastermindPuzzle': [100, MastermindPuzzle],
        'memoryPuzzle': [100, MemoryPuzzle],
        'jigsawPuzzle': [100, Jigsaw],
        'spotTheDifference': [100, SpotTheDifference]
    };

    constructor(excludedPuzzleTypes: string[]){
        //TODO: do the same for converging and end puzzles when more types are available
        this.puzzleInitializers = {
            'anagram': (difficulty, dependentPuzzles) => new Anagram(difficulty, dependentPuzzles),
            'lettersMathPuzzle': (difficulty, dependentPuzzles) => new LettersMathPuzzle(dependentPuzzles),
            'operatorMathPuzzle': (difficulty, dependentPuzzles) => new OperatorMathPuzzle(difficulty, dependentPuzzles),
            'slidePuzzle': (difficulty, dependentPuzzles) => new SlidePuzzle(difficulty, dependentPuzzles),
            'mastermindPuzzle': (difficulty, dependentPuzzles) => new MastermindPuzzle(difficulty, dependentPuzzles),
            'memoryPuzzle': (difficulty, dependentPuzzles, theme) => new MemoryPuzzle(difficulty, dependentPuzzles, theme),
            'spotTheDifference': (dependentPuzzles, theme) => new MemoryPuzzle(difficulty, dependentPuzzles, theme)
        };

        excludedPuzzleTypes.forEach(puzzleType => {
            delete this.puzzleInitializers[puzzleType];
            delete this.puzzleTypeMap[puzzleType];
        });
    }

    createRandomPuzzle(difficulty: number, theme: Theme, dependentPuzzles: string[] = []): Puzzle{
        const puzzleFrequencies = Object.entries(this.puzzleInitializers).map(([puzzleType, initializer]) => {
            let [granularity, Puzzle] = this.puzzleTypeMap[puzzleType];
            return [granularity - Puzzle.objectCounter, () => initializer(difficulty, dependentPuzzles, theme)] as [number, () => Puzzle];
        });

        return frequencies<() => Puzzle>(puzzleFrequencies)();
    }

    createRandomConvergingPuzzle(difficulty: number, dependentPuzzles: string[]): Puzzle{
        let puzzle = new SlidePuzzle(difficulty, dependentPuzzles); //TODO: Add more types of converging puzzles
        return puzzle;
    }

    createRandomEndPuzzle(difficulty: number, dependentPuzzles: string[]): Puzzle{
        return frequencies<() => Puzzle>([
            [1, () => new Jigsaw(difficulty, dependentPuzzles)]
        ])();
    }
}