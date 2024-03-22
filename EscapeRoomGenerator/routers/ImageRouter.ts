import express, { Request, Response } from "express";
import path from "path";
import { Theme } from "../models/Theme";
import { EscapeRoom } from "../models/EscapeRoom";

export const ImageRouter = express.Router();
const imagesData = require('../themedImages.json')

interface ImageRequest extends Request {
    query: {
        gameId: string;
    }
}

ImageRouter.get("/themeImage", async (req: Request, res: Response) => {
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
        console.log(randomImage);
        res.status(200).sendFile(path.join(__dirname, '../Images/' + randomImage));
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
ImageRouter.get("/logoImage", async (req: Request, res: Response) => {
    try{
        res.status(200).sendFile(path.join(__dirname, '../Images/logo.jpg'));
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
/*
function getRandomImage(): string {
    const images = imagesData[Theme.MAGICALWORKSHOP];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    console.log(path.join(__dirname, '../Images/'+randomImage));
    return randomImage;
}

console.log(getRandomImage());
*/