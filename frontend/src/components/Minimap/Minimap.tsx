import './Minimap.css';
import { EscapeRoom, Room, RoomStatus } from '../../interfaces';
import { useEffect } from 'react';

type MinimapProps = {
    escapeRoom: EscapeRoom;
    currentRoom: Room;
    roomStatus: RoomStatus[];
};

function Minimap ({escapeRoom, currentRoom, roomStatus}: MinimapProps) {
    let xs = escapeRoom.rooms.map((room) => room.x);
    let ys = escapeRoom.rooms.map((room) => room.y);
    let minX = Math.min(...xs);
    let maxX = Math.max(...xs);
    let minY = Math.min(...ys);
    let maxY = Math.max(...ys);
    let w = maxX - minX + 1
    let h = maxY - minY + 1
    let cellSize = 40

    let nodes: JSX.Element[] = [];
    let roomIdx: number;
    let room: Room;
    let key: string;
    let color: string;
    
    for (let y = maxY; y >= minY; y--) {
        for (let x = minX; x <= maxX; x++) {
            key = `minimap-element-${x}-${y}`;
            roomIdx = escapeRoom.rooms.findIndex((room) => room.x === x && room.y === y)
            if (roomIdx === -1) {
                nodes.push(<div key={key}></div>)
                continue
            }
            room = escapeRoom.rooms[roomIdx];
            color = currentRoom.id === room.id ? "red" : "rgb(170,170,170)"
            nodes.push(<div key={key} className='minimap-element'>
                <div 
                    className='minimap-element-square w-75 h-75 m-auto'
                    style={{backgroundColor: color}}
                >
                    {roomStatus[roomIdx].solved   && <div className='puzzle-solved-status   notification-dot'></div>}
                    {roomStatus[roomIdx].unlocked && <div className='puzzle-unlocked-status notification-dot'></div>}
                    {roomStatus[roomIdx].hint     && <div className='puzzle-hint-status     notification-dot'></div>}
                </div>
                {room.left  !== -1 && <div className='minimap-line' style={{left: 0}}  ></div>}
                {room.right !== -1 && <div className='minimap-line' style={{right: 0}} ></div>}
                {room.up    !== -1 && <div className='minimap-line' style={{top: 0}}   ></div>}
                {room.down  !== -1 && <div className='minimap-line' style={{bottom: 0}}></div>}
            </div>)
        }
    }

    useEffect(() => {
        document.querySelectorAll('.notification-dot').forEach((element) => {
            element.classList.remove('notification-dot');
            void element.clientWidth;
            element.classList.add('notification-dot');
        });
    }, [roomStatus]);

    return (
        <div 
            className='minimap-container' 
            style={{
                gridTemplateColumns: `repeat(${w}, 1fr)`,
                gridTemplateRows: `repeat(${h}, 1fr)`,
                width: `${w*cellSize}px`,
                height: `${h*cellSize}px`,
            }}
        >
            {nodes}
        </div>
    );
}

export default Minimap;