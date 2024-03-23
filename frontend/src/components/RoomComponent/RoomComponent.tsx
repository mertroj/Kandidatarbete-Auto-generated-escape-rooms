import 'bootstrap/dist/css/bootstrap.min.css';
import { Room, SlidePuzzles } from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import LettersMathPuzzle from "../Puzzles/LettersMathPuzzle";
import OperatorMathPuzzle from "../Puzzles/OperatorMathPuzzle";
import './RoomComponent.css'
import { useEffect, useState } from 'react';
import SlidePuzzle from '../Puzzles/SlidePuzzle';
import axios from 'axios';

interface RoomsFetchResponse{
    room: Room;
}
interface RoomComponentProps {
    room: Room;
    addHint: Function;
    getUpdatedRoom: (roomId: string) => Promise<Room>;
}
function RoomComponent (roomProps: RoomComponentProps) {
    const {room, addHint, getUpdatedRoom} = roomProps;
    const [puzzles, setPuzzles] = useState<JSX.Element[]>();
    const [updatedRoom, setRoom] = useState<Room>(room);

    async function updatePuzzles(){
        console.log("Updating puzzles");
        const response = await axios.get<RoomsFetchResponse>(`http://localhost:8080/room?roomId=${room.id}`);
        setRoom(await getUpdatedRoom(room.id));
    }

    useEffect(() => {
        console.log(room.slots)
        let nodes = updatedRoom.slots.map((puzzle) => {
            if(!puzzle.solved && !puzzle.isLocked){
                if (puzzle.type === 'anagram')
                    return <Anagram key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updatePuzzles}/>
                
                if (puzzle.type === 'lettersMathPuzzle')
                    return <LettersMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updatePuzzles}/>

                if (puzzle.type === 'operatorMathPuzzle') 
                    return <OperatorMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updatePuzzles}/>
                    
                if (puzzle.type === 'slidePuzzle') 
                    return <SlidePuzzle key={puzzle.id} puzzle={puzzle as SlidePuzzles} onSolve={updatePuzzles}/>

                return <p>Invalid puzzle</p>
            }else if(puzzle.isLocked){
                return <p>There are many recipes to the way out, maybe you haven¨t found them all</p>
            }else{
                return <p>Puzzle solved</p> //maybe change to null in order to be skipped when rendering
            }
        })
        setPuzzles(nodes)
    }, [updatedRoom])
    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            {puzzles}
        </div>
    );
}

export default RoomComponent;
