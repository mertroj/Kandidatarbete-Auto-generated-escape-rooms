import { Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function HomePage() {
    
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
            <form className="w-100">
                <div className='w-100 d-flex justify-content-around'>
                    <select name="players" id="players" required>
                        <option value="" disabled hidden>Amount of Players</option>
                        <option value="1">1 player</option>
                        <option value="2">2 players</option>
                        <option value="3">3 players</option>
                        <option value="4">4 players</option>
                    </select>
                    <select name="players" id="players" required>
                        <option value="" disabled hidden>Difficulty</option>
                        <option value="1">Easy</option>
                        <option value="2">Medium</option>
                        <option value="3">Hard</option>
                    </select>
                    <select name="players" id="players" required>
                        <option value="" disabled hidden>Theme</option>
                        <option value="1">Magical workshop</option>
                    </select>
                </div>
                <Row className='fixed-bottom d-flex justify-content-center'>
                    <a href="/escaperoom/" className='w-50 100vh mb-5'>Start</a>
                </Row>
            </form>


        </div>

    );
}

export default HomePage;