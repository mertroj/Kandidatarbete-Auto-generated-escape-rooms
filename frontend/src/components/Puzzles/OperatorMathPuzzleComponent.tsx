import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { OperatorsMathPuzzle } from '../../interfaces';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../assets/sounds/incorrect-answer.wav';
import withClickAudio from '../withClickAudioComponent';

const HintAudioClickButton = withClickAudio('button', hintClickSound);
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

interface OperatorMathPuzzleProps {
    puzzle: OperatorsMathPuzzle;
    i: number;
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (id:string, unlockedPuzzles: string[]) => void;
}

interface GuessResponse {
    result: boolean;
    unlockedPuzzles: string[];
}

interface HintI {
    hint: string;
    question: string;
}

function OperatorMathPuzzleComponent ({puzzle, i, updateRoom, notifyIncorrectAnswer, puzzleSolved}: OperatorMathPuzzleProps) {
    const [answer, setAnswer] = useState<string>();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post<GuessResponse>(`http://localhost:8080/operatorMathPuzzles/checkAnswer`, {answer, puzzleId: puzzle.id});
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
        <div className='puzzle-card'>
            <p className='puzzle-number'>#{i}</p>
            <p>{puzzle.description}</p>
            <p>{puzzle.question}</p>
            <div>
                <form action="" onSubmit={handleSubmit}>
                    <input className='w-100' type="text" placeholder='Enter the answer here' onChange={e => setAnswer(e.target.value)} />
                    <button className='w-100' type='submit'>Test answer</button>
                </form>
                <HintAudioClickButton className="w-100" onClick={async() => getHint()}>
                    Get a hint
                </HintAudioClickButton>
            </div>
        </div>
        
    );
}

export default OperatorMathPuzzleComponent;