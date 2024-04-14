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
    updateRoom: () => void;
    notifyIncorrectAnswer: () => void;
    puzzleSolved: (puzzleId: string, unlockedPuzzles: string[]) => void;
}

function RoomComponent ({room, updateRoom, notifyIncorrectAnswer, puzzleSolved}: RoomComponentProps) {

    return (
        <div className='justify-content-center puzzle-grid overflow-y-scroll'>
            {
                room.puzzles.map((puzzle, i) => {
                    if (puzzle.isLocked || puzzle.isSolved) return null;
        
                    if (puzzle.type === 'anagram')
                        return <AnagramComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as AnagramPuzzle}
                            i={i+1}
                            updateRoom={updateRoom}
                            notifyIncorrectAnswer={notifyIncorrectAnswer}
                            puzzleSolved={puzzleSolved}
                        />
                        
                    if (puzzle.type === 'lettersMathPuzzle')
                        return <LettersMathPuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as LettersMathPuzzle}
                            i={i+1}
                            updateRoom={updateRoom}
                            notifyIncorrectAnswer={notifyIncorrectAnswer}
                            puzzleSolved={puzzleSolved}
                        />
        
                    if (puzzle.type === 'operatorMathPuzzle') 
                        return <OperatorMathPuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as OperatorsMathPuzzle}
                            i={i+1}
                            updateRoom={updateRoom}
                            notifyIncorrectAnswer={notifyIncorrectAnswer}
                            puzzleSolved={puzzleSolved}
                        />
                                
                    if (puzzle.type === 'slidePuzzle') 
                        return <SlidePuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as SlidePuzzle}
                            i={i+1}
                            updateRoom={updateRoom}
                            notifyIncorrectAnswer={notifyIncorrectAnswer}
                            puzzleSolved={puzzleSolved}
                        />
        
                    if (puzzle.type === 'mastermindPuzzle')
                        return <MastermindPuzzleComponent 
                            key={puzzle.id}
                            puzzle={puzzle as MastermindPuzzle}
                            i={i+1}
                            updateRoom={updateRoom}
                            notifyIncorrectAnswer={notifyIncorrectAnswer}
                            puzzleSolved={puzzleSolved}
                        />
        
                    else return <p>Invalid puzzle</p>
                })
            }
            {room.puzzles.some((puzzle) => puzzle.isLocked) && <LockedPuzzleComponent key={"lockedIn"+room.id} />}
            {room.puzzles.some((puzzle) => puzzle.isSolved) && 
                <div className="solved-puzzles-container">
                    {
                        room.puzzles.filter((puzzle) => puzzle.isSolved).map((puzzle, i) => {
                            return <SolvedPuzzleComponent
                                    key={puzzle.id}
                                    style={{
                                        position: 'absolute',
                                        top: `${i * 10}px`,
                                        left: `${i * 10}px`
                                    }}
                                />
                        })
                    }
                </div>
            }
        </div>
    );
}

export default RoomComponent;
