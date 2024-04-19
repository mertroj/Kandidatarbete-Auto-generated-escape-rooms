import React, {useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { OperatorsMathPuzzle } from '../../interfaces';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import correctSound from '../../assets/sounds/correct-answer.wav';
import incorrectSound from '../../assets/sounds/incorrect-answer.wav';
import withClickAudio from '../withClickAudioComponent';
import { VolumeContext } from "../../utils/volumeContext";

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
    const {volume} = React.useContext(VolumeContext);
    const [answer, setAnswer] = useState<string[]>(Array(puzzle.numberOfOperators).fill('+'));

    async function handleSubmit() {
        try{
            const response = await axios.post<GuessResponse>(`http://localhost:8080/operatorMathPuzzles/checkAnswer`, {
                answer: answer.join(''), // join the elements of the answer array into a string
                puzzleId: puzzle.id
            });
            let resp = response.data;
            if(resp.result){
                correctAudio.currentTime = 0;
                correctAudio.volume = volume;
                correctAudio.play();
                puzzleSolved(puzzle.id, resp.unlockedPuzzles)
            }else{
                incorrectAudio.currentTime = 0;
                incorrectAudio.volume = volume;
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

    const handleSelectChange = (index: number, value: string) => {
        answer[index] = value;
        setAnswer([...answer]);
    };

    return (
        <div className='puzzle-card'>
            <p className='puzzle-number'>#{i}</p>
            <p>{puzzle.description}</p>
            <p>{puzzle.question}</p>
            <div className='w-100 d-flex justify-content-around'>
                {Array.from({length: puzzle.numberOfOperators}).map((_, index) => (
                    <select key={index} onChange={e => handleSelectChange(index, e.target.value)}>
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">×</option>
                        <option value="/">÷</option>
                    </select>
                ))}
            </div>
            <div>
                <button className='w-100' style={{marginTop: '20px'}} onClick={() => handleSubmit()}>Test answer</button>
                <HintAudioClickButton className="w-100" onClick={async() => getHint()}>
                    Get a hint
                </HintAudioClickButton>
            </div>
        </div>
    );
}

export default OperatorMathPuzzleComponent;