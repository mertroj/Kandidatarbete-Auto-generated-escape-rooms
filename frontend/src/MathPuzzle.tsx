import React, { useEffect, useState } from 'react';
import axios from 'axios';

export interface MathPuzzleProps {
    estimatedTime: number;
    puzzleQuestion: string;
}
export interface SubmittedAnswer{
    isCorrect: boolean;
}

function MathPuzzle () {
    const [puzzleQuestion, setPuzzleQuestion] = useState<string | null>(null);
    const [estimatedTime, setTime] = useState<number>(0);
    const [answer, setAnswer] = useState<string | null>(null);

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

    useEffect(() => {
        fetchPuzzle();
    }, []);

    if (puzzleQuestion === null || estimatedTime === 0) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>You have approx. {estimatedTime} minutes</h1>
            <span>
                {puzzleQuestion}
                <form onSubmit={async e => {
                    e.preventDefault();
                    try{
                        const response = await axios.post<SubmittedAnswer>(`http://localhost:8080/puzzleService/checkAnswer`, {answer: answer});
                        if (response.data.isCorrect) {
                            alert('Correct!');
                        } else {   
                            alert('Incorrect!');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }}>
                    <input name="answer" type="text" onChange={e => setAnswer(e.target.value)}/>
                </form>
            </span>
        </div>
    );
}

export default MathPuzzle;