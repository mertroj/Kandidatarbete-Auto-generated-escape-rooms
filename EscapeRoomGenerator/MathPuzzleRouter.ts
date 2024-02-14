import { MathPuzzle } from "./types";
import express, { Request, Response } from "express";

export const MathPuzzleRouter = express.Router();

MathPuzzleRouter.get('/generatePuzzle', async (req: Request, res: Response) => {
    const estimatedTime = req.query.estimatedTime as string | undefined;
    const puzzle = new MathPuzzle();
    const time = Number(estimatedTime); //can also do 'const num = +estimatedTime;'

    if(isNaN(time)){ //handles if the estimatedTime string is a non-number/undefined
        res.status(400).send("Invalid estimated time");
        return;
    }

    const question: string = await puzzle.generate(time);
    res.send(question);
});