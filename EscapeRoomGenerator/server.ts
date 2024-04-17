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
import { MemoryPuzzleRouter } from "./routers/MemoryPuzzleRouter";
import { ChatGPTRouter } from "./routers/ChatGPTRouter";
import { Direction } from "./models/Direction";

const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(cors());
app.use('/operatorMathPuzzles', OperatorMathPuzzleRouter);
app.use('/lettersMathPuzzles', LettersMathPuzzleRouter);
app.use('/mastermindPuzzle' , MastermindPuzzleRouter);
app.use('/memoryPuzzles', MemoryPuzzleRouter);
app.use('/slidePuzzles', SlidePuzzleRouter);
app.use('/lockedPuzzle', DescriptionRouter);
app.use('/anagrams', AnagramRouter);
app.use('/chatGPT', ChatGPTRouter);
app.use('/jigsaw', JigsawRouter);
app.use('/images', ImageRouter);

app.get('/creategame', async (req: Request, res: Response) => {
    try {
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
    if (req.query.exclusions === undefined) {
        res.status(400).send("The exclusions parameter is missing");
        return;
    }
    
        let players = parseInt(String(req.query.players));
        let difficulty = parseInt(String(req.query.difficulty));
        let theme = String(req.query.theme);
    let exclusions = String(req.query.exclusions).split(',');
    
        if (Number.isNaN(players)) {
            res.status(400).send("The player query parameter is invalid");
        } else if (Number.isNaN(difficulty)) {
            res.status(400).send("The difficulty query parameter is invalid");
        } else if (theme === "" || !(Object.values(Theme) as string[]).includes(theme)) {
            res.status(400).send("The theme query parameter is invalid");
        } else {
            let er: EscapeRoom = await EscapeRoom.create(players, difficulty, theme as Theme, exclusions);
            res.status(200).send(er.id);
        }
    } catch (error: any) {
        res.status(500).send("Internal server error: " + error.message);
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

app.get('/escaperoom/move', (req: Request, res: Response) => {
    if (req.query.gameId === undefined) {
        res.status(400).send("The gameId parameter is missing");
        return;
    }
    if (req.query.direction === undefined) {
        res.status(400).send("The direction parameter is missing");
        return;
    }

    let gameId = String(req.query.gameId);
    let direction = String(req.query.direction);
    let er = EscapeRoom.get(gameId);

    if (direction === "" || !(Object.values(Direction) as string[]).includes(direction)){
        res.status(400).send("The direction query parameter is invalid");
    }else if (er === null) {
        res.status(404).send("The entered gameId does not exist");
    } else {
        er.move(direction as Direction);
        res.status(200).send(er.strip());
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