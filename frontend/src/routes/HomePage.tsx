import { Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import Select, { ActionMeta } from 'react-select';
import clickSound from '../assets/sounds/navigation-click.wav';
import withClickAudio from '../components/withClickAudioComponent';
const NavigationAudioClickButton = withClickAudio('button', clickSound);

type OptionType = { value: string; label: string; };

function HomePage() {
    const [gameCode, setGameCode] = useState('');
    const [selectedExclusions, setSelectedExclusions] = useState<readonly OptionType[]>([]);
    const exclusionLimit = 2;

    const handleExclusionChange = (selectedOptions: readonly OptionType[], actionMeta: ActionMeta<OptionType>) => {
        if (selectedOptions.length > exclusionLimit) {
            return;
        } else {
            setSelectedExclusions(selectedOptions);
        }
    };
    const exclusionOptions = [
        { value: 'slidePuzzle', label: 'Slide' },
        { value: 'memoryPuzzle', label: 'Memory' },
        { value: 'anagram', label: 'Anagram' },
        { value: 'mastermindPuzzle', label: 'Mastermind' },
        { value: 'lettersMathPuzzle', label: 'Number Math' },
        { value: 'operatorMathPuzzle', label: 'Operator Math' },
    ];
    const difficultyOptions = [
        { value: '1', label: 'Easy' },
        { value: '2', label: 'Medium' },
        { value: '3', label: 'Hard' },
    ];
    const themeOptions = [
        { value: 'magical_workshop', label: 'Magical Workshop' },
        { value: "pharoah's_tomb", label: 'Pharoah\'s Tomb' },
    ];
    const playerOptions = [
        { value: '1', label: '1 player' },
        { value: '2', label: '2 players' },
        { value: '3', label: '3 players' },
        { value: '4', label: '4 players' },
    ];
    const selectStyle = {
        control: (base: any) => ({
          ...base,
          backgroundColor: 'rgba(233,232,236,255)',
          color: 'black',
          boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.2)',
        }),
        placeholder: (base: any) => ({
            ...base,
            color: 'black',
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            fontSize: '1em', // Set this to your desired font size
        }),
    };

    const startEscapeRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const searchParams = 'players=' + formData.get('players') + '&difficulty=' + formData.get('difficulty') + '&theme=' + formData.get('theme') +
            '&exclusions=' + (formData.getAll('exclusions') as string[]).join(',');
        axios.get('http://localhost:8080/creategame/?'+searchParams).then((res) => {
            window.location.pathname = '/escaperoom/' + res.data;
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
                    <Select
                        name="players"
                        id="players"
                        required
                        options={playerOptions}
                        placeholder='Amount of players'
                        isSearchable={false}
                        styles={selectStyle}
                    />
                    <Select
                        name="difficulty"
                        id="difficulty"
                        required
                        options={difficultyOptions}
                        placeholder='Difficulty'
                        isSearchable={false}
                        styles={selectStyle}
                    />
                    <Select
                        name="theme"
                        id="theme"
                        required
                        options={themeOptions}
                        placeholder='Theme'
                        isSearchable={false}
                        styles={selectStyle}
                    />
                    
                    <Select 
                        name='exclusions'
                        id='exclusions'
                        isMulti
                        isSearchable={false}
                        options={exclusionOptions}
                        value={selectedExclusions}
                        onChange={handleExclusionChange}
                        placeholder='Excluded puzzle types'
                        styles={selectStyle}
                    />
                </div>
                <NavigationAudioClickButton className='d-flex justify-content-center mt-4 w-25 100vh' type='submit'>Create Game</NavigationAudioClickButton>
            </form>
            <div className='fixed-bottom mb-5'>
                <input type="text" placeholder='Enter gamecode here' onChange={(e) => joinGameTextChange(e)}/>
                <NavigationAudioClickButton onClick={joinGame}>Join game</NavigationAudioClickButton>
            </div>
        </div>


    );
}

export default HomePage;