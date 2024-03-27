import { v4 as uuidv4 } from 'uuid';
import { point, randomIntRange, around } from './Helpers';
import { Puzzle } from './Puzzle';
import { Graph } from 'graphlib';
import { puzzleTreePopulator } from './PuzzleTreePopulator';


export class Room {
    private static rooms : {[Key: string]: Room} = {};

    id: string;
    x: number;
    y: number;
    left: string;
    right: string;
    up: string;
    down: string;
    is_unlocked: boolean;
    slots: Puzzle[];

    constructor(x: number, y: number, puzzles: Puzzle[]) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.left = '';
        this.right = '';
        this.up = '';
        this.down = '';
        this.is_unlocked = puzzles.some((puzzle) => !puzzle.isLocked);
        this.slots = puzzles;
        Room.rooms[this.id] = this;
    }

    static get(roomId: string): Room {
        return Room.rooms[roomId];
    }

    static createRooms(totalTime: number, players: number, difficulty: number): Room[] {
        let visited = new Set();
        let possible_locations: point[] = [[0,0]];
        let rooms: Room[] = [];
        let nrOfRooms: number = Math.floor(totalTime / 20);
        let graph = puzzleTreePopulator(totalTime, difficulty);
        let nodes = graph.nodes();
        let avgNodesPerRoom = Math.floor(nodes.length / nrOfRooms);
        let remainingNodes = nodes.length % nrOfRooms;

        while (rooms.length < nrOfRooms) {
            let pos_i = randomIntRange(0, possible_locations.length);
            let [pos] = possible_locations.splice(pos_i, 1);
    
            if (visited.has(`${pos[0]},${pos[1]}`)) continue;

            let roomNodes = nodes.splice(0, avgNodesPerRoom + (remainingNodes > 0 ? 1 : 0));
            if (remainingNodes > 0) remainingNodes--;

            rooms.push(new Room(...pos, roomNodes.map((node) => graph.node(node) as Puzzle)));
        
            visited.add(`${pos[0]},${pos[1]}`);
    
            around(pos).forEach((pos) => {
                possible_locations.push(pos);
            })
        }
        return connectRooms(rooms);
    }
}

function connectRooms(rooms: Room[]): Room[] {
    let r: Room | undefined;
    rooms.forEach((room) => {
        r = rooms.find((r) => r.x === room.x-1 && r.y === room.y)
        if (r) room.left = r.id

        r = rooms.find((r) => r.x === room.x+1 && r.y === room.y)
        if (r) room.right = r.id

        r = rooms.find((r) => r.x === room.x && r.y === room.y-1)
        if (r) room.up = r.id

        r = rooms.find((r) => r.x === room.x && r.y === room.y+1)
        if (r) room.down = r.id
    })
    return rooms
}
