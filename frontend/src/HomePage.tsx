import { Button, Container, Row, Col, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {CSSProperties} from "react";


function HomePage({children}: { children: React.ReactNode } ) {
    return (
        <div>
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
            <Row className='mt-4'>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Amount of Players
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">1</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">2</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">3</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">4</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Difficulty
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Easy</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Medium</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Hard</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Theme
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Magical workshop</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            {children}

        </div>
    );
}

export default HomePage;