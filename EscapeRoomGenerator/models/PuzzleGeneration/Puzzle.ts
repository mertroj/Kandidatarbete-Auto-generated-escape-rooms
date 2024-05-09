import { Anagram } from "../Puzzles/Anagram";
import { Jigsaw } from "../Puzzles/Jigsaw";
import { LettersMathPuzzle } from "../Puzzles/LettersMathPuzzle";
import { OperatorMathPuzzle } from "../Puzzles/OperatorMathPuzzle";
import { SlidePuzzle } from "../Puzzles/SlidePuzzle";
import { MastermindPuzzle } from "../Puzzles/MastermindPuzzle";
import { SpotTheDifference } from "../Puzzles/SpotTheDifference";
import { MemoryPuzzle } from "../Puzzles/MemoryPuzzle";

export type Puzzle = Anagram | LettersMathPuzzle | OperatorMathPuzzle | SlidePuzzle | Jigsaw | MastermindPuzzle | SpotTheDifference | MemoryPuzzle;
