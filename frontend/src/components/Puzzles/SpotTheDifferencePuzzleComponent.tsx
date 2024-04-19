import React, { useState, useEffect } from 'react';
import { SpotTheDifferencePuzzle } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import './puzzles.css';
import { Button, Col, Container, Row } from 'react-bootstrap';

interface SpotTheDifferenceProps {
    puzzleId: string;
}

function SpotTheDifferenceComponent({ puzzleId }: SpotTheDifferenceProps) {
    const [puzzle, setPuzzle] = useState<SpotTheDifferencePuzzle | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchPuzzle = async () => {
            try {
                const response = await axios.get<SpotTheDifferencePuzzle>(`http://localhost:8080/spotTheDifference/puzzle?puzzleId=${puzzleId}`);
                setPuzzle(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPuzzle();
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
        return null; // You can render a loading indicator here if needed
    }

    return (
        <Popup
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            trigger={
                <div className='puzzle-card'>
                    <Button variant='outline-primary'>{puzzle.question}</Button>
                </div>
            }
            children={
                <Container className='text-center'>
                    <Row className='mb-3'>
                        <h5>{puzzle.description}</h5>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <img src={puzzle.changedImagePath} alt="Changed" />
                        </Col>
                        <Col xs={6}>
                            <img src={puzzle.originalImagePath} alt="Original" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="success" className='mt-3' onClick={() => handleCheckAnswer()}>Submit</Button>
                        </Col>
                    </Row>
                </Container>
            }
        />
    );
}

export default SpotTheDifferenceComponent;
