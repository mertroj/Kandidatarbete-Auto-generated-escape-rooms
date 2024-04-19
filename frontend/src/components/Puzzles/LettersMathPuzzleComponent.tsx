import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { LettersMathPuzzle } from '../../interfaces';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../assets/sounds/incorrect-answer.wav';
import withClickAudio from '../withClickAudioComponent';
import { VolumeContext } from "../../utils/volumeContext";

const HintAudioClickButton = withClickAudio('button', hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

interface LettersMathPuzzleProps {
    puzzle: LettersMathPuzzle;
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id:string, unlockedPuzzles: string[]) => void;
}

interface GuessResponse {
    result: boolean;
    unlockedPuzzles: string[];
}

function LettersMathPuzzleComponent ({puzzle, i, updateRoom, notifyIncorrectAnswer, puzzleSolved}: LettersMathPuzzleProps) {
    const {volume} = React.useContext(VolumeContext);
    const [answer, setAnswer] = useState<string>('');

    function handleChange(value: string) {
        setAnswer(value);
        sessionStorage.setItem(puzzle.id, value);
    }
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post<GuessResponse>(`http://localhost:8080/lettersMathPuzzles/checkAnswer`, {answer: answer, puzzleId: puzzle.id});
            let resp = response.data;
            if(resp.result){
                correctAudio.currentTime = 0;
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
            const response = await axios.get(`http://localhost:8080/lettersMathPuzzles/hint/?puzzleId=${puzzle.id}`);
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

    useEffect(() => {
        correctAudio.volume = volume;
        incorrectAudio.volume = volume;
    }, [volume]);

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

export default LettersMathPuzzleComponent;