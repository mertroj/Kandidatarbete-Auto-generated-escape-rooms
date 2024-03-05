export class PuzzleNode{
    private puzzle: any; //change type to common puzzle type
    private incomingConnections: PuzzleNode[]; 
    private outgoingConnections: PuzzleNode[];
    private isDiverging: boolean;
    constructor(puzzle: any, isDiverging: boolean, incomingConnections: PuzzleNode[] = [], outgoingConnections: PuzzleNode[] = []){
        this.puzzle = puzzle;
        this.isDiverging = isDiverging;
        this.incomingConnections = incomingConnections;
        this.outgoingConnections = outgoingConnections;
    }
    public getPuzzle(): any {
        return this.puzzle;
    }
    
    public getIncomingConnections(): PuzzleNode[] {
        return this.incomingConnections;
    }

    public getOutgoingConnections(): PuzzleNode[] {
        return this.outgoingConnections;
    }

    public addIncomingConnection(puzzleNode: PuzzleNode): void {
        this.incomingConnections.push(puzzleNode);
    }

    public removeIncomingConnection(puzzleNode: PuzzleNode): void {
        this.incomingConnections = this.incomingConnections.filter(node => node !== puzzleNode);
    }

    public addOutgoingConnection(puzzleNode: PuzzleNode): void {
        this.outgoingConnections.push(puzzleNode);
    }

    public removeOutgoingConnection(puzzleNode: PuzzleNode): void {
        this.outgoingConnections = this.outgoingConnections.filter(node => node !== puzzleNode);
    }

    public isConnectedTo(puzzleNode: PuzzleNode): boolean {
        return this.outgoingConnections.includes(puzzleNode) || this.incomingConnections.includes(puzzleNode);
    }

    public isNodeDiverging(): boolean {
        return this.isDiverging;
    }

}