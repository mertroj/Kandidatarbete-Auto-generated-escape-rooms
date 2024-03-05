import axios from "axios";
import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { EscapeRoom, Room } from "../interfaces"
import Hinting from "../components/Hinting/hinting";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import Navbar from '../components/Navbar/Navbar';

function EscapeRoomPage() {
    const [hintsList, setHintsList] = useState<string[]>([])
    const {gameId} = useParams()
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>()
    const [currentRoom, setCurrentRoom] = useState<Room>()
    
    function addHint(hint: string) {
        setHintsList([hint].concat(hintsList))
    }

    function fetchEscapeRoom() {
        axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
            setEscapeRoom(response.data);
            setCurrentRoom(response.data.rooms[0])
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }

    function moveLeft() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.left))
    }
    function moveRight() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.right))
    }
    function moveUp() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.up))
    }
    function moveDown() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.down))
    }

    useEffect(() => {
        fetchEscapeRoom()
    }, [])
    
    return (
        <div className="d-flex w-100">
            <div className="w-100 d-flex flex-column justify-content-between mh-100">
                <Navbar/>
                {currentRoom ? <RoomComponent room={currentRoom} addHint={addHint} /> : null}
                {currentRoom?.left ? <button onClick={moveLeft} disabled={!escapeRoom?.rooms.find((room) => room.id === currentRoom.left)}>Move Left</button> : null}
                {currentRoom?.right ? <button onClick={moveRight} disabled={!escapeRoom?.rooms.find((room) => room.id === currentRoom.right)}>Move Right</button> : null}
                {currentRoom?.up ? <button onClick={moveUp} disabled={!escapeRoom?.rooms.find((room) => room.id === currentRoom.up)}>Move Up</button> : null}
                {currentRoom?.down ? <button onClick={moveDown} disabled={!escapeRoom?.rooms.find((room) => room.id === currentRoom.down)}>Move Down</button> : null}
                <p className="w-100">Game ID: {gameId}</p>
            </div>

            <Hinting hintsList={hintsList} />
        </div>
    );
}


export default EscapeRoomPage;