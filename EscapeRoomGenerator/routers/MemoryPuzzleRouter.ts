import express, { Request, Response } from "express";
import { SlidePuzzle } from "../models/Puzzles/SlidePuzzle/SlidePuzzle";
import { Position } from "../models/Puzzles/SlidePuzzle/Position";
import { MemoryPuzzle } from "../models/Puzzles/MemoryPuzzle/MemoryPuzzle";

export const MemoryPuzzleRouter = express.Router();

interface FlipCellRequest extends Request{
    body: {
        pos: [number, number];
        puzzleId: string;
    }
}
interface CheckMatchRequest extends Request{
    query: {
        puzzleId: string;
    }
}
interface getImageRequest extends Request{
    query: {
        puzzleId: string;
        fileLocation: string;
    }
}
interface HintRequest extends Request{
    query: {
        puzzleId: string;
    }
}

MemoryPuzzleRouter.patch('/flipCell', (req: FlipCellRequest, res: Response) => {
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
        puzzle.flipCell(pos[0], pos[1]);
        res.status(200).send({
            puzzle: puzzle.strip()
        });

    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});

MemoryPuzzleRouter.get('/symbol', (req: getImageRequest, res: Response) => {
    try{
        const puzzleId = req.query.puzzleId;
        if (puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if (req.query.fileLocation === undefined || req.query.fileLocation === "") {
            res.status(400).send("The fileName parameter is missing");
            return;
        }
        const puzzle = MemoryPuzzle.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        res.status(200).sendFile(req.query.fileLocation);
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});

MemoryPuzzleRouter.get('/checkMatch', (req: CheckMatchRequest, res: Response) => {
    try{
        const puzzleId = req.query.puzzleId;
        if (puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        const puzzle = MemoryPuzzle.get(String(puzzleId));
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        res.status(200).send({
            isSolved: puzzle.checkAnswer(),
            puzzle: puzzle.strip()
        });
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});

MemoryPuzzleRouter.get('/toggleAllUnflippedCells', (req: HintRequest, res: Response) => {
    try{
        const puzzleId = req.query.puzzleId;
        if (puzzleId === undefined) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        const puzzle = MemoryPuzzle.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        puzzle.toggleAllUnflippedCells();
        res.status(200).send({
            puzzle: puzzle.strip()
        });
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});