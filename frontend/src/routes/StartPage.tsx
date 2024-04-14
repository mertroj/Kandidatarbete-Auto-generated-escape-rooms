import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function StartPage() {
    const {gameId} = useParams();
    const [introText, setIntroText] = useState<string[]>([]);
    const [displayedText, setDisplayedText] = useState<string>('');
    const [showStartButton, setShowStartButton] = useState<boolean>(false);
    const [paraIndex, setParaIndex] = useState<number>(0);
    const [charIndex, setCharIndex] = useState<number>(0);

    function startEscapeRoom() {
        window.location.pathname = `/escaperoom/${gameId}`;
    }

    async function fetchIntroText(){
        if (localStorage.getItem('introText')) {
            setIntroText(localStorage.getItem('introText')!.split('\n'));
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/chatGPT/introText`, {gameId: gameId});
            localStorage.setItem('introText', response.data);
            setIntroText(response.data.split('\n'));
        } catch (error) {
            console.error('Failed to fetch intro text:', error);
        }
    }

    useEffect(() => {
        fetchIntroText();
    }, []);

    useEffect(() => {
        return () => {
            localStorage.removeItem('introText');
        };
    }, []);

    useEffect(() => {
        if (introText.length > 0) {
            const timer = setInterval(() => {
                if (paraIndex >= introText.length) {
                    clearInterval(timer);
                    setShowStartButton(true);
                    return;
                }

                setDisplayedText((prevText) => prevText + introText[paraIndex].charAt(charIndex));
                setCharIndex((prevIndex) => prevIndex + 1);

                if (charIndex >= introText[paraIndex].length) {
                    setDisplayedText((prevText) => prevText + '<br>');
                    setParaIndex((prevIndex) => prevIndex + 1);
                    setCharIndex(0);
                }
            }, 25);
    
            return () => clearInterval(timer);
        }
    }, [introText, paraIndex, charIndex]);

    return (
        <div className='text-center' style={{margin:'5% 10% 0 10%'}}>
            {(displayedText !== '') &&
                <>
                    <p dangerouslySetInnerHTML={{ __html: displayedText }} />
                    {showStartButton &&
                    <button onClick={startEscapeRoom}>
                        Enter the room
                    </button>
                    }
                </>
            }
        </div>
    );
}

export default StartPage;