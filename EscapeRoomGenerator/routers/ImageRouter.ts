import express, { Request, Response } from "express";
import path from "path";
import { EscapeRoom } from "../Models/EscapeRoom";

export const ImageRouter = express.Router();
const imagesData = require('../data/themedImages.json');

interface ImageRequest extends Request {
    query: {
        gameId: string;
    }
}

ImageRouter.get("/themeImage", async (req: ImageRequest, res: Response) => {
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
        const images = imagesData[escapeRoom.theme].backgrounds;
        const randomImage = images[Math.floor(Math.random() * images.length)];
        res.status(200).sendFile(path.join(__dirname, '../Images/backgrounds/' + randomImage));
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});