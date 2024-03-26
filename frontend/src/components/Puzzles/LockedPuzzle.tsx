import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './puzzles.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


function LockedPuzzleComponent () {
    const {gameId} = useParams();
    const [description, setDescription] = useState<string>('');

    async function fetchDescription() {
        try {
            const response = await axios.get('http://localhost:8080/lockedPuzzle/description/?gameId=' + gameId);
            setDescription(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchDescription();
    }, []);

    return (
        <div className='puzzle text-center'>
            {description}
        </div>
    );
}

export default LockedPuzzleComponent;
