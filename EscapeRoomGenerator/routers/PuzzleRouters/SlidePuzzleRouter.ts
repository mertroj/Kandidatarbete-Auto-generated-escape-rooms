import express, { Request, Response } from "express";
import { Position, SlidePuzzle } from "../../Models/Puzzles/SlidePuzzle";
import { EscapeRoom } from "../../Models/EscapeRoom";
import { WSS } from "../../sockets";

export const SlidePuzzleRouter = express.Router();

interface GetRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
SlidePuzzleRouter.get('/', (req: GetRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    
    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = SlidePuzzle.get(req.body.puzzleId);
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

interface MovePieceRequest extends Request{
    body: {
        gameId: string;
        pos: Position;
        newPos?: Position;
        puzzleId: string;
        autoMove: boolean;
    }
}
SlidePuzzleRouter.patch('/movePiece', (req: MovePieceRequest, res: Response) => {
    try{
        if (!req.body.gameId) {
            res.status(400).send("The gameId parameter is missing");
            return;
        } 
        if (!req.body.puzzleId) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if (!req.body.pos) {
            res.status(400).send("The pos parameter is missing");
            return;
        }
        if (!req.body.autoMove && !req.body.newPos) {
            res.status(400).send("The newPos parameter is missing");
            return;
        }
        
        const er = EscapeRoom.get(req.body.gameId);
        const puzzle: SlidePuzzle = SlidePuzzle.get(req.body.puzzleId);

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

        let result = puzzle.movePiece(req.body.pos, req.body.newPos);

        if (result)
            WSS.sendToAll(er.id, {
                type: "slide.move",
                puzzleId: puzzle.id,
                pieces: puzzle.pieces
            });

        if (puzzle.isSolved)
            WSS.sendToAll(er.id, {
                type: "slide.solved",
                puzzleId: puzzle.id
            });

        res.status(200).send(result);

    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});

interface HintRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
SlidePuzzleRouter.get('/hint', (req: HintRequest, res: Response) => {
    try{
        if (!req.query.gameId) {
            res.status(400).send("The gameId parameter is missing");
            return;
        } 
        if (req.query.puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        
        const er = EscapeRoom.get(req.query.gameId);
        const puzzle = SlidePuzzle.get(req.query.puzzleId);

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

        let result = puzzle.getHint();

        if (result)
            WSS.sendToAll(er.id, {
                type: "slide.hint",
                puzzleId: puzzle.id,
                pieces: puzzle.pieces, 
                hintLevel: puzzle.hintLevel
            });

        if (puzzle.isSolved)
            WSS.sendToAll(er.id, {
                type: "slide.solved",
                puzzleId: puzzle.id
            });

        res.status(200).send(result);
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});