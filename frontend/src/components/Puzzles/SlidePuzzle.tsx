import React, { useEffect, useState } from 'react';
import { SlidePuzzles } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import { Button, Col, Container, Row } from 'react-bootstrap';

interface PatchResponse {
    puzzle: SlidePuzzles;
}
function SlidePuzzle ({puzzle}: {puzzle: SlidePuzzles}) {
    const [updatedPuzzle, setPuzzle] = useState<SlidePuzzles>(puzzle);
    const [isOpen, setIsOpen] = useState(false);
    
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
    async function handleSubmit(){
        try{
            const response = await axios.post(`http://localhost:8080/slidePuzzles/checkAnswer`, {puzzleId: puzzle.id});
            if (response.data){
                alert('Correct!');
                setIsOpen(false);
            }else{
                alert('Incorrect');
            }
        }catch(error: any){
            console.error(error);
        }
    }

    return (
        <Popup 
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            trigger={
                <div className='puzzle'>
                    <Button variant='outline-primary'>{puzzle.description}</Button>
                </div>
            }
            children={
                <Container className='text-center'>
                    {updatedPuzzle.pieces.map((row, i) => (
                        <Row key={i} className="justify-content-md-center">
                        {row.map((cell, j) => (
                            <Col xs={1} key={j} className=''>
                                <Button 
                                    style={
                                        {
                                            color: cell === null ? 'transparent': 'black', 
                                            width:'4em',
                                            height: '4em',
                                            padding: '0',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: '0 0 2em 0'
                                        }
                                    } 
                                    variant={'outline-primary'} 
                                    onClick={() => handleCellClick(i, j)}
                                >
                                    {cell !== null ? cell.number : 0}
                                </Button>
                            </Col>
                        ))}
                        </Row>
                    ))}
                    <Row className="justify-content-md-center">
                        <Col xs="auto">
                            <Button variant="success" className='mt-5' onClick={() => handleSubmit()}>Submit</Button>
                        </Col>
                    </Row>
                </Container>
            }
        />
    );
}

export default SlidePuzzle;