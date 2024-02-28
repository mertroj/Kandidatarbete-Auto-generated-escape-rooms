import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hinting.css'




function Hinting () {
    let [showHints, setShowHints] = useState(false)

    const showHintsClick = () => {
        setShowHints(!showHints)
    }

    return (
        <div>

            <div className={'hint-window ' + (showHints ? 'hints-slide-in hints-visible' : 'hints-slide-out')}>
                <h2>Hints list:</h2>
                
                <p>hint 1</p>
                <p>hint 2</p>
            </div>

            <button onClick={showHintsClick} className='hint-button'>
                Hints
            </button>

        </div>
    );
}

export default Hinting;