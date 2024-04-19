import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PopupComponent from '../../PopupComponent/Popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../puzzles.css';
import { MastermindPuzzle } from '../../../interfaces';
import { Button, Container } from 'react-bootstrap';
import Guess from './GuessComponent';
import correctSound from '../../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../../assets/sounds/incorrect-answer.wav';
import hintClickSound from '../../../assets/sounds/arcade-hint-click.wav';
import withClickAudio from '../../withClickAudioComponent';
import { VolumeContext } from "../../../utils/volumeContext";

const HintAudioClickButton = withClickAudio(Button, hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

interface MasterMindPuzzleProps {
    puzzle: MastermindPuzzle;
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id:string, unlockedPuzzles: string[]) => void;
}
interface GuessResponse {
    result: boolean;
    bools: string;
    unlockedPuzzles: string[];
}

function MastermindPuzzleComponent ({puzzle, i, updateRoom, notifyIncorrectAnswer, puzzleSolved}: MasterMindPuzzleProps) {
    const {volume} = React.useContext(VolumeContext);
    const [isShowing, setIsShowing] = useState<boolean>(false);
    const [currentInput, setCurrentInput] = useState<string>('');
    const currentInputRef = useRef(currentInput);
    const length = puzzle.length;

    async function handleGuess(guess: string){
        try{
            const response = await axios.post<GuessResponse>('http://localhost:8080/mastermindPuzzle/checkAnswer', {puzzleId: puzzle.id, answer: guess});
            let resp = response.data

            puzzle.previousGuesses.push([guess, resp.bools]);
            setCurrentInput('')
            updateRoom();

            if (resp.bools === '2'.repeat(length)) {
                setTimeout(async () => {
                    correctAudio.volume = volume;
                    correctAudio.play();
                    puzzleSolved(puzzle.id, resp.unlockedPuzzles);
                    setIsShowing(false);
                }, 500*length);
            } else {
                incorrectAudio.currentTime = 0;
                incorrectAudio.volume = volume;
                incorrectAudio.play();
            }


        }catch(error){
            console.error(error + currentInput);
        }
    }
    async function getHint() {
        try{
            const response = await axios.get(`http://localhost:8080/mastermindPuzzle/hint/?puzzleId=${puzzle.id}`);
            let hint : string = response.data;
            if (hint === 'No more hints.') return;
            puzzle.hints.push(hint);
            updateRoom();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            let key = event.key;
            if ((key >= '0' && key <= '9') || (key >= 'Numpad0' && key <= 'Numpad9')) {
                if (key.startsWith('Numpad')) {
                    key = key.replace('Numpad', '');
                }
                if (currentInputRef.current.length < length){
                    setCurrentInput(prevInput => prevInput + key);
                }
            }else if (key === 'Enter') {
                handleGuess(currentInputRef.current);
            }else if (key === 'Backspace') {
                setCurrentInput(prevInput => prevInput.slice(0, -1));
            }
        };

        if (isShowing) window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [isShowing]);

    useEffect(() => {
        currentInputRef.current = currentInput;
    }, [currentInput]);


    return (
        <PopupComponent
            navbarRemove={false}
            trigger={
                <div className='puzzle-card'>
                    <p className='puzzle-number'>#{i}</p>
                    <Button variant='outline-primary'>
                        {puzzle.description}
                    </Button>
                </div>
            }
            isOpen={isShowing}
            onOpen={() => setIsShowing(true)}
            onClose={() => setIsShowing(false)}
            children=
            {
                <div className='d-flex flex-column position-relative'>
                    <HintAudioClickButton variant="primary" className='position-absolute top-0 end-0' onClick={getHint}>Get a hint</HintAudioClickButton>
                    <div className='flex-grow-1'>
                        <div className='text-center d-flex align-items-center flex-column'>
                            <div className='mb-4'>
                                <h5>{puzzle.question}</h5>
                            </div>
                            {
                                puzzle.previousGuesses.map((guess, guessI) => {
                                    return <Guess 
                                        key={guessI}
                                        length={length}
                                        guess={guess[0]}
                                        feedback={guess[1]}
                                        animation={guessI === puzzle.previousGuesses.length - 1}
                                    />
                                })
                            }
                            
                            {!puzzle.isSolved &&
                                <Guess length={length} guess={currentInput} animation={false}/>
                            }
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default MastermindPuzzleComponent;