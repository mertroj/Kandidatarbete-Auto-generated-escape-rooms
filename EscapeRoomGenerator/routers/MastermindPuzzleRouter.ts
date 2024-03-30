import { MastermindPuzzle } from "../models/Puzzles/MastermindPuzzles";
import express, { Request, Response } from "express";

export const MastermindPuzzleRouter = express.Router();

MastermindPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    if (req.body.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }else if (req.body.answer === undefined || req.body.answer === '') {
        res.status(400).send("The answer parameter is missing");
        return;
    }
    const puzzleId = String(req.body.puzzleId);
    const puzzle = MastermindPuzzle.get(puzzleId);
    const submittedAnswer: string  = String(req.body.answer);
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    } else if (submittedAnswer.length !== puzzle.length) {
        res.status(404).send("The answer parameter is invalid");
        return;
    } else {
        res.status(200).send(puzzle.checkAnswer(submittedAnswer));
    }
});

MastermindPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    if (req.query.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    const puzzleId = String(req.query.puzzleId);
    const puzzle = MastermindPuzzle.get(puzzleId);
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    res.status(200).send(puzzle.getHint());
});

MastermindPuzzleRouter.get("/previousGuesses", async (req: Request, res: Response) => {
    if (req.query.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    const puzzleId = String(req.query.puzzleId);
    const puzzle = MastermindPuzzle.get(puzzleId);
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    const previousGuessesArray = Array.from(puzzle.previousGuesses.entries());
    res.status(200).send(previousGuessesArray);
});