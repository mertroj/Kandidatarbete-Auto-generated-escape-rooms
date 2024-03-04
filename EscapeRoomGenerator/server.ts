// @ts-ignore
import express, { Express, Request, Response } from "express";
import { EscapeRoom } from "./types";
// @ts-ignore
import  { generateEscapeRoom } from './EscapeRoom'
import cors from "cors";
import { MathPuzzleRouter } from "./MathPuzzleRouter";
import { AnagramRouter } from "./AnagramRouter";


const app: Express = express();
const port: number = 8080;
app.use(express.json());
app.use(cors());
app.use('/puzzleService', MathPuzzleRouter);
app.use('/placeholder', AnagramRouter); // TODO: change placeholder

app.get('/', (req: Request, res: Response) => {
  let players = parseInt(String(req.query.players))
  let difficulty = parseInt(String(req.query.difficulty))

  if (Number.isNaN(players)) {
    res.status(400).send("The player query parameter is missing or invalid")
  } else if (Number.isNaN(difficulty)) {
    res.status(400).send("The difficulty query parameter is missing or invalid")
  } else {
    let er: EscapeRoom = generateEscapeRoom(players, difficulty);
    res.send(er);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});