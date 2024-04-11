import express, { Request, Response } from "express";
import { SlidePuzzle } from "../models/Puzzles/SlidePuzzle/SlidePuzzle";
import { Position } from "../models/Puzzles/SlidePuzzle/Position";
import { MemoryPuzzle } from "../models/Puzzles/MemoryPuzzle/MemoryPuzzle";

export const SlidePuzzleRouter = express.Router();

interface FlipCellRequest extends Request{
    body: {
        pos: [number, number];
        puzzleId: string;
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

SlidePuzzleRouter.patch('/flipCell', (req: FlipCellRequest, res: Response) => {
    try{
        let puzzleId = req.body.puzzleId;
        let pos = req.body.pos;
        if (req.body.puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }else if (pos === undefined || pos[0] === undefined || pos[1] === undefined) {
            res.status(400).send("The pos parameter is missing");
            return;
        }
        let puzzle: MemoryPuzzle = MemoryPuzzle.get(puzzleId);

        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        if (pos[0] < 0 || pos[0] >= puzzle.cellsMatrix.length || pos[1] < 0 || pos[1] >= puzzle.cellsMatrix[0].length) {
            res.status(404).send("The pos parameter is invalid");
            return;
        }
        puzzle.flipPiece(pos[0], pos[1]);
        res.status(200).send({puzzle: puzzle.strip()});

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
        const puzzle = MemoryPuzzle.get(puzzleId);
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