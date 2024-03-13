export interface Puzzle {
    id: string;
    type: string;
    question:string;
    description: string;
    hintLevel: number;
    solved: boolean;
    estimatedTime: number;

    getHint(): string;
    checkAnswer(answer: string): boolean;
}