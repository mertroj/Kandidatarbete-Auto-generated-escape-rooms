// @ts-ignore
import express, { Express, Request, Response } from "express";
import  { EscapeRoom } from './models/EscapeRoom'
// @ts-ignore
import cors from "cors";
import { LettersMathPuzzleRouter } from "./routers/LettersMathPuzzleRouter";
import { AnagramRouter } from "./routers/AnagramRouter";
import { MastermindPuzzleRouter } from "./routers/MastermindPuzzleRouter";
import { OperatorMathPuzzleRouter } from "./routers/OperatorMathPuzzleRouter";
import { SlidePuzzleRouter } from "./routers/SlidePuzzleRouter";
import {Timer} from "./models/Timer";
import { JigsawRouter } from "./routers/JigsawRouter";
import { ImageRouter } from "./routers/ImageRouter";
import { Theme } from "./models/Theme";
import { DescriptionRouter } from "./routers/DescriptionRouter";
import { SpotTheDifferenceRouter } from "./routers/SpotTheDifferenceRouter";

const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(cors());
app.use('/operatorMathPuzzles', OperatorMathPuzzleRouter);
app.use('/lettersMathPuzzles', LettersMathPuzzleRouter);
app.use('/mastermindPuzzle' , MastermindPuzzleRouter);
app.use('/slidePuzzles', SlidePuzzleRouter);
app.use('/lockedPuzzle', DescriptionRouter);
app.use('/anagrams', AnagramRouter);
app.use('/jigsaw', JigsawRouter);
app.use('/images', ImageRouter);
app.use('/Images', express.static('Images'));
app.use('/spotTheDifference', SpotTheDifferenceRouter);

app.get('/creategame', (req: Request, res: Response) => {
    if (req.query.players === undefined) {
        res.status(400).send("The players parameter is missing");
        return;
    } 
    if (req.query.difficulty === undefined) {
        res.status(400).send("The difficulty parameter is missing");
        return;
    }
    if (req.query.theme === undefined) {
        res.status(400).send("The theme parameter is missing");
        return;
    }

    let players = parseInt(String(req.query.players));
    let difficulty = parseInt(String(req.query.difficulty));
    let theme = String(req.query.theme);

    if (Number.isNaN(players)) {
        res.status(400).send("The player query parameter is invalid");
    } else if (Number.isNaN(difficulty)) {
        res.status(400).send("The difficulty query parameter is invalid");;
    } else if (theme === "" || !(Object.values(Theme) as string[]).includes(theme)) {
        res.status(400).send("The theme query parameter is invalid");
    } else {
        let er: EscapeRoom = new EscapeRoom(players, difficulty, theme as Theme);
        res.status(200).send(er.id);
    }
});

app.get('/escaperoom', (req: Request, res: Response) => {
    if (req.query.gameId === undefined) {
        res.status(400).send("The gameId parameter is missing");
        return;
    }

    let gameId = String(req.query.gameId);
    let er = EscapeRoom.get(gameId);

    if (er === null) {
        res.status(404).send("The entered gameId does not exist");
    } else {
        res.send(er.strip());
    }
});

app.get('/room', (req: Request, res: Response) => {
    if (req.query.roomId === undefined) {
        res.status(400).send("The roomId parameter is missing");
        return;
    }
    if (req.query.gameId === undefined) {
        res.status(400).send("The gameId parameter is missing");
        return;
    }

    let roomId = String(req.query.roomId);
    let gameId = String(req.query.gameId);
    let er = EscapeRoom.get(gameId);

    if (er === null) {
        res.status(404).send("The entered gameId does not exist");
        return;
    }

    let room = er.rooms.find((room) => room.id === roomId);

    if (room === null){
        res.status(404).send("The entered roomId does not exist");
        return;
    }

    res.status(200).send(room);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});