import axios from "axios";
import {Button, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import HintingComponent from "../components/Hinting/hinting";
import { EscapeRoom, JigsawPuzzle, Room } from "../interfaces";
import PopupComponent from "../components/PopupComponent/Popup";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import JigsawComponent from "../components/Puzzles/JigsawPuzzleComponent";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";

function EscapeRoomPage() {
    const {gameId} = useParams();
    const navigate = useNavigate();
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>();
    const [currentRoom, setCurrentRoom] = useState<Room>();
    const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
    const [backgroundImageURL, setBackgroundImageURL] = useState<string>('');
    const resultScreenUrl = `/escaperoom/${gameId}/result`;

    const [showEndPuzzle, setShowEndPuzzle] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    function checkEscapeRoomDone(): boolean {
        return escapeRoom ? escapeRoom.rooms.every((room) => room.puzzles.every((puzzle) => puzzle.isSolved)) : false;
    }

    async function fetchImage() {
        try {
            const response = await fetch(`http://localhost:8080/images/themeImage/?gameId=${gameId}`);
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            setBackgroundImageURL(objectURL);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }

    function update(): void {
        setEscapeRoom(structuredClone(escapeRoom))
    }

    function fetchEscapeRoom() {
        axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
            setEscapeRoom(response.data);
        }).catch((error) => {
            console.error(error);
            window.location.pathname = '/';
        })
    }

    function move(roomIdx: number) {
        setCurrentRoomIdx(roomIdx);
        fetchImage();
    }

    function handleSolve() {
        setShowNotification(true);
        // setTimeout(() => {
        //     navigate(resultScreenUrl);
        // }, 4000); // wait for 4 seconds
    }

    function getEndPuzzleComponent() {
        //safe to use '!' since we checked for null in the render
        switch (escapeRoom?.endPuzzle.type) { 
            case 'jigsawpuzzle':
                return <JigsawComponent key={'end'} puzzle={escapeRoom?.endPuzzle as JigsawPuzzle} onSolve={handleSolve} />;
            default:
                return null;
        }
    }

    useEffect(() => {
        fetchEscapeRoom();
    }, []);

    useEffect(() => {
        if(!backgroundImageURL){
            fetchImage();
        }
    }, [gameId]);

    useEffect(() => {
        if (escapeRoom)
            setCurrentRoom(escapeRoom.rooms[currentRoomIdx]);

        if (checkEscapeRoomDone() && escapeRoom) {
            //navigate(resultScreenUrl);
            setShowEndPuzzle(true);
        }
    }, [escapeRoom, currentRoomIdx]);

    return (
        <div className="d-flex w-100">
            <img
                src={backgroundImageURL}
                alt="background"
                style={{
                    opacity:'60%',
                    position:'absolute',
                    top:'0',
                    left:'0',
                    width:'100%',
                    height:'auto',
                    zIndex:'-1'
                }}/>
            {!showNotification && !showEndPuzzle &&
                <div className="w-100 d-flex flex-column justify-content-between mh-100 h-100">
                    {currentRoom && 
                        <RoomComponent 
                            room={currentRoom} 
                            updateRoom={update}
                        />
                    }
                </div>}
            {showEndPuzzle && escapeRoom && getEndPuzzleComponent()}
            {!showNotification && escapeRoom && currentRoom && 
                <div 
                    style={{height: "100vh", width:"400px", maxWidth: "400px"}} 
                    className="panel-container"
                >
                    <HintingComponent 
                        escapeRoom={escapeRoom}
                        currentRoom={currentRoom}
                    />
                    <NavigationPanel
                        gameId={gameId}
                        currentRoom={currentRoom}
                        escapeRoom={escapeRoom}
                        move={move}
                    />
                </div>}
            {showNotification && 
                <PopupComponent
                    isOpen={showNotification}
                    onOpen={() => setShowNotification(true)}
                    onClose={() => setShowNotification(false)}
                    trigger={<div></div>}
                    children={
                        <div className={'text-center'}>
                                I think I see a way out!
                            <Row className={'mt-5'}>
                                <Button variant='outline-success' onClick={() => navigate(resultScreenUrl)}>Go towards the light</Button>
                            </Row>
                        </div>
                    }
                />}
        </div>
    );
}


export default EscapeRoomPage;