import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomComponent.css'
import {
    SlidePuzzle,
    Room,
    AnagramPuzzle,
    LettersMathPuzzle,
    OperatorsMathPuzzle,
    MastermindPuzzle,
    MemoryPuzzle,
    SpotTheDifferencePuzzle
} from '../../interfaces';
import SlidePuzzleComponent from '../Puzzles/SlidePuzzleComponent';
import SolvedPuzzleComponent from '../Puzzles/SolvedPuzzleComponent';
import LockedPuzzleComponent from '../Puzzles/LockedPuzzleComponent';
import MastermindPuzzleComponent from "../Puzzles/Mastermind/MastermindPuzzleComponent";
import AnagramComponent from "../Puzzles/AnagramPuzzleComponent";
import LettersMathPuzzleComponent from "../Puzzles/LettersMathPuzzleComponent";
import OperatorMathPuzzleComponent from "../Puzzles/OperatorMathPuzzleComponent";
import SpotTheDifferenceComponent from "../Puzzles/SpotTheDifferencePuzzleComponent";
import MemoryPuzzleComponent from '../Puzzles/MemoryPuzzleComponent';

interface RoomComponentProps {
    room: Room;
    incorrectAnswer: () => void;
}

function RoomComponent ({room, incorrectAnswer}: RoomComponentProps) {

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
                            incorrectAnswer={incorrectAnswer}
                        />
                        
                    if (puzzle.type === 'lettersMathPuzzle')
                        return <LettersMathPuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as LettersMathPuzzle}
                            i={i+1}
                            incorrectAnswer={incorrectAnswer}
                        />
        
                    if (puzzle.type === 'operatorMathPuzzle') 
                        return <OperatorMathPuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as OperatorsMathPuzzle}
                            i={i+1}
                            incorrectAnswer={incorrectAnswer}
                        />
                                
                    if (puzzle.type === 'slidePuzzle') 
                        return <SlidePuzzleComponent 
                            key={puzzle.id} 
                            puzzle={puzzle as SlidePuzzle}
                            i={i+1}
                        />
        
                    if (puzzle.type === 'mastermindPuzzle')
                        return <MastermindPuzzleComponent 
                            key={puzzle.id}
                            puzzle={puzzle as MastermindPuzzle}
                            i={i+1}
                            incorrectAnswer={incorrectAnswer}
                        />
                    if (puzzle.type === 'spotTheDifference')
                        return <SpotTheDifferenceComponent
                            key={puzzle.id}
                            puzzle={puzzle as SpotTheDifferencePuzzle}
                            i={i+1}
                        />

                    if (puzzle.type === 'memoryPuzzle')
                        return <MemoryPuzzleComponent
                            key={puzzle.id}
                            puzzle={puzzle as MemoryPuzzle}
                            i={i+1}
                            incorrectAnswer={incorrectAnswer}
                        />

                    else return <p>Invalid puzzle</p>
                })
            }
            {room.hasLockedPuzzles && <LockedPuzzleComponent key={"lockedIn"+room.id} />}
            {room.puzzles.some((puzzle) => puzzle.isSolved) && 
                <div className="solved-puzzles-container">
                    {
                        room.puzzles.filter((puzzle) => puzzle.isSolved).map((puzzle, i) => {
                            return <SolvedPuzzleComponent
                                    key={`solved-${puzzle.id}`}
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
