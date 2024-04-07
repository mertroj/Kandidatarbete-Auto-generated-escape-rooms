import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { OperatorsMathPuzzle } from '../../interfaces';
import withClickAudio from '../withClickAudioComponent';

const AudioClickButton = withClickAudio('button');
interface OperatorMathPuzzleProps {
    addHint: Function;
    puzzle: OperatorsMathPuzzle;
    onSolve: Function;
}
function OperatorMathPuzzleComponent (operatorMathPuzzleProps: OperatorMathPuzzleProps) {
    const {puzzle, addHint, onSolve} = operatorMathPuzzleProps;
    const [answer, setAnswer] = useState<string>();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:8080/operatorMathPuzzles/checkAnswer`, {answer: answer, puzzleId: puzzle.id});
            if(response.data){
                alert('Correct!');
                onSolve();
            }else{
                alert('Incorrect!');
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    async function getHint() {
        try{
            const response = await axios.get(`http://localhost:8080/operatorMathPuzzles/hint/?puzzleId=${puzzle.id}`);
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
                    <AudioClickButton className='w-100' type='submit'>Test answer</AudioClickButton>
                </form>
                <AudioClickButton className="w-100" onClick={async() => getHint()}>
                    Get a hint
                </AudioClickButton>
            </div>
        </div>
        
    );
}

export default OperatorMathPuzzleComponent;