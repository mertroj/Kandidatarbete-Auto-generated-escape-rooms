function generateNumbers(){ //Generate an array of 3 random numbers
    let numbers = Number[3];
    for(let i = 0; i < 3; i++){
        numbers[i] = Math.floor(Math.random() * 9)
    }
    return numbers;
}

export class MastermindPuzzle {
    id: number;
    eTime: number = 6;
    question: string = 'Figure out the 3 digit combination';
    private hints: string[] = ['The solution is: ', 
                            'Green numbers are correct and in correct position, yellow are correct but wrong position', 
                            'After each guess some numbers change colours, maybe that means something'];
    solution: Number[];
    private hintLevel: number = 2;
    constructor(){
        this.id = Number(new Date());
        this.solution = generateNumbers();
    }
    getSolution(): Number[]{
        return this.solution;
    }
    getHint(): string{
        if(this.hintLevel > 0){
            this.hintLevel--;
            return this.hints[this.hintLevel + 1];
        }
        else if(this.hintLevel == 0){
            return this.hints[this.hintLevel] + this.getSolution();
        }
        return 'No more hints.';
    }
}