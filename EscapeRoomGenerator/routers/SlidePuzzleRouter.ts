import express, { Request, Response } from "express";
import { SlidePuzzle } from "../models/SlidePuzzle/SlidePuzzle";

export const SlidePuzzleRouter = express.Router();

interface MovePieceRequest extends Request{
    body: {
        row: number;
        col: number;
        puzzleId: string;
    }
}

SlidePuzzleRouter.patch('/movePiece', (req: MovePieceRequest, res: Response) => {
    //error check the body query parameters
    let puzzle: SlidePuzzle = SlidePuzzle.get(req.body.puzzleId);
    const row: number = req.body.row;
    const col: number = req.body.col;

    if (puzzle.tryMovePiece(puzzle.pieces[row][col])){
        res.status(200).send({puzzle});
    }else{
        console.log('failed slide puzzle movement request', req.body);
        res.status(400).send('Invalid move.');
    }
});