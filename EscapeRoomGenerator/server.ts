// @ts-ignore
import express, { Express } from "express";
// @ts-ignore
import cors from "cors";
import { EscapeRoomRouter } from "./Routers/EscapeRoomRouter";
import { ImageRouter } from "./Routers/ImageRouter";
import { DescriptionRouter } from "./Routers/DescriptionRouter";
import { ChatGPTRouter } from "./Routers/ChatGPTRouter";

import { LettersMathPuzzleRouter } from "./Routers/PuzzleRouters/LettersMathPuzzleRouter";
import { AnagramRouter } from "./Routers/PuzzleRouters/AnagramRouter";
import { MastermindPuzzleRouter } from "./Routers/PuzzleRouters/MastermindPuzzleRouter";
import { OperatorMathPuzzleRouter } from "./Routers/PuzzleRouters/OperatorMathPuzzleRouter";
import { SlidePuzzleRouter } from "./Routers/PuzzleRouters/SlidePuzzleRouter";
import { JigsawRouter } from "./Routers/PuzzleRouters/JigsawRouter";
import { MemoryPuzzleRouter } from "./Routers/PuzzleRouters/MemoryPuzzleRouter";
import { SpotTheDifferenceRouter } from "./Routers/PuzzleRouters/SpotTheDifferenceRouter";

const app: Express = express();
const port: number = 8080;

app.use(express.json());
app.use(cors());

app.use('/escaperoom', EscapeRoomRouter);

app.use('/anagrams', AnagramRouter);
app.use('/operatorMathPuzzles', OperatorMathPuzzleRouter);
app.use('/lettersMathPuzzles', LettersMathPuzzleRouter);
app.use('/mastermindPuzzle' , MastermindPuzzleRouter);
app.use('/memoryPuzzles', MemoryPuzzleRouter);
app.use('/slidePuzzles', SlidePuzzleRouter);
app.use('/spotTheDifference', SpotTheDifferenceRouter);

app.use('/lockedPuzzle', DescriptionRouter);
app.use('/chatGPT', ChatGPTRouter);
app.use('/jigsaw', JigsawRouter);
app.use('/images', ImageRouter);
app.use('/Images', express.static('Images'));

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});