import { EscapeRoom } from "../../Models/EscapeRoom";
import { SpotTheDifference } from "../../Models/Puzzles/SpotTheDifference";
import { Request, Response } from 'express';
import { WSS } from "../../sockets";

export const SpotTheDifferenceRouter = require('express').Router();

interface GetRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
SpotTheDifferenceRouter.get('/', (req: GetRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    
    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = SpotTheDifference.get(req.body.puzzleId);

    if (!er) {
        res.status(404).send("The gameId parameter is invalid");
        return;
    }
    if (!puzzle) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    if (!er.rooms.some((r) => r.puzzles.some((p) => p === puzzle))) {
        res.status(404).send("The puzzleId does not belong to the given gameId");
        return;
    }

    res.send(puzzle.strip());
})

interface ClickRequest extends Request{
    body: {
        gameId: string;
        puzzleId: string;
        x: number;
        y: number;
    }
}
SpotTheDifferenceRouter.post('/click', async (req: ClickRequest, res: Response) => {
    // Process the click event
    try {
        if (!req.body.gameId) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if (!req.body.puzzleId) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
    
        // Validate the received data
        if (typeof req.body.x !== 'number' || typeof req.body.y !== 'number' || typeof req.body.puzzleId !== 'string') {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const er = EscapeRoom.get(req.body.gameId);
        const puzzle = SpotTheDifference.get(req.body.puzzleId);

        if (!er) {
            res.status(404).send("The gameId parameter is invalid");
            return;
        }
        if (!puzzle) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        if (!er.rooms.some((r) => r.puzzles.some((p) => p === puzzle))) {
            res.status(404).send("The puzzleId does not belong to the given gameId");
            return;
        }

        let result = puzzle.checkSelection(req.body.x, req.body.y)

        if (result)
            WSS.sendToAll(er.id, {
                type: "spot.found",
                puzzleId: puzzle.id,
                differences: puzzle.getFoundDifferences()
            });

        if (puzzle.isSolved)
            WSS.sendToAll(er.id, {
                type: "spot.solved",
                puzzleId: puzzle.id
            });

        
        // Send a response back to the client
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

interface HintRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
SpotTheDifferenceRouter.get('/hint', (req: HintRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    
    const er = EscapeRoom.get(req.query.gameId);
    const puzzle = SpotTheDifference.get(req.query.puzzleId);

    if (!er) {
        res.status(404).send("The gameId parameter is invalid");
        return;
    }
    if (!puzzle) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    if (!er.rooms.some((r) => r.puzzles.some((p) => p === puzzle))) {
        res.status(404).send("The puzzleId does not belong to the given gameId");
        return;
    }

    const hint = puzzle.getHint();

    if (hint) 
        WSS.sendToAll(er.id, {
            type: "spot.hint",
            puzzleId: puzzle.id,
            hintLevel: puzzle.hintLevel, 
            differences: puzzle.getFoundDifferences()
        });

    if (puzzle.isSolved)
        WSS.sendToAll(er.id, {
            type: "spot.solved",
            puzzleId: puzzle.id
        });


    res.send(hint);
});
