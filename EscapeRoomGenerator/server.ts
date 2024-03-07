// @ts-ignore
import express, { Express, Request, Response } from "express";
import  { EscapeRoom, createEscapeRoom, getEscapeRoom  } from './models/EscapeRoom'
import cors from "cors";
import { MathPuzzleRouter } from "./routers/MathPuzzleRouter";
import { AnagramRouter } from "./routers/AnagramRouter";
import { MastermindPuzzleRouter } from "./routers/MastermindPuzzleRouter";


const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(cors());
app.use('/puzzleService', MathPuzzleRouter);
app.use('/placeholder', AnagramRouter); // TODO: change placeholder
app.use('/mastermindService', MastermindPuzzleRouter)

app.get('/creategame', (req: Request, res: Response) => {
  let players = parseInt(String(req.query.players))
  let difficulty = parseInt(String(req.query.difficulty))

  if (Number.isNaN(players)) {
    res.status(400).send("The player query parameter is missing or invalid")
  } else if (Number.isNaN(difficulty)) {
    res.status(400).send("The difficulty query parameter is missing or invalid")
  } else {
    let er: EscapeRoom = createEscapeRoom(players, difficulty);
    res.send(er.id);
  }
});

app.get('/escaperoom', (req: Request, res: Response) => {
  let gameId = String(req.query.gameId)
  let er = getEscapeRoom(gameId);
  if (er == null) {
    res.status(400).send("The entered game id does not exist")
  } else {
    res.send(er);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});