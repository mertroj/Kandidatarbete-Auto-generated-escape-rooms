import axios from "axios";
import {Button, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import './EscapeRoomPage.css';
import { useParams, useNavigate } from "react-router-dom";
import HintingComponent from "../components/Hinting/hinting";
import { EscapeRoom, JigsawPuzzle, Room } from "../interfaces";
import PopupComponent from "../components/PopupComponent/Popup";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import JigsawComponent from "../components/Puzzles/JigsawPuzzleComponent";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";
import FeedbackComponent from "../components/Feedback/FeedbackComponent";
import {FeedbackMessages} from "../interfaces";

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
    const [feedbackList, setFeedbackList] = useState<Array<{id: number, message: FeedbackMessages, bgCol:string}>>([]);
    let feedbackId = 0;

    interface escapeRoomFetchResponse{
        escapeRoom: EscapeRoom,
        solvedPuzzles: string[],
        unlockedPuzzles: string[]
    }
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
        setHintsList(hintsList => [hint, ...hintsList])
    }

    function notifySolvedPuzzles(solvedPuzzles: string[]) {
        for(let i = 0; i < solvedPuzzles.length; i++){
            setFeedbackList(feedbackList => [...feedbackList, {id: feedbackId++, message: FeedbackMessages.CORRECT, bgCol:'#00C851'}]);
        }
    }
    function notifyUnlockedPuzzles(unlockedPuzzles: string[]){
        for(let i = 0; i < unlockedPuzzles.length; i++){
            setFeedbackList(feedbackList => [...feedbackList, {id: feedbackId++, message: FeedbackMessages.UNLOCKED, bgCol: '#0d6efd'}]);
        }
    }
    function handleGeneralPuzzleSubmit(res: boolean){
        if (res) {
            fetchEscapeRoom();
        } else {
            setFeedbackList(feedbackList => [...feedbackList, {id: feedbackId++, message: FeedbackMessages.INCORRECT, bgCol: '#ff4444'}]);
        }
    }

    function fetchEscapeRoom() {
        axios.get<escapeRoomFetchResponse>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
            let er = response.data.escapeRoom;
            setEscapeRoom(er);
            if(!currentRoom){
                setCurrentRoom(er.rooms[0]);
            }else{
                setCurrentRoom(er.rooms.find((room) => room.id === currentRoom.id));
            }
            if(response.data.unlockedPuzzles.length !== 0){
                notifySolvedPuzzles(response.data.solvedPuzzles);
                notifyUnlockedPuzzles(response.data.unlockedPuzzles);
            }else{
                notifySolvedPuzzles(response.data.solvedPuzzles);
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setFeedbackList(feedbackList => feedbackList.slice(1));
        }, 2000); // wait for fadeOut time (2s)
        return () => clearTimeout(timer);
    }, [feedbackList]);

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
        <div className="feedback-container">
            {feedbackList.map((feedback, index) => 
                <FeedbackComponent key={feedback.id} message={feedback.message} backgroundColor={feedback.bgCol} delay={index*0.5}/>
            )}
        </div>
            {!showNotification && !showEndPuzzle &&
                <div className="w-100 d-flex flex-column justify-content-between mh-100 h-100">
                    {currentRoom ?
                        <RoomComponent room={currentRoom} addHint={addHint} onSubmit={handleGeneralPuzzleSubmit}/> : null}
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