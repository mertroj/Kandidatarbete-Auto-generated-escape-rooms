import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hinting.css'




function Hinting ({hintsList} : {hintsList : string[]}) {
    const [showHints, setShowHints] = useState(false)
    const [hintNodes, setHintNodes] = useState<JSX.Element[]>([])

    const showHintsClick = () => {
        setShowHints(!showHints)
    }

    useEffect(() => {
        setHintNodes(hintsList.map(hint => <p>{hint}</p>))
    }, [hintsList])

    return (
        <div>
            <div className={'hint-window d-flex flex-column text-center h-50' + (showHints ? ' hints-slide-in' : '')} style={{right: showHints ? '-400px' : 0}}>
                <h2>Hints list:</h2>
                <div className='hint-container overflow-y-scroll'>
                    {hintNodes}
                </div>
            </div>

            <button onClick={showHintsClick} className='hint-button'>
                Hints
            </button>
        </div>
    );
}

export default Hinting;