export function getNeighbourNodes(currNode, grid) {
    const neighbourNodes = [];
    const { row, column } = currNode;
    row > 0 && neighbourNodes.push(grid[row - 1][column]);
    column < grid[0].length - 1 && neighbourNodes.push(grid[row][column + 1]);
    row < grid.length - 1 && neighbourNodes.push(grid[row + 1][column]);
    column > 0 && neighbourNodes.push(grid[row][column - 1]);

    return neighbourNodes;
}

export function getFinalPathNodes(finishNode) {
    const finalPathNodes = [];
    let node = finishNode;
    while (node !== null) {
        finalPathNodes.unshift(node);
        node = node.trackPrevNode;
    }
    return finalPathNodes;
}
