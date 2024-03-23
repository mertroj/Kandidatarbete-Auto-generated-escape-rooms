import {Graph} from "graphlib";

/**
 * Generates a diverging tree graph with a specified number of nodes.
 *
 * The diverging tree is constructed by creating a tree structure where each node
 * has multiple child nodes in the row below, and some nodes converge to a single
 * node in the row above. The start node is connected to the first row, and the
 * last row nodes are connected to an end node.
 *
 * @param {number} nodeAmount - The total number of nodes in the diverging tree.
 * @returns {graph} A Graph object representing the generated diverging tree.
 */
export function divergingTree(nodeAmount: number): Graph {
    const MAX_NODES_ROW: number = 4;
    const MIN_NODES_ROW: number = 2;
    const maxConvergingNodes: number = Math.floor(nodeAmount / 11) + 1;

    let currentConvergingNodes: number = 0;
    let divergingTree = new Graph();
    let previousRow: string[] = [];
    let newRow: string[] = [];
    let rowNodeDifference: number = 0;
    let randomRowNodeAmount: number = 0;
    let endNode: string = "";

    let lastRow: boolean = false;
    let nodesMade: number = 0;

    if (nodeAmount < 3) {
        console.log("Not enough nodes to make a diverging-tree");
        return divergingTree;
    }

    while (nodesMade < nodeAmount) {
        // if first node Generate end node and connect them to 2 child nodes
        if (nodesMade === 0) {
            endNode = nodesMade.toString();
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
                nodesMade++;
                newRow.push(newNode);
            }
        }

        if (nodesMade >= nodeAmount - MAX_NODES_ROW) {
            lastRow = true;
        }

        rowNodeDifference = previousRow.length - randomRowNodeAmount;
        if ((rowNodeDifference > 0 || lastRow) && currentConvergingNodes < maxConvergingNodes) {
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
            if (previousNode !== '') {
                if (previousNode !== undefined && newRow[j] !== undefined) { // added because compiler is dog
                    divergingTree.setEdge(newRow[j], previousNode);
                }
            }
            j++;
        }
        // Connect the remaining nodes to the end node
        while (j < randomRowNodeAmount) {
            divergingTree.setEdge(newRow[j], endNode);
            j++;
        }
    }

    // Connect the start node to the first row
    let startNode = "startNode";
    divergingTree.setNode(startNode, false)
    for (let i: number = 0; i < newRow.length; i++) {
        divergingTree.setEdge(startNode, newRow[i]);
    }


    if (nodesMade !== nodeAmount) {
        console.log(nodesMade + "nodesMade")
        console.log(nodeAmount + "nodeAmount")
        console.log("Error: Something went wrong!");
        return divergingTree;
    }

    return divergingTree;
}