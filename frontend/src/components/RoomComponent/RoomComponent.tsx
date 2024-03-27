import 'bootstrap/dist/css/bootstrap.min.css';
import {JigsawPuzzle, SlidePuzzles, Room} from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import LettersMathPuzzle from "../Puzzles/LettersMathPuzzle";
import OperatorMathPuzzle from "../Puzzles/OperatorMathPuzzle";
import './RoomComponent.css'
import { useEffect, useState } from 'react';
import Jigsaw from "../Puzzles/Jigsaw";
import SlidePuzzle from '../Puzzles/SlidePuzzle';
import SolvedPuzzleComponent from '../Puzzles/SolvedPuzzle';
import LockedPuzzleComponent from '../Puzzles/LockedPuzzle';

interface RoomComponentProps {
    room: Room;
    addHint: Function;
    updateRoom: Function;
}
function RoomComponent (roomProps: RoomComponentProps) {
    const {room, addHint, updateRoom} = roomProps;
    const [puzzles, setPuzzles] = useState<(JSX.Element | null) []>();

    useEffect(() => {
        let nodes = room.puzzles.map((puzzle) => {
            if (puzzle.solved)
                return <SolvedPuzzleComponent/>

            if (puzzle.isLocked)
                return <LockedPuzzleComponent/>

            if (puzzle.type === 'anagram')
                return <Anagram key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>
            
            if (puzzle.type === 'lettersMathPuzzle')
                return <LettersMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>

            if (puzzle.type === 'operatorMathPuzzle') 
                return <OperatorMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>
                
            if (puzzle.type === 'slidePuzzle') 
                return <SlidePuzzle key={puzzle.id} puzzle={puzzle as SlidePuzzles} onSolve={updateRoom}/>

            return <p>Invalid puzzle</p>
        })
        setPuzzles(nodes);
    }, [room])
    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            {puzzles}
        </div>
    );
}

export default RoomComponent;
