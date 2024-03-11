import { v4 as uuidv4 } from 'uuid';
import { point, randomIntRange, repeat, frequencies, around } from './Helpers';
import { Anagram } from './Anagram';
import { MastermindPuzzle } from './MastermindPuzzles';
import { LettersMathPuzzle } from './LettersMathPuzzle';
import { OperatorMathPuzzle } from './OperatorMathPuzzle';
import { Puzzle } from './Puzzle';


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

    constructor(x: number, y: number, slots: number) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.left = '';
        this.right = '';
        this.up = '';
        this.down = '';
        this.is_unlocked = true;
        this.slots = repeat(5, () => {
            return frequencies<() => Puzzle>([
                [1, () => new Anagram(5)], 
                [1, () => new LettersMathPuzzle()], 
                [1, () => new OperatorMathPuzzle()]
            ])()
        });
        Room.rooms[this.id] = this;
    }

    static get(roomId: string): Room {
        return Room.rooms[roomId]
    }

    static createRooms(nr_of_rooms: number, slots_in_room: number): Room[] {
        let visited = new Set();
        let possible_locations: point[] = [[0,0]];
        let rooms: Room[] = [];
    
        while (rooms.length < nr_of_rooms) {
            let pos_i = randomIntRange(0, possible_locations.length);
            let [pos] = possible_locations.splice(pos_i, 1);
    
            if (visited.has(`${pos[0]},${pos[1]}`)) continue;
    
            rooms.push(new Room(...pos, slots_in_room));
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