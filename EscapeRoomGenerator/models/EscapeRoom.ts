import { v4 as uuidv4 } from 'uuid';
import { Room } from './Room';
import { Timer } from "./Timer";
import { Theme } from './Theme';
import { point, randomIntRange, around } from './Helpers';
import { puzzleTreePopulator } from './Puzzles/PuzzleTreePopulator';
import { Puzzle } from './Puzzles/Puzzle';
import { generateEndingText, generateIntroText } from './ChatGPTTextGenerator';
import { Jigsaw } from './Puzzles/Jigsaw';


export class EscapeRoom {
    private static escapeRooms: {[key: string]: EscapeRoom} = {};

    id: string = uuidv4();
    rooms!: Room[];
    timer: Timer = new Timer();
    endPuzzle!: Puzzle;
    theme: Theme;
    startText!: string;
    endText!: string;
    currentRoom!: Room;

    private constructor(theme: Theme) { //for synchronous creation operations
        this.theme = theme;
        //let totalTime: number = (difficulty + 19) * Math.log2(players);
        this.timer.start();
        EscapeRoom.escapeRooms[this.id] = this;
    }
    static async create(players: number, difficulty: number, theme: Theme, exclusions: string[]): Promise<EscapeRoom> {
        let instance = new EscapeRoom(theme);
        let totalTime: number = players * 20; //one room of 20 min per player for now. TODO: improve this

        instance.startText = await generateIntroText(theme);
        instance.endText = await generateEndingText(theme);

        [instance.rooms, instance.endPuzzle] = await EscapeRoom.createRooms(totalTime, difficulty, theme, exclusions);
        EscapeRoom.connectRooms(instance.rooms);
        instance.rooms[0].isLocked = false;
        instance.currentRoom = instance.rooms[0];
        return instance;
    }

    static get(gameId: string) : EscapeRoom | null {
        if (EscapeRoom.escapeRooms[gameId] === undefined) {
            return null;
        }

        EscapeRoom.escapeRooms[gameId].rooms.forEach((room) => {
            room.checkForUnlockedPuzzle();
        });
        
        return EscapeRoom.escapeRooms[gameId];
    }
    
    static async createRooms(totalTime: number, difficulty: number, theme: Theme, exclusions: string[]): Promise<[Room[], Puzzle]> {
        let visited = new Set();
        let possible_locations: point[] = [[0,0]];
        let rooms: Room[] = [];
        let nrOfRooms: number = Math.floor(totalTime / 20);
        let graph = await puzzleTreePopulator(totalTime, difficulty, theme, exclusions);
        let nodes = graph.nodes();

        let promises = nodes.map(async nodeId => { //change the text for all puzzles into themed text using OPENAI
            let puzzle = graph.node(nodeId) as Puzzle;
            if(nodeId === '0' || puzzle instanceof Jigsaw) {
                return;
            }
            await puzzle.applyTheme(theme);
        });
        await Promise.all(promises);

        let avgNodesPerRoom = Math.floor((nodes.length - 1) / nrOfRooms);
        let remainingNodes = (nodes.length - 1) % nrOfRooms;
        let endPuzzle = graph.node('0') as Puzzle;

        while (rooms.length < nrOfRooms) {
            let pos_i = randomIntRange(0, possible_locations.length);
            let [pos] = possible_locations.splice(pos_i, 1);
    
            if (visited.has(`${pos[0]},${pos[1]}`)) continue;

            let roomNodes = nodes.splice(1, avgNodesPerRoom + (remainingNodes > 0 ? 1 : 0));
            if (remainingNodes > 0) remainingNodes--;

            rooms.push(new Room(...pos, roomNodes.map((node) => graph.node(node) as Puzzle)));        
            visited.add(`${pos[0]},${pos[1]}`);

            around(pos).forEach((pos) => {
                possible_locations.push(pos);
            })
        }
        return [rooms, endPuzzle];
    }
    
    static connectRooms(rooms: Room[]): void {
        rooms.forEach((room) => {
            room.left = rooms.findIndex((r) => r.x === room.x-1 && r.y === room.y);
            room.right = rooms.findIndex((r) => r.x === room.x+1 && r.y === room.y);
            room.up = rooms.findIndex((r) => r.x === room.x && r.y === room.y+1);
            room.down = rooms.findIndex((r) => r.x === room.x && r.y === room.y-1);
        })
    }

    strip() {
        return {
            id: this.id, 
            rooms: this.rooms.map((room) => room.strip()),
            endPuzzle: this.endPuzzle.strip(),
            currentRoom: this.currentRoom.strip(),
            timer: this.timer,
            theme: this.theme
        }
    }
}
