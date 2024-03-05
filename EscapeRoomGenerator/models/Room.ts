import { v4 as uuidv4 } from 'uuid';
import { getRandomInt, point } from './Helpers';
import { Anagram } from './Anagram';
import { MathPuzzle } from './MathPuzzles';


export class Room {
    id: string;
    x: number;
    y: number;
    left: string;
    right: string;
    up: string;
    down: string;
    is_unlocked: boolean;
    slots: any[];

    constructor(x: number, y: number, slots: number) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.left = '';
        this.right = '';
        this.up = '';
        this.down = '';
        this.is_unlocked = true;
        this.slots = [new Anagram(5), new MathPuzzle()];
        rooms[this.id] = this;
    }
}
const rooms : {[Key: string]: Room} = {};

export function createRooms(nr_of_rooms: number, slots_in_room: number): Room[] {
    function around(pos: point): point[]  {
        let [x, y] = pos;
        return [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
    }

    let visited = new Set();
    let possible_locations: [number | null, point][] = [[null, [0,0]]];
    let rooms: Room[] = [];

    while (rooms.length < nr_of_rooms) {
        let pos_i = getRandomInt(0, possible_locations.length);
        let [entrance_i, pos] = possible_locations[pos_i];
        possible_locations.splice(pos_i, 1);

        if (visited.has(`${pos[0]},${pos[1]}`)) continue;

        let new_room = new Room(...pos, slots_in_room);
        let i = rooms.length;
        rooms.push(new_room);
        visited.add(`${pos[0]},${pos[1]}`);
        
        if (entrance_i) {
            let entrance = rooms[entrance_i-1]
            if (entrance.x < new_room.x) {
                entrance.right = new_room.id;
                new_room.left = entrance.id;
            }
            else if (entrance.x > new_room.x) {
                entrance.left = new_room.id;
                new_room.right = entrance.id
            }
            else if (entrance.y < new_room.y) {
                entrance.down = new_room.id;
                new_room.up = entrance.id;
            }
            else if (entrance.y > new_room.y) {
                entrance.up = new_room.id;
                new_room.down = entrance.id;
            }
        }

        around(pos).forEach((pos) => {
            possible_locations.push([i, pos]);
        })
    }

    return rooms;
}

export function getRoom(roomId: string): Room {
    return rooms[roomId]
}