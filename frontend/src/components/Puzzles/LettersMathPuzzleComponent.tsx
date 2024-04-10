import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { LettersMathPuzzle } from '../../interfaces';

interface LettersMathPuzzleProps {
    puzzle: LettersMathPuzzle;
    updateRoom: () => void;
}
function LettersMathPuzzleComponent ({puzzle, updateRoom}: LettersMathPuzzleProps) {
    const [answer, setAnswer] = useState<string>();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:8080/lettersMathPuzzles/checkAnswer`, {answer: answer, puzzleId: puzzle.id});
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
            const response = await axios.get(`http://localhost:8080/lettersMathPuzzles/hint/?puzzleId=${puzzle.id}`);
            let hint: string = response.data;
            if (hint === "No more hints.") return;
            puzzle.hints.push(hint);
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

export default LettersMathPuzzleComponent;