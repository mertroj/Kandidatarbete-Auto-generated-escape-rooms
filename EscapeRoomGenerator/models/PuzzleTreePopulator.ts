import {Edge, Graph} from "graphlib";
import { DivergingTree } from "./DivergingTree";
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
    let graph: Graph = DivergingTree(puzzleBox.length) //To be replaced with a function that return a correct graph
    if(puzzleBox.length !== graph.nodeCount()-1){
        throw new Error("Diverging tree does not have as many nodes as required");
    }
    let nodes = graph.nodes();
    for (let i = 0; i < nodes.length; i++){
        try{
            const nodeId = nodes[i];
            if(nodeId === 'startNode'){
                continue;
            }
            if(nodeId === '0'){ //if the node is the final node
                const incomingEdges: void | Edge[] = graph.inEdges(nodeId);
                if(!incomingEdges){
                    throw new Error("Invalid end node with no edges pointing towards it"); //is catched and rethrown
                }
                puzzleBox[i] = generateEndPuzzle(puzzleBox[i].estimatedTime, difficulty, graph.inEdges(nodeId), graph);
            }else if(graph.node(nodeId) === true){ //if the node is a converging node
                puzzleBox[i] = generateConvergingPuzzle(puzzleBox[i].estimatedTime, difficulty, graph.inEdges(nodeId), graph);
            }//else if(graph.node(nodeId) === false) is the default case which all puzzles were originally created upon
            graph.setNode(nodeId, puzzleBox[i]);
        }catch(e){
            if(e instanceof TimeoutError){
                console.log(e.message); //to be removed?
                break;
            }else{
                throw e; //rethrow the error if it is not a TimeoutError
            }
        }
    };
    return graph;
}

function generatePuzzle(requiredTime: number, difficulty: number, counter: number = 1): Puzzle {
    let puzzle = PuzzleFactory.createRandomPuzzle(difficulty);
    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(puzzle.estimatedTime > requiredTime) {
        return generatePuzzle(requiredTime, difficulty, counter + 1);
    }else if(counter > 100){
        throw new TimeoutError("Could not generate a suitable puzzle after 100 attempts");
    }
    return puzzle;
}
function generateEndPuzzle(requiredTime: number, difficulty: number, inEdges: Edge[] | void, graph: Graph, counter: number = 1): Puzzle { //is supposed to be converging always
    if (!inEdges) throw new Error("Converging node does not exist in the graph");
    if (inEdges.length < 2) throw new Error("Converging node with less than 2 incoming edges");
    let puzzle = PuzzleFactory.createRandomEndPuzzle(difficulty, inEdges.map((edge) => graph.node(edge.v)));
    
    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(puzzle.estimatedTime > requiredTime) {
        return generateEndPuzzle(requiredTime, difficulty, inEdges, graph, counter + 1);
    }else if(counter > 100){
        throw new TimeoutError("Could not generate a suitable puzzle after 100 attempts");
    }

    return puzzle;
}
function generateConvergingPuzzle(requiredTime: number, difficulty: number, inEdges: Edge[] | void, graph: Graph, counter: number = 1): Puzzle{
    if(!inEdges) throw new Error("Converging node does not exist in the graph");
    if(inEdges.length < 2) throw new Error("Converging node with less than 2 incoming edges");
    //if(inEdges.length > 3) throw new Error("Converging node with more than 3 incoming edges"); //later

    let puzzle = PuzzleFactory.createRandomConvergingPuzzle(difficulty, inEdges.map((edge) => graph.node(edge.v)));
    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(puzzle.estimatedTime > requiredTime) {
        return generateConvergingPuzzle(requiredTime, difficulty, inEdges, graph, counter + 1);
    }else if(counter > 100){
        throw new TimeoutError("Could not generate a suitable puzzle after 100 attempts");
    }
    return puzzle;
}

