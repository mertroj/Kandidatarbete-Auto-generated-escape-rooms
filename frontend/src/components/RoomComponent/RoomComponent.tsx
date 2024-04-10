import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomComponent.css'
import {JigsawPuzzle, SlidePuzzle, Room, AnagramPuzzle, LettersMathPuzzle, OperatorsMathPuzzle, Puzzle, MastermindPuzzle} from '../../interfaces';
// import JigsawPuzzleComponent from "../Puzzles/JigsawPuzzleComponent";
import SlidePuzzleComponent from '../Puzzles/SlidePuzzleComponent';
import SolvedPuzzleComponent from '../Puzzles/SolvedPuzzleComponent';
import LockedPuzzleComponent from '../Puzzles/LockedPuzzleComponent';
import MastermindPuzzleComponent from "../Puzzles/Mastermind/MastermindPuzzleComponent";
import AnagramComponent from "../Puzzles/AnagramPuzzleComponent";
import LettersMathPuzzleComponent from "../Puzzles/LettersMathPuzzleComponent";
import OperatorMathPuzzleComponent from "../Puzzles/OperatorMathPuzzleComponent";

interface RoomComponentProps {
    room: Room;
    updateRoom: () => void;
}

function RoomComponent ({room, updateRoom}: RoomComponentProps) {

    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            {
                room.puzzles.map((puzzle) => {
                    if (puzzle.isLocked) return null;
                        
                    if (puzzle.isSolved)
                        return <SolvedPuzzleComponent
                            key={puzzle.id} 
                        />
        
                    if (puzzle.type === 'anagram')
                        return <AnagramComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as AnagramPuzzle} 
                            updateRoom={updateRoom}
                        />
                        
                    if (puzzle.type === 'lettersMathPuzzle')
                        return <LettersMathPuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as LettersMathPuzzle} 
                            updateRoom={updateRoom}
                        />
        
                    if (puzzle.type === 'operatorMathPuzzle') 
                        return <OperatorMathPuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as OperatorsMathPuzzle} 
                            updateRoom={updateRoom}
                        />
                                
                    if (puzzle.type === 'slidePuzzle') 
                        return <SlidePuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as SlidePuzzle} 
                            updateRoom={updateRoom}
                        />
        
                    if (puzzle.type === 'mastermindPuzzle')
                        return <MastermindPuzzleComponent 
                            key={puzzle.id}
                            puzzle={puzzle as MastermindPuzzle}
                            updateRoom={updateRoom}
                        />
        
                    else return <p>Invalid puzzle</p>
                })
            }
            {room.puzzles.some((puzzle) => puzzle.isLocked) && <LockedPuzzleComponent key={"lockedIn"+room.id} />}
        </div>
    );
}

export default RoomComponent;
