import 'bootstrap/dist/css/bootstrap.min.css';
import {JigsawPuzzle, SlidePuzzles, Room} from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import LettersMathPuzzle from "../Puzzles/LettersMathPuzzle";
import OperatorMathPuzzle from "../Puzzles/OperatorMathPuzzle";
import './RoomComponent.css'
import { useEffect, useState } from 'react';
import Jigsaw from "../Puzzles/Jigsaw";
import SlidePuzzle from '../Puzzles/SlidePuzzle';

interface RoomComponentProps {
    room: Room;
    addHint: Function;
    updateRoom: Function;
}
function RoomComponent (roomProps: RoomComponentProps) {
    const {room, addHint, updateRoom} = roomProps;
    const [puzzles, setPuzzles] = useState<(JSX.Element | null) []>();

    useEffect(() => {
        let spanNodes: JSX.Element[] = [];
        let nodes = room.slots.map((puzzle) => {
            if(!puzzle.solved && !puzzle.isLocked){
                console.log('trying to render puzzle:', room.slots);
                if (puzzle.type === 'anagram')
                    return <Anagram key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>

                if (puzzle.type === 'lettersMathPuzzle')
                    return <LettersMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>

                if (puzzle.type === 'operatorMathPuzzle')
                    return <OperatorMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>

                if (puzzle.type === 'slidePuzzle')
                    return <SlidePuzzle key={puzzle.id} puzzle={puzzle as SlidePuzzles} onSolve={updateRoom}/>

            if (puzzle.type === 'jigsawpuzzle')
                return <Jigsaw key={puzzle.id} puzzle={puzzle as JigsawPuzzle} onSolve={updateRoom}/>

            return <p>Invalid puzzle</p>
                return <p>Invalid puzzle</p>
            }else if(puzzle.isLocked){ //definitely not solved since it is locked
                return null; //TODO: Check if endPuzzle for example or converging and do something else
            }else{  //puzzle is solved
                return null;
                //return <p>Puzzle solved</p> //maybe change to null in order to be skipped when rendering
            }
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
