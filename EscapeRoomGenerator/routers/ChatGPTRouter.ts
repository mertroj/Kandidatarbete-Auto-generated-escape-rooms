import OpenAI from "openai";
import express, { Request, Response } from "express";
import { EscapeRoom } from "../models/EscapeRoom";
export const ChatGPTRouter = express.Router();

//const openai = new OpenAI({});

ChatGPTRouter.post('/introText', async (req: Request, res: Response) => {
    /*
    try{
        if (req.query.gameId === undefined) {
            res.status(400).send("The gameId parameter is missing");
            return;
        }

        let gameId = String(req.query.gameId);
        let er = EscapeRoom.get(gameId);
        if(!er){
            res.status(404).send("The gameId parameter is invalid");
            return;
        }

        res.status(200).send(er.startText);
    }
    catch (error){
        console.error(error);
        res.status(500).send("Internal server error: " + error.message);
    }
    */
    console.log('fetching intro text');
    res.status(200).send("This is an intro text test response");
});

ChatGPTRouter.post('/endingText', async (req: Request, res: Response) => {
    /*
    try{
        if (req.query.gameId === undefined) {
            res.status(400).send("The gameId parameter is missing");
            return;
        }

        let gameId = String(req.query.gameId);
        let er = EscapeRoom.get(gameId);
        if(er === undefined){
            res.status(404).send("The gameId parameter is invalid");
            return;
        }

        res.status(200).send(er.endText);
    }
    catch (error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
    */
    console.log('fetching end text');
    res.status(200).send("This is an end text test response");
});