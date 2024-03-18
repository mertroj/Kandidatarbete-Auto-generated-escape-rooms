import React, { useEffect, useRef, useState } from 'react';

const JigsawTest: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    let IMAGE: HTMLImageElement | null = null;
    let CANVAS: HTMLCanvasElement | null = null;
    let CONTEXT: CanvasRenderingContext2D | null = null;
    let SCALAR = 0.6;
    let SIZE = { x: 0, y: 0, width: 0, height: 0 };

    async function jigsawImage() {
        // Fetch the image URL from the backend
        console.log("Fetching image");
        const response = await fetch('http://localhost:8080/jigsawtest/image');
        console.log(response);
        console.log("Fetched image");
        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            // Load the image
            IMAGE = new Image();
            IMAGE.src = imageUrl;

            IMAGE.onload = function () {
                handleResize();
                setImageLoaded(true);
                window.addEventListener("resize", handleResize);
                updateCanvas();
            };
            CANVAS = document.getElementById("canvasRef") as HTMLCanvasElement;
            CONTEXT = CANVAS.getContext("2d");
        } else {
            console.error('Failed to fetch image');
        }
    }

    useEffect(() => {
        jigsawImage();
        console.log(imageLoaded);
    }, []);

    function handleResize() {
        if (CANVAS && IMAGE) {
            CANVAS.width = window.innerWidth;
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
        }
    }

    function updateCanvas() {
        if (CONTEXT && IMAGE) {
            CONTEXT.drawImage(IMAGE, 0, 0, SIZE.width, SIZE.height);
            window.requestAnimationFrame(updateCanvas);
        }
    }

    return (
        <div>
            {imageLoaded && (

                <canvas id="canvasRef" width={window.innerWidth} height={window.innerHeight}></canvas>
            )}
        </div>
    );
};

export default JigsawTest;
