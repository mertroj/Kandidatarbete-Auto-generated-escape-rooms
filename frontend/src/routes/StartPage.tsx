import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { start } from 'repl';

function StartPage() {
    const {gameId} = useParams();
    const [introText, setIntroText] = useState<string>('');

    function startEscapeRoom() {
        window.location.pathname = `/escaperoom/${gameId}`;
    }
    async function fetchIntroText(){
        const response = await axios.post(`http://localhost:8080/chatGPT/introText`, {gameId: gameId});
        setIntroText(response.data);
    }

    useEffect(() => {
        fetchIntroText();
    }, []);

    return (
        <div className='text-center'>
            {(introText !== '') &&
                <>
                    <p>{introText}</p>
                    <button onClick={startEscapeRoom}>
                        Enter the room
                    </button>
                </>
            }
        </div>
    );
}

export default StartPage;