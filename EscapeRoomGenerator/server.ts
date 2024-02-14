import express, { Express, Request, Response } from "express";
import { EscapeRoom } from "./types";

const app: Express = express();
const port: number = 8080;

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