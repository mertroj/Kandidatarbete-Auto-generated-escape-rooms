import axios from "axios";
import {useEffect, useState} from "react";
import Anagram from "./Anagram";
import Hinting from "../components/Hinting/hinting";

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

    // if(room === null) return (<div>Loading...</div>);

    const [hintsList, setHintsList] = useState(['Hint 1','Hint 2'])

    const addHint = (hint: string) => {
        setHintsList([hint].concat(hintsList))
    }

    return (
        <div>
            {room}

            <Hinting hintsList={hintsList} />
        </div>
    );
}


export default PuzzleStart;