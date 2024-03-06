import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'

interface MathPuzzleProps {
    estimatedTime: number;
    puzzleQuestion: string;
    description: string;
}
interface SubmittedAnswer{
    isCorrect: boolean;
}
interface NewHint{
    hint: string; 
}

function MathPuzzle ({addHint, puzzle}: {addHint : Function, puzzle: Object}) {
    const [puzzleQuestion, setPuzzleQuestion] = useState<string>();
    const [estimatedTime, setTime] = useState<number>(0);
    const [answer, setAnswer] = useState<string>();
    const [description, setDescription] = useState<string>();

    async function fetchPuzzle() {
        try {
            const response = await axios.get<MathPuzzleProps>(
                `http://localhost:8080/puzzleService/info`
            );
            setPuzzleQuestion(response.data.puzzleQuestion);
            setTime(response.data.estimatedTime);

        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post<SubmittedAnswer>(`http://localhost:8080/puzzleService/checkAnswer`, {answer: answer});
            alert(response.data.isCorrect ? 'Correct!' : 'Incorrect!');
        } catch (error) {
            console.error(error);
        }
    }
    
    async function getHint() {
        try{
            const response = await axios.get<NewHint>(`http://localhost:8080/puzzleService/hint`);
            addHint(response.data.hint);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPuzzle();
    }, []);

    if (puzzleQuestion === null || estimatedTime === 0 /* || description === null */) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className='puzzle'>
            <p>{puzzleQuestion}</p>
            {/*
                <Row>
                    TODO: Add description to the puzzle
                    {description}
                </Row>
            */}
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

export default MathPuzzle;