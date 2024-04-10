import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { OperatorsMathPuzzle } from '../../interfaces';

interface OperatorMathPuzzleProps {
    puzzle: OperatorsMathPuzzle;
    updateRoom: () => void;
}

interface HintI {
    hint: string;
    question: string;
}

function OperatorMathPuzzleComponent ({puzzle, updateRoom}: OperatorMathPuzzleProps) {
    const [answer, setAnswer] = useState<string>();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:8080/operatorMathPuzzles/checkAnswer`, {answer: answer, puzzleId: puzzle.id});
            if(response.data){
                alert('Correct!');
                puzzle.isSolved = true
                updateRoom();
            }else{
                alert('Incorrect!');
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    async function getHint() {
        try{
            const response = await axios.get<HintI>(`http://localhost:8080/operatorMathPuzzles/hint/?puzzleId=${puzzle.id}`);
            if (response.data.hint === "No more hints.") return;
            puzzle.hints.push(response.data.hint);
            puzzle.question = response.data.question
            updateRoom();
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
                <button className="w-100" onClick={async() => getHint()}>
                    Get a hint
                </button>
            </div>
        </div>
        
    );
}

export default OperatorMathPuzzleComponent;