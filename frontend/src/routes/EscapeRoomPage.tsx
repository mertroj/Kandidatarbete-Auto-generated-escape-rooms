import axios from "axios";
import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EscapeRoom, JigsawPuzzle, Room } from "../interfaces"
import Hinting from "../components/Hinting/hinting";
import RoomComponent from "../components/RoomComponent/RoomComponent";
import Navbar from '../components/Navbar/Navbar';
import {Row} from "react-bootstrap";
import NavigationPanel from "../components/NavigationPanel/NavigationPanel";
import Jigsaw from "../components/Puzzles/Jigsaw";

function EscapeRoomPage() {
    const {gameId} = useParams()
    const navigate = useNavigate();
    const [hintsList, setHintsList] = useState<string[]>([])
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoom>()
    const [currentRoom, setCurrentRoom] = useState<Room>()
    const [backgroundImageURL, setBackgroundImageURL] = useState<string>('');
    const resultScreenUrl = `/escaperoom/${gameId}/result`;

    const [showPuzzle, setShowPuzzle] = useState(false);
    const [puzzleData, setPuzzleData] = useState<JigsawPuzzle | null>(null);


    function checkEscapeRoomDone(): boolean {
        if (escapeRoom){
            for (let room of escapeRoom?.rooms || []) {
                for (let slot of room.slots) {
                    if (!slot.solved) {
                        return false;
                    }
                }
            } return true;
        } return false;
    }

    async function createJigsawPuzzle(): Promise<JigsawPuzzle> {
        const response = await axios.post<JigsawPuzzle>('http://localhost:8080/jigsaw/create');
        return response.data;
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

    function addHint(hint: string) {
        setHintsList(hintsList => [...hintsList, hint]);
    }

    function fetchEscapeRoom() {
        axios.get<EscapeRoom>('http://localhost:8080/escaperoom/?gameId=' + gameId).then((response) => {
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
        console.log('left');
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.left));
        fetchImage();;
    }
    function moveRight() {
        console.log('right');
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.right));
        fetchImage();;
    }
    function moveUp() {
        console.log('up');
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.up));
        fetchImage();;
    }
    function moveDown() {
        console.log('down');
        setCurrentRoom(escapeRoom?.rooms.find((room) => room.id === currentRoom?.down));
        fetchImage();;
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
        if (checkEscapeRoomDone()) {
            //navigate(resultScreenUrl);
            createJigsawPuzzle().then((puzzle) => {
                setPuzzleData(puzzle);
                setShowPuzzle(true);
            });

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
            <div className="w-100 d-flex flex-column justify-content-between mh-100 h-100">
                {/*<Navbar/>*/}
                {currentRoom ? 
                    <RoomComponent room={currentRoom} addHint={addHint} updateRoom={fetchEscapeRoom}/> : null}
            </div>
            {showPuzzle && puzzleData && <Jigsaw key={'end'} puzzle={puzzleData} onSolve={()=>navigate(resultScreenUrl)} />}

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