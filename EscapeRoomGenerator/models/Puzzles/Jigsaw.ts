import { Observable, Observer } from '../ObserverPattern';
import {v4 as uuidv4} from "uuid";
import * as path from "path";
import { choice, range, shuffleArray } from '../Helpers';

const imagesData = require('../../Data/ThemedImages.json');

export class Jigsaw implements Observable, Observer {
    private static puzzles: {[key: string]: Jigsaw} = {}
    static type = 'jigsawPuzzle';

    private observers: Observer[] = []; //All puzzles that depend on this one (outgoing)
    private dependentPuzzles: string[]; //All puzzles that need to be solved before this one can be attempted (incoming)

    id: string = uuidv4();
    type: string = Jigsaw.type;
    description: string = "Solve the jigsaw puzzle";
    estimatedTime: number;
    hints: string[] = [];
    isSolved: boolean = false;
    isLocked: boolean = false;

    rows: number;
    columns: number;
    imagePath: string;
    pieces: Piece[];

    constructor(difficulty: number, dependentPuzzles: string[], theme: string) {  // 1 = easy, 2 = medium, 3 = hard
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;

        if (difficulty === 1) {
            this.rows = 3;
            this.columns = 3;
            this.estimatedTime = 2;
        } else if (difficulty === 2) {
            this.rows = 5;
            this.columns = 5;
            this.estimatedTime = 4;
        } else {
            this.rows = 10;
            this.columns = 10;
            this.estimatedTime = 10;
        }

        const randomImage = choice(imagesData[theme].backgrounds)
        this.imagePath = path.join(__dirname, '../../Images/backgrounds/' + randomImage);

        this.pieces = this.createPieces(this.rows, this.columns);
        Jigsaw.puzzles[this.id] = this;
    }

    static get(puzzleId: string): Jigsaw {
        return Jigsaw.puzzles[puzzleId];
    }

    private createPieces(rows: number, columns: number): Piece[] {
        let pieces = range(0, rows*columns).map((i) => {
            return {
                id: i,
                row: Math.floor(i / rows),
                col: i % columns,
                curRow: null,
                curCol: null,
                left: NaN,
                right: NaN,
                top: NaN,
                bottom: NaN
            }
        })
    
        let count: number = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const piece: Piece = pieces[count];
                if (i < rows-1) {
                    const sgn = (Math.random() - 0.5) < 0 ? -1 : 1;
                    piece.bottom = sgn * (Math.random() * 0.4 + 0.3);
                }
    
                if (j < columns-1) {
                    const sgn = (Math.random()-0.5)<0? -1:1;
                    piece.right = sgn*(Math.random()*0.4+0.3);
                }
    
                if(j > 0) {
                    piece.left = -pieces[count-1].right;
                }
                if (i > 0) {
                    piece.top = -pieces[count - columns].bottom;
                }
                count++;
            }
        }

        return shuffleArray(pieces);
    }
    
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }
    update(id: string): void{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }

    move(pieceId: number, row: number|null, col: number|null) {
        const piece = this.pieces.find((p) => p.id === pieceId);

        if (!piece) return false;

        if (this.pieces.some((p) => 
            row !== null && col !== null &&
            p.curRow === row && p.curCol === col
        )) return false;

        if (row !== null && col !== null && row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
            piece.curRow = row;
            piece.curCol = col;
        } else {
            piece.curRow = null;
            piece.curCol = null;
        }

        this.checkAnswer();
        return true;
    }

    checkAnswer(): boolean {
        if (this.isSolved || this.isLocked) return false;

        this.isSolved = this.pieces.every((p) => p.curRow === p.row && p.curCol === p.col);

        if (this.isSolved) {
            this.notifyObservers();
        }

        return this.isSolved;
    }

    getHint(): string {
        return "Perhaps start with the corners";
    }

    strip() {
        return {
            type: this.type,
            id: this.id,
            isSolved: this.isSolved,
            isLocked: this.isLocked,
            hints: this.hints,
            
            description: this.description,
            pieces: this.pieces,
            rows: this.rows,
            columns: this.columns
        }
    }
}

interface Piece {
    id: number;
    row: number;
    col: number;
    curRow: number | null;
    curCol: number | null;
    left:   number;
    right:  number;
    top:    number;
    bottom: number;
}