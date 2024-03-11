import { OperatorMathPuzzle } from "../models/OperatorMathPuzzle";
import express, { Request, Response } from "express";

export const OperatorMathPuzzleRouter = express.Router();

OperatorMathPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = OperatorMathPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle);
});

OperatorMathPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const puzzleId = String(req.body.puzzleId)
    const puzzle = OperatorMathPuzzle.get(puzzleId)
    const submittedAnswer: string  = String(req.body.answer);
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
    } else if (submittedAnswer === '') {
        res.status(400).send("No answer provided");
    } else {
        res.send(puzzle.checkAnswer(submittedAnswer));
    }
});

OperatorMathPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = OperatorMathPuzzle.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle.getHint());
});