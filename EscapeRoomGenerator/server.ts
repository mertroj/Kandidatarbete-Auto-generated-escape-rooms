// @ts-ignore
import express, { Express, Request, Response } from "express";
import { EscapeRoom } from "./types";
// @ts-ignore
import cors from "cors";
import { MathPuzzleRouter } from "./MathPuzzleRouter";
import { AnagramRouter } from "./AnagramRouter";


const app: Express = express();
const port: number = 8080;
app.use(express.json());
app.use(cors());
app.use('/puzzleService', MathPuzzleRouter);
app.use('/placeholder', AnagramRouter); // TODO: change placeholder

const games: Map<string, EscapeRoom> = new Map();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/game/create', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/game/join', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/game/leave', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/game/solve', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});