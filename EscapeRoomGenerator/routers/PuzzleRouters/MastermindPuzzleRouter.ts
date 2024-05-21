import { MastermindPuzzle } from "../../Models/Puzzles/MastermindPuzzle";
import express, { Request, Response } from "express";
import { WSS } from "../../sockets";
import { EscapeRoom } from "../../Models/EscapeRoom";

export const MastermindPuzzleRouter = express.Router();

interface GetRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
MastermindPuzzleRouter.get('/', (req: GetRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    
    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = MastermindPuzzle.get(req.body.puzzleId);
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

interface CheckAnswerRequest extends Request{
    body: {
        gameId: string;
        puzzleId: string;
        answer: string;
    }
}
MastermindPuzzleRouter.post("/checkAnswer", async (req: CheckAnswerRequest, res: Response) => {
    if (!req.body.gameId) {
        res.status(400).send("The gameId parameter is missing");
        return;
    } 
    if (!req.body.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }else if (!req.body.answer) {
        res.status(400).send("The answer parameter is missing");
        return;
    }

    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = MastermindPuzzle.get(req.body.puzzleId);

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

    let result = puzzle.checkAnswer(req.body.answer);

    WSS.sendToAll(er.id, {
        type: "mastermind.guess",
        puzzleId: puzzle.id,
        guesses: puzzle.previousGuesses
    });

    if (result)
        WSS.sendToAll(er.id, {
            type: "mastermind.solved",
            puzzleId: puzzle.id
        });

    res.status(200).send(result);
});

interface HintRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
MastermindPuzzleRouter.get("/hint", async (req: HintRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The gameId parameter is missing");
        return;
    } 
    if (req.query.puzzleId === undefined) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    
    const er = EscapeRoom.get(req.query.gameId);
    const puzzle = MastermindPuzzle.get(req.query.puzzleId);

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

    let hint = puzzle.getHint();

    if (hint)
        WSS.sendToAll(er.id, {
            type: "mastermind.hint",
            puzzleId: puzzle.id,
            hints: puzzle.hints
        });

    res.status(200).send(hint);
});