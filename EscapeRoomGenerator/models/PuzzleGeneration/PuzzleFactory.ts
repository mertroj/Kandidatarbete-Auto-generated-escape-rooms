import { frequencies } from "../Helpers";
import { Theme } from "../Theme";

import { Puzzle } from "./Puzzle";
import { Anagram } from "../Puzzles/Anagram";
import { LettersMathPuzzle } from "../Puzzles/LettersMathPuzzle";
import { OperatorMathPuzzle } from "../Puzzles/OperatorMathPuzzle";
import { SlidePuzzle } from "../Puzzles/SlidePuzzle";
import { Jigsaw } from "../Puzzles/Jigsaw";
import { MastermindPuzzle } from "../Puzzles/MastermindPuzzle";
import { SpotTheDifference } from "../Puzzles/SpotTheDifference";
import { MemoryPuzzle } from "../Puzzles/MemoryPuzzle";

type IInitFunc = (difficulty: number, dependentPuzzles: string[], theme: Theme) => Puzzle;

export class PuzzleFactory{
    private static baseFrequenciesPuzzle: [string, number, IInitFunc][] = [
        [Anagram.type,            30,  
            (difficulty, dependentPuzzles, _theme)  => new Anagram(difficulty, dependentPuzzles)],
        [LettersMathPuzzle.type,  20,  
            (_difficulty, dependentPuzzles, _theme) => new LettersMathPuzzle(dependentPuzzles)],
        [OperatorMathPuzzle.type, 20,  
            (difficulty, dependentPuzzles, _theme)  => new OperatorMathPuzzle(difficulty, dependentPuzzles)],
        [SlidePuzzle.type,        50, 
            (difficulty, dependentPuzzles, _theme)  => new SlidePuzzle(difficulty, dependentPuzzles)],
        [MastermindPuzzle.type,   50, 
            (difficulty, dependentPuzzles, _theme)  => new MastermindPuzzle(difficulty, dependentPuzzles)],
        [MemoryPuzzle.type,       50, 
            (difficulty, dependentPuzzles, theme)   => new MemoryPuzzle(difficulty, dependentPuzzles, theme)],
        [SpotTheDifference.type,  25,  
            (difficulty, dependentPuzzles, theme)   => new SpotTheDifference(difficulty, dependentPuzzles, theme)]
    ];

    private static baseFrequenciesConvPuzzle: [string, number, IInitFunc][] = [
        [SlidePuzzle.type, 1, (difficulty, dependentPuzzles, _theme)   => new SlidePuzzle(difficulty, dependentPuzzles)]
    ]

    private static baseFrequenciesEndPuzzle: [string, number, IInitFunc][] = [
        [Jigsaw.type, 1, (difficulty, dependentPuzzles, theme)   => new Jigsaw(difficulty, dependentPuzzles, theme)]
    ]

    static createRandomPuzzle(puzzleCount: {[key: string]: number}, excludedPuzzleTypes: string[], difficulty: number, theme: Theme, dependentPuzzles: string[] = []): Puzzle{
        return frequencies<IInitFunc>(
            this.baseFrequenciesPuzzle
                .filter(([type, _freq, _InitFunc]) => !excludedPuzzleTypes.includes(type))
                .map(([type, freq, InitFunc]) => {
                    return [Math.max(puzzleCount[type] ? freq - puzzleCount[type] : freq, 1), InitFunc];
                })
            )(difficulty, dependentPuzzles, theme);
    }

    static createRandomConvergingPuzzle(puzzleCount: {[key: string]: number}, excludedPuzzleTypes: string[], difficulty: number, theme: Theme, dependentPuzzles: string[]): Puzzle{
        return frequencies<IInitFunc>(
            this.baseFrequenciesConvPuzzle
                .filter(([type, _freq, _InitFunc]) => !excludedPuzzleTypes.includes(type))
                .map(([type, freq, InitFunc]) => {
                    return [Math.max(puzzleCount[type] ? freq - puzzleCount[type] : freq, 1), InitFunc];
                })
            )(difficulty, dependentPuzzles, theme);
    }

    static createRandomEndPuzzle(puzzleCount: {[key: string]: number}, excludedPuzzleTypes: string[], difficulty: number, theme: Theme, dependentPuzzles: string[]): Puzzle{
        return frequencies<IInitFunc>(
            this.baseFrequenciesEndPuzzle
                .filter(([type, _freq, _InitFunc]) => !excludedPuzzleTypes.includes(type))
                .map(([type, freq, InitFunc]) => {
                    return [Math.max(puzzleCount[type] ? freq - puzzleCount[type] : freq, 1), InitFunc];
                })
            )(difficulty, dependentPuzzles, theme);
    }
}