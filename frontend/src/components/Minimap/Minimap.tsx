import './Minimap.css';
import { EscapeRoom, Room } from '../../interfaces';

type MinimapProps = {
    escapeRoom: EscapeRoom;
    currentRoom: Room
};

function Minimap ({escapeRoom, currentRoom}: MinimapProps) {
    let xs = escapeRoom.rooms.map((room) => room.pos[0]);
    let ys = escapeRoom.rooms.map((room) => room.pos[1]);
    let minX = Math.min(...xs);
    let maxX = Math.max(...xs);
    let minY = Math.min(...ys);
    let maxY = Math.max(...ys);
    let w = maxX - minX + 1
    let h = maxY - minY + 1
    let cellSize = 40

    let nodes: JSX.Element[] = [];
    let room: Room|undefined;
    let key: string;
    let color: string;
    for (let y = maxY; y >= minY; y--) {
        for (let x = minX; x <= maxX; x++) {
            key = `minimap-element-${x}-${y}`;
            room = escapeRoom.rooms.find((room) => room.pos[0] === x && room.pos[1] === y)
            if (!room) {
                nodes.push(<div key={key}></div>)
                continue
            }
            color = currentRoom.id === room.id ? "red" : "rgb(150,150,150)"
            nodes.push(<div key={key} className='minimap-element'>
                <div 
                    className='minimap-element-square w-75 h-75 m-auto'
                    style={{backgroundColor: color}}
                ></div>
                {room.left  !== -1 && <div className='minimap-line' style={{left: 0}}  ></div>}
                {room.right !== -1 && <div className='minimap-line' style={{right: 0}} ></div>}
                {room.up    !== -1 && <div className='minimap-line' style={{top: 0}}   ></div>}
                {room.down  !== -1 && <div className='minimap-line' style={{bottom: 0}}></div>}
            </div>)
        }
    }

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