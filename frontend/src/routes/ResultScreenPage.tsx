import { Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function ResultScreenPage() {
    const [timeTaken, setTimeTaken] = useState('');
    const [hintsUsed, setHintsUsed] = useState(0);
    const [difficulty, setDifficulty] = useState('');
    const history = useHistory();

    useEffect(() => {
        // Make API call to fetch result data
        axios.get('http://localhost:8080/resultData')
            .then(response => {
                const { timeTaken, hintsUsed, difficulty } = response.data;
                setTimeTaken(timeTaken);
                setHintsUsed(hintsUsed);
                setDifficulty(difficulty);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const goToHomePage = () => {
        // Redirect to home page
        history.push('/');
    };

    return (
        <div>
            <Row>
                <h1>Result Screen</h1>
            </Row>
            <Row>
                <p>Congratulations! You have successfully escaped the room!</p>
                <p>Time Taken: {timeTaken}</p>
                <p>Hints Used: {hintsUsed}</p>
                <p>Difficulty: {difficulty}</p>
            </Row>
            <Row>
                {/* Button to go back to the home page */}
                <Button onClick={goToHomePage}>Go to Home</Button>
            </Row>
        </div>
    );
}

export default ResultScreenPage;
