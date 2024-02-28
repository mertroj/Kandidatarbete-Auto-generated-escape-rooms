import { Anagram } from "./Anagram"; // Import Anagram module
// @ts-ignore
import express, { Request, Response } from "express";

const anagram = new Anagram(5); // Create an instance of Anagram
export const AnagramRouter = express.Router(); // Define AnagramRouter

AnagramRouter.get("/info", async (req: Request, res: Response) => {
    const anagramQuestion: string = anagram.getQuestion(); // Get question from Anagram instance
    const estimatedTime: number = anagram.getEstimatedTime(); // Get estimated time from Anagram instance
    console.log(anagramQuestion, estimatedTime);
    res.status(200).send({ puzzleQuestion: anagramQuestion, estimatedTime }); // Send response
});

AnagramRouter.post("/checkAnswer", async (req: Request, res: Response) => {
    const submittedAnswer: string | undefined = req.body.answer as string | undefined;
    if (!submittedAnswer) {
        res.status(400).send("No answer provided");
        return;
    }
    const isCorrect: boolean = anagram.checkAnswer(submittedAnswer); // Check submitted answer
    console.log(submittedAnswer, anagram.checkAnswer(submittedAnswer), isCorrect);
    res.status(200).send({ isCorrect }); // Send response
});

AnagramRouter.get("/hint", async (req: Request, res: Response) => {
    const hint: string = anagram.getHint(); // Get hint from Anagram instance
    console.log(hint);
    res.status(200).send({ hint }); // Send response
});
