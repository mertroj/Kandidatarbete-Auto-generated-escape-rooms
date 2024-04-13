import axios from "axios";
import {Button, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import HintingComponent from "../components/Hinting/hinting";
import { EscapeRoom, JigsawPuzzle, Puzzle, Room } from "../interfaces";
import PopupComponent from "../components/PopupComponent/Popup";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import JigsawComponent from "../components/Puzzles/JigsawPuzzleComponent";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";
import FeedbackComponent from "../components/Feedback/FeedbackComponent";
import {FeedbackMessages} from "../interfaces";
import './EscapeRoomPage.css'

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
    const [feedbackList, setFeedbackList] = useState<Array<{id: number, message: FeedbackMessages, bgCol:string}>>([]);
    let feedbackId = 0;

    // Fetch
    async function fetchImage() {
        try {
            const response = await fetch(`http://localhost:8080/images/themeImage/?gameId=${gameId}`);
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            console.log(objectURL)
            setBackgroundImageURL(objectURL);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }
    function fetchEscapeRoom() {
        axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
            let er = response.data;
            setEscapeRoom(er);

        }).catch((error) => {
            console.error(error);
            navigate('/');
        })
    }

    // Getters
    function getPuzzle(puzzleId: string): Puzzle | undefined {
        let room = escapeRoom?.rooms.find((room) => room.puzzles.find((puzzle) => puzzle.id === puzzleId))
        return room?.puzzles.find((puzzle) => puzzle.id === puzzleId)
    }

    // notifiers
    function notifySolvedPuzzle(puzzleId: string) {
        setFeedbackList(feedbackList => [...feedbackList, {id: feedbackId++, message: FeedbackMessages.CORRECT, bgCol:'#00C851'}]);
    }
    function notifyUnlockedPuzzle(puzzleId: string){
        setFeedbackList(feedbackList => [...feedbackList, {id: feedbackId++, message: FeedbackMessages.UNLOCKED, bgCol: '#0d6efd'}]);
    }
    function notifyIncorrectAnswer(){
        setFeedbackList(feedbackList => [...feedbackList, {id: feedbackId++, message: FeedbackMessages.INCORRECT, bgCol: '#ff4444'}]);
    }

    // Smaller functions
    function checkEscapeRoomDone(): boolean {
        return escapeRoom ? escapeRoom.rooms.every((room) => room.puzzles.every((puzzle) => puzzle.isSolved)) : false;
    }
    function update(): void {
        setEscapeRoom(structuredClone(escapeRoom))
    }
    function handleSolve() {
        setShowNotification(true);
        // setTimeout(() => {
        //     navigate(resultScreenUrl);
        // }, 4000); // wait for 4 seconds
    }
    function move(roomIdx: number) {
        setCurrentRoomIdx(roomIdx);
        fetchImage();
    }

    // Larger functions
    function puzzleSolved(puzzleId: string, unlockedPuzzles: string[]): void {
        let solvedPuzzle = getPuzzle(puzzleId);
        if (!solvedPuzzle) return;
        solvedPuzzle.isSolved = true;
        notifySolvedPuzzle(puzzleId);

        let puzzle: Puzzle | undefined;
        unlockedPuzzles.forEach((puzzleId) => {
            puzzle = getPuzzle(puzzleId);
            if (!puzzle) return;
            puzzle.isLocked = false;
            notifyUnlockedPuzzle(puzzleId)
        })

        update();
    }    
    function getEndPuzzleComponent() {
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setFeedbackList(feedbackList => feedbackList.slice(1));
        }, 2000); // wait for fadeOut time (2s)
        return () => clearTimeout(timer);
    }, [feedbackList]);

    return (
        <div 
            className="d-flex w-100"
        >
            <img
                src={backgroundImageURL}
                alt="background"
                className="background-image"
            />

            <div className="feedback-container">
                {feedbackList.map((feedback, index) => 
                    <FeedbackComponent key={feedback.id} message={feedback.message} backgroundColor={feedback.bgCol} delay={index*0.5}/>
                )}
            </div>

            {!showNotification && !showEndPuzzle &&
                <div className="w-100 d-flex flex-column justify-content-between mh-100 h-100">
                    {currentRoom && 
                        <RoomComponent 
                            room={currentRoom} 
                            updateRoom={update}
                            notifyIncorrectAnswer={notifyIncorrectAnswer}
                            puzzleSolved={puzzleSolved}
                        />
                    }
                </div>
            }

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
                </div>
            }

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
                />
            }
        </div>
    );
}


export default EscapeRoomPage;