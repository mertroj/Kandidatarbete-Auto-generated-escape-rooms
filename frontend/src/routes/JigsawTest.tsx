import React, { useEffect, useRef, useState } from 'react';

const JigsawTest: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [canvasResized, setCanvasResized] = useState<boolean>(false); // Track whether canvas has been resized
    let IMAGE: HTMLImageElement | null = null;
    let CONTEXT: CanvasRenderingContext2D | null = null;
    let SCALAR = 0.6;
    let SIZE = { x: 0, y: 0, width: 0, height: 0 };

    async function jigsawImage() {
        try {
            const response = await fetch('http://localhost:8080/jigsawtest/image');
            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                IMAGE = new Image();
                IMAGE.src = imageUrl;

                IMAGE.onload = function () {
                    handleResize(); // Resize canvas after image load
                    setImageLoaded(true);
                    setLoadingError(null);
                    window.addEventListener("resize", handleResize);
                };

                IMAGE.onerror = function () {
                    setLoadingError('Error loading image');
                };
            } else {
                setLoadingError('Failed to fetch image');
            }
        } catch (error) {
            setLoadingError('Error fetching image');
            console.error('Error fetching image:', error);
        }
    }

    useEffect(() => {
        jigsawImage();
    }, []);

    useEffect(() => {
        // Resize canvas once after image has loaded
        if (imageLoaded && !canvasResized) {
            handleResize();
            setCanvasResized(true);
        }
    }, [imageLoaded, canvasResized]);

    function handleResize() {
        if (canvasRef.current && IMAGE) {
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            let resizer = SCALAR *
                Math.min(
                    window.innerWidth / IMAGE.width,
                    window.innerHeight / IMAGE.height
                );
            SIZE.width = IMAGE.width * resizer;
            SIZE.height = IMAGE.height * resizer;
            SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
            SIZE.y = window.innerHeight / 2 - SIZE.height / 2;

            CONTEXT = canvas.getContext("2d");
            if (CONTEXT && IMAGE) {
                redrawImage();
            }
        }
    }

    function redrawImage() {
        if (CONTEXT && IMAGE) {
            CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight);
            CONTEXT.drawImage(IMAGE, 0, 0, SIZE.width, SIZE.height);
        }
    }

    return (
        <div>
            {loadingError && <div>{loadingError}</div>}
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    );
};

export default JigsawTest;
