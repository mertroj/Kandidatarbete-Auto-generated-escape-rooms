

function divergingTree(estimatedTime: number) {
    const MAX_PUZZLE_ROW: number = 4;
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

    // start loop here
    // if first row generate 3 puzzles and connect them to endPuzzle


}



function generateEndPuzzle(estimatedTime: number): any{
    return "im in pain"
}
function generatePuzzle(estimatedTime: number, difficulty: string) {
    const remainingTime: number = estimatedTime;
    const puzzle: any = 1 /* your puzzle generation logic goes here */; // TODO: replace with actual puzzle generation logic
    // should become a puzzleNode object, which contains a puzzle and an array of
    // incoming connections and another array of outgoing connections
    return {
        remainingTime: remainingTime,
        puzzle: puzzle
    };
}