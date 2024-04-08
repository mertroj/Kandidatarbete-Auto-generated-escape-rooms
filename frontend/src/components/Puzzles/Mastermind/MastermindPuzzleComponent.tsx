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

const HintAudioClickButton = withClickAudio(Button, hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
function MastermindPuzzleComponent ({addHint, puzzle, onSolve}: {addHint : Function, puzzle: MastermindPuzzle, onSolve: Function}) {
    const [previousGuesses, setPreviousGuesses] = useState<Map<number, [string, string]>>(new Map());
    const [submittedAnswer, setSubmittedAnswer] = useState<string>();
    const [isShowing, setIsShowing] = useState<boolean>(false);
    const [currentInput, setCurrentInput] = useState<string>('');
    const currentInputRef = useRef(currentInput);
    const length = puzzle.length;
    const correct = Array(length).fill(0);
    let notSolved = true;

    async function fetchGuesses(){
        try{
            const response = await axios.get<[[number, [string, string]]]>('http://localhost:8080/mastermindPuzzle/previousGuesses?puzzleId=' + puzzle.id);
            if (response.status !== 200) throw new Error('Failed to fetch previous guesses: ' + response.statusText);
            const previousGuessesMap = new Map(response.data);
            setPreviousGuesses(previousGuessesMap);
            setCurrentInput('');
        }catch(error){
            console.error(error);
        }
    }
    async function handleGuess(guess: string){
        try{
            const response = await axios.post<Number[]>('http://localhost:8080/mastermindPuzzle/checkAnswer', {puzzleId: puzzle.id, answer: guess});
            if (response.data.length === correct.length && response.data.every((value, index) => value === correct[index])) {
                notSolved = false;
                await fetchGuesses();
                setTimeout(async () => {
                    setIsShowing(false);
                    onSolve();
                    correctAudio.play();
                    await fetchGuesses();
                }, 500*length);
            } else {
                await fetchGuesses();
                incorrectAudio.play();
            }
        }catch(error){
            console.error(error + currentInput);
        }
    }
    async function getHint() {
        try{
            const response = await axios.get(`http://localhost:8080/mastermindPuzzle/hint/?puzzleId=${puzzle.id}`);
            addHint(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchGuesses();
    }, []);

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

        if (isShowing) {
            window.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isShowing]);

    useEffect(() => {
        currentInputRef.current = currentInput;
    }, [currentInput]);

    let guessComponents = [];
    for (let i = 0; i < previousGuesses.size; i++) {
        if (previousGuesses.has(i)) {
            guessComponents.push(
                <Guess 
                    key={i}
                    length={length}
                    guess={previousGuesses.get(i)![0]} //safe since we set the indexes to be the keys in the backend, and we checked with .has(i)
                    feedback={previousGuesses.get(i)![1]}
                    animation={i === previousGuesses.size - 1}
                />
            );
        }
    }

return (
    <div className='puzzle'>
        <PopupComponent
            trigger={
                <Button variant='outline-primary'>
                    Placeholder text for mastermind puzzle. To be chosen depending on the theme
                </Button>
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
                            {guessComponents}
                            {notSolved &&
                                <Guess length={length} guess={currentInput} animation={false}/>
                            }
                        </div>
                    </div>
                </div>
            }
        />
    </div>
);
}

export default MastermindPuzzleComponent;