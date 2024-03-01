import { MastermindPuzzle } from "./MastermindPuzzle";
import express, { Request, Response } from "express";

const puzzle = new MastermindPuzzle();
export const MastermindPuzzleRouter = express.Router();

MastermindPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleQuestion: string = puzzle.question;
    const estimatedTime:  number = puzzle.eTime;
    console.log(puzzleQuestion, estimatedTime);
    res.status(200).send({puzzleQuestion, estimatedTime});
});

MastermindPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const submittedAnswer: string | undefined = req.body.answer as string | undefined;
    if (!submittedAnswer) {
        res.status(400).send("No answer provided");
        return;
    }
    const isCorrect: boolean = await submittedAnswer === puzzle.getSolution();
    console.log(submittedAnswer, puzzle.getSolution(), isCorrect);
    res.status(200).send({isCorrect});
});

MastermindPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    const hint: string = puzzle.getHint();
    console.log(hint);
    res.status(200).send({hint});
});