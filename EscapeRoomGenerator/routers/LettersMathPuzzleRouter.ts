import { LettersMathPuzzle } from "../models/LettersMathPuzzle";
import express, { Request, Response } from "express";

export const LettersMathPuzzleRouter = express.Router();

LettersMathPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = LettersMathPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle);
});

LettersMathPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const puzzleId = String(req.body.puzzleId)
    const puzzle = LettersMathPuzzle.get(puzzleId)
    const submittedAnswer: number  = Number(req.body.answer);
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
    } else if (Number.isNaN(submittedAnswer)) {
        res.status(400).send("No answer provided");
    } else {
        res.send(puzzle.checkAnswer(submittedAnswer));
    }
});

LettersMathPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = LettersMathPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle.getHint());
});