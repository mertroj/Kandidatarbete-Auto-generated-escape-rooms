import 'bootstrap/dist/css/bootstrap.min.css';
import { Room, SlidePuzzles } from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import LettersMathPuzzle from "../Puzzles/LettersMathPuzzle";
import OperatorMathPuzzle from "../Puzzles/OperatorMathPuzzle";
import './RoomComponent.css'
import { useEffect, useState } from 'react';
import SlidePuzzle from '../Puzzles/slidePuzzle';
import LockedPuzzle from '../Puzzles/LockedPuzzle';

interface RoomComponentProps {
    room: Room;
    addHint: Function;
    updateRoom: Function;
    
}
function RoomComponent (roomProps: RoomComponentProps) {
    const {room, addHint, updateRoom} = roomProps;
    const [puzzles, setPuzzles] = useState<(JSX.Element | null) []>();

    useEffect(() => {
        let hasLockedPuzzle: boolean = false;
        let allSolved: boolean = true;
        let nodes = room.slots.map((puzzle) => {
            if(!puzzle.solved && !puzzle.isLocked){
                allSolved = false;
                console.log('trying to render puzzle:', room.slots);
                if (puzzle.type === 'anagram')
                    return <Anagram key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>
                
                if (puzzle.type === 'lettersMathPuzzle')
                    return <LettersMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>

                if (puzzle.type === 'operatorMathPuzzle') 
                    return <OperatorMathPuzzle key={puzzle.id} addHint={addHint} puzzle={puzzle} onSolve={updateRoom}/>
                    
                if (puzzle.type === 'slidePuzzle') 
                    return <SlidePuzzle key={puzzle.id} puzzle={puzzle as SlidePuzzles} onSolve={updateRoom}/>

                return <p>Invalid puzzle</p>
            }else if(puzzle.isLocked){ //definitely not solved since it is locked
                allSolved = false;
                if(hasLockedPuzzle){
                    return null;
                } else {
                    hasLockedPuzzle = true;
                    return <LockedPuzzle key={puzzle.id}/>;
                }
            }else{  //puzzle is solved
                return null;
            }
        });
        if(allSolved){ //means that nodes is full of nulls
            console.log(nodes);
            nodes.push(<div key={room.id} className='empty-room'>Nothing to do here! Go elsewhere</div>);
        }
        setPuzzles(nodes);
    }, [room])
    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            {puzzles}
        </div>
    );
}

export default RoomComponent;
