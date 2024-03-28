import axios from "axios";
import {Button, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import HintingComponent from "../components/Hinting/hinting";
import { EscapeRoom, JigsawPuzzle, Room } from "../interfaces";
import PopupComponent from "../components/PopupComponent/Popup";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import JigsawComponent from "../components/Puzzles/JigsawPuzzleComponent";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";

function EscapeRoomPage() {
    const {gameId} = useParams()
    const navigate = useNavigate();
    const [hintsList, setHintsList] = useState<string[]>([])
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>()
    const [currentRoom, setCurrentRoom] = useState<Room>()
    const [backgroundImageURL, setBackgroundImageURL] = useState<string>('');
    const resultScreenUrl = `/escaperoom/${gameId}/result`;

    const [showEndPuzzle, setShowEndPuzzle] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    function checkEscapeRoomDone(): boolean {
        return escapeRoom ? escapeRoom.rooms.every((room) => room.puzzles.every((puzzle) => puzzle.isSolved)) : false
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

    function getEndPuzzleComponent() {
        //safe to use '!' since we checked for null in the render
        switch (escapeRoom?.endPuzzle.type) { 
            case 'jigsawpuzzle':
                return <JigsawComponent key={'end'} puzzle={escapeRoom?.endPuzzle as JigsawPuzzle} onSolve={handleSolve} />;
            default:
                return null;
        }
    }

    function addHint(hint: string) {
        setHintsList(hintsList => [...hintsList, hint]);
    }

    function fetchEscapeRoom() {
        axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
            console.log(response.data)
            setEscapeRoom(response.data);
            if(!currentRoom){
                setCurrentRoom(response.data.rooms[0]);
            }else{
                setCurrentRoom(response.data.rooms.find((room) => room.id === currentRoom.id));
            }
        }).catch((error) => {
            console.error(error);
            window.location.pathname = '/';
        })
    }

    function moveLeft() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.left));
        fetchImage();;
    }
    function moveRight() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.right));
        fetchImage();;
    }
    function moveUp() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.up));
        fetchImage();;
    }
    function moveDown() {
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.down));
        fetchImage();;
    }

    function handleSolve() {
        setShowNotification(true);
        // setTimeout(() => {
        //     navigate(resultScreenUrl);
        // }, 4000); // wait for 4 seconds
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
        if (checkEscapeRoomDone() && escapeRoom) {
            //navigate(resultScreenUrl);
            setShowEndPuzzle(true);
        }
    }, [escapeRoom]);

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
            {!showNotification && !showEndPuzzle &&
                <div className="w-100 d-flex flex-column justify-content-between mh-100 h-100">
                    {/*<Navbar/>*/}
                    {currentRoom ?
                        <RoomComponent room={currentRoom} addHint={addHint} updateRoom={fetchEscapeRoom}/> : null}
                </div>
            }
            { 
                showEndPuzzle && escapeRoom && getEndPuzzleComponent()
            }
            {!showNotification && <div className="panel-container">
                <HintingComponent hintsList={hintsList}/>
                <NavigationPanel
                    gameId={gameId}
                    currentRoom={currentRoom}
                    escapeRoom={escapeRoom}
                    moveLeft={moveLeft}
                    moveRight={moveRight}
                    moveUp={moveUp}
                    moveDown={moveDown}
                />
            </div>}
            {showNotification ?
                <PopupComponent
                    isOpen={showNotification}
                    onOpen={() => setShowNotification(true)}
                    onClose={() => setShowNotification(false)}
                    trigger={
                        <div>
                        </div>
                    }
                    children={
                        <div className={'text-center'}>
                                I think I see a way out!
                            <Row className={'mt-5'}>
                                <Button variant='outline-success' onClick={() => navigate(resultScreenUrl)}>Go towards the light</Button>
                            </Row>
                        </div>
                    }
                /> : null}
        </div>
    );
}


export default EscapeRoomPage;