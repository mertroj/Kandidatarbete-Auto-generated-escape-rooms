import { MastermindPuzzle } from "../models/MastermindPuzzles";
import express, { Request, Response } from "express";

export const MastermindPuzzleRouter = express.Router();


MastermindPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = MastermindPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle);
});

MastermindPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const puzzleId = String(req.body.puzzleId)
    const puzzle = MastermindPuzzle.get(puzzleId)
    const submittedAnswer: string  = String(req.body.answer);
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
    } else if (submittedAnswer === '') {
        res.status(400).send("No answer provided");
    } else {
        res.send(puzzle.checkAnswer(submittedAnswer));
    }
});

MastermindPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = MastermindPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle.getHint());
});