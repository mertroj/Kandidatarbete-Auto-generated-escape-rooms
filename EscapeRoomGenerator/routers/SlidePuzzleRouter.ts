import express, { Request, Response } from "express";
import { SlidePuzzle } from "../models/puzzles/SlidePuzzle/SlidePuzzle";
import { Position } from "../models/puzzles/SlidePuzzle/Position";

export const SlidePuzzleRouter = express.Router();

interface MovePieceRequest extends Request{
    body: {
        pos: [number, number];
        newPos?: [number, number];
        puzzleId: string;
        autoMove: boolean;
    }
}
interface CheckAnswerRequest extends Request{
    body: {
        puzzleId: string;
    }
}
interface HintRequest extends Request{
    query: {
        puzzleId: string;
    }
}

SlidePuzzleRouter.patch('/movePiece', (req: MovePieceRequest, res: Response) => {
    //error check the body query parameters
    try{
        if (req.body.puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }else if (req.body.pos === undefined || req.body.pos[0] === undefined || req.body.pos[1] === undefined) {
            res.status(400).send("The pos parameter is missing");
            return;
        }else if (!req.body.autoMove && (req.body.newPos === undefined || req.body.newPos[0] === undefined || req.body.newPos[1] === undefined)) {
            res.status(400).send("The newPos parameter is missing");
            return;
        }
        let puzzle: SlidePuzzle = SlidePuzzle.get(req.body.puzzleId);

        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        const row: number = req.body.pos[0];
        const col: number = req.body.pos[1];
        if(!req.body.autoMove){
            const newPos = new Position(req.body.newPos![0], req.body.newPos![1]); //safe to use ! since we check for undefined above
            res.status(200).send({isSuccessful: puzzle.movePiece(puzzle.pieces[row][col], newPos), puzzle: puzzle});
        }else{
            res.status(200).send({isSuccessful: puzzle.movePiece(puzzle.pieces[row][col]), puzzle: puzzle});
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

SlidePuzzleRouter.get('/hint', (req: HintRequest, res: Response) => {
    try{
        const puzzleId = req.query.puzzleId;
        if (puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        const puzzle = SlidePuzzle.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        res.status(200).send({isSuccessful: puzzle.getHint(), puzzle: puzzle});
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});