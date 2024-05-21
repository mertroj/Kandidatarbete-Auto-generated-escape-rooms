import {useEffect, useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import { OperatorsMathPuzzle, backendURL } from '../../interfaces';
import hintClickSound from '../../assets/sounds/arcade-hint-click.wav';
import withClickAudio from '../withClickAudioComponent';
import { useParams } from 'react-router-dom';

const HintAudioClickButton = withClickAudio('button', hintClickSound);

interface OperatorMathPuzzleProps {
    puzzle: OperatorsMathPuzzle;
    i: number;
    incorrectAnswer: () => void;
}

function OperatorMathPuzzleComponent ({puzzle, i, incorrectAnswer}: OperatorMathPuzzleProps) {
    const {gameId} = useParams();
    const [answer, setAnswer] = useState<string[]>(Array(puzzle.numberOfOperators).fill('+'));

    async function handleSubmit() {
        try{
            const response = await axios.post<boolean>(backendURL + `/operatorMathPuzzles/checkAnswer`, {
                gameId,
                answer, 
                puzzleId: puzzle.id
            });
            if(!response.data){
                incorrectAnswer();
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function getHint() {
        try {
            const response = await axios.get<string | null>(backendURL + `/operatorMathPuzzles/hint/?`, {
                params: {
                    gameId,
                    puzzleId: puzzle.id
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleSelectChange = (index: number, value: string) => {
        answer[index] = value;
        setAnswer([...answer]);
        sessionStorage.setItem(puzzle.id, answer.join(''));
    };

    useEffect(() => {
        let prevAnswer = sessionStorage.getItem(puzzle.id);
        if (prevAnswer) setAnswer(prevAnswer.split(''));
    }, [])

    return (
        <div className='puzzle-card'>
            <p className='puzzle-number'>#{i}</p>
            <p>{puzzle.description}</p>
            <p>{puzzle.question}</p>
            <div className='w-100 d-flex justify-content-around'>
                {answer.map((val, index) => (
                    <select 
                        key={index} 
                        onChange={e => handleSelectChange(index, e.target.value)}
                        value={val}
                    >
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