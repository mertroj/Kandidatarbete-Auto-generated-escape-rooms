import React, { useEffect, useState } from 'react';
import {Difference, Puzzle, SpotTheDifferencePuzzle} from '../../interfaces';
import axios from 'axios';
import './puzzles.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import LargePopup from "../LargePopupComponent/LargePopup";
import correctSound from "../../assets/sounds/correct-answer.wav";

const correctAudio = new Audio(correctSound);

interface SpotTheDifferenceProps {
    puzzle: SpotTheDifferencePuzzle;
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id: string, unlockedPuzzles: string[]) => void;
}

function SpotTheDifferenceComponent({ puzzle, i, updateRoom, notifyIncorrectAnswer, puzzleSolved }: SpotTheDifferenceProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [counter, setCounter] = useState(0);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [paddingLeft, setPaddingLeft] = useState(0);

    function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
        const img = event.target as HTMLImageElement;
        setImg(img);

        const style = window.getComputedStyle(img);
        const paddingLeftValue = parseFloat(style.paddingLeft);
        setPaddingLeft(paddingLeftValue);
    }

    async function handleImageClick(event: React.MouseEvent<HTMLImageElement>) {
        if (!puzzle) return;

        const img = event.target as HTMLImageElement;
        const offsetX = event.nativeEvent.offsetX;
        const offsetY = event.nativeEvent.offsetY;
        const scaledOffsetX = (offsetX / img.width) * puzzle.width;
        const scaledOffsetY = (offsetY / img.height) * puzzle.height;

        try {
            // Send relative coordinates to the backend
            const response = await axios.post<{res: boolean, difference?: Difference}>(`http://localhost:8080/spotTheDifference/click`, {
                x: scaledOffsetX,
                y: scaledOffsetY,
                puzzleId: puzzle.id
            });

            if (response.data.difference)
                puzzle.differences.push(response.data.difference);

            await handleCheckAnswer()

            updateRoom();
        } catch (error) {
            console.error(error);
        }
    }

    if (!puzzle) {
        return null;
    }

    async function handleCheckAnswer() {
        try {
            const response = await axios.post<boolean>(`http://localhost:8080/spotTheDifference/checkAnswer`, {
                puzzleId: puzzle.id
            });
            if (response.data) {
                console.log(123);
                correctAudio.play();
                puzzle.isSolved = true;
                updateRoom();
                setIsOpen(false);
            } else {
                // Handle incorrect answer
            }
        } catch (error: any) {
            console.error(error);
        }
    }

    async function handleHintClick() {
        try {
            // Send a GET request to the /hint endpoint
            const response = await axios.get<{hint: string, difference?: Difference}>(`http://localhost:8080/spotTheDifference/hint`, {
                params: {
                    puzzleId: puzzle.id
                }
            });

            if (!puzzle) return;

            if (response.data.hint)
                puzzle.hints.push(response.data.hint);

            if (response.data.difference)
                puzzle.differences.push(response.data.difference)

            await handleCheckAnswer()

            updateRoom();
        } catch (error) {
            console.error(error);
        }
    }

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
                                        src={`http://localhost:8080${puzzle.changedImagePath}`}
                                        alt="Changed"
                                        onLoad={handleImageLoad}
                                        onClick={handleImageClick}
                                    />
                                    {puzzle.differences.map((difference, index) => {
                                        if (!img) return null;

                                        const offset = 5; // Adjust this value to change the size of the boxes
                                        const left = Math.min(difference.x1, difference.x2, difference.x3, difference.x4) * (img.width / puzzle.width) + img.offsetLeft - offset/2;
                                        const top = Math.min(difference.y1, difference.y2, difference.y3, difference.y4) * (img.height / puzzle.height) + img.offsetTop - offset/2;
                                        const width = (Math.max(difference.x1, difference.x2, difference.x3, difference.x4) - Math.min(difference.x1, difference.x2, difference.x3, difference.x4)) * ((img.width - 2) / puzzle.width) + offset;
                                        const height = (Math.max(difference.y1, difference.y2, difference.y3, difference.y4) - Math.min(difference.y1, difference.y2, difference.y3, difference.y4)) * (img.height / puzzle.height) + offset;

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
                                    })}
                                </div>
                            </Col>
                            <Col xs={6} className='no-padding-margin'>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        style={{ width: 'calc(100% - 2px)', height: '100%', paddingLeft: '2px' }}
                                        src={`http://localhost:8080${puzzle.originalImagePath}`}
                                        alt="Original"
                                        onLoad={handleImageLoad}
                                        onClick={handleImageClick}
                                    />
                                    {puzzle.differences.map((difference, index) => {
                                        if (!img) return null;

                                        const offset = 5; // Adjust this value to change the size of the boxes
                                        const left = Math.min(difference.x1, difference.x2, difference.x3, difference.x4) * (img.width / puzzle.width) + img.offsetLeft - offset/2;
                                        const top = Math.min(difference.y1, difference.y2, difference.y3, difference.y4) * (img.height / puzzle.height) + img.offsetTop - offset/2;
                                        const width = (Math.max(difference.x1, difference.x2, difference.x3, difference.x4) - Math.min(difference.x1, difference.x2, difference.x3, difference.x4)) * ((img.width - 2) / puzzle.width) + offset;
                                        const height = (Math.max(difference.y1, difference.y2, difference.y3, difference.y4) - Math.min(difference.y1, difference.y2, difference.y3, difference.y4)) * (img.height / puzzle.height) + offset;

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
                                    })}
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
