import express, { Request, Response } from "express";
import { WSS } from "../../sockets";
import { Anagram } from "../../Models/Puzzles/Anagram";
import { EscapeRoom } from "../../Models/EscapeRoom";

export const AnagramRouter = express.Router();

interface GetRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
AnagramRouter.get('/', (req: GetRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    
    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = Anagram.get(req.body.puzzleId);
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
AnagramRouter.post("/checkAnswer", async (req: CheckAnswerRequest, res: Response) => {
    if (!req.body.gameId) {
        res.status(400).send("The gameId parameter is missing");
        return;
    }
    if (!req.body.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    if (!req.body.answer) {
        res.status(400).send("The answer parameter is missing");
        return;
    }

    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = Anagram.get(req.body.puzzleId);

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

    if (result) 
        WSS.sendToAll(er.id, {
            type: "anagram.solved",
            puzzleId: puzzle.id
        });
    
    res.send(result);
});

interface HintRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
AnagramRouter.get("/hint", async (req: HintRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The gameId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    const er = EscapeRoom.get(req.query.gameId);
    const puzzle = Anagram.get(req.query.puzzleId)
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
            type: "anagram.hint",
            puzzleId: puzzle.id,
            hints: puzzle.hints
        });
    
    res.send(hint);
});
