import 'bootstrap/dist/css/bootstrap.min.css';
import { Room } from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import MathPuzzle from "../Puzzles/MathPuzzle";
import './RoomComponent.css'
import { useEffect, useState } from 'react';


function RoomComponent ({room, addHint}: {room: Room, addHint: Function}) {
    const [puzzles, setPuzzles] = useState<JSX.Element[]>();

    useEffect(() => {
        let nodes = room.slots.map((puzzle) => {
            if (puzzle.puzzle) {
                return <MathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} />
            } else if (puzzle.type === 'anagram') {
                return <Anagram key={puzzle.id} addHint={addHint} puzzle={puzzle} />
            } else {
                return <p>Invalid puzzle</p>
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
