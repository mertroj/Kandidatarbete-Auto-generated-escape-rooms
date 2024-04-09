import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { LettersMathPuzzle } from '../../interfaces';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../assets/sounds/incorrect-answer.wav';
import withClickAudio from '../withClickAudioComponent';

const HintAudioClickButton = withClickAudio('button', hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
interface LettersMathPuzzleProps {
    addHint: Function;
    puzzle: LettersMathPuzzle;
    onSubmit: Function;
}
function LettersMathPuzzleComponent (lettersMathPuzzleProps: LettersMathPuzzleProps) {
    const {puzzle, addHint, onSubmit} = lettersMathPuzzleProps;
    const [answer, setAnswer] = useState<string>();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:8080/lettersMathPuzzles/checkAnswer`, {answer: answer, puzzleId: puzzle.id});
            if(response.data){
                correctAudio.play();
                onSubmit(true);
            }else{
                incorrectAudio.currentTime = 0;
                incorrectAudio.play();
                onSubmit(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    async function getHint() {
        try{
            const response = await axios.get(`http://localhost:8080/lettersMathPuzzles/hint/?puzzleId=${puzzle.id}`);
            addHint(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='puzzle'>
            <p>{puzzle.description}</p>
            <p>{puzzle.question}</p>
            <div>
                <form action="" onSubmit={handleSubmit}>
                    <input className='w-100' type="text" placeholder='Enter the answer here' onChange={e => setAnswer(e.target.value)} />
                    <button className='w-100' type='submit'>Test answer</button>
                </form>
                <HintAudioClickButton className="w-100" onClick={async() => getHint()}>
                    Get a hint
                </HintAudioClickButton>
            </div>
        </div>
        
    );
}

export default LettersMathPuzzleComponent;