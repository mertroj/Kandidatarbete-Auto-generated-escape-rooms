import { Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {EscapeRoom, Room} from "../interfaces";
import {useParams, Link} from 'react-router-dom';

function ResultScreenPage() {
    const {gameId} = useParams();
    const [hintUsed, setHintUsed] = useState<number>(0);
    const [formattedTimeTaken, setFormattedTimeTaken] = useState<string>('00:00:00');

    interface PuzzleProps {
        hintLevel: number;
    }
    interface fetchResponse{
        escapeRoom: EscapeRoom
    }

    async function fetchTimeTaken() {
        try {

            const storedTimeTaken = sessionStorage.getItem('timeTaken');
    
            if (storedTimeTaken) {
                setFormattedTimeTaken(storedTimeTaken);
            } else {
                const response = await axios.get<fetchResponse>('http://localhost:8080/escaperoom/?gameId=' + gameId);
                const escapeRoom: EscapeRoom = response.data.escapeRoom;
                const time: string = formatMilliseconds(escapeRoom.timer.elapsedTime);
                setFormattedTimeTaken(time);
                sessionStorage.setItem('timeTaken', time);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchEscapeRoom = async () => {
        try {
            const response = await axios.get<fetchResponse>('http://localhost:8080/escaperoom/?gameId=' + gameId);

            const rooms: Room[] = response.data.escapeRoom.rooms;

            setHintUsed(0);
            rooms.forEach((room) => {
                room.puzzles.forEach((slot: PuzzleProps) => {
                    setHintUsed(prevHintUsed => prevHintUsed + slot.hintLevel);
                });
            });

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
        //Add current page to the history stack
        const unblock = window.history.pushState(null, "", window.location.href);

        //When navigating back, add current page to the history stack again
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };

        fetchEscapeRoom();
        fetchTimeTaken();

        //When done with the page, remove the back navigation listnere/preventer
        return () => {
            window.onpopstate = null;
        };
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
                <Link to="/" onClick={() => sessionStorage.removeItem('timeTaken')}>Back to Home Page</Link>
            </Row>
        </div>
    );
}

export default ResultScreenPage;
