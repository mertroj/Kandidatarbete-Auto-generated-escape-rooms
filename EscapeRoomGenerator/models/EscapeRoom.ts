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
        let totalTime: number = players * 20; //one room of 20 min per player for now. TODO: improve this
        //let totalTime: number = (difficulty + 19) * Math.log2(players);
        this.id = uuidv4();
        this.rooms = Room.createRooms(totalTime, players, difficulty)
        this.rooms[0].isLocked = true
        EscapeRoom.escapeRooms[this.id] = this
        this.timer = new Timer()
        this.timer.start()
    }

    static get(gameId: string) : EscapeRoom | null {
        if (EscapeRoom.escapeRooms[gameId] === undefined) {
            return null
        }
        EscapeRoom.escapeRooms[gameId].rooms.map((room) => {
            checkForUnlocked(room);
        });
        return {
            id: gameId, 
            rooms: EscapeRoom.escapeRooms[gameId].rooms
                        .filter((room) => !room.isLocked),
            timer: EscapeRoom.escapeRooms[gameId].timer,
            theme: EscapeRoom.escapeRooms[gameId].theme
        }
    }
}

function checkForUnlocked(room: Room): void {
    if (room.isLocked) {
        room.slots.some((slot) => {
            if(!slot.isLocked) room.isLocked = false;
        });
    }
}

