import * as path from "node:path";
import { Request, Response } from 'express';
import {Jigsaw, Piece} from "../models/Jigsaw";
import {LettersMathPuzzle} from "../models/LettersMathPuzzle";

export const JigsawRouter = require('express').Router();

JigsawRouter.get('/image', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../Images/MagicalWorkshop.png'));
});

JigsawRouter.get('/puzzle', (req: Request, res: Response) => {
    const puzzleId = String(req.body.puzzleId)
    const puzzle = Jigsaw.get(puzzleId)
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid")
        return
    }
    res.send(puzzle);
});