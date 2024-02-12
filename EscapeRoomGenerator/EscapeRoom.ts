import {EscapeRoom, Room, point} from "./types";

function getRandomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateEscapeRoom(players: number, difficulty: number) : EscapeRoom {
    let er = new EscapeRoom();
    let nr_of_rooms = 7
    er.rooms = generateRooms(nr_of_rooms);
    return er;
}
    
function generateRooms(nr_of_rooms: number) {
    function around(pos: point): point[]  {
        let [x, y] = pos;
        return [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
    }

    let visited = new Set();
    let available_slots: [number | null, point][] = [[null, [0,0]]];
    let rooms: Room[] = [];

    for (let i = 1; i <= nr_of_rooms; i += 1) {
        let pos_i = getRandomInt(0, available_slots.length);
        let [entrance_i, pos] = available_slots[pos_i];
        available_slots.splice(pos_i, 1);

        let new_room = new Room(...pos);
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
            if (visited.has(`${pos[0]},${pos[1]}`)) return;
            available_slots.push([i, pos]);
        })
    }

    return rooms;
}

function printEscapeRoom(er: EscapeRoom){
    let roomPos = new Map();
    for (let i=0; i < er.rooms.length; i++) {
        let room = er.rooms[i];
        roomPos.set(`${room.x},${room.y}`, i+1);
    }

    let minX = Math.min(...(er.rooms.map((room: Room) => {return room.x})));
    let minY = Math.min(...(er.rooms.map((room: Room) => {return room.y})));
    let maxX = Math.max(...(er.rooms.map((room: Room) => {return room.x})));
    let maxY = Math.max(...(er.rooms.map((room: Room) => {return room.y})));
    
    for (let y = minY; y <= maxY; y++) {
        let row_str = " ";
        for (let x = minX; x <= maxX; x++) {
            if (roomPos.has(`${x},${y}`)) {
                row_str += roomPos.get(`${x},${y}`);
            } else row_str += " "
            row_str += " ";
        }
        console.log(row_str);
    }
}


let er = generateEscapeRoom(3, 1);
console.log(er);
printEscapeRoom(er);