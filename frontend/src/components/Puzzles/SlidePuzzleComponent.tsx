import React, { useEffect, useState } from 'react';
import { Piece, SlidePuzzle } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import './puzzles.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../assets/sounds/incorrect-answer.wav';
import withClickAudio from '../withClickAudioComponent';
import { VolumeContext } from "../../utils/volumeContext";

const HintAudioClickButton = withClickAudio(Button, hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

interface SlidePuzzleProps {
    puzzle: SlidePuzzle;
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id:string, unlockedPuzzles: string[]) => void;
}
interface PatchResponse {
    result: boolean;
    pieces: (Piece|null)[][];
}
interface HintResponse {
    result: boolean;
    pieces: (Piece|null)[][];
}
interface GuessResponse {
    result: boolean;
    unlockedPuzzles: string[];
}

function SlidePuzzleComponent ({puzzle, i, updateRoom, notifyIncorrectAnswer, puzzleSolved}: SlidePuzzleProps) {
    const {volume} = React.useContext(VolumeContext);
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
            if (response.data.result) {
                puzzle.pieces = response.data.pieces;
                updateRoom();
            }else{
                // TODO: error handling for 'Invalid move'
            }
        }catch(error: any){
            console.error(error);
        }
    }
    async function handleSubmit(){ //closes the Popup if the answer is correct
        try{
            const response = await axios.post<GuessResponse>(`http://localhost:8080/slidePuzzles/checkAnswer`, {puzzleId: puzzle.id});
            let resp = response.data;
            if(resp.result){
                correctAudio.currentTime = 0;
                correctAudio.play();
                puzzleSolved(puzzle.id, resp.unlockedPuzzles)
                setIsOpen(false);
            }else{
                incorrectAudio.currentTime = 0;
                incorrectAudio.play();
                notifyIncorrectAnswer();
            }
        }catch(error: any){
            console.error(error);
        }
    }
    async function handleHintRequest(){
        try{
            const response = await axios.get<HintResponse>(`http://localhost:8080/slidePuzzles/hint/?puzzleId=${puzzle.id}`);
            if (response.data.result) {
                puzzle.pieces = response.data.pieces;
                puzzle.hints++;
                updateRoom();
            }else{
                // TODO: 'No more hints. Question already answered. Alert instead? Should not be needed later on
            }
        }catch(error: any){
            console.error(error);
        }
    }

    useEffect(() => {
        correctAudio.volume = volume;
        incorrectAudio.volume = volume;
    }, [volume]);

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
                            {row.map((cell, j) => (
                                <div 
                                    key={j}
                                    className='cell-button'
                                    style={{
                                        color: cell === null ? 'transparent': 'black'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (puzzle.hints === 0){ 
                                            e.currentTarget.style.cursor = 'pointer';
                                            e.currentTarget.style.backgroundColor = 'DodgerBlue';
                                            if (cell !== null) e.currentTarget.style.color = 'white';
                                        }
                                        
                                    }}
                                    onMouseLeave={(e) => {
                                        if (puzzle.hints === 0){ 
                                            e.currentTarget.style.cursor = 'default';
                                            e.currentTarget.style.backgroundColor = 'white';
                                            if (cell !== null) e.currentTarget.style.color = 'black';
                                        }
                                    }}
                                    onClick={(e) => {
                                        if (puzzle.hints === 0){
                                            handleClick(i, j, e, true);
                                        }
                                    }}
                                >
                                    <div className={`${cell !== null ? 'arrow up': ''}`} style={{top: 0, ...(puzzle.hints === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.UP)}>↑</div>
                                    <div className={`${cell !== null ? 'arrow left': ''}`} style={{left: 0, ...(puzzle.hints === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.LEFT)}>←</div>
                                    <div className={`${cell !== null ? 'arrow right': ''}`} style={{right: 0, ...(puzzle.hints === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.RIGHT)}>→</div>
                                    <div className={`${cell !== null ? 'arrow down': ''}`} style={{bottom: 0, ...(puzzle.hints === 0 ? {display: 'none'}: {})}} onClick={e => handleClick(i, j, e, false, Direction.DOWN)}>↓</div>
                                    {cell !== null ? cell.number : 0}
                                </div>
                            ))}
                            </div>
                        ))}
                        <Row className="justify-content-md-center">
                            <Col xs="auto">
                                <Button variant="success" className='mt-3' onClick={() => handleSubmit()}>Submit</Button>
                            </Col>
                        </Row>
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