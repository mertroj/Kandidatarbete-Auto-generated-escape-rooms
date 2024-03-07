import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'

interface MastermindPuzzleProps {
    estimatedTime: number;
    mastermindQuestion: string;
    description: string;
}
interface SubmittedAnswer{
    isCorrect: Number[];
}
interface NewHint{
    hint: string; 
}

function MastermindPuzzle ({addHint}: {addHint : Function}) {
    const [mastermindQuestion, setMastermindQuestion] = useState<string>();
    const [estimatedTime, setTime] = useState<number>(0);
    const [answer, setAnswer] = useState<string>();
    const [description, setDescription] = useState<string>();

    async function fetchMastermind() {
        try {
            const response = await axios.get<MastermindPuzzleProps>(
                `http://localhost:8080/mastermindService/info`
            );
            setMastermindQuestion(response.data.mastermindQuestion);
            setTime(response.data.estimatedTime);
            setDescription(response.data.description);

        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            let feedback: String = '';
            const response = await axios.post<SubmittedAnswer>(`http://localhost:8080/mastermindService/checkAnswer`, {answer: answer});
            /*for(let i = 0; i < response.data.isCorrect.length; i++){
                if(response.data.isCorrect[i] == 1) {
                    feedback += '1';
                }
                else if(response.data.isCorrect[i] == 2) {
                    feedback += '2';
                }
                else if(response.data.isCorrect[i] == 3) {
                    feedback += '3';
                }
            }*/
            alert(response.data.isCorrect);
        } catch (error) {
            console.error(error);
        }
    }
    
    async function handleHintClick() {
        try{
            const response = await axios.get<NewHint>(`http://localhost:8080/mastermindService/hint`);
            addHint(response.data.hint);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchMastermind();
    }, []);

    if (mastermindQuestion === null || estimatedTime === 0 /* || description === null */) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className='puzzle'>
            <p>{description}</p>
            <p>{mastermindQuestion}</p>
            <form action="" onSubmit={handleSubmit}>
                <input className='w-100' type="text" placeholder='Enter the answer here' onChange={e => setAnswer(e.target.value)} />
                <button className='w-100' type='submit'>Test answer</button>
                <button className="w-100" onClick={async() => handleHintClick()}>
                    Get a hint
                </button>
            </form>
        </div>
        
    );
}


export default MastermindPuzzle;