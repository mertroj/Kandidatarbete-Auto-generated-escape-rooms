import { arrayBuffer } from "stream/consumers";
import { MastermindPuzzle } from "../models/MastermindPuzzles";
import express, { Request, Response } from "express";

const puzzle = new MastermindPuzzle();
export const MastermindPuzzleRouter = express.Router();

function stringToNumberArray(string: string): Number[]{
    let numbers : Number[] = new Array(3);
    for(let i = 0; i < string.length; i++){
        numbers[i] = +string.charAt(i);
    }
    return numbers;
}

function checkAnswer(answer: string, solution: Number[]): Number[]{
    let bools: Number[] = new Array(solution.length);
    let numAns = stringToNumberArray(answer);

    for(let i = 0; i < solution.length; i++){
        bools[i] = 3; //Base value 3 for incorrect
        if(numAns[i] == solution[i]) //If correct set 1
            bools[i] = 1;
        else
            for(let j = 0; j < solution.length; j++){
               if(numAns[i] == solution[j]) //if somewhere is correct set 2
                    bools[i] = 2; 
            }
    }
    return bools;
}

MastermindPuzzleRouter.get("/info", async (req: Request, res: Response) => {
    const mastermindQuestion: string = puzzle.mastermindQuestion;
    const estimatedTime:  number = puzzle.eTime;
    console.log(mastermindQuestion, estimatedTime);
    res.status(200).send({mastermindQuestion, estimatedTime});
});

MastermindPuzzleRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const submittedAnswer: string | undefined = req.body.answer as string | undefined;
    if (!submittedAnswer) {
        res.status(400).send("No answer provided");
        return;
    }
    const isCorrect: Number[] = await checkAnswer(submittedAnswer, puzzle.getSolution());
    console.log(submittedAnswer, puzzle.getSolution(), isCorrect);
    res.status(200).send({isCorrect});
});

MastermindPuzzleRouter.get("/hint", async (req: Request, res: Response) => {
    const hint: string = puzzle.getHint();
    console.log(hint);
    res.status(200).send({hint});
});