export interface Puzzle extends Observable{
    id: string;
    type: string;
    question:string;
    description: string;
    hintLevel: number;
    solved: boolean;
    estimatedTime: number;
    isLocked: boolean; 
}
export interface Observable{ //To be implemented by all puzzles that be independent
    addObserver(observer: Observer): void;
    notifyObservers(): void;
}
export interface Observer{ //To be implemented by all puzzles that depend on others
    update(): void;
}
