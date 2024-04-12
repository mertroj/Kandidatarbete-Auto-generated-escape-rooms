import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hinting.css';
import { EscapeRoom, Room } from '../../interfaces';

interface HintingProps {
    escapeRoom: EscapeRoom;
    currentRoom: Room;
}

function Hinting ({escapeRoom, currentRoom} : HintingProps) {
    const [showHints, setShowHints] = useState<boolean[]>(new Array(currentRoom.puzzles.length).fill(true));

    function toggleShowHints(puzzleI: number): void {
        showHints[puzzleI] = !showHints[puzzleI]
        setShowHints([...showHints]);
    }

    function totalHintsUsed(): number {
        return escapeRoom?.rooms.reduce((total, room) => total + room.puzzles.reduce((acc, puzzle) => 
            acc + (typeof puzzle.hints === 'number' ? puzzle.hints : puzzle.hints.length)
        , 0), 0);
    }

    return (

        <div className={'hint-window d-flex flex-column text-center'}>
            <h2>Hints list:</h2>
            <div className='hint-container overflow-y-scroll'>
                {
                    currentRoom.puzzles.map((puzzle, puzzleI) => {
                        if (puzzle.isLocked || puzzle.isSolved) return null;
                        // console.log(puzzle.hints)
            
                        if (typeof puzzle.hints === "number"){
                            if (puzzle.hints > 0){
                                return <div className='d-flex' key={puzzleI}>
                                    <h6>
                                        {`Puzzle ${puzzleI+1} - ${puzzle.hints} ${puzzle.hints === 1 ? 'hint' : 'hints'}`}
                                    </h6>
                                </div>
                            } else return null;
                        }
                        if (puzzle.hints.length !== 0) {
                            return <div key={puzzleI}>
                                <div onClick={() => toggleShowHints(puzzleI)} className='d-flex flex-row justify-content-between hint-dropdown-button'>
                                    <h6>
                                        Puzzle {puzzleI+1} - {puzzle.hints.length} {puzzle.hints.length === 1 ? 'hint' : 'hints'}
                                    </h6>
                                    <h6>{showHints[puzzleI] ? 'v' : '>'}</h6>
                                </div>
                                <div className={'puzzle-hints-wrapper ' + (showHints[puzzleI] ? 'show-hints ' : '')}>
                                    <div className={'overflow-hidden'}>
                                        {(puzzle.hints).map((hint, hintI) => <p key={hintI}>{hint}</p>)}
                                    </div>
                                </div>
                            </div>
                        };
                        return null;
                    })
                }
            </div>
            <h6 className='mt-auto'>Total hints used: {totalHintsUsed()}</h6>
        </div>
    );
}

export default Hinting;