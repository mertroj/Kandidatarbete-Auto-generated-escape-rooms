import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { AnagramPuzzle, backendURL } from '../../interfaces';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import withClickAudio from '../withClickAudioComponent';
import { useParams } from 'react-router-dom';

const HintAudioClickButton = withClickAudio('button', hintClickSound);

interface AnagramProps {
    puzzle: AnagramPuzzle;
    i: number;
    incorrectAnswer: () => void;
}

function AnagramPuzzleComponent ({puzzle, i, incorrectAnswer}: AnagramProps) {
    const {gameId} = useParams();
    const [answer, setAnswer] = useState<string>('');

    function handleChange(value: string) {
        setAnswer(value);
        sessionStorage.setItem(puzzle.id, value);
    }
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await axios.post<boolean>(backendURL + '/anagrams/checkAnswer', {
                gameId,
                puzzleId: puzzle.id,
                answer
            });
            if (!response.data)
                incorrectAnswer();
        } catch (error) {
            console.error(error);
        }
    }
    async function getHint() {
        try {
            const response = await axios.get<string | null>(backendURL + `/anagrams/hint/?`, {
                params: {
                    gameId,
                    puzzleId: puzzle.id
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        let prevAnswer = sessionStorage.getItem(puzzle.id);
        if (prevAnswer) setAnswer(prevAnswer);
    }, [])

    return (
        <div className='puzzle-card'>
            <p className='puzzle-number'>#{i}</p>
            <p>{puzzle.description}</p>
            <p>{puzzle.question}</p>
            <div>
                <form action="" onSubmit={handleSubmit}>
                    <input 
                        className='w-100' 
                        type="text" 
                        value={answer}
                        placeholder='Enter the answer here' 
                        onChange={e => handleChange(e.target.value)} 
                    />
                    <button className='w-100' type='submit'>Test answer</button>
                </form>
                <HintAudioClickButton className="w-100" onClick={async() => getHint()}>
                    Get a hint
                </HintAudioClickButton>
            </div>
        </div>
    );
}

export default AnagramPuzzleComponent;
