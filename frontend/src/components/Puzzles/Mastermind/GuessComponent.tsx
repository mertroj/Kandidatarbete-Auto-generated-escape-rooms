import { useEffect, useState } from "react";
import './Guess.css';
import { Col, Row } from "react-bootstrap";

interface GuessComponentProps {
    length: number;
    guess: string;
    animation: boolean;
    feedback?: string;
}

function GuessComponent({length, guess, feedback, animation}: GuessComponentProps) {
    const [backgroundColor, setBackgroundColor] = useState<string[]>(new Array(length).fill('transparent'));
    const animationDuration = 500; // ms

    const getColor = (feedbackChar: string) => {
        switch (feedbackChar) {
            case '0':
                return 'grey';
            case '1':
                return 'yellow';
            case '2':
                return 'green';
            default:
                return 'transparent'; // default color
        }
    }

    useEffect(() => {
        if (feedback) {
            if (!animation) {
                setBackgroundColor(feedback.split('').map(getColor));
            } else {
                let timeoutId: NodeJS.Timeout;
                for (let i = 0; i < length; i++) {
                    timeoutId = setTimeout(() => {
                        setBackgroundColor(prevState => {
                            const newState = [...prevState];
                            newState[i] = getColor(feedback.charAt(i));
                            return newState;
                        });
                    }, ((i + 1) * animationDuration) / 2);
                }
                return () => clearTimeout(timeoutId);
            }
        }
    }, []);

    return (
        <div className={'grid-container d-flex flex-row'}>
            {Array.from({length: length}, (_, i) => {
                return  <div 
                            key={i} 
                            className={'grid-item ' + (animation ? 'animated' : '')} 
                            style={{
                                backgroundColor: backgroundColor[i],
                                animationDelay: (animation ? `${i * animationDuration / 2}ms` : '0s')
                            }}
                        >
                            <input
                                className='text-center input-box'
                                type='text'
                                value={(i < guess.length) ? guess[i] : ''}
                                disabled={true}/>
                        </div>
            })}
        </div>
    );
}
export default GuessComponent;