import express, { Express, Request, Response } from "express";
import cors from "cors";
import { MathPuzzleRouter } from "./MathPuzzleRouter";

const app: Express = express();
const port = 8080;
app.use(cors());
app.use(express.json());
app.use('/puzzleService', MathPuzzleRouter);


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});