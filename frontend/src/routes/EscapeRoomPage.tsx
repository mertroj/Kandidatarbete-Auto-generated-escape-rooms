import axios from "axios";
import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { EscapeRoom, Room } from "../interfaces"
import Hinting from "../components/Hinting/hinting";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import Navbar from '../components/Navbar/Navbar';
import {Row} from "react-bootstrap";

function EscapeRoomPage() {
    const {gameId} = useParams()
    const [hintsList, setHintsList] = useState<string[]>([])
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>()
    const [currentRoom, setCurrentRoom] = useState<Room>()
    const resultScreenUrl = `/escaperoom/${gameId}/result`;


    function addHint(hint: string) {
        setHintsList(hintsList => [...hintsList, hint])
    }

    function fetchEscapeRoom() {
        axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
            setEscapeRoom(response.data);
            setCurrentRoom(response.data.rooms[0])
        }).catch((error) => {
            console.error(error)
            window.location.pathname = '/'
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

                {currentRoom && escapeRoom ? <div className="d-flex justify-content-center">

                    {currentRoom.left ? <button onClick={moveLeft} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.left)}>Move Left</button> : null}

                    {currentRoom.right ? <button onClick={moveRight} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.right)}>Move Right</button> : null}

                    {currentRoom.up ? <button onClick={moveUp} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.up)}>Move Up</button> : null}

                    {currentRoom.down ? <button onClick={moveDown} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.down)}>Move Down</button> : null}

                </div> : null}
                
                <p className="w-100">Game ID: {gameId}</p>

                <Row>
                    {/* Using the constructed URL */}
                    <a href={resultScreenUrl}>THE VOID CONSUMES ALL THE LIGHT AND JOY FROM EVERYONE. DON'T TRUST THE NEWS!</a>
                </Row>

            </div>

            <Hinting hintsList={hintsList} />
        </div>
    );
}


export default EscapeRoomPage;