import {Edge, Graph, alg} from "graphlib";
import { divergingTree } from "./DivergingTree";
import { Puzzle } from "./Puzzle";
import { PuzzleFactory } from "./PuzzleFactory";
import { Theme } from "../Theme";

//TODO: generate puzzles based on difficulty and/or time: TO BE EXPETED FROM THE PUZZLES?
//TODO: check the new Anagram and MathPuzzle and adjust the factory accordingl

class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
    }
}

export class PuzzleTreePopulator {
    puzzleCount: {[key: string]: number} = {};
    puzzleBox: Puzzle[] = [];
    exclusions: string[];

    constructor(exclusions: string[]) {
        this.exclusions = exclusions;
    }

    incrementPuzzle(puzzle: Puzzle) {
        if (!this.puzzleCount[puzzle.type])
            this.puzzleCount[puzzle.type] = 0;
        this.puzzleCount[puzzle.type]++;
    }

    async populate(estimatedTime: number, difficulty: number, theme: Theme): Promise<Graph> {
        let counter = 0;
        let remainingTime: number;
        while(this.puzzleBox.length <= 2){
            remainingTime = estimatedTime;
            this.puzzleBox = [];
            while(remainingTime > 0){ //Should never be under 0 bcz of recursiveness in generatePuzzle(), but just in case
                let tempPuzzleObject: Puzzle = this.generatePuzzle(remainingTime, difficulty, theme);
                remainingTime -= tempPuzzleObject.estimatedTime;
                this.puzzleBox.push(tempPuzzleObject);
                this.incrementPuzzle(tempPuzzleObject);
            }
            if(counter > 50){ //prevent infinite loop if not possible
                throw new TimeoutError("Failed to generate a puzzle box with the required time " +estimatedTime+ " after 50 tries");
            }
            counter++;
        }
        let graph: Graph = divergingTree(this.puzzleBox.length) //To be replaced with a function that return a correct graph
    
        if(this.puzzleBox.length !== graph.nodeCount()-1){
            console.log('puzzleBox length: ', this.puzzleBox.length);
            console.log('graph nodes count: ', graph.nodeCount()-1);
            throw new Error("Diverging tree does not have as many nodes as required");
        }
        graph.removeNode('startNode');
        let sortedGraph = alg.topsort(graph); //Topological sort of the graph in order to generate dependentPuzzles first
    
        for (let i = 0; i < sortedGraph.length; i++){
            try{
                const nodeId = sortedGraph[i];
                const incomingEdges: void | Edge[] = graph.inEdges(nodeId);
                if(incomingEdges === undefined){
                    throw new Error("Failed to get incomingEdges"); //is catched and rethrown
                }
                const incomingPuzzles: Puzzle[] = incomingEdges.map((edge) => (graph.node(edge.v) as Puzzle));
                const incomingPuzzlesIds: string[] = incomingPuzzles.map(puzzle => puzzle.id);
                if(nodeId === 'startNode'){ //TODO: remove this since we remove startNode before the loop
                    continue;
                }
                if(nodeId === '0'){ //if the node is the final node
                    const incomingEdges: void | Edge[] = graph.inEdges(nodeId);
                    if(!incomingEdges){
                        throw new Error("Invalid end node with no edges pointing towards it"); //is catched and rethrown
                    }
                    this.puzzleBox[i] = this.generateEndPuzzle(this.puzzleBox[i].estimatedTime, difficulty, incomingPuzzlesIds, theme);
                }else if(graph.node(nodeId) === true){ //if the node is a converging node
                    this.puzzleBox[i] = this.generateConvergingPuzzle(this.puzzleBox[i].estimatedTime, difficulty, incomingPuzzlesIds, theme);
                }else{ //if the node is a normal node but has which can still have incoming edges
                    this.puzzleBox[i] = this.generateDependentPuzzle(this.puzzleBox[i].estimatedTime, difficulty, incomingPuzzlesIds, theme);
                }
                this.incrementPuzzle(this.puzzleBox[i]);
                this.addObservers(this.puzzleBox[i], incomingPuzzles);
                graph.setNode(nodeId, this.puzzleBox[i]);
            }catch(e){
                if(e instanceof TimeoutError){
                    console.error(e.message); //to be removed?
                    break;
                }else{
                    throw e; //rethrow the error if it is not a TimeoutError
                }
            }
        }
    
        return graph;
    }

    //Recursive functions to generate puzzles with approperiate time and difficulty:
    generatePuzzle(requiredTime: number, difficulty: number, theme: Theme, counter: number = 1): Puzzle {
        let puzzle = PuzzleFactory.createRandomPuzzle(this.puzzleCount, this.exclusions, difficulty, theme);
        
        //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
        if (puzzle.estimatedTime > requiredTime && counter < 100) {
            return this.generatePuzzle(requiredTime, difficulty, theme, counter + 1);
        }
        return puzzle;
    }
    generateDependentPuzzle(requiredTime: number, difficulty: number, incomingPuzzles: string[], theme: Theme, counter: number = 1): Puzzle {
        let puzzle = PuzzleFactory.createRandomPuzzle(this.puzzleCount, this.exclusions, difficulty, theme, incomingPuzzles);

        //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
        if(puzzle.estimatedTime > requiredTime && counter < 100) {
            return this.generateDependentPuzzle(requiredTime, difficulty, incomingPuzzles, theme, counter + 1);
        }
        return puzzle;
    }
    generateEndPuzzle(requiredTime: number, difficulty: number, incomingPuzzles: string[], theme: Theme, counter: number = 1): Puzzle { //is supposed to be converging always
        if (incomingPuzzles.length < 2) throw new Error("Converging node with less than 2 incoming edges");
        let puzzle = PuzzleFactory.createRandomEndPuzzle(this.puzzleCount, this.exclusions, difficulty, theme, incomingPuzzles);
        
        //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
        if(puzzle.estimatedTime > requiredTime && counter < 100) {
            return this.generateEndPuzzle(requiredTime, difficulty, incomingPuzzles, theme, counter + 1);
        }
        return puzzle;
    }
    generateConvergingPuzzle(requiredTime: number, difficulty: number, incomingPuzzles: string[], theme: Theme, counter: number = 1): Puzzle{
        if(incomingPuzzles.length < 2) throw new Error("Converging node with less than 2 incoming edges");
        let puzzle = PuzzleFactory.createRandomConvergingPuzzle(this.puzzleCount, this.exclusions, difficulty, theme, incomingPuzzles);

        //tries to generate until it finds a puzzle with approperiate time or has ran 100 times with no such puzzle
        if(puzzle.estimatedTime > requiredTime && counter < 100) {
            return this.generateConvergingPuzzle(requiredTime, difficulty, incomingPuzzles, theme, counter + 1);
        }
        return puzzle;
    }
    addObservers(puzzle: Puzzle, incomingPuzzles: Puzzle[]): void{
        incomingPuzzles.forEach((p) => {
            p.addObserver(puzzle);
        });
    }
}