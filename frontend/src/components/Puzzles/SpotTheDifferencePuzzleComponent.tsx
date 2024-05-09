import React, { useEffect, useState } from 'react';
import { SpotTheDifferencePuzzle, backendURL } from '../../interfaces';
import axios from 'axios';
import './puzzles.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import LargePopup from "../LargePopupComponent/LargePopup";
import { useParams } from 'react-router-dom';

interface SpotTheDifferenceProps {
    puzzle: SpotTheDifferencePuzzle;
    i: number;
}

function SpotTheDifferenceComponent({ puzzle, i }: SpotTheDifferenceProps) {
    const {gameId} = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [paddingLeft, setPaddingLeft] = useState(0);
    const [diffs, setDiffs] = useState<JSX.Element[]>([]);

    function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
        const img = event.target as HTMLImageElement;
        setImg(img);

        const style = window.getComputedStyle(img);
        const paddingLeftValue = parseFloat(style.paddingLeft);
        setPaddingLeft(paddingLeftValue);
    }

    async function handleImageClick(event: React.MouseEvent<HTMLImageElement>) {
        const img = event.target as HTMLImageElement;
        const offsetX = event.nativeEvent.offsetX;
        const offsetY = event.nativeEvent.offsetY;
        const scaledOffsetX = (offsetX / img.width) * puzzle.width;
        const scaledOffsetY = (offsetY / img.height) * puzzle.height;

        try {
            // Send relative coordinates to the backend
            const response = await axios.post<boolean>(backendURL + `/spotTheDifference/click`, {
                gameId,
                x: scaledOffsetX,
                y: scaledOffsetY,
                puzzleId: puzzle.id
            });

        } catch (error) {
            console.error(error);
        }
    }

    async function handleHintClick() {
        try {
            // Send a GET request to the /hint endpoint
            const response = await axios.get<boolean>(backendURL + `/spotTheDifference/hint`, {
                params: {
                    gameId,
                    puzzleId: puzzle.id
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!img) return;
        
        let newDiffs = puzzle.differences.map((difference, index) => {
            const offset = 5; // Adjust this value to change the size of the boxes
            const left = difference.x1 * (img.width / puzzle.width) + img.offsetLeft - offset/2;
            const top = difference.y1 * (img.height / puzzle.height) + img.offsetTop - offset/2;
            const width = (difference.x2 - difference.x1) * ((img.width - 2) / puzzle.width) + offset;
            const height = (difference.y2 - difference.y1) * (img.height / puzzle.height) + offset;
    
            return (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${width}px`,
                        height: `${height}px`,
                        border: '2px solid red',
                        boxShadow: '0 0 0 2px black',
                    }}
                />
            );
        })
        setDiffs(newDiffs);
    }, [img, puzzle])
    

    return (
        <LargePopup
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            trigger={
                <div className='puzzle-card'>
                    <p className='puzzle-number'>#{i}</p>
                    <Button variant='outline-primary'>{puzzle.question}</Button>
                </div>
            }
            children={
                <Container className='text-center no-padding-margin' style={{ width: '100%', height: '100%' }}>
                    <Row className='mb-3 no-padding-margin'>
                        <h5>{puzzle.description}</h5>
                    </Row>
                    <Row className='no-padding-margin'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            <Col xs={6} className='no-padding-margin'>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        style={{ width: 'calc(100% - 2px)', height: '100%', paddingRight: '2px' }}
                                        src={backendURL + puzzle.changedImagePath}
                                        alt="Changed"
                                        onLoad={handleImageLoad}
                                        onClick={handleImageClick}
                                    />
                                    {diffs}
                                </div>
                            </Col>
                            <Col xs={6} className='no-padding-margin'>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        style={{ width: 'calc(100% - 2px)', height: '100%', paddingLeft: '2px' }}
                                        src={backendURL + puzzle.originalImagePath}
                                        alt="Original"
                                        onLoad={handleImageLoad}
                                        onClick={handleImageClick}
                                    />
                                    {diffs}
                                </div>
                            </Col>
                        </div>
                    </Row>
                    <Row className='no-padding-margin'>
                        <Col className='no-padding-margin'>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center', // This aligns items vertically in the center
                                gap: '20px' // This creates a little distance between the counter and the button
                            }}>
                                <p style={{ transform: 'translateY(15px)' }}>{`${puzzle.differences.length} / ${puzzle.maximumHints}`}</p>
                                <Button style={{ maxHeight: '10vh', width: 'auto' }} variant="primary" className='mt-3' onClick={handleHintClick}>Hint</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            }
        />
    );
}

export default SpotTheDifferenceComponent;
