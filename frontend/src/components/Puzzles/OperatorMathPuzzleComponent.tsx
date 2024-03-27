import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { OperatorsMathPuzzle } from '../../interfaces';

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

    if (puzzle.question === null || puzzle.estimatedTime === 0 /* || description === null */) {
        return <h1>Loading...</h1>;
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