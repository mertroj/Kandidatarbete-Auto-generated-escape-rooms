import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const MathPuzzle = ({estimatedTime}: {estimatedTime: number})=> {
    const [puzzle, setPuzzle] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPuzzle() {
            try {
                const response = await axios.get<string>(
                    `http://localhost:8080/generatePuzzle?estimatedTime=${estimatedTime}`
                );
                setPuzzle(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchPuzzle();
    }, []); // Array empty => Fetch puzzle once

    return (
    <div>
        <h1>You have approx. {puzzle}</h1>
        <p>{puzzle}</p>
    </div>
    );
}
export default MathPuzzle;