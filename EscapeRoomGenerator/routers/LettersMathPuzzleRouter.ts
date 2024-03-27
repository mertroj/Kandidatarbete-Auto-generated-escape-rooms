import { LettersMathPuzzle } from "../models/puzzles/LettersMathPuzzle";
import express, { Request, Response } from "express";

export const LettersMathPuzzleRouter = express.Router();

LettersMathPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    if (req.query.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing")
        return
    }
    const puzzleId = String(req.query.puzzleId)
    const puzzle = LettersMathPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid")
        return
    }
    res.send(puzzle);
});

LettersMathPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    if (req.body.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing")
        return
    }
    if (req.body.answer === undefined) {
        res.status(400).send("No answer provided");
        return
    }
    const puzzleId = String(req.body.puzzleId)
    const puzzle = LettersMathPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid")
        return
    }
    res.send(puzzle.checkAnswer(String(req.body.answer)));
});

LettersMathPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    if (req.query.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing")
        return
    }
    const puzzleId = String(req.query.puzzleId)
    const puzzle = LettersMathPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid")
        return
    }
    res.send(puzzle.getHint());
});