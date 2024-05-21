import WebSocket from 'ws';
import { EscapeRoom } from './Models/EscapeRoom';
import { v4 as uuidv4 } from 'uuid';
import { Puzzle } from './Models/PuzzleGeneration/Puzzle';

class Client {
    currentGame: string | null = null;
    id: string = uuidv4();
    socket: WebSocket;

    constructor(socket: WebSocket) {
        this.socket = socket;
    }

    emit(event: string, data?: object) {
        this.socket.emit(event, data);
    }

    close() {
        this.socket.close();
    }

    sendJson(data: object): void {
        this.socket.send(JSON.stringify(data));
    }

    sendId(): void {
        this.sendJson({type: "user.id", id: this.id});
    }
}

class WebSocketServer {
    port: number;
    private webSocketServer: WebSocket.Server;
    private clients: {[key: string]: Client[]} = {};

    constructor(port: number) {
        this.port = port;
        this.webSocketServer = new WebSocket.Server({ port });
        this.initWSS();
    }

    private parseMessage(client: Client, message: string): void {
        let req: {event: string, data: {}} = JSON.parse(message);
        console.log(req);
        client.emit(req.event, req.data);
    }

    private joinGame(client: Client, gameId: string): void {
        if (!this.clients[gameId]) return;
        this.clients[gameId].push(client);
        client.currentGame = gameId;
    }
    
    private leaveGame(client: Client): void {
        if (!client.currentGame) return;
        this.clients[client.currentGame] = this.clients[client.currentGame].filter((client2) => client2 !== client);
        client.currentGame = null;
    }

    private closeClient(client: Client): void {
        if (client.currentGame) client.emit("game.leave");
        client.close();
    }

    private initWSS(): void {
        this.webSocketServer.on('connection', (socket: WebSocket) => {
            console.log('New client connected');

            let client = new Client(socket);

            socket.on('message', (message: string) => this.parseMessage(client, message));
            socket.on('close', () => this.closeClient(client));

            socket.on('game.join', (data: {gameId: string}) => this.joinGame(client, data.gameId));
            socket.on('game.leave', () => this.leaveGame(client));

            client.sendId();
        });
    }

    getPuzzle(gameId: string, puzzleId: string): Puzzle | undefined {
        return EscapeRoom.get(gameId).getPuzzle(puzzleId);
    }

    sendToAll(gameId: string, action: object): void {
        console.log(action);
        this.clients[gameId].forEach((client) => {
            client.sendJson(action);
        });
    }

    gameCreated(gameId: string): void {
        this.clients[gameId] = [];
    }
    gameFinished(gameId: string): void {
        delete this.clients[gameId];
    }
}

export const WSS = new WebSocketServer(8081)