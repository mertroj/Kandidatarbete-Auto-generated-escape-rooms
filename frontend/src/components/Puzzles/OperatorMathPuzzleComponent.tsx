import React, {useEffect, useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'
import {OperatorsMathPuzzle} from '../../interfaces';

interface OperatorMathPuzzleProps {
    addHint: Function;
    puzzle: OperatorsMathPuzzle;
    onSolve: Function;
}
function OperatorMathPuzzleComponent(operatorMathPuzzleProps: OperatorMathPuzzleProps) {
    const {puzzle, addHint, onSolve} = operatorMathPuzzleProps;
    const [numberOfOperands, setNumberOfOperands] = useState<number>(1  );
    const [answer, setAnswer] = useState<Array<string>>(Array(numberOfOperands - 1).fill('+'));

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/operatorMathPuzzles/checkAnswer`, {
                answer: answer.join(''), // join the elements of the answer array into a string
                puzzleId: puzzle.id
            });
            if (response.data) {
                alert('Correct!');
                onSolve();
            } else {
                alert('Incorrect!');
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
                <button className="w-100" onClick={async () => getHint()}>
                    Get a hint
                </button>
            </div>
        </div>
    );
}

export default OperatorMathPuzzleComponent;