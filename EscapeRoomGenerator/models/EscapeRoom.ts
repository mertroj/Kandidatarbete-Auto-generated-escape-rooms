import { v4 as uuidv4 } from 'uuid';
import { Room, createRooms, getRoom } from './Room';


export class EscapeRoom {
    private static escapeRooms: {[key: string]: EscapeRoom} = {}
    private static roomIds: {[key: string]: string[]} = {}

    id: string;
    rooms: Room[];
    // TODO: add timestamp of creation
    
    constructor(players: number, difficulty: number) {
        let nr_of_rooms = players+difficulty;
        let slots_in_room = 5+difficulty;
        this.id = uuidv4();
        this.rooms = createRooms(nr_of_rooms, slots_in_room)
        this.rooms[0].is_unlocked = true
        EscapeRoom.escapeRooms[this.id] = this
        EscapeRoom.roomIds[this.id] = this.rooms.map((room) => room.id)
    }

    static get(gameId: string) : EscapeRoom | null {
        if (EscapeRoom.roomIds[gameId] === undefined) {
            return null
        }
        return {
            id: gameId, 
            rooms: EscapeRoom.roomIds[gameId]
                        .map((roomId) => getRoom(roomId))
                        .filter((room) => room.is_unlocked)
        }
    }
}


