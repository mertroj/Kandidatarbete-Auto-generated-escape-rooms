import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'

interface SolvedPuzzleProps {
    style: React.CSSProperties;
}

function SolvedPuzzleComponent ({style}: SolvedPuzzleProps) {

    return (
        <div className='puzzle-card' style={style}>
            <b>Solved</b>
        </div>
    );
}

export default SolvedPuzzleComponent;
