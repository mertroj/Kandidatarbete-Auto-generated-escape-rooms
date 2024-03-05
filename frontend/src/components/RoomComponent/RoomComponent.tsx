import 'bootstrap/dist/css/bootstrap.min.css';
import { Room } from '../../interfaces';
import Anagram from "../Puzzles/Anagram";
import MathPuzzle from "../Puzzles/MathPuzzle";
import './RoomComponent.css'


function RoomComponent ({room, addHint}: {room: Room, addHint: Function}) {
    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            <Anagram addHint={addHint}/>
            <MathPuzzle addHint={addHint}/>
        </div>
    );
}

export default RoomComponent;
