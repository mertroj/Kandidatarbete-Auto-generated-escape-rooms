import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from './PopupComponent/Popup';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Hint from './HintComponent/hint';

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

function AnagramComponent () {
    const [anagramQuestion, setAnagramQuestion] = useState<string | null>(null);
    const [estimatedTime, setTime] = useState<number>(0);
    const [answer, setAnswer] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [hint, setHint] = useState<string>('');

    async function fetchAnagram() {
        try {
            const response = await axios.get<AnagramProps>(
                `http://localhost:8080/placeholder/info`
            );
            setAnagramQuestion(response.data.anagramQuestion);
            setTime(response.data.estimatedTime);

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
            setHint(response.data.hint);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1 id='titleTime'>You have approx. {estimatedTime} minutes</h1>
            <Popup
                trigger={<Button variant="primary">Show Anagram</Button>}
                children=
                    {
                        <Container className='text-center d-flex flex-column min-vh-100'>
                            <Row className='mb-3 justify-content-center'>
                                {anagramQuestion}
                            </Row>
                            <Row>
                                {/*
                                TODO: Add description to the anagram
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

export default AnagramComponent;
