import express, { Request, Response } from "express";
import { EscapeRoom } from "../models/EscapeRoom";
export const ChatGPTRouter = express.Router();

ChatGPTRouter.post('/introText', async (req: Request, res: Response) => {
    
    try{
        if (req.body.gameId === undefined) {
            res.status(400).send("The gameId parameter is missing");
            return;
        }

        let gameId = String(req.body.gameId);
        let er = EscapeRoom.get(gameId);
        if(!er){
            res.status(404).send("The gameId parameter is invalid");
            return;
        }

        res.status(200).send(er.startText);
    }
    catch (error: any){
        console.error(error);
        res.status(500).send("Internal server error: " + error.message);
    }
});

ChatGPTRouter.post('/endingText', async (req: Request, res: Response) => {
    
    try{
        if (req.body.gameId === undefined) {
            res.status(400).send("The gameId parameter is missing");
            return;
        }

        let gameId = String(req.body.gameId);
        let er = EscapeRoom.get(gameId);
        if(!er){
            res.status(404).send("The gameId parameter is invalid");
            return;
        }

        res.status(200).send(er.endText);
    }
    catch (error: any){
        console.error(error);
        res.status(500).send("Internal server error");
    }
});