import React, { useEffect, useState } from 'react';
import { SlidePuzzles } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import './slidePuzzle.css';
import { Button, Col, Container, Row } from 'react-bootstrap';

interface PatchResponse {
    puzzle: SlidePuzzles;
}
function SlidePuzzle ({puzzle}: {puzzle: SlidePuzzles}) {
    const [updatedPuzzle, setPuzzle] = useState<SlidePuzzles>(puzzle);
    
    async function handleCellClick(row: number, col: number) {
        try{
            const response = await axios.patch<PatchResponse>(`http://localhost:8080/slidePuzzles/movePiece`, {row, col, puzzleId: puzzle.id});
            if (response.status === 200) {
                setPuzzle(response.data.puzzle);
            }
        }catch(error: any){
            if (error.response && error.response.status === 400) {
                console.log('Invalid move');
            } else {
                throw error;
            }
        }
    }

    return (
        <Popup 
            trigger={
                <div className='puzzle'>
                    <Button variant='outline-primary'>{puzzle.description}</Button>
                </div>
            }
            children={
                <Container>
                    {updatedPuzzle.pieces.map((row, i) => (
                        <Row key={i} className="justify-content-md-center">
                        {row.map((cell, j) => (
                            <Col xs="auto" key={j} className='border no-margin'>
                                <Button style={{color: cell === null ? 'transparent': 'black'}} variant={'outline-primary'} onClick={() => handleCellClick(i, j)}>
                                    {cell !== null ? cell.number : 0}
                                </Button>
                            </Col>
                        ))}
                        </Row>
                    ))}
                    <Row className="justify-content-md-center">
                        <Col xs="auto">
                            <Button variant="success" className='mt-5'>Submit</Button>
                        </Col>
                    </Row>
                </Container>
            }
        />
    );
}

export default SlidePuzzle;