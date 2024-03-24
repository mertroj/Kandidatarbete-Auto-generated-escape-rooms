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
    updateRoom: Function;
}
function RoomComponent (roomProps: RoomComponentProps) {
    const {room, addHint, updateRoom} = roomProps;
    const [puzzles, setPuzzles] = useState<(JSX.Element | null) []>();

    async function updatePuzzles(){
        console.log("Updating puzzles");
        updateRoom();
    }

    useEffect(() => {
        let nodes = room.slots.map((puzzle) => {
            if(!puzzle.solved && !puzzle.isLocked){
                console.log('trying to render puzzle:', room.slots);
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
                return null;
                //return <p>There are many recipes to the way out, maybe you haven¨t found them all</p>
            }else{
                return null;
                //return <p>Puzzle solved</p> //maybe change to null in order to be skipped when rendering
            }
        })
        setPuzzles(nodes)
    }, [room])
    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            {puzzles}
        </div>
    );
}

export default RoomComponent;
