

function DivergingTree(nodeAmount: number) {
    const MAX_NODES_ROW: number = 4;
    const MIN_NODES_ROW: number = 2;

    while (true) {
        const tempPuzzleObject = generatePuzzle(estimatedTime, difficulty);
        if (tempPuzzleObject.remainingTime <= 0) {
            break;
        }
        puzzleBox.push(tempPuzzleObject.puzzle);
        estimatedTime = tempPuzzleObject.remainingTime;
    }

    // start loop here
    let totalPuzzles = puzzleBox.length;
    let temporaryPuzzleBox: any[];
    for (let i = 0; i < totalPuzzles; i++) {
        temporaryPuzzleBox = []
        if (i === 0) {

            // randomly pop 3 times from puzzleBox add them to and connect to endPuzzle
        }

    }
    // if first row generate 3 puzzles and connect them to endPuzzle


}