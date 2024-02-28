import { v4 as uuidv4 } from 'uuid';
import { isContext } from 'vm';

export class EscapeRoom {
    id: string;
    rooms: Room[];

    constructor() {
        this.id = uuidv4();
        this.rooms = []
    }
}

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
        this.slots = new Array(slots).fill(null)
    }
}

export type point = [number, number]