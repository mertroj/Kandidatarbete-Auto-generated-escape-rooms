import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hinting.css'




function Hinting ({hintsList} : {hintsList : string[]}) {
    const [hintNodes, setHintNodes] = useState<JSX.Element[]>([])

    useEffect(() => {
        let i = 0;
        setHintNodes(hintsList.reverse().map(hint => <p key={i++}>{hint}</p>))
    }, [hintsList])

    return (
        <div className={'hint-window d-flex flex-column text-center vh-100'}>
            <h2>Hints list:</h2>
            <div className='hint-container overflow-y-scroll'>
                {hintNodes}
            </div>
        </div>
    );
}

export default Hinting;