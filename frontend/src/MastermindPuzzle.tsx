import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from './PopupComponent/Popup';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Hint from './HintComponent/hint';

interface MastermindPuzzleProps {
    estimatedTime: number;
    puzzleQuestion: string;
    description: string;
}
interface SubmittedAnswer{
    isCorrect: Number[];
}
interface NewHint{
    hint: string; 
}

function MastermindPuzzle () {
    const [puzzleQuestion, setPuzzleQuestion] = useState<string | null>(null);
    const [estimatedTime, setTime] = useState<number>(0);
    const [answer, setAnswer] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [hint, setHint] = useState<string>('');

    async function fetchPuzzle() {
        try {
            const response = await axios.get<MastermindPuzzleProps>(
                `http://localhost:8080/puzzleService/info`
            );
            setPuzzleQuestion(response.data.puzzleQuestion);
            setTime(response.data.estimatedTime);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPuzzle();
    }, []);

    if (puzzleQuestion === null || estimatedTime === 0 /* || description === null */) {
        return <h1>Loading...</h1>;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try{
            const response = await axios.post<SubmittedAnswer>(`http://localhost:8080/puzzleService/checkAnswer`, {answer: answer});
            for(let i = 0; i < response.data.isCorrect.length; i++){
                if(response.data.isCorrect[i] == 1) {
                    
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function handleHintClick() {
        try{
            const response = await axios.get<NewHint>(`http://localhost:8080/puzzleService/hint`);
            setHint(response.data.hint);
        } catch (error) {
            console.error(error);{/*  */}
        }
    }

    return (
        <div>
            <h1 id='titleTime'>You have approx. {estimatedTime} minutes</h1>
            <Popup
                trigger={<Button variant="primary">Show Puzzle</Button>}
                children=
                {
                    <Container className='text-center d-flex flex-column min-vh-100'>
                        <Row className='mb-3 justify-content-center'>
                            {puzzleQuestion}
                        </Row>
                        <Row>
                            {/*
                                TODO: Add description to the puzzle
                                {description}
                            */}
                        </Row>
                        <Row className='mb-3 justify-content-center'>
                            <Hint hint={hint}/>
                        </Row>
                        <Row>
                            <Col>
                                <Form onSubmit={async e => handleSubmit(e)}>
                                    <Form.Control className='w-100' name="answer" type="text" onChange={e => setAnswer(e.target.value)}/>
                                </Form>
                            </Col>
                        </Row>
                        <Row className='mt-auto flex-grow-1 align-items-center'>
                            <Button variant='btn btn-outline-danger btn-sm' onClick={async() => handleHintClick()}>
                                Get a hint
                            </Button>
                        </Row>
                    </Container>
                }
            />
        </div>
        
    );
}

export default MastermindPuzzle;