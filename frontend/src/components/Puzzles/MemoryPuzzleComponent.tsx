import React, { useEffect, useRef, useState } from 'react';
import { MemoryPuzzle, backendURL } from '../../interfaces';
import axios from 'axios';
import Popup from '../PopupComponent/Popup';
import './puzzles.css';
import { Button, Container } from 'react-bootstrap';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import withClickAudio from '../withClickAudioComponent';
import { useParams } from 'react-router-dom';

const HintAudioClickButton = withClickAudio(Button, hintClickSound);

interface MemoryPuzzleProps {
    puzzle: MemoryPuzzle;
    i: number;
    incorrectAnswer: () => void;
}

function MemoryPuzzleComponent ({puzzle, i, incorrectAnswer}: MemoryPuzzleProps) {
    const {gameId} = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const valueImages = useRef<Array<[number, string]>>([]);

    async function fetchImages(){
        try{
            const imagePromises = puzzle.valuesToSymbols.map(async ([value, fileLocation]) => {
                const response = await axios.get(backendURL + '/memoryPuzzles/symbol/', { 
                    responseType: 'blob',
                    params: {
                        gameId,
                        puzzleId: puzzle.id,
                        fileLocation
                    }
                });
                const imageUrl = URL.createObjectURL(response.data);
                return [value, imageUrl] as [number, string];
            });
            valueImages.current = await Promise.all(imagePromises);
        }catch(error: any){
            console.error(error);
        }
    }

    async function handleClick(e: React.MouseEvent<HTMLDivElement>, cellIdx: number) {
        e.stopPropagation();
        try{
            let response = await axios.patch<boolean>(backendURL + `/memoryPuzzles/flipCell`, {
                gameId,
                cellIdx, 
                puzzleId: puzzle.id
            });
        } catch(error: any) {
            console.error(error);
        }
    }

    async function handleHintRequest(e: React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation();
        try{
            const response = await axios.get<number>(backendURL + `/memoryPuzzles/hint/?`, {
                params: {
                    gameId,
                    puzzleId: puzzle.id
                }
            });
        }catch(error: any){
            console.error(error);
        }
    }

    useEffect(() => {
        fetchImages();
    }, []);

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
                <Container className='text-center d-flex justify-content-between flex-column align-items-center'>
                    <div className='mb-3'>
                        <h5>{puzzle.description}</h5>
                    </div>
                    <div className='memory-grid'>
                        {puzzle.cells.map((cell, i) => (
                            <div 
                                key={i}
                                className={`memory-cell ${cell.isFlipped ? 'memory-cell-flip' : ''}`}
                                onClick={(e) => handleClick(e, i)}
                            >
                                <div className="memory-cell-inner">
                                    <div className="memory-cell-front"> </div> {/* empty div representing the front side of the cells */}
                                    <div className="memory-cell-back">
                                        <img 
                                            className="symbol"
                                            src={valueImages.current.find(([key]) => key === cell.value)?.[1]} 
                                            alt={"symbol " + i} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="justify-content-md-center">
                        <HintAudioClickButton variant="primary" disabled={puzzle.hints === 3 || puzzle.hintActive} className='mt-1' onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleHintRequest(e)}>{"Get help " + `(${puzzle.hints}/3)`}</HintAudioClickButton>
                    </div>
                </Container>
            }
        />
    );
}

export default MemoryPuzzleComponent;