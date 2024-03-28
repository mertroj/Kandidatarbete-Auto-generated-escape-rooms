import * as path from "node:path";
import { Request, Response } from 'express';
import {Jigsaw} from "../models/Puzzles/Jigsaw";
import {EscapeRoom} from "../models/EscapeRoom";

export const JigsawRouter = require('express').Router();

const imagesData = require('../themedImages.json');
interface CheckAnswerRequest extends Request {
    body: {
        puzzleId: string;
    }
}
interface setCorrectRequest extends Request {
    body: {
        pieceId: string;
        puzzleId: string;
        isCorrect: boolean;
    }

}
JigsawRouter.get('/image', (req: Request, res: Response) => {
    try{
        if (req.query.gameId === undefined || req.query.gameId === "") {
            res.status(400).send("The gameId parameter is missing")
            return
        }
        const gameId = String(req.query.gameId)
        const escapeRoom = EscapeRoom.get(gameId)
        if (escapeRoom === undefined || escapeRoom === null) {
            res.status(404).send("The gameId parameter is invalid")
            return
        }
        const images = imagesData[escapeRoom.theme];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        res.status(200).sendFile(path.join(__dirname, '../Images/' + randomImage));
    } catch (error) {
        res.status(500).send("Internal server error");
    }
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

JigsawRouter.post('/checkAnswer', (req: CheckAnswerRequest, res: Response) => {
    if(req.body.puzzleId === undefined || req.body.puzzleId === ""){
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    const puzzleId = String(req.body.puzzleId);
    const puzzle = Jigsaw.get(puzzleId);
    if (puzzle === undefined) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    const isCorrect = puzzle.checkAnswer();
    res.status(200).send(isCorrect);
});


// do one for setCorrect
JigsawRouter.patch('/setCorrect', (req: setCorrectRequest, res: Response) => {
    try {
        if(req.body.pieceId === undefined || req.body.pieceId === ""){
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if(req.body.puzzleId === undefined || req.body.puzzleId === ""){
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if(req.body.isCorrect === undefined){
            res.status(400).send("The isCorrect parameter is missing");
            return;
        }
        const pieceId = String(req.body.pieceId);
        const puzzleId = String(req.body.puzzleId);
        const puzzle = Jigsaw.get(puzzleId);
        if (puzzle === undefined) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }

        const piece = puzzle.pieces.find((piece) => piece.id === pieceId);
        if (piece === undefined) {
            res.status(404).send("The pieceId parameter is invalid");
            return;
        }
        piece.setCorrect(req.body.isCorrect);
        res.status(200).send(true);
    }
    catch (error) {
        res.status(500).send("Internal server error");
    }
});