export interface Observable{ //To be implemented by all puzzles that be independent
    addObserver(observer: Observer): void;
    notifyObservers(): string[];
}
export interface Observer{ //To be implemented by all puzzles that depend on others
    update(id: string): string;
}