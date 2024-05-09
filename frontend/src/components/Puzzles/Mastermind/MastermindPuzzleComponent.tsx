import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PopupComponent from '../../PopupComponent/Popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../puzzles.css';
import { MastermindPuzzle, backendURL } from '../../../interfaces';
import { Button } from 'react-bootstrap';
import Guess from './GuessComponent';
import hintClickSound from '../../../assets/sounds/arcade-hint-click.wav';
import withClickAudio from '../../withClickAudioComponent';
import { useParams } from 'react-router-dom';

const HintAudioClickButton = withClickAudio(Button, hintClickSound);

interface MasterMindPuzzleProps {
    puzzle: MastermindPuzzle;
    i: number;
    incorrectAnswer: () => void;
}
function MastermindPuzzleComponent ({puzzle, i, incorrectAnswer}: MasterMindPuzzleProps) {
    const {gameId} = useParams();

    const [isShowing, setIsShowing] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false)

    const [currentInput, setCurrentInput] = useState<string>('');
    const currentInputRef = useRef(currentInput);

    const length = puzzle.length;
    const animationDuration = 300;

    const guessesDiv = useRef<HTMLDivElement>(null);

    async function handleGuess(guess: string){
        try{
            const response = await axios.post<boolean>(backendURL + '/mastermindPuzzle/checkAnswer', {
                gameId,
                puzzleId: puzzle.id, 
                answer: guess
            });

            setCurrentInput('');
        }catch(error){
            console.error(error + currentInput);
        }
    }
    async function getHint() {
        try{
            const response = await axios.get<string | null>(backendURL + `/mastermindPuzzle/hint/?`, {
                params: {
                    gameId,
                    puzzleId: puzzle.id
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
        }, animationDuration*(length+1));
    }, [puzzle])

    useEffect(() => {
        if (!guessesDiv.current) return;
        guessesDiv.current.scrollTop = guessesDiv.current.scrollHeight;
    }, [isAnimating, isShowing])

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            let key = event.key;
            if ((key >= '0' && key <= '9') || (key >= 'Numpad0' && key <= 'Numpad9')) {
                if (key.startsWith('Numpad')) {
                    key = key.replace('Numpad', '');
                }
                if (currentInputRef.current.length < length){
                    setCurrentInput(prevInput => prevInput + key);
                    sessionStorage.setItem(puzzle.id, currentInputRef.current);
                }
            }else if (key === 'Enter') {
                handleGuess(currentInputRef.current);
                sessionStorage.removeItem(puzzle.id);
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

    useEffect(() => {
        let prevAnswer = sessionStorage.getItem(puzzle.id);
        if (prevAnswer) setCurrentInput(prevAnswer);
    }, []);

    return (
        <PopupComponent
            puzzleNumber={i}
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
                <div className='d-flex position-relative text-center align-items-center flex-column h-100'>
                    <HintAudioClickButton 
                        variant="primary" 
                        className='position-absolute top-0 end-0' 
                        onClick={getHint}
                    >Get a hint</HintAudioClickButton>

                    <div className='mb-4'>
                        <h5>{puzzle.question}</h5>
                    </div>

                    <div 
                        ref={guessesDiv}
                        className='overflow-y-scroll h-75 mh-75'
                    >
                        {puzzle.previousGuesses.map((guess, guessI) => {
                            return <Guess 
                                key={guessI}
                                length={length}
                                guess={guess[0]}
                                feedback={guess[1]}
                                animation={guessI === puzzle.previousGuesses.length - 1}
                                animationDuration={animationDuration}
                            />
                        })}
                        
                        {!isAnimating &&
                            <Guess 
                                length={length} 
                                guess={currentInput}
                                animation={false}
                                animationDuration={animationDuration}
                            />
                        }
                    </div>
                </div>
            }
        />
    );
}

export default MastermindPuzzleComponent;