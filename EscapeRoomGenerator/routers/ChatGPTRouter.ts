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
    
    console.log('fetching intro text');
    /*
    res.status(200).send("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet nisi fringilla, porttitor tellus quis, aliquet tortor. Quisque at tincidunt enim. Aliquam mattis sapien at ligula luctus, vitae bibendum diam ullamcorper. Pellentesque vel quam luctus, sollicitudin magna ut, vestibulum libero. Integer congue lorem ut consequat cursus. Fusce posuere pellentesque urna, eu finibus est euismod in. Nunc tristique dignissim elit eu sollicitudin. Curabitur mattis velit at commodo pharetra. Curabitur scelerisque tristique purus a finibus. Donec porta accumsan dictum. Suspendisse quam magna, scelerisque in nulla sed, ultricies suscipit nisl. Nunc vehicula tortor et dui porttitor, non convallis metus commodo. Donec vel est turpis. Mauris feugiat blandit ligula a condimentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae" +
    "\n" + "Pellentesque lacinia dolor at diam cursus, id posuere quam sollicitudin. Cras at ornare arcu. Sed tincidunt ipsum nisl, eget vulputate ligula dignissim quis. Sed in nulla aliquet, faucibus enim eget, malesuada urna. Proin suscipit ipsum vitae tellus rhoncus hendrerit. Duis mattis velit id aliquam maximus. Nam dignissim laoreet diam, vel accumsan justo hendrerit vel. Maecenas mi risus, laoreet ut urna vel, imperdiet condimentum enim. Vivamus finibus rhoncus est nec fringilla. Fusce suscipit est ex. Donec id nulla mollis est finibus ultricies. "
    );
    */
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
    
    console.log('fetching end text');
    //res.status(200).send("This is an end text test response");
});