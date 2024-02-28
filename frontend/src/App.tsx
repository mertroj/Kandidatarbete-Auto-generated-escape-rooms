import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import HomePage from "./HomePage";
import {Button, Container, Row} from "react-bootstrap";
import PuzzleStart from "./PuzzleStart"; //import this and use it whenever you want to make a request to the backend

// Component for Page 1
function Page1() {
    return <div>This is Page 1</div>;
}

// Component for Page 2
function Page2() {
    return <div>This is Page 2</div>;
}

// Main App component
function App() {

    const [currentPage, setCurrentPage] = useState('HomePage');

    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };

    // Render the appropriate page based on currentPage state
    let pageContent;
    if (currentPage === 'HomePage') {
        const navigation =
            <Row className='fixed-bottom d-flex justify-content-center'>
                <Button className='w-50 100vh mb-5' onClick={() => handlePageChange('PuzzleStart')}>Start</Button>
            </Row>;
        pageContent = <HomePage children={navigation} />;
    } else if (currentPage === 'PuzzleStart') {
        pageContent = <PuzzleStart />;
    }


    return (
        <Container className='text-center mt-5 min-vh-100 justify-content-center'>
            <nav>
            </nav>
            {pageContent}
        </Container>
    );
}

export default App;
