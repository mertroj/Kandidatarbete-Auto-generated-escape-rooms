import { Observer } from "./Puzzles/ObserverPattern";
import { Puzzle } from "./Puzzles/Puzzle";

export class PuzzleManager implements Observer{
    private puzzles: {[key: string]: Puzzle} = {};
    solvedPuzzlesQueue: string[] = [];
    unLockedPuzzlesQueue: string[] = [];

    addPuzzle(puzzle: Puzzle) {
        this.puzzles[puzzle.id] = puzzle;
        puzzle.addObserver(this);
    }

    update(puzzleId: string) {
        this.solvedPuzzlesQueue.push(puzzleId);
        for (let id in this.puzzles) {
            if (id !== puzzleId) {
                let puzzle = this.puzzles[id];
                let lockedBefore = puzzle.isLocked;
                puzzle.update(puzzleId);
                if (lockedBefore && !puzzle.isLocked) {
                    this.unLockedPuzzlesQueue.push(id);
                }
            }
        }
        console.log('solved: ',this.solvedPuzzlesQueue);
        console.log('unlocked: ', this.unLockedPuzzlesQueue);
    }
}