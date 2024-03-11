import { Anagram } from "../models/Anagram";
import express, { Request, Response } from "express";

export const AnagramRouter = express.Router();

AnagramRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = Anagram.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle);
});

AnagramRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const puzzleId = String(req.body.puzzleId)
    const puzzle = Anagram.get(puzzleId)
    const submittedAnswer: string  = String(req.body.answer);
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
    } else if (submittedAnswer === '') {
        res.status(400).send("No answer provided");
    } else {
        res.send(puzzle.checkAnswer(submittedAnswer));
    }
});

AnagramRouter.get("/hint", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const puzzle = Anagram.get(puzzleId)
    if (puzzle === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(puzzle.getHint());
});
