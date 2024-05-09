import express, { Request, Response } from "express";
import { EscapeRoom } from "../Models/EscapeRoom";
import { Theme } from "../Models/Theme";
import { WSS } from "../sockets";

export const EscapeRoomRouter = express.Router();


interface GetRequest extends Request{
    query: {
        gameId: string;
    }
}
EscapeRoomRouter.get('/', (req: GetRequest, res: Response) => {
    if (req.query.gameId === undefined) {
        res.status(400).send("The gameId parameter is missing");
        return;
    }

    let gameId = String(req.query.gameId);
    let er = EscapeRoom.get(gameId);

    if (er === undefined) {
        res.status(404).send("The entered gameId does not exist");
    } else {
        res.send(er.strip());
    }
});

interface CreateRequest extends Request{
    body: {
        players: string;
        difficulty: string;
        theme: string;
        exclusions: string;
    }
}
EscapeRoomRouter.post('/', async (req: CreateRequest, res: Response) => {
    try {
        if (req.body.players === undefined) {
            res.status(400).send("The players parameter is missing");
            return;
        }
        if (req.body.difficulty === undefined) {
            res.status(400).send("The difficulty parameter is missing");
            return;
        }
        if (req.body.theme === undefined) {
            res.status(400).send("The theme parameter is missing");
            return;
        }
        if (req.body.exclusions === undefined) {
            res.status(400).send("The exclusions parameter is missing");
            return;
        }

        let players = parseInt(String(req.body.players));
        let difficulty = parseInt(String(req.body.difficulty));
        let theme = String(req.body.theme);
        let exclusions = String(req.body.exclusions).split(',');

        if (Number.isNaN(players)) {
            res.status(400).send("The player query parameter is invalid");
        } else if (Number.isNaN(difficulty)) {
            res.status(400).send("The difficulty query parameter is invalid");
        } else if (theme === "" || !(Object.values(Theme) as string[]).includes(theme)) {
            res.status(400).send("The theme query parameter is invalid");
        } else {
            let er: EscapeRoom = await EscapeRoom.create(players, difficulty, theme as Theme, exclusions);
            WSS.gameCreated(er.id);
            res.status(200).send(er.id);
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).send("Internal server error: " + error.message);
    }
});