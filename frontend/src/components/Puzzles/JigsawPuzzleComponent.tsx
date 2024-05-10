import { useEffect, useRef } from 'react';
import {JigsawPuzzle, JigsawPiece, backendURL} from "../../interfaces";
import {useParams} from "react-router-dom";
import axios from "axios";

type Coords = {row: number, col: number, x: number, y: number}

interface JigsawProps {
    puzzle: JigsawPuzzle;
}

function JigsawPuzzleComponent ({puzzle}: JigsawProps) {
    const {gameId} = useParams();
    let CONTEXT: any = null;
    let SCALAR: number = 0.6;
    let pieceWidth = 0;
    let pieceHeight = 0;
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const image = useRef(new Image());
    const SIZE = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const pieces = useRef<JigsawPiece[]>([]);
    const selectedPiece = useRef<JigsawPiece | undefined>();
    const possibleCoords = useRef<Coords[]>([]);

    async function fetchImage() {
        if (!canvasRef.current) return;
        try {
            const response = await axios.get(backendURL + `/jigsaw/image/`, { 
                responseType: 'blob',
                params: {
                    gameId,
                    puzzleId: puzzle.id
                }
            });

            image.current.src = URL.createObjectURL(response.data);
            image.current.onload = () => {
                pieces.current = puzzle.pieces.map(piece => {
                    return {...piece, x: 20, y: 20, prevX: 20, prevY: 20}
                });
                
                calcNewSize();
                calcNewCoords();
                calcNewPiecesCoords();
                updateGame();
            };
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }
    async function movePiece(piece: JigsawPiece, coords?: Coords) {
        try {
            const response = await axios.patch(backendURL + `/jigsaw/move`, {
                gameId,
                puzzleId: puzzle.id,
                pieceId: piece.id, 
                row: coords ? coords.row : null, 
                column: coords ? coords.col : null
            });

        } catch (error) {
            console.error('Error setting correct :', error);
        }
    }

    function snapToCoords(piece: JigsawPiece, coords: Coords) {
        piece.x = coords.x;
        piece.y = coords.y;
    }

    function calcNewSize() {
        if (!canvasRef.current || !image.current) return;

        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        let resizer = SCALAR *
            Math.min(
                window.innerWidth / image.current.width,
                window.innerHeight / image.current.height
            );

        SIZE.current.width = image.current.width * resizer;
        SIZE.current.height = image.current.height * resizer;
        SIZE.current.x = window.innerWidth / 2 - SIZE.current.width / 2;
        SIZE.current.y = window.innerHeight / 2 - SIZE.current.height / 2;

        pieceWidth = SIZE.current.width / puzzle.columns;
        pieceHeight = SIZE.current.height / puzzle.rows;
    }
    function calcNewCoords() {
        possibleCoords.current = [];
        let x: number, y: number;
        for (let row = 0; row < puzzle.rows; row++) {
            for (let col = 0; col < puzzle.columns; col++) {
                x = SIZE.current.x + col * pieceWidth;
                y = SIZE.current.y + row * pieceHeight;
                possibleCoords.current.push({row, col, x, y});
            }
        }
    }
    function calcNewPiecesCoords() {
        pieces.current.forEach((p) => {
            p.x = Math.min(p.x, window.innerWidth-pieceWidth);
            p.y = Math.min(p.y, window.innerHeight-pieceHeight);
        });
    }
    function handleResize() {
        calcNewSize();
        calcNewCoords();
        calcNewPiecesCoords();
    }

    function onMouseDown(e: MouseEvent) {
        selectedPiece.current = pieces.current.slice().reverse().find((p) => {
            let coords = possibleCoords.current.find((c) => c.row === p.curRow && c.col === p.curCol);
            let x = coords ? coords.x : p.x;
            let y = coords ? coords.y : p.y;
            return e.x > x && e.x < x + pieceWidth && e.y > y && e.y < y + pieceHeight
        });

        if (!selectedPiece.current) return; 

        let piece = selectedPiece.current;

        const index = pieces.current.indexOf(piece);
        if (index !== -1) {
            pieces.current.splice(index, 1);
            pieces.current.push(piece);
        }
        let coords = possibleCoords.current.find((c) => piece.curRow === c.row && piece.curCol === c.col)
        if (coords) {
            piece.x = coords.x;
            piece.y = coords.y;
        }
    }
    function onMouseMove(e: MouseEvent) {
        if (selectedPiece.current) {
            selectedPiece.current.x += e.movementX;
            selectedPiece.current.y += e.movementY;
        }
    }
    function onMouseUp() {
        if (!selectedPiece.current) return;

        let piece = selectedPiece.current;

        let coords: Coords | undefined = possibleCoords.current.find((c) => {
            let dist = Math.sqrt((piece.x - c.x)**2 + (piece.y - c.y)**2)
            let occupied = pieces.current.some((p) => p.curRow === c.row && p.curCol === c.col && p.id !== piece!.id);
            
            return dist < pieceWidth / 3 && !occupied;
        });

        if (coords) {
            snapToCoords(piece, coords);
            movePiece(piece, coords);
        } else  {
            if (piece.curRow !== null || piece.curCol !== null)
                movePiece(piece);
            piece.prevX = piece.x;
            piece.prevY = piece.y;
        }
        
        selectedPiece.current = undefined;
    }

    function updateGame() { // previously named updateCanvas
        if (!CONTEXT) return;
        CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight);

        CONTEXT.strokeStyle = 'black'; // Set the stroke color to black
        CONTEXT.lineWidth = 2; // Set the line width to 2 pixels

        // Draw the puzzle area outline
        CONTEXT.strokeRect(SIZE.current.x, SIZE.current.y, SIZE.current.width, SIZE.current.height);
        for (let piece of pieces.current) {
            drawPiece(piece, CONTEXT);
        }
        window.requestAnimationFrame(updateGame);
    }
    function drawPiece(piece: JigsawPiece, context: { 
        beginPath: () => void; 
        moveTo: (arg0: number, arg1: number) => void; 
        lineTo: (arg0: number, arg1: number) => void; 
        bezierCurveTo: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number) => void; 
        save: () => void; 
        clip: () => void; 
        drawImage: (arg0: HTMLImageElement, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number, arg6: number, arg7: number, arg8: number) => void; 
        restore: () => void; 
        stroke: () => void; 
    })  {
        context.beginPath();

        const sz = Math.min(pieceWidth, pieceHeight);  // Hard coded values for the aesthetics
        const neck = 0.08*sz;
        const tabSize = 0.2*sz;

        let x = piece.x;
        let y = piece.y;

        if (piece.curRow !== null && piece.curCol !== null && selectedPiece.current?.id !== piece.id) {
            let coords = possibleCoords.current.find((c) => c.row === piece.curRow && c.col === piece.curCol);
            x = coords!.x;
            y = coords!.y;
        }

        // from top left
        context.moveTo(x, y);
        // to top right
        if (piece.top) {
            context.lineTo(x + pieceWidth * Math.abs(piece.top) - neck,
            y);
            context.bezierCurveTo(
                x + pieceWidth*Math.abs(piece.top) - neck,
                y - tabSize*Math.sign(piece.top)*0.2,

                x + pieceWidth*Math.abs(piece.top) - tabSize,
                y - tabSize*Math.sign(piece.top),

                x + pieceWidth*Math.abs(piece.top),
                y - tabSize*Math.sign(piece.top)
            )

            context.bezierCurveTo(
                x + pieceWidth*Math.abs(piece.top) + tabSize,
                y - tabSize*Math.sign(piece.top),

                x + pieceWidth*Math.abs(piece.top) + neck,
                y - tabSize*Math.sign(piece.top)*0.2,

                x + pieceWidth*Math.abs(piece.top) + neck,
                y
            )
        }
        context.lineTo(x + pieceWidth, y);

        // to bottom right
        if (piece.right) {
            context.lineTo(x + pieceWidth, y + pieceHeight * Math.abs(piece.right) - neck);
            context.bezierCurveTo(
                x + pieceWidth + tabSize*Math.sign(piece.right)*0.2,
                y + pieceHeight*Math.abs(piece.right) - neck,

                x + pieceWidth + tabSize*Math.sign(piece.right),
                y + pieceHeight*Math.abs(piece.right) - tabSize,

                x + pieceWidth + tabSize*Math.sign(piece.right),
                y + pieceHeight*Math.abs(piece.right)
            )
            context.bezierCurveTo(
                x + pieceWidth + tabSize*Math.sign(piece.right),
                y + pieceHeight*Math.abs(piece.right) + tabSize,

                x + pieceWidth + tabSize*Math.sign(piece.right)*0.2,
                y + pieceHeight*Math.abs(piece.right) + neck,

                x + pieceWidth,
                y + pieceHeight*Math.abs(piece.right) + neck
            )
        }
        context.lineTo(x + pieceWidth, y + pieceHeight);

        // to bottom left
        if (piece.bottom) {
            context.lineTo(x + pieceWidth * Math.abs(piece.bottom) + neck, y + pieceHeight);
            context.bezierCurveTo(
                x + pieceWidth*Math.abs(piece.bottom) + neck,
                y + pieceHeight + tabSize*Math.sign(piece.bottom)*0.2,

                x + pieceWidth*Math.abs(piece.bottom) + tabSize,
                y + pieceHeight + tabSize*Math.sign(piece.bottom),

                x + pieceWidth*Math.abs(piece.bottom),
                y + pieceHeight + tabSize*Math.sign(piece.bottom)
            )
            context.bezierCurveTo(
                x + pieceWidth*Math.abs(piece.bottom) - tabSize,
                y + pieceHeight + tabSize*Math.sign(piece.bottom),

                x + pieceWidth*Math.abs(piece.bottom) - neck,
                y + pieceHeight + tabSize*Math.sign(piece.bottom)*0.2,

                x + pieceWidth*Math.abs(piece.bottom) - neck,
                y + pieceHeight
            )
        }
        context.lineTo(x, y + pieceHeight);

        //to top left
        if(piece.left){
            context.lineTo(x, y + pieceHeight * Math.abs(piece.left) + neck);
            context.bezierCurveTo(
                x - tabSize*Math.sign(piece.left)*0.2,
                y + pieceHeight*Math.abs(piece.left) + neck,

                x - tabSize*Math.sign(piece.left),
                y + pieceHeight*Math.abs(piece.left) + tabSize,

                x - tabSize*Math.sign(piece.left),
                y + pieceHeight*Math.abs(piece.left)
            )
            context.bezierCurveTo(
                x - tabSize*Math.sign(piece.left),
                y + pieceHeight*Math.abs(piece.left) - tabSize,

                x - tabSize*Math.sign(piece.left)*0.2,
                y + pieceHeight*Math.abs(piece.left) - neck,

                x,
                y + pieceHeight*Math.abs(piece.left) - neck
            )
        }
        context.lineTo(x, y);


        const scaledTabHeight: number =
            Math.min(image.current.width/puzzle.columns,
            image.current.height/puzzle.rows)*tabSize/sz;

        context.save();
        context.clip();

        context.drawImage(image.current,
            piece.col*image.current.width/puzzle.columns - scaledTabHeight,
            piece.row*image.current.height/puzzle.rows - scaledTabHeight,
            image.current.width/puzzle.columns + scaledTabHeight*2,
            image.current.height/puzzle.rows + scaledTabHeight*2,
            x-tabSize,
            y-tabSize,
            pieceWidth+tabSize*2,
            pieceHeight+tabSize*2);

        context.restore();
        context.stroke();
    }

    useEffect(() => {
        if (!pieces.current.length) return;

        pieces.current.forEach((p) => {
            let newP = puzzle.pieces.find((p2) => p2.id === p.id);
            if (!newP) return;

            if (newP.curRow === null && newP.curCol === null) {
                p.x = p.prevX;
                p.y = p.prevY;
            }
            p.curRow = newP.curRow;
            p.curCol = newP.curCol;
        });
    }, [puzzle])
    
    useEffect(() => {
        fetchImage();

        canvasRef.current!.addEventListener("mousedown", onMouseDown);
        canvasRef.current!.addEventListener("mousemove", onMouseMove);
        canvasRef.current!.addEventListener("mouseup", onMouseUp);
        CONTEXT = canvasRef.current!.getContext("2d");
        // Call handleResize on window resize to resize canvas dynamically
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    );
};

export default JigsawPuzzleComponent;
