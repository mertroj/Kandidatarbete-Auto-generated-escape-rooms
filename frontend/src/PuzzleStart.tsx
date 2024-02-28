import axios from "axios";
import {useEffect, useState} from "react";
import Anagram from "./Anagram";

interface Room {
    room: string;
}

function PuzzleStart() {
    const [room, setRoom] = useState<string | null>(null);
    async function fetchPuzzle() {
        try {
            const response = await axios.get<Room>('http://localhost:8080/'); // fix here if necessary
            setRoom(response.data.room);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPuzzle();
    }, []);

    if(room === null) return (<div>Loading...</div>);


    return (
        <div>
            <Anagram/>
        </div>
    );
}


export default PuzzleStart;