import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { AnagramPuzzle } from '../../interfaces';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../assets/sounds/incorrect-answer.wav';
import withClickAudio from '../withClickAudioComponent';

const HintAudioClickButton = withClickAudio('button', hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

interface AnagramProps {
    puzzle: AnagramPuzzle;
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id:string, unlockedPuzzles: string[]) => void;
}

interface GuessResponse {
    result: boolean;
    unlockedPuzzles: string[];
}

function AnagramPuzzleComponent ({puzzle, i, updateRoom, notifyIncorrectAnswer, puzzleSolved}: AnagramProps) {
    const [answer, setAnswer] = useState<string>('');

    function handleChange(value: string) {
        setAnswer(value);
        sessionStorage.setItem(puzzle.id, value);
    }
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await axios.post<GuessResponse>(`http://localhost:8080/anagrams/checkAnswer`, {answer: answer, puzzleId: puzzle.id});
            let resp = response.data;
            if(resp.result){
                correctAudio.play();
                puzzleSolved(puzzle.id, resp.unlockedPuzzles)
            }else{
                incorrectAudio.currentTime = 0;
                incorrectAudio.play();
                notifyIncorrectAnswer();
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function getHint() {
        try{
            const response = await axios.get<string>(`http://localhost:8080/anagrams/hint/?puzzleId=${puzzle.id}`);
            let hint: string = response.data;
            if (hint === "No more hints.") return;
            puzzle.hints.push(hint);
            updateRoom();
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
