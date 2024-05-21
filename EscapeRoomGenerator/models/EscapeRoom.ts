import { v4 as uuidv4 } from 'uuid';
import { Room } from './Room';
import { Theme } from './Theme';
import { point, randomIntRange, around } from './Helpers';
import { generateEndingText, generateIntroText } from './ChatGPTTextGenerator';
import { PuzzleTreePopulator } from './PuzzleGeneration/PuzzleTreePopulator';
import { Puzzle } from './PuzzleGeneration/Puzzle';
import { Jigsaw } from './Puzzles/Jigsaw';
import { Observer } from './ObserverPattern';


export class EscapeRoom implements Observer {
    private static escapeRooms: {[key: string]: EscapeRoom} = {};

    id: string = uuidv4();
    rooms!: Room[];
    allRoomsSolved: boolean = false;
    isSolved: boolean = false;
    startTime: number = Date.now();
    endPuzzle!: Puzzle;
    theme: Theme;
    startText!: string;
    endText!: string;

    private constructor(theme: Theme) { //for synchronous creation operations
        this.theme = theme;
        EscapeRoom.escapeRooms[this.id] = this;
    }
    static async create(players: number, difficulty: number, theme: Theme, exclusions: string[]): Promise<EscapeRoom> {
        let er = new EscapeRoom(theme);
        let totalTime: number = players * 20; //one room of 20 min per player for now. TODO: improve this

        er.startText = await generateIntroText(theme);
        er.endText = await generateEndingText(theme);

        [er.rooms, er.endPuzzle] = await EscapeRoom.createRooms(totalTime, difficulty, theme, exclusions);

        er.rooms.forEach((r) => r.addObserver(er));
        er.endPuzzle.addObserver(er);

        return er;
    }

    static get(gameId: string) : EscapeRoom {
        return EscapeRoom.escapeRooms[gameId];
    }

    getPuzzle(puzzleId: string): Puzzle | undefined {
        let room = this.getRoom(puzzleId);
        return room ? room.puzzles.find((p) => p.id === puzzleId) : undefined;
    }

    getRoom(puzzleId: string): Room | undefined {
        return this.rooms.find((r) => r.puzzles.some((p) => p.id === puzzleId));
    }

    update(id: string): void {
        if (this.isSolved) return;
        this.allRoomsSolved = this.rooms.every((r) => r.isSolved);
        this.isSolved = this.allRoomsSolved && this.endPuzzle.isSolved;
    }
    
    static async createRooms(totalTime: number, difficulty: number, theme: Theme, exclusions: string[]): Promise<[Room[], Puzzle]> {
        let visited = new Set();
        let possible_locations: point[] = [[0,0]];
        let rooms: Room[] = [];
        let nrOfRooms: number = Math.floor(totalTime / 20) + 1; //1 player: 2 rooms, 2 players: 3 rooms, 3 players: 4 rooms, 4 players: 5 rooms
        let populator = new PuzzleTreePopulator(exclusions);
        let graph = await populator.populate(totalTime, difficulty, theme);
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
        this.connectRooms(rooms);
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
            startTime: this.startTime,
            allRoomsSolved: this.allRoomsSolved,
            isSolved: this.isSolved,
            theme: this.theme
        };
    }
}
