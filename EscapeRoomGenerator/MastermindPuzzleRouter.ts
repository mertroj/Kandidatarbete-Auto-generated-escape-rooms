import { MastermindPuzzle } from "./MastermindPuzzles";
import express, { Request, Response } from "express";

const puzzle = new MastermindPuzzle();
export const MastermindPuzzleRouter = express.Router();

function stringToNumberArray(string: string): Number[]{
    let numbers = Number[3];
    string.split('').map(num => numbers[num]);
    return numbers;
}

function checkAnswer(answer: Number[], solution: Number[]): Number[]{
    let bools = Number[solution.length];

    for(let i = 0; i < solution.length; i++){
        bools[i] = 3; //Base value 3 for incorrect
        if(answer[i] == solution[i]) //If correct set 1
            bools[i] = 1;
        else
            for(let j = 1; j < solution.length; j++){
               if(answer[i] == solution[j]) //if somewhere is correct set 2
                    bools[i] = 2; 
            }
    }
    return bools;
}

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
    const isCorrect: Number[] = await checkAnswer(stringToNumberArray(submittedAnswer), puzzle.getSolution());
    console.log(submittedAnswer, puzzle.getSolution(), isCorrect);
    res.status(200).send({isCorrect});
});

MastermindPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    const hint: string = puzzle.getHint();
    console.log(hint);
    res.status(200).send({hint});
});