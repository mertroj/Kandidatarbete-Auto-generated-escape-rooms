import React, { useEffect, useRef, useState } from 'react';
//TODO:  Fix the bug with the pieces not always being drawn.

const JigsawTest: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    let IMAGE: HTMLImageElement;
    let CONTEXT: any | null = null;
    let SCALAR = 0.6;
    let [SIZE, setSize] = useState({ x: 0, y: 0, width: 0, height: 0, rows: 2, columns: 2 });
    let PIECES: Piece[] = [];
    let SELECTED_PIECE: any = null;
    let CANVAS: HTMLCanvasElement | null = canvasRef.current;

    async function jigsawImage(rows: number, columns: number) {
        try {
            const response = await fetch('http://localhost:8080/jigsawtest/image');
            if (response.ok) {
                CANVAS = canvasRef.current;
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                IMAGE = new Image();
                IMAGE.src = imageUrl;

                IMAGE.onload = function () {
                    handleResize(); // Resize canvas after image load // TODO: fix later currently broken
                    setImageLoaded(true);
                    window.addEventListener("resize", handleResize);
                    addEventListeners();
                    updateGame();
                };
                initializePieces(rows,columns);
                randomizePieces();
            }

        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }

    useEffect(() => {
        jigsawImage(4,4);
    }, []);

    useEffect(() => {
        // Call handleResize on window resize to resize canvas dynamically
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    function handleResize() {

        // @ts-ignore
        CANVAS.width = window.innerWidth;
        // @ts-ignore
        CANVAS.height = window.innerHeight;

        let resizer = SCALAR *
            Math.min(
                window.innerWidth / IMAGE.width,
                window.innerHeight / IMAGE.height
            );
        SIZE.width = IMAGE.width * resizer;
        SIZE.height = IMAGE.height * resizer;
        SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
        SIZE.y = window.innerHeight / 2 - SIZE.height / 2;

        // @ts-ignore
        CONTEXT = CANVAS.getContext("2d");


    }

    // could be used instead of specifing rows and columns (requires refactoring the code)
    function setDifficulty(difficulty: string) {
        switch (difficulty) {
            case 'easy':
                initializePieces(3, 3);
                break;
            case 'medium':
                initializePieces(5, 5);
                break;
            case 'hard':
                initializePieces(10, 10);
                break;
        }
    }

    function checkAnswer() { // checks if the puzzle is complete
        for (let piece of PIECES) {
            if (!piece.correct) {
                return false;
            }
        }
        return true;
    }
    function addEventListeners() {
        // @ts-ignore
        CANVAS.addEventListener("mousedown", onMouseDown);
        // @ts-ignore
        CANVAS.addEventListener("mousemove", onMouseMove);
        // @ts-ignore
        CANVAS.addEventListener("mouseup", onMouseUp);
    }

    function onMouseDown(event: MouseEvent) {
        SELECTED_PIECE = getPressedPiece(event);

        if (SELECTED_PIECE != null) {
            const index = PIECES.indexOf(SELECTED_PIECE);
            if (index > -1) {
                PIECES.splice(index, 1);
                PIECES.push(SELECTED_PIECE);
            }
            SELECTED_PIECE.offset = {
                x: event.x - SELECTED_PIECE.x,
                y: event.y - SELECTED_PIECE.y
            }
            SELECTED_PIECE.correct = false;
        }
    }

    function onMouseMove(event: MouseEvent) {
        if (SELECTED_PIECE != null) {
            SELECTED_PIECE.x = event.x - SELECTED_PIECE.offset.x;
            SELECTED_PIECE.y = event.y - SELECTED_PIECE.offset.y;
        }
    }

    function onMouseUp() {
        if (SELECTED_PIECE && SELECTED_PIECE.isClose()){
            SELECTED_PIECE.snap();
            if (checkAnswer()) {
                console.log("Puzzle complete");
            }
        }
        SELECTED_PIECE = null;
    }

    function getPressedPiece(loc: Coordinates) {
        for ( let i=PIECES.length-1 ; i>=0 ; i--) {
            if (loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width &&
                loc.y > PIECES[i].y && loc.y < PIECES[i].y + PIECES[i].height) {
                return PIECES[i];
            }

        }
    }

    function updateGame() { // previously named updateCanvas
        CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight);

        CONTEXT.globalAlpha = 0.5;
        CONTEXT.drawImage(IMAGE, SIZE.x, SIZE.y, SIZE.width, SIZE.height);
        CONTEXT.globalAlpha = 1;

        for (let piece of PIECES) {
            piece.draw(CONTEXT);
        }
        window.requestAnimationFrame(updateGame);
    }


    function initializePieces(rows: number, columns: number) {
        SIZE.rows = rows;
        SIZE.columns = columns;
        const newPieces: any[] = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                newPieces.push(new Piece(i, j));
            }
        }
        PIECES = newPieces;

        let count: number = 0;
        for (let i = 0; i < SIZE.rows; i++) {
            for (let j = 0; j < SIZE.columns; j++) {
                const piece = PIECES[count];
                if (i==SIZE.rows-1) {
                    piece.bottom = NaN;
                }
                else {
                    const sgn = (Math.random() - 0.5) < 0 ? -1 : 1;
                    piece.bottom = sgn * (Math.random() * 0.4 + 0.3);
                }

                if (j == SIZE.columns-1){
                    piece.right = NaN
                }
                else{
                    const sgn = (Math.random()-0.5)<0? -1:1;
                    piece.right = sgn*(Math.random()*0.4+0.3);
                }

                if(j == 0){
                    piece.left = NaN;
                }
                else {
                    piece.left =- PIECES[count-1].right;
                }
                if (i==0){
                    piece.top = NaN;
                }
                else {
                    piece.top = -PIECES[count - SIZE.columns].bottom;
                }
                count++;
            }
        }
    }


    interface Coordinates {
        x: number;
        y: number;
    }
    function randomizePieces() {

        for (let i = 0; i < PIECES.length; i++) {
            let location: Coordinates = {
                // @ts-ignore
                x: Math.random() * (CANVAS.width - PIECES[i].width),
                // @ts-ignore
                y: Math.random() * (CANVAS.height - PIECES[i].height)
            }
            PIECES[i].x = location.x;
            PIECES[i].y = location.y;
            PIECES[i].correct = false;
        }
    }

    class Piece {
        rowIndex: any;
        colIndex: any;
        x: number;
        y: number;
        width: number;
        height: number;
        xCorrect: number;
        yCorrect: number;
        correct: boolean;
        bottom: any = null;
        right: any = null;
        left: any = null;
        top: any = null;
        constructor(rowIndex: any, colIndex: any) {
            this.rowIndex = rowIndex;
            this.colIndex = colIndex;
            this.x = SIZE.x + SIZE.width * this.colIndex / SIZE.columns;
            this.y = SIZE.y + SIZE.height * this.rowIndex / SIZE.rows;
            this.width = SIZE.width / SIZE.columns;
            this.height = SIZE.height / SIZE.rows;
            this.xCorrect = this.x;
            this.yCorrect = this.y;
            this.correct = true;
        }
        draw(context: { beginPath: () => void; moveTo: (arg0: number, arg1: number) => void; lineTo: (arg0: number, arg1: number) => void; bezierCurveTo: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number) => void; save: () => void; clip: () => void; drawImage: (arg0: HTMLImageElement, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number, arg6: number, arg7: number, arg8: number) => void; restore: () => void; stroke: () => void; }) {
            context.beginPath();

            const sz = Math.min(this.width, this.height);  // Hard coded values for the aesthetics
            const neck = 0.08*sz;
            const tabWidth = 0.2*sz;
            const tabHeight = 0.2*sz;


            //context.rect(this.x, this.y, this.width, this.height);
            // from top left
            context.moveTo(this.x, this.y);
            // to top right
            if (this.top) {
                context.lineTo(this.x + this.width * Math.abs(this.top) - neck,
                    this.y);
                context.bezierCurveTo(
                    this.x + this.width*Math.abs(this.top) - neck,
                    this.y - tabHeight*Math.sign(this.top)*0.2,

                    this.x + this.width*Math.abs(this.top) - tabWidth,
                    this.y - tabHeight*Math.sign(this.top),

                    this.x + this.width*Math.abs(this.top),
                    this.y - tabHeight*Math.sign(this.top)
                )

                context.bezierCurveTo(
                    this.x + this.width*Math.abs(this.top) + tabWidth,
                    this.y - tabHeight*Math.sign(this.top),

                    this.x + this.width*Math.abs(this.top) + neck,
                    this.y - tabHeight*Math.sign(this.top)*0.2,

                    this.x + this.width*Math.abs(this.top) + neck,
                    this.y
                )
            }
            context.lineTo(this.x + this.width, this.y);

            // to bottom right
            if (this.right) {
                context.lineTo(this.x + this.width, this.y + this.height * Math.abs(this.right) - neck);
                context.bezierCurveTo(
                    this.x + this.width + tabHeight*Math.sign(this.right)*0.2,
                    this.y + this.height*Math.abs(this.right) - neck,

                    this.x + this.width + tabHeight*Math.sign(this.right),
                    this.y + this.height*Math.abs(this.right) - tabWidth,

                    this.x + this.width + tabHeight*Math.sign(this.right),
                    this.y + this.height*Math.abs(this.right)
                )
                context.bezierCurveTo(
                    this.x + this.width + tabHeight*Math.sign(this.right),
                    this.y + this.height*Math.abs(this.right) + tabWidth,

                    this.x + this.width + tabHeight*Math.sign(this.right)*0.2,
                    this.y + this.height*Math.abs(this.right) + neck,

                    this.x + this.width,
                    this.y + this.height*Math.abs(this.right) + neck
                )
            }
            context.lineTo(this.x + this.width, this.y + this.height);

            // to bottom left
            if (this.bottom) {
                context.lineTo(this.x + this.width * Math.abs(this.bottom) + neck, this.y + this.height);
                context.bezierCurveTo(
                    this.x + this.width*Math.abs(this.bottom) + neck,
                    this.y + this.height + tabHeight*Math.sign(this.bottom)*0.2,

                    this.x + this.width*Math.abs(this.bottom) + tabWidth,
                    this.y + this.height + tabHeight*Math.sign(this.bottom),

                    this.x + this.width*Math.abs(this.bottom),
                    this.y + this.height + tabHeight*Math.sign(this.bottom)
                )
                context.bezierCurveTo(
                    this.x + this.width*Math.abs(this.bottom) - tabWidth,
                    this.y + this.height + tabHeight*Math.sign(this.bottom),

                    this.x + this.width*Math.abs(this.bottom) - neck,
                    this.y + this.height + tabHeight*Math.sign(this.bottom)*0.2,

                    this.x + this.width*Math.abs(this.bottom) - neck,
                    this.y + this.height
                )
            }
            context.lineTo(this.x, this.y + this.height);

            //to top left
            if(this.left){
                context.lineTo(this.x, this.y + this.height * Math.abs(this.left) + neck);
                context.bezierCurveTo(
                    this.x - tabHeight*Math.sign(this.left)*0.2,
                    this.y + this.height*Math.abs(this.left) + neck,

                    this.x - tabHeight*Math.sign(this.left),
                    this.y + this.height*Math.abs(this.left) + tabWidth,

                    this.x - tabHeight*Math.sign(this.left),
                    this.y + this.height*Math.abs(this.left)
                )
                context.bezierCurveTo(
                    this.x - tabHeight*Math.sign(this.left),
                    this.y + this.height*Math.abs(this.left) - tabWidth,

                    this.x - tabHeight*Math.sign(this.left)*0.2,
                    this.y + this.height*Math.abs(this.left) - neck,

                    this.x,
                    this.y + this.height*Math.abs(this.left) - neck
                )
            }
            context.lineTo(this.x, this.y);


            const scaledTabHeight: number =
                Math.min(IMAGE.width/SIZE.columns,
                IMAGE.height/SIZE.rows)*tabHeight/sz;

            context.save();
            context.clip();

            context.drawImage(IMAGE,
                this.colIndex*IMAGE.width/SIZE.columns - scaledTabHeight,
                this.rowIndex*IMAGE.height/SIZE.rows - scaledTabHeight,
                IMAGE.width/SIZE.columns + scaledTabHeight*2,
                IMAGE.height/SIZE.rows + scaledTabHeight*2,
                this.x-tabHeight,
                this.y-tabHeight,
                this.width+tabHeight*2,
                this.height+tabHeight*2);

            context.restore();
            context.stroke();
        }
        isClose() {
            return distance({x: this.x, y: this.y},
                {x: this.xCorrect, y: this.yCorrect}) < this.width / 3;
        }
        snap() {
            this.x = this.xCorrect;
            this.y = this.yCorrect;
            this.correct = true;
        }
    }
    function distance(piece1: Coordinates, piece2: Coordinates){
        return Math.sqrt((piece1.x - piece2.x)**2 + (piece1.y - piece2.y)**2);

    }

    return (
        <div>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    );
};

export default JigsawTest;
