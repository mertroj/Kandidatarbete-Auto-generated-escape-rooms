import React, { useEffect, useState } from 'react';
import { MemoryPuzzle, Cell } from '../../../interfaces';
import axios from 'axios';
import Popup from '../../PopupComponent/Popup';
import './memoryPuzzle.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import hintClickSound from '../../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../../assets/sounds/incorrect-answer.wav';
import withClickAudio from '../../withClickAudioComponent';

const HintAudioClickButton = withClickAudio(Button, hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
interface PatchResponse {
    isSolved: boolean;
    puzzle: MemoryPuzzle;
}
interface HintResponse {
    isSuccessful: boolean;
    puzzle: MemoryPuzzle;
}
interface MemoryPuzzleProps {
    puzzle: MemoryPuzzle;
    onSubmit: Function;
}

function MemoryPuzzleComponent ({puzzle, onSubmit}: MemoryPuzzleProps) {
    console.log(puzzle);
    const [updatedPuzzle, setPuzzle] = useState<MemoryPuzzle>(puzzle);
    const [isOpen, setIsOpen] = useState(false);
    const [valueImages, setValueImages] = useState<Array<[number, string]>>([]);

    async function handleClick(row: number, col: number, e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        try{
            let response = await axios.patch<PatchResponse>(`http://localhost:8080/memoryPuzzles/flipCell`, {pos: [row, col], puzzleId: puzzle.id});
            setPuzzle(response.data.puzzle);
            if (response.data.isSolved) {
                correctAudio.play();
                onSubmit(true);
                setIsOpen(false);
            }else{
                onSubmit(false);
            }
        }catch(error: any){
            console.error(error);
        }
    }
    async function fetchImages(){
        try{
            const imagePromises = updatedPuzzle.valuesToSymbols.map(async ([value, fileLocation]) => {
                const response = await axios.get(`http://localhost:8080/memoryPuzzles/symbol/?puzzleId=${puzzle.id}&fileLocation=${fileLocation}`, { responseType: 'blob' });
                const imageUrl = URL.createObjectURL(response.data);
                return [value, imageUrl] as [number, string];
            });
            const valueImages = await Promise.all(imagePromises);
            setValueImages(valueImages);
        }catch(error: any){
            console.error(error);
        }
    }

    async function handleHintRequest(){
        try{
            const response = await axios.get<HintResponse>(`http://localhost:8080/memoryPuzzles/hint/?puzzleId=${puzzle.id}`);
            if (response.data.isSuccessful) {
                setPuzzle(response.data.puzzle);
            }else{
                // TODO: 'No more hints. Question already answered. Alert instead? Should not be needed later on
            }
        }catch(error: any){
            console.error(error);
        }
    }

    useEffect(() => {
        fetchImages();
    }, [updatedPuzzle]);

    if (valueImages.length === 0) return (<div>Loading...</div>);

    return (
        <Popup 
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            trigger={
                <div className='puzzle'>
                    <Button variant='outline-primary'>{puzzle.question}</Button>
                </div>
            }
            children={
                <Container className='text-center'>
                    <Row className='mb-3'>
                        <h5>{updatedPuzzle.description}</h5>
                    </Row>
                    <Row>
                        {updatedPuzzle.cellsMatrix.map((row, i) => (
                            <Row key={i} className="justify-content-md-center">
                            {row.map((cell, j) => (
                                <Col xs={1} key={j} className="cell-col">
                                    <div 
                                        className='cell'
                                        onMouseEnter={(e) => {
                                            if (!cell.isFlipped){

                                            }
                                            
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!cell.isFlipped){

                                            }
                                        }}
                                        onClick={(e) => {
                                            handleClick(i, j, e);
                                        }}
                                    >
                                        <img 
                                            className="symbol"
                                            src={valueImages.find(([key]) => key === cell.value)?.[1]} 
                                            alt={"symbol " + j} />
                                    </div>
                                </Col>
                            ))}
                            </Row>
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

export default MemoryPuzzleComponent;