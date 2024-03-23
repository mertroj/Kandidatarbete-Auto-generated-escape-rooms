import React, { useEffect, useState } from 'react';
import { SlidePuzzles } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import './slidePuzzle.css';
import { Button, Col, Container, Row } from 'react-bootstrap';

interface PatchResponse {
    isSuccessful: boolean;
    puzzle: SlidePuzzles;
}
interface HintResponse {
    isSuccessful: boolean;
    puzzle: SlidePuzzles;
}
enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}
interface SlidePuzzleProps {
    puzzle: SlidePuzzles;
    onSolve: Function;
}
function SlidePuzzle ({puzzle, onSolve}: SlidePuzzleProps) {
    const [updatedPuzzle, setPuzzle] = useState<SlidePuzzles>(puzzle);
    const [isOpen, setIsOpen] = useState(false);

    async function handleClick(row: number, col: number, e: React.MouseEvent<HTMLDivElement>, autoMove: boolean, dir?: Direction) {
        e.stopPropagation();
        try{
            let response;
            if(autoMove){
                response = await axios.patch<PatchResponse>(`http://localhost:8080/slidePuzzles/movePiece`, {pos: [row, col], puzzleId: puzzle.id, autoMove: true});
            }else if (dir){
                let newPos: [number, number];
                if(dir === Direction.UP){
                    newPos = [row-1, col];
                }else if(dir === Direction.DOWN){
                    newPos = [row+1, col];
                }else if(dir === Direction.LEFT){
                    newPos = [row, col-1];
                }else{ //Direction.RIGHT
                    newPos = [row, col+1];
                }
                response = await axios.patch<PatchResponse>(`http://localhost:8080/slidePuzzles/movePiece`, {pos: [row, col], puzzleId: puzzle.id, newPos: newPos, autoMove: false});
            }else{
                throw new Error('Invalid move request with no direction and autoMove = false');
            }
            if (response.data.isSuccessful) {
                console.log(response.data.puzzle);
                setPuzzle(response.data.puzzle);
            }else{
                console.log('Invalid move');
            }
        }catch(error: any){
            console.log(error);
        }
    }
    async function handleSubmit(){ //closes the Popup if the answer is correct
        try{
            const response = await axios.post(`http://localhost:8080/slidePuzzles/checkAnswer`, {puzzleId: puzzle.id});
            if (response.data){
                alert('Correct!');
                onSolve();
                setIsOpen(false);
            }else{
                alert('Incorrect');
            }
        }catch(error: any){
            console.error(error);
        }
    }
    async function handleHintRequest(){
        try{
            const response = await axios.get<HintResponse>(`http://localhost:8080/slidePuzzles/hint/?puzzleId=${puzzle.id}`);
            if (response.data.isSuccessful) {
                setPuzzle(response.data.puzzle);
            }else{
                console.log('No more hints. Question already answered.'); //Alert instead? Should not be needed later on
            }
        }catch(error: any){
            console.log(error);
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
                            <Col xs={1} key={j}>
                                <div 
                                    className='cell-button'
                                    style={
                                        {
                                            color: cell === null ? 'transparent': 'black'
                                        }
                                    }
                                    onMouseEnter={(e) => {
                                        if (updatedPuzzle.hintLevel === 0){ 
                                            e.currentTarget.style.cursor = 'pointer';
                                            e.currentTarget.style.backgroundColor = 'DodgerBlue';
                                            if (cell !== null) e.currentTarget.style.color = 'white';
                                        }
                                        
                                    }}
                                    onMouseLeave={(e) => {
                                        if (updatedPuzzle.hintLevel === 0){ 
                                            e.currentTarget.style.cursor = 'default';
                                            e.currentTarget.style.backgroundColor = 'white';
                                            if (cell !== null) e.currentTarget.style.color = 'black';
                                        }
                                    }}
                                    onClick={(e) => {
                                        if (updatedPuzzle.hintLevel === 0){
                                            handleClick(i, j, e, true);
                                        }
                                    }}
                                >
                                    <div className={`${cell !== null ? 'arrow up': ''}`} style={{top: 0, ...(updatedPuzzle.hintLevel === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.UP)}>↑</div>
                                    <div className={`${cell !== null ? 'arrow left': ''}`} style={{left: 0, ...(updatedPuzzle.hintLevel === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.LEFT)}>←</div>
                                    <div className={`${cell !== null ? 'arrow right': ''}`} style={{right: 0, ...(updatedPuzzle.hintLevel === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.RIGHT)}>→</div>
                                    <div className={`${cell !== null ? 'arrow down': ''}`} style={{bottom: 0, ...(updatedPuzzle.hintLevel === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.DOWN)}>↓</div>
                                    {cell !== null ? cell.number : 0}
                                </div>
                            </Col>
                        ))}
                        </Row>
                    ))}
                    <Row className="justify-content-md-center">
                        <Col xs="auto">
                            <Button variant="success" className='mt-3' onClick={() => handleSubmit()}>Submit</Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col xs="auto">
                            <Button variant="danger" className='mt-1' onClick={() => handleHintRequest()}>Get help</Button>
                        </Col>
                    </Row>
                </Container>
            }
        />
    );
}

export default SlidePuzzle;