import { MathPuzzle, PuzzleInfo } from "../models/MathPuzzles";
// @ts-ignore
import express, { Request, Response } from "express";

const puzzle = new MathPuzzle();
export const MathPuzzleRouter = express.Router();

MathPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    const puzzleInfo: PuzzleInfo = await puzzle.generate();
    const puzzleQuestion: string = puzzleInfo.question;
    const estimatedTime:  number = puzzleInfo.time;
    console.log(puzzleQuestion, estimatedTime);
    res.status(200).send({puzzleQuestion, estimatedTime});
});

MathPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const submittedAnswer: string | undefined = req.body.answer as string | undefined;
    if (!submittedAnswer) {
        res.status(400).send("No answer provided");
        return;
    }
    const isCorrect: boolean = puzzle.checkSolution(req.body.answer as string);
    res.status(200).send({isCorrect});
});

MathPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    const hint: string = puzzle.getHint();
    console.log(hint);
    res.status(200).send({hint});
});