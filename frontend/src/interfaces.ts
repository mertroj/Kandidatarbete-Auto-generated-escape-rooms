export interface EscapeRoom {
    id: string;
    rooms: Room[]
}

export interface Room {
    id: string;
    x: number;
    y: number;
    left: string;
    right: string;
    up: string;
    down: string;
    is_unlocked: boolean;
    slots: any[]
}

export interface NewHint{
    hint: string;
}