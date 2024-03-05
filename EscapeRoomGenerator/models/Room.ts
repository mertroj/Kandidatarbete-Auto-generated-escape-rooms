import { v4 as uuidv4 } from 'uuid';
import { getRandomInt, point } from './Helpers';
import { Anagram } from './Anagram';
import { MathPuzzle } from './MathPuzzles';


export class Room {
    id: string;
    x: number;
    y: number;
    left: number | null;
    right: number | null;
    up: number | null;
    down: number | null;
    is_unlocked: boolean;
    slots: any[]

    constructor(x: number, y: number, slots: number) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;
        this.is_unlocked = false;
        this.slots = [new Anagram(5), new MathPuzzle()]
        rooms[this.id] = this
    }
}
const rooms : {[Key: string]: Room} = {}

export function createRooms(nr_of_rooms: number, slots_in_room: number) {
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
        let i = rooms.length
        rooms.push(new_room);
        visited.add(`${pos[0]},${pos[1]}`);
        
        if (entrance_i) {
            let entrance = rooms[entrance_i-1]
            if (entrance.x < new_room.x) {
                entrance.right = i;
                new_room.left = entrance_i;
            }
            else if (entrance.x > new_room.x) {
                entrance.left = i;
                new_room.right = entrance_i
            }
            else if (entrance.y < new_room.y) {
                entrance.down = i;
                new_room.up = entrance_i;
            }
            else if (entrance.y > new_room.y) {
                entrance.up = i;
                new_room.down = entrance_i;
            }
        }

        around(pos).forEach((pos) => {
            possible_locations.push([i, pos]);
        })
    }

    return rooms;
}