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
    puzzle: MemoryPuzzle;
}
interface HintResponse {
    puzzle: MemoryPuzzle;
}
interface CheckMatchResponse {
    isSolved: boolean;
    puzzle: MemoryPuzzle;
    unlockedPuzzles: string[];
}
interface MemoryPuzzleProps {
    puzzle: MemoryPuzzle;
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id:string, unlockedPuzzles: string[]) => void;
}

function MemoryPuzzleComponent ({puzzle, i, updateRoom, notifyIncorrectAnswer, puzzleSolved}: MemoryPuzzleProps) {
    const hintDuration = 1000 + (((puzzle.difficulty - 1)/2)) * 1000; //1 second, 1.5 seconds or 2 seconds
    const [updatedPuzzle, setPuzzle] = useState<MemoryPuzzle>(puzzle);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [valueImages, setValueImages] = useState<Array<[number, string]>>([]);

    async function handleClick(row: number, col: number, e: React.MouseEvent<HTMLDivElement>) {
        if (isLoading || isHintLoading) {
            return;
        }

        e.stopPropagation();
        setIsLoading(true);
        try{
            let response = await axios.patch<PatchResponse>(`http://localhost:8080/memoryPuzzles/flipCell`, {pos: [row, col], puzzleId: puzzle.id});
            setPuzzle(response.data.puzzle);
            setTimeout(async () => {
                let matchResponse = await axios.get<CheckMatchResponse>(`http://localhost:8080/memoryPuzzles/checkAnswer/?puzzleId=${puzzle.id}`);
                setPuzzle(matchResponse.data.puzzle);
                let resp = matchResponse.data;
                if (resp.isSolved) {
                    correctAudio.play(); 
                    puzzleSolved(puzzle.id, resp.unlockedPuzzles);
                    setIsOpen(false);
                }
                setIsLoading(false);
            }, 600);
        } catch(error: any) {
            console.error(error);
            setIsLoading(false);
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

    async function handleHintRequest(e: React.MouseEvent<HTMLButtonElement>){
        if (isHintLoading || isLoading) {
            return;
        }

        e.stopPropagation();
        setIsHintLoading(true);
        try{
            const response = await axios.get<HintResponse>(`http://localhost:8080/memoryPuzzles/toggleAllUnflippedCells/?puzzleId=${puzzle.id}`);
            setPuzzle(response.data.puzzle);
            setTimeout(async () =>{
                let hintResponse = await axios.get<HintResponse>(`http://localhost:8080/memoryPuzzles/toggleAllUnflippedCells/?puzzleId=${puzzle.id}`);
                setPuzzle(hintResponse.data.puzzle);
                setIsHintLoading(false);
            }, hintDuration); //1 second, 1.5 seconds or 2 seconds
        }catch(error: any){
            console.error(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchImages();
    }, []);

    if (valueImages.length === 0) return (<div>Loading...</div>);

    return (
        <Popup 
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
                        <h5>{updatedPuzzle.description}</h5>
                    </Row>
                    <Row>
                        {updatedPuzzle.cellsMatrix.map((row, i) => (
                            <Row key={i} className="justify-content-md-center">
                            {row.map((cell, j) => (
                                <Col xs={1} key={j} className="cell-col">
                                    <div 
                                        className={`cell ${cell.isFlipped ? 'cell-flip' : ''}`}
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
                                        <div className="cell-inner">
                                            <div className="cell-front"> </div> {/* empty div representing the front side of the cells */}
                                            <div className="cell-back">
                                                <img 
                                                    className="symbol"
                                                    src={valueImages.find(([key]) => key === cell.value)?.[1]} 
                                                    alt={"symbol " + j} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                            </Row>
                        ))}
                        <Row className="justify-content-md-center">
                            <Col xs="auto">
                                <HintAudioClickButton variant="primary" disabled={updatedPuzzle.hints === 3} className='mt-1' onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleHintRequest(e)}>{"Get help " + `(${updatedPuzzle.hints}/3)`}</HintAudioClickButton>
                            </Col>
                        </Row>
                    </Row>
                </Container>
            }
        />
    );
}

export default MemoryPuzzleComponent;