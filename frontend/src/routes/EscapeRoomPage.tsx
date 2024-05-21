import axios from "axios";
import {Button, Row} from "react-bootstrap";
import {useEffect, useState, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWebSocket from 'react-use-websocket';
import './EscapeRoomPage.css'

import { AnagramPuzzle, Cell, Difference, EscapeRoom, JigsawPuzzle, LettersMathPuzzle, MastermindPuzzle, MemoryPuzzle, OperatorsMathPuzzle, Puzzle, Room, RoomStatus, SlidePuzzle, SpotTheDifferencePuzzle, backendURL, socketsURL } from "../interfaces";

import HintingComponent from "../components/Hinting/hinting";
import PopupComponent from "../components/PopupComponent/Popup";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import JigsawComponent from "../components/Puzzles/JigsawPuzzleComponent";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";
import FeedbackComponent from "../components/Feedback/FeedbackComponent";
import VolumeComponent from "../components/Volume/VolumeComponent";
import TimerComponent from "../components/Timer/TimerComponent";
import { VolumeContext } from "../utils/VolumeContext";

import correctSound from '../assets/sounds/correct-answer.wav';
import incorrectSound from '../assets/sounds/incorrect-answer.wav';
const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

function EscapeRoomPage() {
    const {gameId} = useParams();
    const navigate = useNavigate();

    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>();
    const [currentRoom, setCurrentRoom] = useState<Room>();
    const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
    const [roomStatus, setRoomStatus] = useState<RoomStatus[]>();
    
    const [backgroundImageURL, setBackgroundImageURL] = useState<string>('');
    const [volume, setVolume] = useState(1.0);
    const [isMuted, setMuted] = useState(false);
    
    const [endingText, setEndingText] = useState<string>('');
    const [displayedEndText, setDisplayedEndText] = useState<string>('');
    const [currentEndIndex, setCurrentEndIndex] = useState<number>(0);
    
    const [timer, setTimer] = useState<number>(0);
    const timerRef = useRef(0);
    
    const [feedbackList, setFeedbackList] = useState<{id: number, message: string, bgCol:string}[]>([]);
    let feedbackId = 0;
    
    const userId = useRef('')
    const prevSolved = useRef<number[]>([]);
    const prevUnlocked = useRef<number[]>([]);
    const prevHints = useRef<number[]>([]);

    const hasInteracted = useRef(false);

    async function fetchEscapeRoom() {
        try {
            let response = await axios.get<EscapeRoom>(backendURL + '/escaperoom/?gameId=' + gameId);
            setEscapeRoom(response.data);
        } catch (error) {
            console.error(error);
            navigate('/');
        }
    }
    async function fetchImage() {
        try {
            const response = await fetch(backendURL + `/images/themeImage/?gameId=${gameId}`);
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            setBackgroundImageURL(objectURL);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }
    async function fetchEndingText(){
        const response = await axios.post(backendURL + `/chatGPT/endingText`, {gameId: gameId});
        setEndingText(response.data);
    }

    function getPuzzle(puzzleId: string): Puzzle | undefined {
        if (escapeRoom?.endPuzzle.id === puzzleId) return escapeRoom?.endPuzzle;
        let room = escapeRoom?.rooms.find((room) => room.puzzles.find((puzzle) => puzzle.id === puzzleId));
        return room?.puzzles.find((puzzle) => puzzle.id === puzzleId);
    }

    function notifySolvedPuzzle(): void {
        setFeedbackList(fbList => [...fbList, {id: feedbackId++, message: "Puzzle solved!", bgCol:'#08c32e'}]);
    }
    function notifyUnlockedPuzzle(): void {
        setFeedbackList(fbList => [...fbList, {id: feedbackId++, message: "New puzzle unlocked!", bgCol: '#0d6efd'}]);
    }
    function notifyIncorrectAnswer(): void {
        setFeedbackList(fbList => [...fbList, {id: feedbackId++, message: "Incorrect answer!", bgCol: '#ff4444'}]);
    }
    function notifyNewHint(): void {
        setFeedbackList(fbList => [...fbList, {id: feedbackId++, message: "New puzzle hint", bgCol: '#fd950d'}]);
    }

    function update(): void {
        setEscapeRoom(structuredClone(escapeRoom));
    }
    function move(roomIdx: number) {
        setCurrentRoomIdx(roomIdx);
        fetchImage();
    }
    function changeVolume(volume: number) {
        setMuted(false);
        setVolume(volume);
    }
    function toggleMuted() {
        setMuted(!isMuted)
    }

    function getEndPuzzleComponent() {
        switch (escapeRoom?.endPuzzle.type) { 
            case 'jigsawPuzzle':
                return <JigsawComponent key={'end'} puzzle={escapeRoom?.endPuzzle as JigsawPuzzle} />;
            default:
                return null;
        }
    }
    function incorrectAnswer() {
        if (hasInteracted.current) {
            incorrectAudio.currentTime = 0;
            incorrectAudio.play();
        }
        notifyIncorrectAnswer();
    }

    function puzzleSolved(): void {
        if (hasInteracted.current) {
            correctAudio.currentTime = 0;
            correctAudio.play();
        }
        notifySolvedPuzzle();
    }
    function puzzleUnlocked(): void {
        notifyUnlockedPuzzle();
    }
    function puzzleHint(): void {
        notifyNewHint();
    }

    const {sendJsonMessage} = useWebSocket(socketsURL, {
        onOpen: () => {
            sendJsonMessage({
                event: "game.join",
                data: {
                    gameId
                }
            });
        },
        onMessage: (message) => {
            let action = JSON.parse(message.data);
            let puzzle = getPuzzle(action.puzzleId);
            if (!puzzle) return;

            if (action.type === "user.id") {
                userId.current = action.id;
            } 
            
            else if (action.type === "anagram.solved") {
                fetchEscapeRoom();
            } else if (action.type === "anagram.hint"){
                (puzzle as AnagramPuzzle).hints = action.hints;
            } 

            else if (action.type === "operator.solved") {
                fetchEscapeRoom();
            } else if (action.type === "operator.hint") {
                (puzzle as OperatorsMathPuzzle).hints = action.hints;
                (puzzle as OperatorsMathPuzzle).question = action.question;
            } 

            else if (action.type === "letters.solved") {
                fetchEscapeRoom();
            } else if (action.type === "letters.hint") {
                (puzzle as LettersMathPuzzle).hints = action.hints;
            } 

            else if (action.type === "slide.solved") {
                setTimeout(() => fetchEscapeRoom(), 1000);
            } else if (action.type === "slide.hint") {
                (puzzle as SlidePuzzle).hints = action.hintLevel;
                (puzzle as SlidePuzzle).pieces = action.pieces;
            } else if (action.type === "slide.move") {
                (puzzle as SlidePuzzle).pieces = action.pieces;
            } 

            else if (action.type === "mastermind.solved") {
                setTimeout(() => fetchEscapeRoom(), ((puzzle as MastermindPuzzle).length+1) * 300);
            } else if (action.type === "mastermind.hint") {
                (puzzle as MastermindPuzzle).hints = action.hints;
            } else if (action.type === "mastermind.guess") {
                (puzzle as MastermindPuzzle).previousGuesses = action.guesses;
            } 

            else if (action.type === "memory.solved") {
                setTimeout(() => fetchEscapeRoom(), 1000);
            } else if (action.type === "memory.hint") {
                let cells = (puzzle as MemoryPuzzle).cells;
                (puzzle as MemoryPuzzle).hints = action.hintLevel;
                (puzzle as MemoryPuzzle).hintActive = true;
                (puzzle as MemoryPuzzle).cells = action.cells;
                setTimeout(() => {
                    (puzzle as MemoryPuzzle).cells = cells;
                    (puzzle as MemoryPuzzle).hintActive = false;
                    update();
                }, action.duration)
            } else if (action.type === "memory.flip") {
                (puzzle as MemoryPuzzle).cells = action.cells;
            } else if (action.type === "memory.match") {
                (puzzle as MemoryPuzzle).cells = action.cells;
            } else if (action.type === "memory.nomatch") {
                setTimeout(() => {
                    (puzzle as MemoryPuzzle).cells = action.cells;
                    update();
                }, 750)
            } 

            else if (action.type === "spot.solved") {
                setTimeout(() => fetchEscapeRoom(), 1000);
            } else if (action.type === "spot.hint") {
                (puzzle as SpotTheDifferencePuzzle).differences = action.differences;
                (puzzle as SpotTheDifferencePuzzle).hints = action.hintLevel;
            } else if (action.type === "spot.found") {
                (puzzle as SpotTheDifferencePuzzle).differences = action.differences;
            }

            else if (action.type === "jigsaw.solved") {
                setTimeout(() => fetchEscapeRoom(), 1000);
            } else if (action.type === "jigsaw.move") {
                (puzzle as JigsawPuzzle).pieces = action.pieces;
            }

            update();
        }
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => {
                timerRef.current = timer + 1;
                return timerRef.current;
            });
        }, 1000);

        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => window.history.pushState(null, "", window.location.href);

        fetchEscapeRoom();
        fetchImage();

        const onInteraction = () => {
            hasInteracted.current = true;
            window.removeEventListener("mousedown", onInteraction);
            window.removeEventListener("keydown", onInteraction);
        }
        window.addEventListener("mousedown", onInteraction)
        window.addEventListener("keydown", onInteraction)

        return () => {
            window.onpopstate = null;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        correctAudio.volume = isMuted ? 0 : volume;
        incorrectAudio.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    useEffect(() => {
        if (!escapeRoom) return;

        if (roomStatus) {
            let hasSolved = false;
            let hasUnlocked = false;
            let hasUsedHint = false;

            for (let roomIdx = 0; roomIdx < escapeRoom.rooms.length; roomIdx++) {
                let newPuzzles = escapeRoom.rooms[roomIdx].puzzles;

                let solved = newPuzzles.filter((p) => p.isSolved).length
                let unlocked = newPuzzles.filter((p) => !p.isLocked).length
                let huntsUsed = newPuzzles.reduce((acc, puzzle) => 
                    acc + (puzzle.hints ? (typeof puzzle.hints === 'number' ? puzzle.hints : puzzle.hints.length) : 0)
                , 0);

                let solvedDiff   = solved    - prevSolved.current[roomIdx];
                let unlockedDiff = unlocked  - prevUnlocked.current[roomIdx];
                let hintsDiff    = huntsUsed - prevHints.current[roomIdx];
                
                prevSolved.current[roomIdx] = solved;
                prevUnlocked.current[roomIdx] = unlocked;
                prevHints.current[roomIdx] = huntsUsed;

                roomStatus[roomIdx].solved   = roomStatus[roomIdx].solved   || (solvedDiff   > 0);
                roomStatus[roomIdx].unlocked = roomStatus[roomIdx].unlocked || (unlockedDiff > 0);
                roomStatus[roomIdx].hint     = roomStatus[roomIdx].hint     || (hintsDiff    > 0);
                
                if (solvedDiff) hasSolved = true;
                if (unlockedDiff) hasUnlocked = true;
                if (hintsDiff) hasUsedHint = true;
            }

            if (hasSolved) puzzleSolved();
            if (hasUnlocked) puzzleUnlocked();
            if (hasUsedHint) puzzleHint();
        } else {
            let initRoomStatus: RoomStatus[] = [];
            escapeRoom.rooms.forEach((r) => initRoomStatus.push({solved: false, unlocked: false, hint: false}));
            prevSolved.current = new Array(escapeRoom.rooms.length).fill(0);
            prevUnlocked.current = new Array(escapeRoom.rooms.length).fill(0);
            prevHints.current = new Array(escapeRoom.rooms.length).fill(0);
            setRoomStatus(initRoomStatus);
            update();
        }

        setTimer(Math.trunc((Date.now() - escapeRoom.startTime) / 1000));

        if(escapeRoom.isSolved){
            fetchEndingText();
        }
    }, [escapeRoom])

    useEffect(() => {
        if (escapeRoom) {
            setCurrentRoom(escapeRoom.rooms[currentRoomIdx]);
        }
        if (roomStatus) {
            roomStatus[currentRoomIdx].solved = false;
            roomStatus[currentRoomIdx].unlocked = false;
            roomStatus[currentRoomIdx].hint = false;
            setRoomStatus([...roomStatus]);
        }
    }, [escapeRoom, currentRoomIdx]);

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
        <VolumeContext.Provider value={{ volume, changeVolume, isMuted, toggleMuted }}>
            {escapeRoom && currentRoom && roomStatus && <div className="d-flex w-100 position-relative">
                {!escapeRoom.allRoomsSolved && <div className="w-100 d-flex flex-column justify-content-between mh-100 h-100">
                        <RoomComponent 
                            room={currentRoom} 
                            incorrectAnswer={incorrectAnswer}
                        />
                    </div>
                }

                {escapeRoom.allRoomsSolved && getEndPuzzleComponent()}  
                
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
                        currentRoom={currentRoom}
                        escapeRoom={escapeRoom}
                        roomStatus={roomStatus}
                        move={move}
                    />
                </div>

                <PopupComponent
                    navbarRemove={true}
                    isOpen={escapeRoom.isSolved}
                    children={
                        <div className={'text-center'}>
                            {displayedEndText}
                            <Row className={'mt-5'}>
                                <Button variant='outline-success' onClick={() => navigate(`/escaperoom/${gameId}/result`)}>Leave</Button>
                            </Row>
                        </div>
                    }
                />
            </div>}

            <VolumeComponent />
            <img
                src={backgroundImageURL}
                alt="background"
                className="background-image"
            />
            <div className="feedback-container">
                {feedbackList.map((feedback, index) => 
                    <FeedbackComponent key={`${index}-${feedback.id}`} message={feedback.message} backgroundColor={feedback.bgCol} delay={index*0.5}/>
                )}
            </div>
        </VolumeContext.Provider>
    );
}


export default EscapeRoomPage;