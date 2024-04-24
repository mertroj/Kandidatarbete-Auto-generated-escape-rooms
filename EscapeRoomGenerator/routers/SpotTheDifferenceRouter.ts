import { SpotTheDifference } from "../models/Puzzles/SpotTheDifference";
import { Request, Response } from 'express';

export const SpotTheDifferenceRouter = require('express').Router();

SpotTheDifferenceRouter.get('/puzzle', (req: Request, res: Response) => {
    const puzzleId = String(req.query.puzzleId);
    const puzzle = SpotTheDifference.get(puzzleId);
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    res.send(puzzle.strip());
});

SpotTheDifferenceRouter.post('/click', async (req: Request, res: Response) => {
    const { x, y, puzzleId } = req.body;

    // Validate the received data
    if (typeof x !== 'number' || typeof y !== 'number' || typeof puzzleId !== 'string') {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    // Process the click event
    try {
        const puzzle = SpotTheDifference.get(puzzleId);
        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        // Send a response back to the client
        res.json(puzzle.checkSelection(x, y));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

SpotTheDifferenceRouter.post('/checkAnswer', (req: Request, res: Response) => {
    try {
        if(req.body.puzzleId === undefined || req.body.puzzleId === ""){
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        const puzzleId = String(req.body.puzzleId);
        const puzzle = SpotTheDifference.get(puzzleId);
        // Check if the puzzle is solved
        puzzle.checkAnswer();
        res.status(200).send(puzzle.isSolved);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

SpotTheDifferenceRouter.get('/hint', (req: Request, res: Response) => {
    if (req.query.puzzleId === undefined) {
        return res.status(400).send("The puzzleId parameter is missing");
    }

    const puzzleId = String(req.query.puzzleId);
    const puzzle = SpotTheDifference.get(puzzleId);

    if (!puzzle) {
        return res.status(404).send("The puzzleId parameter is invalid");
    }

    const hint = puzzle.getHint();

    if (!hint) {
        return res.status(404).send("No hint available for this puzzle");
    }

    res.send(hint);
});
