import React, {useEffect, useState} from 'react';
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
    addHint: Function;
    puzzle: OperatorsMathPuzzle;
    onSubmit: Function;
}
function OperatorMathPuzzleComponent (operatorMathPuzzleProps: OperatorMathPuzzleProps) {
    const {puzzle, addHint, onSubmit} = operatorMathPuzzleProps;
    const [numberOfOperands, setNumberOfOperands] = useState<number>(1  );
    const [answer, setAnswer] = useState<Array<string>>(Array(numberOfOperands - 1).fill('+'));


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:8080/operatorMathPuzzles/checkAnswer`, {
                answer: answer.join(''), // join the elements of the answer array into a string
                puzzleId: puzzle.id
            });
            if(response.data){
                correctAudio.play();
                onSubmit(true);
            }else{
                incorrectAudio.currentTime = 0;
                incorrectAudio.play();
                onSubmit(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function getHint() {
        try {
            const response = await axios.get(`http://localhost:8080/operatorMathPuzzles/hint/?puzzleId=${puzzle.id}`);
            addHint(response.data);
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        async function fetchOperandAmount() {
            try {
                const response = await axios.get(`http://localhost:8080/operatorMathPuzzles/info?puzzleId=${operatorMathPuzzleProps.puzzle.id}`);
                setNumberOfOperands(response.data.numberOfOperands);
                setAnswer(Array(response.data.numberOfOperands - 1).fill('+'));
            } catch (error) {
                console.error(error);
            }
        }

        fetchOperandAmount();
    }, [operatorMathPuzzleProps.puzzle.id]);

    const handleSelectChange = (index: number, value: string) => {
        setAnswer(prevAnswer => {
            const newAnswer = [...prevAnswer];
            newAnswer[index] = value;
            return newAnswer;
        });
    };
    const dropdowns = Array.from({ length: numberOfOperands - 1 }).map((_, index) => (
        <select key={index} onChange={e => handleSelectChange(index, e.target.value)}>
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
        </select>
    ));

    return (
        <div className='puzzle'>
            <p>{puzzle.description}</p>
            <p>{puzzle.question}</p>
            <div>
                <form action="" onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {dropdowns.map((dropdown, index) => (
                            <div key={index} style={{ margin: '0 10px' }}>
                                {dropdown}
                            </div>
                        ))}
                    </div>
                    <button className='w-100' type='submit' style={{ marginTop: '20px' }}>Test answer</button>
                </form>
                <HintAudioClickButton className="w-100" onClick={async() => getHint()}>
                    Get a hint
                </HintAudioClickButton>
            </div>
        </div>
    );
}

export default OperatorMathPuzzleComponent;