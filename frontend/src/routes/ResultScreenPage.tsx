import { Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {EscapeRoom, Puzzle, Room} from "../interfaces";
import {useParams, Link} from 'react-router-dom';

function ResultScreenPage() {
    const {gameId} = useParams();
    const [hintUsed, setHintUsed] = useState<number>(0);
    const [formattedTimeTaken, setFormattedTimeTaken] = useState<string>('00:00:00');

    const fetchEscapeRoom = async () => {
        try {
            const response = await axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId);
            const escapeRoom = response.data;
            const rooms: Room[] = escapeRoom.rooms;
            setHintUsed(rooms.reduce((acc, room) => acc + room.puzzles.reduce((acc, puzzle) => {
                if (typeof puzzle.hints === "number") 
                    return acc + puzzle.hints
                return acc + puzzle.hints.length
            }, 0), 0));
            const time: string = formatMilliseconds(escapeRoom.timer.elapsedTime);
            setFormattedTimeTaken(time);
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
        const unblock = window.history.pushState(null, "", window.location.href);

        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };

        fetchEscapeRoom();

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
