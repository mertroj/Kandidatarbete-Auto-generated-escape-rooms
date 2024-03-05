import axios from "axios";
import {useEffect, useState} from "react";
import Anagram from "../components/Anagram";
import Hinting from "../components/Hinting/hinting";
import MathPuzzle from "../components/MathPuzzle";
import { useParams } from "react-router-dom";

interface EscapeRoom {
    id: string;
    rooms: Room[]
}
interface Room {
    id: string;
    x: number;
    y: number;
    left: number | null;
    right: number | null;
    up: number | null;
    down: number | null;
    is_unlocked: boolean;
    slots: any[]
}

function EscapeRoomPage() {
    const [hintsList, setHintsList] = useState<string[]>([])
    const {gameId} = useParams()
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom | null>(null)
    
    const addHint = (hint: string) => {
        setHintsList([hint].concat(hintsList))
    }


    axios.get<EscapeRoom>('http://localhost:8080/fetchgame/?gameId=' + gameId).then((response) => {
        setEscapeRoom(response.data);
    }).catch((error) => {
        console.error(error);
    });
    
    
    if(escapeRoom === null) return (<div>Loading...</div>);
    return (
        <div>
            <Hinting hintsList={hintsList} />
            <p className="fixed-bottom fixed-left">Game ID: {gameId}</p>
        </div>
    );
}


export default EscapeRoomPage;