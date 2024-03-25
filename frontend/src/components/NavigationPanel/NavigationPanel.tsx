import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationPanel.css';
import { EscapeRoom, Room } from '../../interfaces';

type NavigationPanelProps = {
    gameId?: string;
    currentRoom?: Room;
    escapeRoom?: EscapeRoom;
    moveLeft: () => void;
    moveRight: () => void;
    moveUp: () => void;
    moveDown: () => void;
};

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
                        <button onClick={moveLeft} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.left)}>Move Left</button>
                    ) : null}
                    {currentRoom.right ? (
                        <button onClick={moveRight} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.right)}>Move Right</button>
                    ) : null}
                    {currentRoom.up ? (
                        <button onClick={moveUp} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.up)}>Move Up</button>
                    ) : null}
                    {currentRoom.down ? (
                        <button onClick={moveDown} disabled={!escapeRoom.rooms.find((room) => room.id === currentRoom.down)}>Move Down</button>
                    ) : null}
                </div>
            ) : null}
            </div>
        </div>
    );
}

export default NavigationPanel;