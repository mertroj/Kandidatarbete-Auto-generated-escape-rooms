import { v4 as uuidv4 } from 'uuid';
import { Room } from './Room';


export class EscapeRoom {
    private static escapeRooms: {[key: string]: EscapeRoom} = {}

    id: string;
    rooms: Room[];
    // TODO: add timestamp of creation
    
    constructor(players: number, difficulty: number) {
        let nr_of_rooms = players+difficulty;
        let slots_in_room = 5+difficulty;
        this.id = uuidv4();
        this.rooms = Room.createRooms(nr_of_rooms, slots_in_room)
        this.rooms[0].is_unlocked = true
        EscapeRoom.escapeRooms[this.id] = this
    }

    static get(gameId: string) : EscapeRoom | null {
        if (EscapeRoom.escapeRooms[gameId] === undefined) {
            return null
        }
        return {
            id: gameId, 
            rooms: EscapeRoom.escapeRooms[gameId].rooms
                        .filter((room) => room.is_unlocked)
        }
    }
}


