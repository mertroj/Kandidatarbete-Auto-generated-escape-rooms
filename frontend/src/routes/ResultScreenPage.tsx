import { Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {EscapeRoom, Room} from "../interfaces";
import {useParams} from "react-router-dom";

function ResultScreenPage() {
    const {gameId} = useParams();
    const [hintUsed, setHintUsed] = useState<number>(0);
    const [formattedTimeTaken, setFormattedTimeTaken] = useState<string>('00:00:00'); // Initialize with default value

    interface Puzzle {
        id: string;
        hintLevel: number;
    }
    const timeTaken: number = 0;

    const fetchData = async () => {
        try {
            const response = await axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId);
            const responseTimer = await axios.get<any>('http://localhost:8080/timer/elapsedTime');
            await axios.get<number>('http://localhost:8080/timer/pauseTimer');

            const rooms: Room[] = response.data.rooms;
            const timeTaken: number = responseTimer.data.elapsedTime;

            setHintUsed(0);
            rooms.forEach((room) => {
                room.slots.forEach((slot: Puzzle) => {
                    setHintUsed(prevHintUsed => prevHintUsed + slot.hintLevel);
                });
            });

            const formattedTime = formatMilliseconds(timeTaken);
            setFormattedTimeTaken(formattedTime); // Update the state with formatted time
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    function formatMilliseconds(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className='text-center mt-5 d-flex flex-column justify-content-center mx-auto'>
            <Row>
                <h1>Result Screen</h1>
            </Row>
            <Row>
                <p>Congratulations! You have successfully escaped the room!</p>
                <p>Time Taken: {formattedTimeTaken}</p>
                <p>Hints Used: {hintUsed}</p>
            </Row>
            <Row>
                <a href="/">Back to Home Page</a>
            </Row>
        </div>
    );
}

export default ResultScreenPage;
