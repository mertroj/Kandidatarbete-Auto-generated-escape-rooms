

function divergingTree(estimatedTime: number) {

    // if (amountOfPuzzles < 5) {
    //     console.error("DivergingTree: amountOfPuzzles must be at least 5")
    // }
    const MAX_PUZZLE_ROW: number = 5;
    const MIN_PUZZLE_ROW: number = 2;

    let puzzleBox: any[] = [];

    while (true) {
        const tempPuzzleObject = generatePuzzle(estimatedTime, "hard");
        if (tempPuzzleObject.remainingTime <= 0) {
            break;
        }
        puzzleBox.push(tempPuzzleObject.puzzle);
        estimatedTime = tempPuzzleObject.remainingTime;
    }
    const endPuzzle = generateEndPuzzle(estimatedTime);


}



function generateEndPuzzle(estimatedTime: number): any{
    return "im in pain"
}
function generatePuzzle(estimatedTime: number, difficulty: string) {
    const remainingTime: number = estimatedTime;
    const puzzle: any = 1 /* your puzzle generation logic goes here */; // TODO: replace with actual puzzle generation logic

    return {
        remainingTime: remainingTime,
        puzzle: puzzle
    };
}