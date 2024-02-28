import React from 'react';

interface HintProps{
    hint: string;
}

function Hint({hint}: HintProps) {

    return (
        <div>
            {hint.split('|').map((item, key) => {
                return <span key={key}>{item}<br/></span>
            })}
        </div>
    );
}

export default Hint;