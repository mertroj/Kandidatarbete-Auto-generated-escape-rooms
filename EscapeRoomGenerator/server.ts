// @ts-ignore
import express, { Express, Request, Response } from "express";
import  { EscapeRoom } from './models/EscapeRoom'
// @ts-ignore
import cors from "cors";
import { LettersMathPuzzleRouter } from "./routers/LettersMathPuzzleRouter";
import { AnagramRouter } from "./routers/AnagramRouter";
import { OperatorMathPuzzleRouter } from "./routers/OperatorMathPuzzleRouter";
import {Timer} from "./models/Timer";


const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(cors());
app.use('/lettersMathPuzzles', LettersMathPuzzleRouter);
app.use('/operatorMathPuzzles', OperatorMathPuzzleRouter);
app.use('/anagrams', AnagramRouter); // TODO: change placeholder

app.get('/creategame', (req: Request, res: Response) => {
    let players = parseInt(String(req.query.players))
    let difficulty = parseInt(String(req.query.difficulty))

    console.log("Creating an escape room")

    if (Number.isNaN(players)) {
        res.status(400).send("The player query parameter is missing or invalid")
    } else if (Number.isNaN(difficulty)) {
        res.status(400).send("The difficulty query parameter is missing or invalid")
    } else {
        let er: EscapeRoom = new EscapeRoom(players, difficulty);
        res.send(er.id);
    }
    console.log("Finished")
});

app.get('/escaperoom', (req: Request, res: Response) => {
    let gameId = String(req.query.gameId)
    let er = EscapeRoom.get(gameId);
    if (er == null) {
        res.status(400).send("The entered game id does not exist")
    } else {
        res.send(er);
    }
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});