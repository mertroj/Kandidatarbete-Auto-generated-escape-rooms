export class Cell{
    value: number;
    isFlipped: boolean;
    isMatched: boolean;

    constructor(value: number){
        this.value = value;
        this.isFlipped = false;
        this.isMatched = false;
    }

    flip(): void{
        this.isFlipped = !this.isFlipped;
    }

    match(): void{
        this.isMatched = true;
    }
}