import { getAnagram, getHint, testAnswer } from "../models/Anagram";
import express, { Request, Response } from "express";

export const AnagramRouter = express.Router();

AnagramRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const anagram = getAnagram(puzzleId)
    if (anagram === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(anagram);
});

AnagramRouter.post("/testAnswer", async (req: Request, res: Response) => {
    const puzzleId = String(req.body.puzzleId)
    const anagram = getAnagram(puzzleId)
    const submittedAnswer: string  = String(req.body.answer);
    if (anagram === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    } else if (submittedAnswer === '') {
        res.status(400).send("No answer provided");
        return;
    }
    const isCorrect: boolean = testAnswer(anagram, submittedAnswer);
    res.send(isCorrect);
});

AnagramRouter.get("/hint", async (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId)
    const anagram = getAnagram(puzzleId)
    if (anagram === undefined) {
        res.status(400).send("The puzzleId parameter is missing or invalid")
        return
    }
    res.send(getHint(anagram));
});
