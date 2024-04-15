import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationPanel.css';
import { EscapeRoom, Room } from '../../interfaces';
import clickSound from '../../assets/sounds/navigation-click.wav';
import withClickAudio from '../withClickAudioComponent';

type NavigationPanelProps = {
    gameId?: string;
    currentRoom?: Room;
    escapeRoom?: EscapeRoom;
    move: (roomIdx: number) => void;
};

const NavigationAudioClickButton = withClickAudio('button', clickSound);
function NavigationPanel (props: NavigationPanelProps) {
    const { gameId, currentRoom, escapeRoom, move } = props;

    return (
        <div className='navigation-window d-flex flex-column text-center justify-content-between'>
            {/* The map of the rooms should go here */ <p>Map place holder text</p>}
            <div>
            {gameId ? (
                <p>Game ID: {gameId}</p>
            ) : null}
            {currentRoom && escapeRoom ? (
                <div className="d-flex justify-content-center">
                    {currentRoom.left !== -1 && <button onClick={() => move(currentRoom.left)} >Move Left</button>}
                    {currentRoom.right !== -1 && <button onClick={() => move(currentRoom.right)} >Move Right</button>}
                    {currentRoom.up !== -1 && <button onClick={() => move(currentRoom.up)} >Move Up</button>}
                    {currentRoom.down !== -1 && <button onClick={() => move(currentRoom.down)} >Move Down</button>}
                </div>
            ) : null}
            </div>
        </div>
    );
}

export default NavigationPanel;