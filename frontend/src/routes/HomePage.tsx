import { Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';


function HomePage() {
    const [gameCode, setGameCode] = useState('')

    const startEscapeRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const searchParams = 'players=' + formData.get('players') + '&difficulty=' + formData.get('difficulty') + '&theme=' + formData.get('theme')
        axios.get('http://localhost:8080/creategame/?'+searchParams).then((res) => {
            window.location.pathname = '/escaperoom/' + res.data
        }).catch((error) => {
            console.error(error)
        })
    }

    const joinGameTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameCode(e.currentTarget.value)
    }
    const joinGame = () => {
        window.location.pathname = '/escaperoom/' + gameCode
    }


    return (
        <div className='text-center mt-5 d-flex flex-column justify-content-center mx-auto'>
            <Row>
                <h1>THE BEST ESCAPE ROOM GENERATOR :)</h1>
            </Row>
            <Row className='text-center'>
                <p>
                    Welcome to the best escape room generator :)
                    <br></br>
                    <br></br>
                    In each menu at the bottom make sure to select the amount of players (1-4), the desired difficulty
                    and the theme for the escape room.
                    <br></br>
                    <br></br>
                    You will have a limited amount of minutes in order to complete the room, but don't get too hung up
                    on a puzzle, you might not have gotten every piece necessary just yet!
                    <br></br>
                    <br></br>
                    If you ever feel stuck just click on the “Hint” button on the right side of the page.
                </p>
            </Row>
            <form className='d-flex justify-content-center flex-column align-items-center'
                  onSubmit={e => startEscapeRoom(e)}>
                <div className='w-100 d-flex justify-content-around'>
                    <select
                        name="players"
                        id="players"
                        required
                    >
                        <option value="" hidden>Amount of Players</option>
                        <option value="1">1 player</option>
                        <option value="2">2 players</option>
                        <option value="3">3 players</option>
                        <option value="4">4 players</option>
                    </select>
                    <select
                        name="difficulty"
                        id="difficulty"
                        required
                    >
                        <option value="" hidden>Difficulty</option>
                        <option value="1">Easy</option>
                        <option value="2">Medium</option>
                        <option value="3">Hard</option>
                    </select>
                    <select
                        name="theme"
                        id="theme"
                        required
                    >
                        <option value="" hidden>Theme</option>
                        <option value="magical_workshop">Magical workshop</option>
                    </select>
                </div>
                <button className='d-flex justify-content-center mt-4 w-25 100vh' type='submit'>Create Game</button>
            </form>
            <div className='fixed-bottom mb-5'>
                <input type="text" placeholder='Enter gamecode here' onChange={(e) => joinGameTextChange(e)}/>
                <button onClick={joinGame}>Join game</button>
            </div>
            <a href={"/escaperoom/jigsawtest"}>Jigsaw Test</a>
        </div>


    );
}

export default HomePage;