import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css'

function SolvedPuzzleComponent ({style}: {style: React.CSSProperties}) {

    return (
        <div className='puzzle' style={style}>
            <b>Solved</b>
        </div>
    );
}

export default SolvedPuzzleComponent;
