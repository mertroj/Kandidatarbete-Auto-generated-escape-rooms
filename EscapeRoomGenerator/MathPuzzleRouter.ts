import { MathPuzzle } from "./types";
import express, { Request, Response } from "express";

const puzzle = new MathPuzzle();
export const MathPuzzleRouter = express.Router();

MathPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleQuestion: string = (await puzzle.generate()).question;
    const estimatedTime:  number = (await puzzle.generate()).time;
    res.status(200).send({puzzleQuestion, estimatedTime});
});

MathPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const submittedAnswer: string | undefined = req.body.answer as string | undefined;
    if (!submittedAnswer) {
        console.log("No answer provided");
        console.log(req.body);
        res.status(400).send("No answer provided");
        return;
    }
    const isCorrect: boolean = await (submittedAnswer === puzzle.getSolution());
    console.log(submittedAnswer, puzzle.getSolution(), isCorrect);
    res.status(200).send({isCorrect});
});