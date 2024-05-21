import React, { useState } from 'react';
import { SlidePuzzle, backendURL } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import './puzzles.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import withClickAudio from '../withClickAudioComponent';
import { useParams } from 'react-router-dom';

const HintAudioClickButton = withClickAudio(Button, hintClickSound);

enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

interface SlidePuzzleProps {
    puzzle: SlidePuzzle;
    i: number;
}

function SlidePuzzleComponent ({puzzle, i}: SlidePuzzleProps) {
    const {gameId} = useParams();
    const [isOpen, setIsOpen] = useState(false);

    async function handleClick(row: number, col: number, e: React.MouseEvent<HTMLDivElement>, autoMove: boolean, dir?: Direction) {
        e.stopPropagation();
        try{
            if (!autoMove && !dir){
                throw new Error('Invalid move request with no direction and autoMove = false');
            }

            let newPos: {row: number, col: number} | undefined;
            if (!autoMove && dir){
                if(dir === Direction.UP){
                    newPos = {row: row-1, col: col};
                }else if(dir === Direction.DOWN){
                    newPos = {row: row+1, col: col};
                }else if(dir === Direction.LEFT){
                    newPos = {row: row, col: col-1};
                }else{ //Direction.RIGHT
                    newPos = {row: row, col: col+1};
                }
            };

            let response = await axios.patch<boolean>(backendURL + `/slidePuzzles/movePiece`, {
                gameId,
                pos: {row, col}, 
                puzzleId: puzzle.id, 
                autoMove, 
                newPos
            });
        }catch(error: any){
            console.error(error);
        }
    }
    
    async function handleHintRequest(){
        try{
            const response = await axios.get<boolean>(backendURL + `/slidePuzzles/hint/?`, {
                params: {
                    gameId,
                    puzzleId: puzzle.id
                }
            });
        }catch(error: any){
            console.error(error);
        }
    }

    return (
        <Popup 
            puzzleNumber={i}
            navbarRemove={false}
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
                <Container className='text-center'>
                    <Row className='mb-3'>
                        <h5>{puzzle.description}</h5>
                    </Row>
                    <Row>
                        {puzzle.pieces.map((row, i) => (
                            <div key={i} className="d-flex justify-content-center">
                                {row.map((val, j) => {
                                    if (puzzle.hints === 0) {
                                        return (
                                            <div
                                                key={j}
                                                className={'slide-cell slide-no-hints'}
                                                onClick={(e) => handleClick(i, j, e, true)}
                                            >{val}</div>
                                        )
                                    } else {
                                        return (
                                            <div 
                                                key={j}
                                                className={'slide-cell'}
                                            >
                                                {val}
                                                {val && <div>
                                                    <div className={'slide-cell-arrow up'} onClick={e => handleClick(i, j, e, false, Direction.UP)}>↑</div>
                                                    <div className={'slide-cell-arrow left'} onClick={e => handleClick(i, j, e, false, Direction.LEFT)}>←</div>
                                                    <div className={'slide-cell-arrow right'} onClick={e => handleClick(i, j, e, false, Direction.RIGHT)}>→</div>
                                                    <div className={'slide-cell-arrow down'} onClick={e => handleClick(i, j, e, false, Direction.DOWN)}>↓</div>
                                                </div>}
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        ))}
                        <Row className="justify-content-md-center">
                            <Col xs="auto">
                                <HintAudioClickButton variant="primary" className='mt-1' onClick={() => handleHintRequest()}>Get help</HintAudioClickButton>
                            </Col>
                        </Row>
                    </Row>
                </Container>
            }
        />
    );
}

export default SlidePuzzleComponent;