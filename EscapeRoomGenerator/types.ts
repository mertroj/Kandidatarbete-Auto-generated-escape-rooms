export class EscapeRoom {
    rooms: Room[];
    constructor() {
        this.rooms = []
    }
}

export class Room {
    left: number | null;
    right: number | null;
    up: number | null;
    down: number | null;
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;
    }
}

export type point = [number, number]