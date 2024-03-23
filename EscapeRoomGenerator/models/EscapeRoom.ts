import { v4 as uuidv4 } from 'uuid';
import { Room } from './Room';
import {Timer} from "./Timer";


export class EscapeRoom {
    private static escapeRooms: {[key: string]: EscapeRoom} = {}

    id: string;
    rooms: Room[];
    timer: Timer;
    
    constructor(players: number, difficulty: number) {
        let totalTime: number = 20 + 67 * Math.log(players);
        this.id = uuidv4();
        this.rooms = Room.createRooms(totalTime, players, difficulty)
        this.rooms[0].is_unlocked = true
        EscapeRoom.escapeRooms[this.id] = this
        this.timer = new Timer()
        this.timer.start()
    }

    static get(gameId: string) : EscapeRoom | null {
        if (EscapeRoom.escapeRooms[gameId] === undefined) {
            return null
        }
        return {
            id: gameId, 
            rooms: EscapeRoom.escapeRooms[gameId].rooms
                        .filter((room) => room.is_unlocked),
            timer: EscapeRoom.escapeRooms[gameId].timer
        }
    }
}


