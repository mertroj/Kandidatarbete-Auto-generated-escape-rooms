export interface Puzzle {
    id: string;
    type: string;
    question:string;
    description: string;
    hintLevel: number;
    solved: boolean;

    getHint(): string;
    checkAnswer(answer: string): boolean;
}