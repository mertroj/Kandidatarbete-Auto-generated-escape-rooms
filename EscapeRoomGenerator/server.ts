// @ts-ignore
import express, { Express, Request, Response } from "express";
import  { EscapeRoom } from './models/EscapeRoom'
// @ts-ignore
import cors from "cors";
import { LettersMathPuzzleRouter } from "./routers/LettersMathPuzzleRouter";
import { AnagramRouter } from "./routers/AnagramRouter";
import { OperatorMathPuzzleRouter } from "./routers/OperatorMathPuzzleRouter";
import { SlidePuzzleRouter } from "./routers/SlidePuzzleRouter";
import {Timer} from "./models/Timer";
import { JigsawRouter } from "./routers/JigsawRouter";
import { ImageRouter } from "./routers/ImageRouter";
import { Theme } from "./models/Theme";


const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(cors());
app.use('/lettersMathPuzzles', LettersMathPuzzleRouter);
app.use('/operatorMathPuzzles', OperatorMathPuzzleRouter);
app.use('/slidePuzzles', SlidePuzzleRouter);
app.use('/anagrams', AnagramRouter);
app.use('/images', ImageRouter);
app.use('/jigsaw', JigsawRouter);

app.get('/creategame', (req: Request, res: Response) => {
    let players = parseInt(String(req.query.players));
    let difficulty = parseInt(String(req.query.difficulty));
    let theme = String(req.query.theme);

    console.log("Creating an escape room");

    if (Number.isNaN(players)) {
        res.status(400).send("The player query parameter is missing or invalid");
    } else if (Number.isNaN(difficulty)) {
        res.status(400).send("The difficulty query parameter is missing or invalid");;
    } else if (theme === undefined || theme === "" || !(Object.values(Theme) as string[]).includes(theme)) {
        res.status(400).send("The theme query parameter is missing or invalid");
    } else {
        let er: EscapeRoom = new EscapeRoom(players, difficulty, theme as Theme);
        res.status(200).send(er.id);
    }
    console.log("Finished");
});

app.get('/escaperoom', (req: Request, res: Response) => {
    let gameId = String(req.query.gameId);
    let er = EscapeRoom.get(gameId);
    if (er == null) {
        res.status(400).send("The entered game id does not exist");
    } else {
        res.send(er);
    }
});

app.get('/room', (req: Request, res: Response) => {
    let roomId = String(req.query.roomId);
    let gameId = String(req.query.gameId);
    let er = EscapeRoom.get(gameId);
    if (er == null) {
        res.status(400).send("The entered game id does not exist");
        return;
    }
    let room = er.rooms.find((room) => room.id === roomId);
    if (room === null){
        res.status(400).send("The entered room id does not exist");
        return;
    }
    res.status(200).send(room);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});