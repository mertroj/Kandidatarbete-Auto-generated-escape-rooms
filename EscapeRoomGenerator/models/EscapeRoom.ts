import { v4 as uuidv4 } from 'uuid';
import { Room, createRooms, getRoom } from './Room';


export class EscapeRoom {
    id: string;
    rooms: Room[];
    // TODO: add timestamp of creation
    
    constructor(nr_of_rooms: number, slots_in_room: number) {
        this.id = uuidv4();
        this.rooms = createRooms(nr_of_rooms, slots_in_room)
        this.rooms[0].is_unlocked = true
        escapeRooms[this.id] = this
        roomIds[this.id] = this.rooms.map((room) => room.id)
    }
}
const escapeRooms: {[Key: string]: EscapeRoom} = {}
const roomIds: {[key: string]: string[]} = {}

export function createEscapeRoom(players: number, difficulty: number) : EscapeRoom {
    let nr_of_rooms = players+difficulty;
    let slots_in_room = 5+difficulty;
    let er: EscapeRoom = new EscapeRoom(nr_of_rooms, slots_in_room);
    return er;
}

export function getEscapeRoom(gameId: string) : EscapeRoom {
    return {
        id: gameId, 
        rooms: roomIds[gameId]
                    .map((roomId) => getRoom(roomId))
                    .filter((room) => room.is_unlocked)
    }
    
}

