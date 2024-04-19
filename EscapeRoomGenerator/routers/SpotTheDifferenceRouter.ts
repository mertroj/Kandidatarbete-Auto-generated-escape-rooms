import { SpotTheDifference } from "../models/Puzzles/SpotTheDifference";
import { Request, Response } from 'express';


export const SpotTheDifferenceRouter = require('express').Router();

SpotTheDifferenceRouter.get('/puzzle', (req: Request, res: Response) => {
    const puzzleId = String(req.body.puzzleId);
    const puzzle = SpotTheDifference.get(puzzleId);
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    res.send(puzzle.strip);
});

SpotTheDifferenceRouter.post('/checkSelection', (req: Request, res: Response) => {
    try {
        if (req.body.puzzleId === undefined || req.body.puzzleId === "") {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        const puzzleId = String(req.body.puzzleId);
        const puzzle = SpotTheDifference.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        const x = req.body.x;
        const y = req.body.y;
        const isCorrect = puzzle.checkSelection(x, y);
        res.status(200).send(isCorrect);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

SpotTheDifferenceRouter.get('/checkAnswer', (req: Request, res: Response) => {
    try {
        const puzzleId = String(req.body.puzzleId);
        const puzzle = SpotTheDifference.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        // Check if the puzzle is solved
        puzzle.checkAnswer();
        res.status(200).send(puzzle.isSolved);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

SpotTheDifferenceRouter.get('/hint', (req: Request, res: Response) => {
    try {
        const puzzleId = String(req.body.puzzleId);
        const puzzle = SpotTheDifference.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        // Get a hint
        const hint = puzzle.getHint();
        res.status(200).send(hint);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
