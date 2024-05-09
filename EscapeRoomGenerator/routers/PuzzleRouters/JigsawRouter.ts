import { Request, Response } from 'express';
import {Jigsaw} from "../../Models/Puzzles/Jigsaw";
import {EscapeRoom} from "../../Models/EscapeRoom";
import { WSS } from '../../sockets';

export const JigsawRouter = require('express').Router();

interface GetRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
JigsawRouter.get('/', (req: GetRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The gameId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }

    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = Jigsaw.get(req.body.puzzleId)

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
});

interface GetImageRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
JigsawRouter.get('/image', (req: GetImageRequest, res: Response) => {
    try{
        if (!req.query.gameId) {
            res.status(400).send("The gameId parameter is missing");
            return;
        }
        if (!req.query.puzzleId) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }

        const er = EscapeRoom.get(req.query.gameId);
        const puzzle = Jigsaw.get(req.query.puzzleId);

        if (!er) {
            res.status(404).send("The gameId parameter is invalid");
            return;
        }
        if (!puzzle) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        if (er.endPuzzle.id !== puzzle.id) {
            res.status(404).send("The puzzleId does not belong to the given gameId");
            return;
        }

        res.status(200).sendFile(puzzle.imagePath);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

interface MovePieceRequest extends Request {
    body: {
        gameId: string;
        puzzleId: string;
        pieceId: number;
        row?: number;
        column?: number;
    }
}
JigsawRouter.patch('/move', (req: MovePieceRequest, res: Response) => {
    try {
        if (!req.body.gameId) {
            res.status(400).send("The gameId parameter is missing");
            return;
        }
        if(!req.body.puzzleId){
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if(req.body.pieceId === undefined){
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if(req.body.row === undefined){
            res.status(400).send("The row parameter is missing");
            return;
        }
        if(req.body.column === undefined){
            res.status(400).send("The column parameter is missing");
            return;
        }

        const er = EscapeRoom.get(req.body.gameId);
        const puzzle = Jigsaw.get(req.body.puzzleId);
        
        if (!er) {
            res.status(404).send("The gameId parameter is invalid");
            return;
        }
        if (!puzzle) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        if (er.endPuzzle.id !== puzzle.id) {
            res.status(404).send("The puzzleId does not belong to the given gameId");
            return;
        }
        if (!puzzle.pieces.find((p) => p.id === req.body.pieceId)) {
            res.status(404).send("The pieceId parameter is invalid");
            return;
        }

        let result = puzzle.move(req.body.pieceId, req.body.row, req.body.column);
        if (result)
            WSS.sendToAll(er.id, {
                type: "jigsaw.move",
                puzzleId: puzzle.id,
                pieces: puzzle.pieces
            });
        if (puzzle.isSolved)
            WSS.sendToAll(er.id, {
                type: "jigsaw.solved",
                puzzleId: puzzle.id
            });

        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send("Internal server error");
    }
});