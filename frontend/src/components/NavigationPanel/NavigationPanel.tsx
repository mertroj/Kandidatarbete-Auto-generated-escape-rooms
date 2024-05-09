import './NavigationPanel.css';
import { EscapeRoom, Room, RoomStatus } from '../../interfaces';
import Minimap from '../Minimap/Minimap';
import { useParams } from 'react-router-dom';


type NavigationPanelProps = {
    currentRoom: Room;
    escapeRoom: EscapeRoom;
    roomStatus: RoomStatus[];
    move: (roomIdx: number) => void;
};
function NavigationPanel ({currentRoom, escapeRoom, roomStatus, move}: NavigationPanelProps) {
    const {gameId} = useParams();

    function copyGameId() {
        if (gameId) {
            navigator.clipboard.writeText(gameId);
            alert("Copied the Game ID to you clipboard!")
        }
    }

    return (
        <div className='navigation-window d-flex flex-column text-center'>

            <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
                <Minimap
                    escapeRoom={escapeRoom}
                    currentRoom={currentRoom}
                    roomStatus={roomStatus}
                />
            </div>

            <div>
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
                <div className='copy-game-id' onClick={() => copyGameId()}>
                    <p>Copy Game ID to clipboard</p>
                </div>
            </div>
        </div>
    );
}

export default NavigationPanel;