import './NavigationPanel.css';
import { EscapeRoom, Room, RoomStatus } from '../../interfaces';
import clickSound from '../../assets/sounds/navigation-click.wav';
import withClickAudio from '../withClickAudioComponent';
import Minimap from '../Minimap/Minimap';


type NavigationPanelProps = {
    gameId: string;
    currentRoom: Room;
    escapeRoom: EscapeRoom;
    roomStatus: RoomStatus[];
    move: (roomIdx: number) => void;
};

const NavigationAudioClickButton = withClickAudio('button', clickSound);
function NavigationPanel ({gameId, currentRoom, escapeRoom, roomStatus, move}: NavigationPanelProps) {
    return (
        <div className='navigation-window d-flex flex-column text-center'>
            {currentRoom && escapeRoom && (
                <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
                    <Minimap
                        escapeRoom={escapeRoom}
                        currentRoom={currentRoom}
                        roomStatus={roomStatus}
                    />
                </div>
            )}
            <div>
                {currentRoom && escapeRoom && (
                    <div className="navigation-grid">
                        <div className='navigation-grid-row'>
                            <button 
                                onClick={() => move(currentRoom.up)} 
                                style={{gridColumn: 2}}
                                disabled={currentRoom.up === -1}
                            >Up</button>
                        </div>
                        <div className='navigation-grid-row'>
                            <button 
                                onClick={() => move(currentRoom.left)} 
                                style={{gridColumn: 1}}
                                disabled={currentRoom.left === -1}
                            >Left</button>
                            <button 
                                onClick={() => move(currentRoom.right)} 
                                style={{gridColumn: 3}}
                                disabled={currentRoom.right === -1}
                            >Right</button>
                        </div>
                        <div className='navigation-grid-row'>
                            <button 
                                onClick={() => move(currentRoom.down)} 
                                style={{gridColumn: 2}}
                                disabled={currentRoom.down === -1}
                            >Down</button>
                        </div>
                    </div>
                )}
                {gameId && (
                    <p>Game ID: {gameId}</p>
                )}
            </div>
        </div>
    );
}

export default NavigationPanel;