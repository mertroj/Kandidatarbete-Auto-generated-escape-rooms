import { Anagram } from "./Anagram";
import { Jigsaw } from "./Jigsaw";
import { LettersMathPuzzle } from "./LettersMathPuzzle";
import { OperatorMathPuzzle } from "./OperatorMathPuzzle";
import { SlidePuzzle } from "./SlidePuzzle/SlidePuzzle";
import { MastermindPuzzle } from "./MastermindPuzzles";
import { SpotTheDifference } from "./SpotTheDifference";

export type Puzzle = Anagram | LettersMathPuzzle | OperatorMathPuzzle | SlidePuzzle | Jigsaw | MastermindPuzzle | SpotTheDifference;
