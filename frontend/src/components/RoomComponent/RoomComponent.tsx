import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomComponent.css'
import {JigsawPuzzle, SlidePuzzle, Room, AnagramPuzzle, LettersMathPuzzle, OperatorsMathPuzzle} from '../../interfaces';
// import JigsawPuzzleComponent from "../Puzzles/JigsawPuzzleComponent";
import SlidePuzzleComponent from '../Puzzles/SlidePuzzleComponent';
import SolvedPuzzleComponent from '../Puzzles/SolvedPuzzleComponent';
import LockedPuzzleComponent from '../Puzzles/LockedPuzzleComponent';
import AnagramComponent from "../Puzzles/AnagramPuzzleComponent";
import LettersMathPuzzleComponent from "../Puzzles/LettersMathPuzzleComponent";
import OperatorMathPuzzleComponent from "../Puzzles/OperatorMathPuzzleComponent";

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
        let nodes = room.puzzles.map((puzzle) => {
            if (!puzzle.isLocked){
                if (puzzle.solved)
                    return <SolvedPuzzleComponent
                        key={puzzle.id} 
                    />

                if (puzzle.type === 'anagram')
                    return <AnagramComponent 
                        key={puzzle.id} 
                        addHint={addHint} 
                        puzzle={puzzle as AnagramPuzzle} 
                        onSolve={updateRoom}
                    />
                
                if (puzzle.type === 'lettersMathPuzzle')
                    return <LettersMathPuzzleComponent 
                        key={puzzle.id} 
                        addHint={addHint} 
                        puzzle={puzzle as LettersMathPuzzle} 
                        onSolve={updateRoom}
                    />

                if (puzzle.type === 'operatorMathPuzzle') 
                    return <OperatorMathPuzzleComponent 
                        key={puzzle.id} 
                        addHint={addHint} 
                        puzzle={puzzle as OperatorsMathPuzzle} 
                        onSolve={updateRoom}
                />
                        
                if (puzzle.type === 'slidePuzzle') 
                    return <SlidePuzzleComponent 
                        key={puzzle.id} 
                        puzzle={puzzle as SlidePuzzle} 
                        onSolve={updateRoom}
                    />

                return <p>Invalid puzzle</p>
            }else{
                if (!hasLockedPuzzle){
                    hasLockedPuzzle = true;
                    return <LockedPuzzleComponent
                        key={puzzle.id} 
                    />
                } return null;
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
