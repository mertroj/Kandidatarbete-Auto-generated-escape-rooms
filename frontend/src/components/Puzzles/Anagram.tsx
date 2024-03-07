import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'

interface AnagramProps {
    estimatedTime: number;
    anagramQuestion: string;
    description: string;
}
interface SubmittedAnswer{
    isCorrect: boolean;
}
interface NewHint{
    hint: string;
}

function AnagramComponent ({addHint}: {addHint : Function}) {
    const [anagramQuestion, setAnagramQuestion] = useState<string>();
    const [estimatedTime, setTime] = useState<number>(0);
    const [answer, setAnswer] = useState<string>();
    const [description, setDescription] = useState<string>();

    async function fetchAnagram() {
        try {
            const response = await axios.get<AnagramProps>(
                `http://localhost:8080/placeholder/info`
            );
            setAnagramQuestion(response.data.anagramQuestion);
            setTime(response.data.estimatedTime);
            setDescription(response.data.description);

        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post<SubmittedAnswer>(`http://localhost:8080/placeholder/checkAnswer`, {answer: answer});
            if (response.data.isCorrect) {
                alert('Correct!');
            } else {
                alert('Incorrect!');
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function handleHintClick() {
        try{
            const response = await axios.get<NewHint>(`http://localhost:8080/placeholder/hint`);
            addHint(response.data.hint);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAnagram();
    }, []);

    if (anagramQuestion === null || estimatedTime === 0 /* || description === null */) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className='puzzle'>
            <p>{description}</p>
            <p>{anagramQuestion}</p>
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

export default AnagramComponent;
