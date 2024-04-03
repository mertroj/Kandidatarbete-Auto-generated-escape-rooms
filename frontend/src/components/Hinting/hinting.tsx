import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hinting.css';
import { Room } from '../../interfaces';

interface HintingProps {
    currentRoom: Room;
    hintsUpdatedFlag: boolean;
}

function Hinting ({currentRoom, hintsUpdatedFlag} : HintingProps) {
    const [hints, setHints] = useState<JSX.Element[]>();
    const [showHints, setShowHints] = useState<Set<string>>(new Set())

    function toggleShowHints(puzzleId: string): void {
        if (showHints.has(puzzleId)){
            showHints.delete(puzzleId);
        } else {
            showHints.add(puzzleId);
        }
        setShowHints(new Set(showHints));
    }

    useEffect(() => {
        let puzzleI = 0;
        let hintI: number;
        let puzzleHints: JSX.Element[] = [];
        currentRoom.puzzles.forEach((puzzle) => {
            puzzleI++;
            if (puzzle.isLocked) return;
            if (typeof puzzle.hints == "number") return;
            if (puzzle.hints.length === 0) return;
            hintI = 0;
            puzzleHints.push(<div key={puzzle.id}>
                <div onClick={() => toggleShowHints(puzzle.id)} className='d-flex flex-row justify-content-between'>
                    <h6 className=''>
                        Puzzle {puzzleI} - {puzzle.hints.length} {puzzle.hints.length == 1 ? 'hint' : 'hints'}
                    </h6>
                    <h6>{showHints.has(puzzle.id) ? 'v' : '>'}</h6>
                </div>
                {showHints.has(puzzle.id) && <div>
                    {puzzle.hints.map((hint) => <p key={hintI++}>{hint}</p>)}
                </div>}
            </div>);
        });

        setHints(puzzleHints);
        // setHintNodes(hints.map(hint => <p key={i++}>{hint}</p>))
    }, [currentRoom, showHints, hintsUpdatedFlag]);

    return (

        <div className={'hint-window d-flex flex-column text-center'}>
            <h2>Hints list:</h2>
            <div className='hint-container overflow-y-scroll'>
                {hints}
            </div>
        </div>
    );
}

export default Hinting;