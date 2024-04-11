import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomComponent.css'
import {JigsawPuzzle, SlidePuzzle, Room, AnagramPuzzle, LettersMathPuzzle, OperatorsMathPuzzle, Puzzle, MastermindPuzzle, MemoryPuzzle} from '../../interfaces';
// import JigsawPuzzleComponent from "../Puzzles/JigsawPuzzleComponent";
import SlidePuzzleComponent from '../Puzzles/SlidePuzzleComponent';
import SolvedPuzzleComponent from '../Puzzles/SolvedPuzzleComponent';
import LockedPuzzleComponent from '../Puzzles/LockedPuzzleComponent';
import MastermindPuzzleComponent from "../Puzzles/Mastermind/MastermindPuzzleComponent";
import AnagramComponent from "../Puzzles/AnagramPuzzleComponent";
import LettersMathPuzzleComponent from "../Puzzles/LettersMathPuzzleComponent";
import OperatorMathPuzzleComponent from "../Puzzles/OperatorMathPuzzleComponent";
import MemoryPuzzleComponent from '../Puzzles/Memory/MemoryPuzzleComponent';

interface RoomComponentProps {
    room: Room;
    addHint: Function;
    onSubmit: Function;
    
}

function RoomComponent (roomProps: RoomComponentProps) {
    const {room, addHint, onSubmit} = roomProps;
    const [puzzles, setPuzzles] = useState<(JSX.Element | null) []>();

    useEffect(() => {
        let hasLockedPuzzle: boolean = room.puzzles.some((puzzle) => puzzle.isLocked);
        let solvedPuzzles: JSX.Element[] = [];
        let nodes: JSX.Element[] = [];
        room.puzzles.forEach((puzzle) => {
            if (puzzle.isLocked)
                return
                
            else if (puzzle.isSolved)
                solvedPuzzles.push(<SolvedPuzzleComponent
                    key={puzzle.id} 
                    style={{
                        position: 'absolute',
                        top: `${solvedPuzzles.length * 10}px`,
                        left: `${solvedPuzzles.length * 10}px`
                    }}
                />)

            else if (puzzle.type === 'anagram')
                nodes.push(<AnagramComponent 
                    key={puzzle.id} 
                    addHint={addHint} 
                    puzzle={puzzle as AnagramPuzzle} 
                    onSubmit={onSubmit}
                />)
                
            else if (puzzle.type === 'lettersMathPuzzle')
                nodes.push(<LettersMathPuzzleComponent 
                    key={puzzle.id} 
                    addHint={addHint} 
                    puzzle={puzzle as LettersMathPuzzle} 
                    onSubmit={onSubmit}
                />)

            else if (puzzle.type === 'operatorMathPuzzle') 
                nodes.push(<OperatorMathPuzzleComponent 
                    key={puzzle.id} 
                    addHint={addHint} 
                    puzzle={puzzle as OperatorsMathPuzzle} 
                    onSubmit={onSubmit}
                />)
                        
            else if (puzzle.type === 'slidePuzzle') 
                nodes.push(<SlidePuzzleComponent 
                    key={puzzle.id} 
                    puzzle={puzzle as SlidePuzzle} 
                    onSubmit={onSubmit}
                />)
            else if (puzzle.type === 'memoryPuzzle') 
                nodes.push(<MemoryPuzzleComponent 
                    key={puzzle.id} 
                    puzzle={puzzle as MemoryPuzzle} 
                    onSubmit={onSubmit}
                />)

            else if (puzzle.type === 'mastermindPuzzle')
                nodes.push(<MastermindPuzzleComponent 
                    key={puzzle.id}
                    addHint={addHint}
                    puzzle={puzzle as MastermindPuzzle}
                    onSubmit={onSubmit}
                />)

            else nodes.push(<p>Invalid puzzle</p>)
        })
        if (hasLockedPuzzle)
            nodes.push(<LockedPuzzleComponent
                key={"lockedIn"+room.id} 
            />)
        if (solvedPuzzles.length > 0){
            nodes.push(
                <div className="solved-puzzles-container">
                    {solvedPuzzles}
                </div>
            );
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
