import 'bootstrap/dist/css/bootstrap.min.css';
import { Room } from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import LettersMathPuzzle from "../Puzzles/LettersMathPuzzle";
import OperatorMathPuzzle from "../Puzzles/OperatorMathPuzzle";
import './RoomComponent.css'
import { useEffect, useState } from 'react';


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

            return <p>Invalid puzzle</p>
        })
        setPuzzles(nodes)
    }, [room])
    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            <img src="https://th.bing.com/th/id/OIG3..dK0wbzBpj1oWLQDrX.n?w=270&h=270&c=6&r=0&o=5&dpr=2&pid=ImgGn" alt="" 
            style={{
                opacity:'50%', 
                position:'absolute',
                top:'0',
                left:'0',
                width:'100%',
                height:'auto',
                zIndex:'-1'
            }}/>
            {puzzles}
        </div>
    );
}

export default RoomComponent;
