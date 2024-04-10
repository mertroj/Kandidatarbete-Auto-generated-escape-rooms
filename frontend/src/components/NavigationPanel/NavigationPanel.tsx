import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationPanel.css';
import { EscapeRoom, Room } from '../../interfaces';
import clickSound from '../../assets/sounds/navigation-click.wav';
import withClickAudio from '../withClickAudioComponent';

type NavigationPanelProps = {
    gameId?: string;
    currentRoom?: Room;
    escapeRoom?: EscapeRoom;
    moveLeft: () => void;
    moveRight: () => void;
    moveUp: () => void;
    moveDown: () => void;
};

const NavigationAudioClickButton = withClickAudio('button', clickSound);
function NavigationPanel (props: NavigationPanelProps) {
    const { gameId, currentRoom, escapeRoom, moveLeft, moveRight, moveUp, moveDown } = props;

    return (
        <div className='navigation-window d-flex flex-column text-center justify-content-between'>
            {/* The map of the rooms should go here */ <p>Map place holder text</p>}
            <div>
            {gameId ? (
                <p>Game ID: {gameId}</p>
            ) : null}
            {currentRoom && escapeRoom ? (
                <div className="d-flex justify-content-center">
                    {currentRoom.left ? (
                        <NavigationAudioClickButton onClick={moveLeft} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.left)}>Move Left</NavigationAudioClickButton>
                    ) : null}
                    {currentRoom.right ? (
                        <NavigationAudioClickButton onClick={moveRight} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.right)}>Move Right</NavigationAudioClickButton>
                    ) : null}
                    {currentRoom.up ? (
                        <NavigationAudioClickButton onClick={moveUp} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.up)}>Move Up</NavigationAudioClickButton>
                    ) : null}
                    {currentRoom.down ? (
                        <NavigationAudioClickButton onClick={moveDown} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.down)}>Move Down</NavigationAudioClickButton>
                    ) : null}
                </div>
            ) : null}
            </div>
        </div>
    );
}

export default NavigationPanel;