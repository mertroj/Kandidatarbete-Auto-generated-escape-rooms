import {Graph} from "graphlib";

function DivergingTree(nodeAmount: number) {
    const MAX_NODES_ROW: number = 4;
    const MIN_NODES_ROW: number = 2;
    const maxConvergingNodes: number = Math.floor(nodeAmount / 11) + 1;

    let divergingTree = new Graph();
    let temporaryBox: string[];
    let rowNodeDifference: number;
    let randomRowNodeAmount: number;

    for (let i = 0; i < nodeAmount; i++) {
        // if first row generate end node and connect them to 3 child nodes
        if (i === 0) {
            // Create the end node
            divergingTree.setNode(i.toString(), true);
            for (let j: number = 1; j <=2; j++) {
                divergingTree.setNode((i+j).toString(), false);
                divergingTree.setEdge((i+j).toString(), i.toString());
                temporaryBox.push((i+j).toString());
            }
            i = 2;

        }

        // randomly generate amount of nodes in a row
        if (nodeAmount - i < MAX_NODES_ROW) {
            let randomRowNodeAmount = Math.floor(Math.random() * (MAX_NODES_ROW - MIN_NODES_ROW + 1) + MIN_NODES_ROW);
        }
        else if (nodeAmount - i < MIN_NODES_ROW){
            let randomRowNodeAmount = nodeAmount - i;
        }
        else {
            let randomRowNodeAmount = Math.floor(Math.random() * (nodeAmount - i - MIN_NODES_ROW + 1) + MIN_NODES_ROW);
        }

        rowNodeDifference = temporaryBox.length - randomRowNodeAmount;
        if (rowNodeDifference > 0) {
                divergingTree.setNode(temporaryBox[0], true);
        }

        for (let j: number = 0; j < randomRowNodeAmount; j++) {
            let currentNode = (i+j+1).toString()
            divergingTree.setNode(currentNode, false);
            divergingTree.setEdge(currentNode, temporaryBox[j]);
        }  // TODO: byt till while loop som itterar över temporaryBox och ser till att om inga fler noder finns i temporary box så kopplar de till end node

        // connect the new rows nodes to previous rows nodes, connecting one overflow node to the converging node otherwise to end node
        // also check if second to last row to make an additional converging node if above a certain amount of total nodes


        // om du nått max convergingnodes koppla istället till endnode


        // TODO: clear temporaryBox
    }
    
    
    return divergingTree;
}