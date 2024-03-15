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
interface CheckAnswerRequest extends Request{
    body: {
        puzzleId: string;
    }
}

SlidePuzzleRouter.patch('/movePiece', (req: MovePieceRequest, res: Response) => {
    //error check the body query parameters
    try{
        if (req.body.puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }else if (req.body.row === undefined) {
            res.status(400).send("The row parameter is missing");
            return;
        }else if (req.body.col === undefined) {
            res.status(400).send("The col parameter is missing");
            return;
        }
        let puzzle: SlidePuzzle = SlidePuzzle.get(req.body.puzzleId);

        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        const row: number = req.body.row;
        const col: number = req.body.col;

        if (puzzle.tryMovePiece(puzzle.pieces[row][col])){
            res.status(200).send({puzzle});
        }else{
            console.log('failed slide puzzle movement request', req.body);
            res.status(400).send('Invalid move.');
        }
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});

SlidePuzzleRouter.post('/checkAnswer', (req: CheckAnswerRequest, res: Response) => {
    try{
        if (req.body.puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        const puzzleId = req.body.puzzleId;
        const puzzle = SlidePuzzle.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        res.status(200).send(puzzle.checkAnswer());
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});