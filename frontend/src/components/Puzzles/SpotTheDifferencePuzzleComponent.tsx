import React, {useEffect, useState} from 'react';
import { SpotTheDifferencePuzzle } from '../../interfaces';
import axios from 'axios';
import './puzzles.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import LargePopup from "../LargePopupComponent/LargePopup";

interface SpotTheDifferenceProps {
    puzzleId: string; // Assuming you have the puzzleId to fetch the puzzle
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id: string, unlockedPuzzles: string[]) => void;
}

function SpotTheDifferenceComponent({ puzzleId, i, updateRoom, notifyIncorrectAnswer, puzzleSolved }: SpotTheDifferenceProps) {
    const [puzzle, setPuzzle] = useState<SpotTheDifferencePuzzle | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    async function fetchPuzzle(puzzleId: string) {
        try {
            const response = await axios.get<SpotTheDifferencePuzzle>(`http://localhost:8080/spotTheDifference/puzzle?puzzleId=${puzzleId}`);
            setPuzzle(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPuzzle(puzzleId);
    }, [puzzleId]);

    async function handleCheckAnswer() {
        try {
            const response = await axios.post<{ isSuccessful: boolean }>(`http://localhost:8080/spotTheDifference/checkAnswer`, {
                puzzleId: puzzleId
            });
            if (response.data.isSuccessful) {
                setIsOpen(false);
            } else {
                // Handle incorrect answer
            }
        } catch (error: any) {
            console.error(error);
        }
    }

    if (!puzzle) {
        // Render loading state or return null
        return null;
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
                <Container className='text-center no-padding-margin' style={{width: '100%', height: '100%'}}>
                    <Row className='mb-3 no-padding-margin'>
                        <h5>{puzzle.description}</h5>
                    </Row>
                    <Row className='no-padding-margin'>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Col xs={6} className='no-padding-margin'>
                                <img style={{width: 'calc(100% - 2px)', height: '100%', paddingRight: '2px'}} src={`http://localhost:8080${(puzzle.changedImagePath)}`} alt="Changed" />
                            </Col>
                            <Col xs={6} className='no-padding-margin'>
                                <img style={{width: 'calc(100% - 2px)', height: '100%', paddingLeft: '2px'}} src={`http://localhost:8080${(puzzle.originalImagePath)}`} alt="Original" />
                            </Col>
                        </div>
                    </Row>
                    <Row className='no-padding-margin'>
                        <Col className='no-padding-margin'>
                            <Button style={{maxHeight: '10vh', width: 'auto'}} variant="primary" className='mt-3' onClick={() => handleCheckAnswer()}>Hint</Button>
                        </Col>
                    </Row>
                </Container>
            }
        />
    );
}// TODO: add hint functionality, and interactive clicks

export default SpotTheDifferenceComponent;
