import { Anagram } from "../models/Anagram";
import express, { Request, Response } from "express";
import path from "path";
import { EscapeRoom } from "../models/EscapeRoom";

export const DescriptionRouter = express.Router();
const descriptionData = require('../lockedPuzzleDescriptions.json');

interface DescriptionRequest extends Request{
    query: {
        gameId: string;
    }
}

DescriptionRouter.get("/description", async (req: DescriptionRequest, res: Response) => {
    try{
        if (req.query.gameId === undefined || req.query.gameId === "") {
            res.status(400).send("The gameId parameter is missing");
            return;
        }
        const gameId = String(req.query.gameId);
        const escapeRoom = EscapeRoom.get(gameId);
        if (escapeRoom === undefined || escapeRoom === null) {
            res.status(404).send("The gameId parameter is invalid");
            return;
        }
        const descriptions: string[] = descriptionData[escapeRoom.theme];
        const randomDescription: string = descriptions[Math.floor(Math.random() * descriptions.length)];
        res.status(200).send(randomDescription);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});