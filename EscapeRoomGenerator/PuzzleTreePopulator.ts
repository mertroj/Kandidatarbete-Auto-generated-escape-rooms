import {Edge, Graph} from "graphlib";
import { createAnagramPuzzle, createMathPuzzle } from "./PuzzleFactory";

//TODO: generate puzzles based on difficulty and/or time: TO BE EXPETED FROM THE PUZZLES?
//TODO: make sure to always be under the estimatedTime: DONE
//TODO: check the new Anagram and MathPuzzle and adjust the factory accordingly

const possiblePuzzles: Function[] = [createAnagramPuzzle, createMathPuzzle];
const possibleEndPuzzles: Function[] = [createAnagramPuzzle, createMathPuzzle];
const possibleConvergingPuzzles: Function[] = [createAnagramPuzzle, createMathPuzzle];

class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
    }
}

function puzzleTreePopulator(estimatedTime: number, difficulty: Difficulty): Graph {
    let remainingTime: number = estimatedTime;
    let puzzleBox: Puzzle[] = [];
    while(true){
        try{
            if(remainingTime <= 0){ //Should never be under 0 bcz of recursiveness in generatePuzzle(), but just in case
                break;
            }
            let tempPuzzleObject: Puzzle = generatePuzzle(remainingTime, difficulty, false);
            remainingTime -= tempPuzzleObject.et;
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
    let graph: Graph = new Graph(/*puzzleBox.length*/); //To be replaced with a function that return a correct graph
    if(puzzleBox.length !== graph.nodeCount()+1){
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
                puzzleBox[i] = generateEndPuzzle(puzzleBox[i].et, difficulty, incomingEdges.length);
            }else if(graph.node(nodeId) === true){ //if the node is a converging node
                puzzleBox[i] = generatePuzzle(puzzleBox[i].et, difficulty, true);
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
function generateEndPuzzle(requiredTime: number, difficulty: Difficulty, incomingEdges: number, counter: number = 1): Puzzle { //is supposed to be converging always
    let puzzle = possibleEndPuzzles[Math.floor(Math.random() * possiblePuzzles.length)](requiredTime, difficulty); //Upper exclusive
    
    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(puzzle.et > requiredTime) {
        return generateEndPuzzle(requiredTime, difficulty, incomingEdges, counter + 1);
    }else if(counter > 100){
        throw new TimeoutError("Could not generate a suitable puzzle after 100 attempts");
    }

    return puzzle;
}
function generatePuzzle(requiredTime: number, difficulty: number, isConverging: boolean, counter: number = 1): Puzzle {
    let puzzle;
    if(!isConverging){
        puzzle = possiblePuzzles[Math.floor(Math.random() * possiblePuzzles.length)](requiredTime, difficulty); //Upper exclusive
    }else{
        puzzle = possibleConvergingPuzzles[Math.floor(Math.random() * possiblePuzzles.length)](requiredTime, difficulty); //Upper exclusive
    }

    //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
    if(puzzle.et > requiredTime) {
        return generatePuzzle(requiredTime, difficulty, isConverging, counter + 1);
    }else if(counter > 100){
        throw new TimeoutError("Could not generate a suitable puzzle after 100 attempts");
    }

    return puzzle;
}

enum Difficulty {
    EASY = 1,
    MEDIUM = 2,
    HARD = 3
}

export interface Puzzle {
    question: string;
    solution: string;
    hint: string;
    et: number;
    difficulty: string;
}