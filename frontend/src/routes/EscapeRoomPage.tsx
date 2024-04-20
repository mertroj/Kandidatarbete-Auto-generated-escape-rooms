import axios from "axios";
import {Button, Row} from "react-bootstrap";
import {useEffect, useState, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import HintingComponent from "../components/Hinting/hinting";
import { EscapeRoom, JigsawPuzzle, Puzzle, Room, RoomStatus } from "../interfaces";
import PopupComponent from "../components/PopupComponent/Popup";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import JigsawComponent from "../components/Puzzles/JigsawPuzzleComponent";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";
import FeedbackComponent from "../components/Feedback/FeedbackComponent";
import {FeedbackMessages} from "../interfaces";
import './EscapeRoomPage.css'
import { VolumeContext } from "../utils/volumeContext";
import VolumeSlider from "../components/Volume/volumeSliderComponent";
import VolumeIconComponent from "../components/Volume/volumeIconComponent";
import TimerComponent from "../components/Timer/TimerComponent";

function EscapeRoomPage() {
    const {gameId} = useParams();
    const navigate = useNavigate();
    const [volume, setVolume] = useState(1.0);
    const [isMouseOverVolume, setIsMouseOverVolume] = useState(false);
    const [timer, setTimer] = useState<number>(() => Number(sessionStorage.getItem('timer')) || 0);
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>();
    const [currentRoom, setCurrentRoom] = useState<Room>();
    const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
    const [backgroundImageURL, setBackgroundImageURL] = useState<string>('');
    const resultScreenUrl = `/escaperoom/${gameId}/result`;
    const [showEndPuzzle, setShowEndPuzzle] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [feedbackList, setFeedbackList] = useState<Array<{id: number, message: FeedbackMessages, bgCol:string}>>([]);
    const [roomStatus, setRoomStatus] = useState<RoomStatus[]>([]);
    const [endingText, setEndingText] = useState<string>('');
    const [displayedEndText, setDisplayedEndText] = useState<string>('');
    const [currentEndIndex, setCurrentEndIndex] = useState<number>(0);

    const timerRef = useRef(timer);
    timerRef.current = timer;
    let feedbackId = 0;

    // Fetch
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
    async function fetchEndingText(){
        const response = await axios.post(`http://localhost:8080/chatGPT/endingText`, {gameId: gameId});
        setEndingText(response.data);
    }

    function fetchEscapeRoom() {
        axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
            let er = response.data;
            setEscapeRoom(er);

            let initRoomStatus: RoomStatus[] = [];
            er.rooms.forEach((r) => initRoomStatus.push({solved: false, unlocked:false}));
            setRoomStatus(initRoomStatus);
        }).catch((error) => {
            console.error(error);
            navigate('/');
        })
    }

    // Getters
    function getPuzzle(puzzleId: string): Puzzle | undefined {
        let room = escapeRoom?.rooms.find((room) => room.puzzles.find((puzzle) => puzzle.id === puzzleId));
        return room?.puzzles.find((puzzle) => puzzle.id === puzzleId);
    }
    function getRoomIndex(puzzleId: string): number | undefined {
        return escapeRoom?.rooms.findIndex((room) => room.puzzles.find((puzzle) => puzzle.id === puzzleId));
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
        sessionStorage.removeItem('timer');
        setShowNotification(true);
    }
    function move(roomIdx: number) {
        setCurrentRoomIdx(roomIdx);
        fetchImage();
    }
    function handleMouseEnterVolume(){
        setIsMouseOverVolume(true);
    }
    function handleMouseLeaveVolume(){
        setIsMouseOverVolume(false);
    }

    // Larger functions
    function solvePuzzle(puzzleId: string) {
        let solvedPuzzle = getPuzzle(puzzleId);
        let roomI = getRoomIndex(puzzleId);

        if (!solvedPuzzle || roomI === undefined || roomI === -1) return;
        solvedPuzzle.isSolved = true;
        roomStatus[roomI].solved = true;

        setRoomStatus([...roomStatus]);
        notifySolvedPuzzle(puzzleId);
    }
    function unlockPuzzles(unlockedPuzzles: string[]) {
        let puzzle: Puzzle | undefined;
        let roomI: number | undefined;
        unlockedPuzzles.forEach((puzzleId) => {
            puzzle = getPuzzle(puzzleId);
            roomI = getRoomIndex(puzzleId);

            if (!puzzle || roomI === undefined || roomI === -1) return;
            console.log('Unlocking puzzle:', puzzle.type);

            puzzle.isLocked = false;
            roomStatus[roomI].unlocked = true;

            setRoomStatus([...roomStatus]);
            notifyUnlockedPuzzle(puzzleId)
        })
    }
    function puzzleSolved(puzzleId: string, unlockedPuzzles: string[]): void {
        solvePuzzle(puzzleId);
        unlockPuzzles(unlockedPuzzles);
        update();
    }    
    function getEndPuzzleComponent() {
        console.log('End puzzle:', escapeRoom?.endPuzzle);
        switch (escapeRoom?.endPuzzle.type) { 
            case 'jigsawPuzzle':
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
        const getEndingText = async () => {
            await fetchEndingText();
        };
        if(showNotification){
            getEndingText();
        }
    }, [showNotification]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => {
                timerRef.current = timer + 1;
                return timerRef.current;
            });
        }, 1000);
        window.onbeforeunload = () => sessionStorage.setItem('timer', timerRef.current.toString());

        return () => {
            clearInterval(interval);
            sessionStorage.setItem('timer', timerRef.current.toString());
        };
    }, []);

    useEffect(() => {
        if (escapeRoom) {
            setCurrentRoom(escapeRoom.rooms[currentRoomIdx]);
            roomStatus[currentRoomIdx].solved = false;
            roomStatus[currentRoomIdx].unlocked = false;
            setRoomStatus([...roomStatus]);
        }
        if (checkEscapeRoomDone() && escapeRoom) {
            //navigate(resultScreenUrl);
            setShowEndPuzzle(true);
        }
    }, [escapeRoom, currentRoomIdx]);

    useEffect(() => {
        const unblock = window.history.pushState(null, "", window.location.href);

        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };

        fetchEscapeRoom();

        return () => {
            window.onpopstate = null;
        };
    }, []);

    useEffect(() => {
        if (endingText !== '') {
            const intervalId = setInterval(() => {
                if (currentEndIndex < endingText.length) {
                    setDisplayedEndText(prevText => prevText + endingText[currentEndIndex]);
                    setCurrentEndIndex(prevIndex => prevIndex + 1);
                } else {
                    clearInterval(intervalId);
                }
            }, 25);
        
            return () => clearInterval(intervalId);
        }
    }, [endingText, currentEndIndex]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFeedbackList(feedbackList => feedbackList.slice(1));
        }, 2000); // wait for fadeOut time (2s)
        return () => clearTimeout(timer);
    }, [feedbackList]);

    return (
        <VolumeContext.Provider value={{ volume, setVolume }}>
            <div 
                className="d-flex w-100"
            >
                <div className="volume-slider-container"
                    onMouseEnter={handleMouseEnterVolume}
                    onMouseLeave={handleMouseLeaveVolume}
                >
                    <div 
                        style={{position: 'relative', width:'45px'}}
                    >
                        <div 
                            className="volume-icon"
                            style={{marginBottom:`${isMouseOverVolume ? '320%' : '0px'}`}}
                        >
                            <VolumeIconComponent />
                        </div>
                        {isMouseOverVolume && (

                            <VolumeSlider />
                        )}
                    </div>
                </div>
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

                {!showNotification && !showEndPuzzle && escapeRoom && currentRoom && gameId && 
                    <div 
                        style={{height: "100vh", width:"400px", maxWidth: "400px"}} 
                        className="panel-container"
                    >
                        <HintingComponent 
                            escapeRoom={escapeRoom}
                            currentRoom={currentRoom}
                        />
                        <TimerComponent timer={timer}/>
                        <NavigationPanel
                            gameId={gameId}
                            currentRoom={currentRoom}
                            escapeRoom={escapeRoom}
                            roomStatus={roomStatus}
                            move={move}
                        />
                    </div>
                }

                {showNotification && 
                    <PopupComponent
                        navbarRemove={true}
                        isOpen={showNotification}
                        onOpen={() => setShowNotification(true)}
                        onClose={() => {}}
                        trigger={<div></div>}
                        children={
                            <div className={'text-center'}>
                                {displayedEndText}
                                <Row className={'mt-5'}>
                                    <Button variant='outline-success' onClick={() => navigate(resultScreenUrl)}>Leave</Button>
                                </Row>
                            </div>
                        }
                    />
                }
            </div>
        </VolumeContext.Provider>
    );
}


export default EscapeRoomPage;