import {Edge, Graph, alg} from "graphlib";
import { divergingTree } from "./DivergingTree";
import { Puzzle } from "./Puzzle";
import { PuzzleFactory } from "./PuzzleFactory";

//TODO: generate puzzles based on difficulty and/or time: TO BE EXPETED FROM THE PUZZLES?
//TODO: make sure to always be under the estimatedTime: DONE
//TODO: check the new Anagram and MathPuzzle and adjust the factory accordingl

class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
    }
}

export function puzzleTreePopulator(estimatedTime: number, difficulty: number): Graph {
    console.log('Populating puzzle tree with required total time of the room: ', estimatedTime);
    let remainingTime: number = estimatedTime;
    let puzzleBox: Puzzle[] = [];
    while(true){
        try{
            if(remainingTime <= 0){ //Should never be under 0 bcz of recursiveness in generatePuzzle(), but just in case
                break;
            }
            let tempPuzzleObject: Puzzle = generatePuzzle(remainingTime, difficulty);
            remainingTime -= tempPuzzleObject.estimatedTime;
            puzzleBox.push(tempPuzzleObject);
        }catch(e){
            if(e instanceof TimeoutError){
                console.log(e.message); //to be removed?
                break;
            }else{
                throw e; //rethrow the error if it is not a TimeoutError
            }
        }
    }
    let graph: Graph = divergingTree(puzzleBox.length) //To be replaced with a function that return a correct graph

    if(puzzleBox.length !== graph.nodeCount()-1){
        console.log('puzzleBox length: ', puzzleBox.length);
        console.log('graph nodes count: ', graph.nodeCount()-1);
        throw new Error("Diverging tree does not have as many nodes as required");
    }
    graph.removeNode('startNode');
    let sortedGraph = alg.topsort(graph); //Topological sort of the graph

    //let nodes = graph.nodes();
    for (let i = 0; i < sortedGraph.length; i++){
        try{
            const nodeId = sortedGraph[i];
            const incomingEdges: void | Edge[] = graph.inEdges(nodeId);
            if(incomingEdges === undefined){
                throw new Error("Failed to get incomingEdges"); //is catched and rethrown
            }
            const incomingPuzzles: Puzzle[] = incomingEdges.map((edge) => (graph.node(edge.v) as Puzzle));
            const incomingPuzzlesIds: string[] = incomingPuzzles.map(puzzle => puzzle.id);
            if(nodeId === 'startNode'){
                continue;
            }
            if(nodeId === '0'){ //if the node is the final node
                const incomingEdges: void | Edge[] = graph.inEdges(nodeId);
                if(!incomingEdges){
                    throw new Error("Invalid end node with no edges pointing towards it"); //is catched and rethrown
                }
                puzzleBox[i] = generateEndPuzzle(puzzleBox[i].estimatedTime, difficulty, incomingPuzzlesIds);
            }else if(graph.node(nodeId) === true){ //if the node is a converging node
                puzzleBox[i] = generateConvergingPuzzle(puzzleBox[i].estimatedTime, difficulty, incomingPuzzlesIds);
            }else{ //if the node is a normal node but has which can still have incoming edges
                puzzleBox[i] = generateDependentPuzzle(puzzleBox[i].estimatedTime, difficulty, incomingPuzzlesIds);
            }
            addObservers(puzzleBox[i], incomingPuzzles);
            graph.setNode(nodeId, puzzleBox[i]);
        }catch(e){
            if(e instanceof TimeoutError){
                console.log(e.message); //to be removed?
                break;
            }else{
                throw e; //rethrow the error if it is not a TimeoutError
            }
        }
    }
    
    return graph;
}


//Recursive functions to generate puzzles with approperiate time and difficulty:
function generatePuzzle(requiredTime: number, difficulty: number, counter: number = 1): Puzzle {
    let puzzle = PuzzleFactory.createRandomPuzzle(difficulty);
    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle

    if(counter > 100){
        return puzzle; //if it has tried 100 times, it will return the puzzle anyway
    }else if(puzzle.estimatedTime > requiredTime) {
        return generatePuzzle(requiredTime, difficulty, counter + 1);
    }
    return puzzle;
}
function generateDependentPuzzle(requiredTime: number, difficulty: number, incomingPuzzles: string[], counter: number = 1): Puzzle {
    let puzzle = PuzzleFactory.createRandomPuzzle(difficulty, incomingPuzzles);

    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(counter > 100){
        return puzzle; //if it has tried 100 times, it will return the puzzle anyway
    }else if(puzzle.estimatedTime > requiredTime) {
        return generateDependentPuzzle(requiredTime, difficulty, incomingPuzzles, counter + 1);
    }
    return puzzle;
}
function generateEndPuzzle(requiredTime: number, difficulty: number, incomingPuzzles: string[], counter: number = 1): Puzzle { //is supposed to be converging always
    if (incomingPuzzles.length < 2) throw new Error("Converging node with less than 2 incoming edges");
    let puzzle = PuzzleFactory.createRandomEndPuzzle(difficulty, incomingPuzzles);
    
    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(counter > 100){
        return puzzle; //if it has tried 100 times, it will return the puzzle anyway
    }else if(puzzle.estimatedTime > requiredTime) {
        return generateEndPuzzle(requiredTime, difficulty, incomingPuzzles, counter + 1);
    }

    return puzzle;
}
function generateConvergingPuzzle(requiredTime: number, difficulty: number, incomingPuzzles: string[], counter: number = 1): Puzzle{
    if(incomingPuzzles.length < 2) throw new Error("Converging node with less than 2 incoming edges");
    //if(inEdges.length > 3) throw new Error("Converging node with more than 3 incoming edges"); //later

    let puzzle = PuzzleFactory.createRandomConvergingPuzzle(difficulty, incomingPuzzles);
    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(counter > 100){
        return puzzle; //if it has tried 100 times, it will return the puzzle anyway
    }else if(puzzle.estimatedTime > requiredTime) {
        return generateConvergingPuzzle(requiredTime, difficulty, incomingPuzzles, counter + 1);
    }
    return puzzle;
}
function addObservers(puzzle: Puzzle, incomingPuzzles: Puzzle[]): void{
    incomingPuzzles.forEach((p) => {
        p.addObserver(puzzle);
    });
}
