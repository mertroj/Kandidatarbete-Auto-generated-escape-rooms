import axios from "axios";
import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { EscapeRoom, Room } from "../interfaces"
import Hinting from "../components/Hinting/hinting";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import Navbar from '../components/Navbar/Navbar';
import {Row} from "react-bootstrap";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";

function EscapeRoomPage() {
    const {gameId} = useParams()
    const [hintsList, setHintsList] = useState<string[]>([])
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>()
    const [currentRoom, setCurrentRoom] = useState<Room>()
    const [backgroundImageURL, setBackgroundImageURL] = useState<string>('');
    const resultScreenUrl = `/escaperoom/${gameId}/result`;

    async function fetchImage() {
        const response = await fetch(`http://localhost:8080/images/themeImage/?gameId=${gameId}`);
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        setBackgroundImageURL(objectURL);
    }

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
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.left));
        fetchImage();
    }
    function moveRight() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.right));
        fetchImage();
    }
    function moveUp() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.up));
        fetchImage();
    }
    function moveDown() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.down));
        fetchImage();
    }

    useEffect(() => {
        fetchEscapeRoom()
    }, []);
    
    useEffect(() => {
        if(!backgroundImageURL){
            fetchImage();
        }
    }, [gameId]);
    
    return (
        <div className="d-flex w-100">
            <img 
                src={backgroundImageURL} 
                alt="background image" 
                style={{
                    opacity:'60%', 
                    position:'absolute',
                    top:'0',
                    left:'0',
                    width:'100%',
                    height:'auto',
                    zIndex:'-1'
            }}/>
            <div className="w-100 d-flex flex-column justify-content-between mh-100 h-100">
                {/*<Navbar/>*/}
                {currentRoom ? <RoomComponent room={currentRoom} addHint={addHint} /> : null}

                {
                /*Using the constructed URL. 
                TODO: To be removed and be redirected automatically when done */
                }
                <a href={resultScreenUrl}>THE VOID CONSUMES ALL THE LIGHT AND JOY FROM EVERYONE. DON'T TRUST THE NEWS!</a>

            </div>

            <div className="panel-container">
                <Hinting hintsList={hintsList} />
                <NavigationPanel 
                    gameId={gameId} 
                    currentRoom={currentRoom}
                    escapeRoom={escapeRoom}
                    moveLeft={moveLeft}
                    moveRight={moveRight}
                    moveUp={moveUp}
                    moveDown={moveDown}
                />
            </div>
        </div>
    );
}


export default EscapeRoomPage;