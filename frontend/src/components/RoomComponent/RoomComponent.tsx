import 'bootstrap/dist/css/bootstrap.min.css';
import {JigsawPuzzle, Room} from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import LettersMathPuzzle from "../Puzzles/LettersMathPuzzle";
import OperatorMathPuzzle from "../Puzzles/OperatorMathPuzzle";
import './RoomComponent.css'
import { useEffect, useState } from 'react';
import Jigsaw from "../Puzzles/Jigsaw";


function RoomComponent ({room, addHint}: {room: Room, addHint: Function}) {
    const [puzzles, setPuzzles] = useState<JSX.Element[]>();

    useEffect(() => {
        console.log(room.slots)
        let nodes = room.slots.map((puzzle) => {
            if (puzzle.type === 'anagram')
                return <Anagram key={puzzle.id} addHint={addHint} puzzle={puzzle} />
            
            if (puzzle.type === 'lettersMathPuzzle')
                return <LettersMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} />

            if (puzzle.type === 'operatorMathPuzzle') 
                return <OperatorMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} />

            if (puzzle.type === 'jigsawpuzzle')
                return <Jigsaw key={puzzle.id} puzzle={puzzle as JigsawPuzzle} />
            return <p>Invalid puzzle</p>
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
