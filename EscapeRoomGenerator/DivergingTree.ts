import {Graph} from "graphlib";

export function DivergingTree(nodeAmount: number): Graph {
    const MAX_NODES_ROW: number = 4;
    const MIN_NODES_ROW: number = 2;
    const maxConvergingNodes: number = Math.floor(nodeAmount / 11) + 1;

    let currentConvergingNodes: number = 0;
    let divergingTree = new Graph();
    let previousRow: string[] = [];
    let newRow: string[] = [];
    let rowNodeDifference: number = 0;
    let randomRowNodeAmount: number = 0;
    let endNode: string  = "";

    let lastRow: boolean = false;
    let nodesMade: number = 0;

    if (nodeAmount < 3) {
        console.log("Not enough nodes to make a diverging-tree");
        return divergingTree;
    }

    while (nodesMade < nodeAmount) {
        // if first node Generate end node and connect them to 2 child nodes
        if (nodesMade === 0) {
            let endNode = nodesMade.toString();
            divergingTree.setNode(endNode, true);
            currentConvergingNodes++;
            nodesMade++;
            for (let j: number = 1; j <= 2; j++) {
                let newNode = nodesMade.toString();
                divergingTree.setNode(newNode, false);
                divergingTree.setEdge(newNode, endNode);
                newRow.push(newNode);
                nodesMade++;
            }
            continue
        }

        previousRow = newRow;
        newRow = [];

        // randomly generate amount of nodes in a row
        if (nodeAmount - nodesMade > MAX_NODES_ROW) {
            randomRowNodeAmount = Math.floor(Math.random() * (MAX_NODES_ROW - MIN_NODES_ROW + 1) + MIN_NODES_ROW);
        }
        else {
            randomRowNodeAmount = Math.floor(Math.random() * (nodeAmount - nodesMade - MIN_NODES_ROW + 1) + MIN_NODES_ROW);
        }
        if (nodeAmount - nodesMade - randomRowNodeAmount < MIN_NODES_ROW) {
            randomRowNodeAmount += nodeAmount - nodesMade - randomRowNodeAmount;
        }

        if (nodesMade !== 0 && randomRowNodeAmount > 0) {
            for (let j: number = 0; j < randomRowNodeAmount; j++) {
                let newNode = (nodesMade).toString();
                divergingTree.setNode(newNode, false);

                console.log("made node " + nodesMade+ " here")
                nodesMade++;
                newRow.push(newNode);
            }
        }

        if (nodesMade >= nodeAmount - MAX_NODES_ROW) {
            lastRow = true;
        }

        rowNodeDifference = previousRow.length - randomRowNodeAmount;
        if ((rowNodeDifference> 0 || lastRow) && currentConvergingNodes < maxConvergingNodes) {
            divergingTree.setNode(previousRow[0], true); // overwriting a node
            currentConvergingNodes++;
        }

        let j: number = 0;
        while (previousRow.length > 0) {
            if (divergingTree.node(previousRow[0]) === true) {
                divergingTree.setEdge(newRow[j], previousRow[0]);
                j++;
            }
            const previousNode = previousRow.shift();
            if (previousNode !== undefined) { // added because compiler is dog
                divergingTree.setEdge(newRow[j], previousNode);
            }
            j++;
        }
        // Connect the remaining nodes to the end node
        while (j < randomRowNodeAmount) {
            divergingTree.setEdge(newRow[j], endNode);
            j++;
            console.log("stuck here b")
        }
    }

    // Connect the start node to the first row
    let startNode = "startNode";
    divergingTree.setNode(startNode, false)
    for (let i: number = 0; i < newRow.length; i++) {
        divergingTree.setEdge(startNode, newRow[i]);
        console.log("stuck here a")
    }


    if (nodesMade !== nodeAmount) {
        console.log(nodesMade + "nodesMade")
        console.log(nodeAmount + "nodeAmount")
        console.log("Error: Something went wrong!");
        return divergingTree;
    }

    return divergingTree;
}

let graph = DivergingTree(10);
console.log(graph.nodes());