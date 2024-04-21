import React, { useEffect, useState } from 'react';
import { Cell, MemoryPuzzle } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import './puzzles.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../assets/sounds/correct-answer.wav';
import withClickAudio from '../withClickAudioComponent';
import { VolumeContext } from "../../utils/volumeContext";

const HintAudioClickButton = withClickAudio(Button, hintClickSound);
const correctAudio = new Audio(correctSound);

interface PatchResponse {
    result: boolean;
    cellsMatrix: Cell[][];
}
interface HintResponse {
    result: boolean;
    cellsMatrix: Cell[][];
}
interface CheckMatchResponse {
    isSolved: boolean;
    cellsMatrix: Cell[][];
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
    const {volume} = React.useContext(VolumeContext);
    const hintDuration = 1000 + (((puzzle.difficulty - 1)/2)) * 1000; //1 second, 1.5 seconds or 2 seconds
    const [isOpen, setIsOpen] = useState(false);
    const [cellsMatrix, setCellsMatrix] = useState<Cell[][]>(puzzle.cellsMatrix);
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
            setCellsMatrix(response.data.cellsMatrix);
            puzzle.cellsMatrix = response.data.cellsMatrix;
            setTimeout(async () => {
                let matchResponse = await axios.get<CheckMatchResponse>(`http://localhost:8080/memoryPuzzles/checkAnswer/?puzzleId=${puzzle.id}`);
                setCellsMatrix(matchResponse.data.cellsMatrix);
                puzzle.cellsMatrix = matchResponse.data.cellsMatrix;
                let resp = matchResponse.data;
                if (resp.isSolved) {
                    correctAudio.currentTime = 0;
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
            const imagePromises = puzzle.valuesToSymbols.map(async ([value, fileLocation]) => {
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
            if (response.data.result) {
                setCellsMatrix(response.data.cellsMatrix);
                puzzle.cellsMatrix = response.data.cellsMatrix;
                puzzle.hints++;
                setTimeout(async () =>{
                    let hintResponse = await axios.get<HintResponse>(`http://localhost:8080/memoryPuzzles/toggleAllUnflippedCells/?puzzleId=${puzzle.id}`);
                    setCellsMatrix(hintResponse.data.cellsMatrix);
                    puzzle.cellsMatrix = response.data.cellsMatrix;
                    setIsHintLoading(false);
                }, hintDuration); //1 second, 1.5 seconds or 2 seconds
            }
        }catch(error: any){
            console.error(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        correctAudio.volume = volume;
    }, [volume]);

    if (valueImages.length === 0) return (<div>Loading...</div>);

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
                        {cellsMatrix.map((row, i) => (
                            <Row key={i} className="justify-content-md-center">
                            {row.map((cell, j) => (
                                <Col xs={1} key={j} className="cell-col">
                                    <div 
                                        className={`cell ${cell.isFlipped ? 'cell-flip' : ''}`}
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
                                <HintAudioClickButton variant="primary" disabled={puzzle.hints === 3} className='mt-1' onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleHintRequest(e)}>{"Get help " + `(${puzzle.hints}/3)`}</HintAudioClickButton>
                            </Col>
                        </Row>
                    </Row>
                </Container>
            }
        />
    );
}

export default MemoryPuzzleComponent;