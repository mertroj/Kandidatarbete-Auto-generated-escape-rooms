import { v4 as uuidv4 } from 'uuid';
import { Room } from './Room';
import {Timer} from "./Timer";
import { Theme } from './Theme';


export class EscapeRoom {
    private static escapeRooms: {[key: string]: EscapeRoom} = {}

    id: string;
    rooms: Room[];
    timer: Timer;
    theme: Theme;
    constructor(players: number, difficulty: number, theme: Theme) {
        this.theme = theme;
        let nr_of_rooms = players+difficulty;
        let slots_in_room = 5+difficulty;
        this.id = uuidv4();
        this.rooms = Room.createRooms(nr_of_rooms, slots_in_room, difficulty)
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
            timer: EscapeRoom.escapeRooms[gameId].timer,
            theme: EscapeRoom.escapeRooms[gameId].theme
        }
    }
}


