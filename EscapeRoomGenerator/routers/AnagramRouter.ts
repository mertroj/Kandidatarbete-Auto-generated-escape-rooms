import { Anagram } from "../models/Anagram";
import express, { Request, Response } from "express";

export const AnagramRouter = express.Router();

AnagramRouter.get("/info", async (req: Request, res: Response) => {
    if (req.query.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing")
        return
    }
    const puzzleId = String(req.query.puzzleId)
    const puzzle = Anagram.get(puzzleId)
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid")
        return
    }
    res.send(puzzle);
});

AnagramRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    if (req.body.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing")
        return
    }
    if (req.body.answer === undefined) {
        res.status(400).send("No answer provided");
        return
    }
    const puzzleId = String(req.body.puzzleId)
    const puzzle = Anagram.get(puzzleId)
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid")
        return
    }
    res.send(puzzle.checkAnswer(String(req.body.answer)));
});

AnagramRouter.get("/hint", async (req: Request, res: Response) => {
    if (req.query.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing")
        return
    }
    const puzzleId = String(req.query.puzzleId)
    const puzzle = Anagram.get(puzzleId)
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid")
        return
    }
    res.send(puzzle.getHint());
});
