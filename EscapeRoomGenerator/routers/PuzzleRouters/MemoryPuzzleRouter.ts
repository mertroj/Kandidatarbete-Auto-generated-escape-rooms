import express, { Request, Response } from "express";
import { MemoryPuzzle } from "../../Models/Puzzles/MemoryPuzzle";
import { EscapeRoom } from "../../Models/EscapeRoom";
import { WSS } from "../../sockets";

export const MemoryPuzzleRouter = express.Router();

interface GetRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
MemoryPuzzleRouter.get('/', (req: GetRequest, res: Response) => {
    if (!req.query.gameId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    if (!req.query.puzzleId) {
        res.status(400).send("The puzzleId parameter is missing");
        return;
    }
    
    const er = EscapeRoom.get(req.body.gameId);
    const puzzle = MemoryPuzzle.get(req.body.puzzleId);
    if (!er) {
        res.status(404).send("The gameId parameter is invalid");
        return;
    }
    if (!puzzle) {
        res.status(404).send("The puzzleId parameter is invalid");
        return;
    }
    if (!er.rooms.some((r) => r.puzzles.some((p) => p === puzzle))) {
        res.status(404).send("The puzzleId does not belong to the given gameId");
        return;
    }

    res.send(puzzle.strip());
})

interface FlipCellRequest extends Request{
    body: {
        gameId: string;
        puzzleId: string;
        cellIdx: number;
    }
}
MemoryPuzzleRouter.patch('/flipCell', (req: FlipCellRequest, res: Response) => {
    try{
        if (!req.body.gameId) {
            res.status(400).send("The gameId parameter is missing");
            return;
        } 
        if (!req.body.puzzleId) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if (req.body.cellIdx === undefined) {
            res.status(400).send("The cellIdx parameter is missing");
            return;
        }

        const er = EscapeRoom.get(req.body.gameId);
        const puzzle: MemoryPuzzle = MemoryPuzzle.get(req.body.puzzleId);

        if (!er) {
            res.status(404).send("The gameId parameter is invalid");
            return;
        }
        if (!puzzle) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        if (!er.rooms.some((r) => r.puzzles.some((p) => p === puzzle))) {
            res.status(404).send("The puzzleId does not belong to the given gameId");
            return;
        }
        if (req.body.cellIdx < 0 || req.body.cellIdx >= puzzle.cells.length) {
            res.status(404).send("The cellIdx parameter is invalid");
            return;
        }

        let result = puzzle.flipCell(req.body.cellIdx);

        if (result) {
            WSS.sendToAll(er.id, {
                type: "memory.flip",
                puzzleId: puzzle.id,
                cells: puzzle.cells
            });

            if (puzzle.currentlyFlipped.length === puzzle.cellsToMatch) {
                let match = puzzle.checkForMatch();
    
                if (puzzle.isSolved)
                    WSS.sendToAll(er.id, {
                        type: "memory.solved",
                        puzzleId: puzzle.id
                    });
    
                else if (match)
                    WSS.sendToAll(er.id, {
                        type: "memory.match",
                        puzzleId: puzzle.id,
                        cells: puzzle.cells
                    });

                else
                    WSS.sendToAll(er.id, {
                        type: "memory.nomatch",
                        puzzleId: puzzle.id,
                        cells: puzzle.cells
                    });
            }


        }

        res.status(200).send(result);

    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});

interface getImageRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
        fileLocation: string;
    }
}
MemoryPuzzleRouter.get('/symbol', (req: getImageRequest, res: Response) => {
    try{
        if (!req.query.gameId) {
            res.status(400).send("The gameId parameter is missing");
            return;
        } 
        if (!req.query.puzzleId) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }
        if (!req.query.fileLocation) {
            res.status(400).send("The fileName parameter is missing");
            return;
        }

        const er = EscapeRoom.get(req.query.gameId);
        const puzzle = MemoryPuzzle.get(req.query.puzzleId);

        if (!er) {
            res.status(404).send("The gameId parameter is invalid");
            return;
        }
        if (!puzzle) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        if (!er.rooms.some((r) => r.puzzles.some((p) => p === puzzle))) {
            res.status(404).send("The puzzleId does not belong to the given gameId");
            return;
        }

        res.status(200).sendFile(req.query.fileLocation);
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});

interface HintRequest extends Request{
    query: {
        gameId: string;
        puzzleId: string;
    }
}
MemoryPuzzleRouter.get('/hint', (req: HintRequest, res: Response) => {
    try{
        if (!req.query.gameId) {
            res.status(400).send("The gameId parameter is missing");
            return;
        } 
        if (!req.query.puzzleId) {
            res.status(400).send("The puzzleId parameter is missing");
            return;
        }

        const er = EscapeRoom.get(req.query.gameId);
        const puzzle = MemoryPuzzle.get(req.query.puzzleId);

        if (!er) {
            res.status(404).send("The gameId parameter is invalid");
            return;
        }
        if (!puzzle) {
            res.status(404).send("The puzzleId parameter is invalid");
            return;
        }
        if (!er.rooms.some((r) => r.puzzles.some((p) => p === puzzle))) {
            res.status(404).send("The puzzleId does not belong to the given gameId");
            return;
        }

        let {duration, cells} = puzzle.getHint();

        if (duration) {
            WSS.sendToAll(er.id, {
                type: "memory.hint",
                puzzleId: puzzle.id,
                hintLevel: puzzle.hintLevel, 
                cells, 
                duration: duration
            });
        }

        res.status(200).send(!!duration);
    }catch(error: any){
        res.status(500).send('Internal server error' + error.message);
    }
});