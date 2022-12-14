import { getNeighbourNodes } from "./commonFunctions";
export function bidirectionalSearch(grid, startNode, finishNode) {
  const visitedNodesStart = [];
  const unvisitedNodesStart = [];
  const visitedNodesFinish = [];
  const unvisitedNodesFinish = [];
  let trackStart = new Map();
  let trackFinish = new Map();
  //Set distance of start node
  startNode.distance = 0;
  startNode.visitedNode = true;
  finishNode.distance = 0;
  finishNode.visitedNode = true;
  //Search from start node
  trackStart.set(startNode, null);
  trackFinish.set(finishNode, null);
  unvisitedNodesStart.push(startNode);
  unvisitedNodesFinish.push(finishNode);
  //Loop until the whole grid is searched or
  //trapped inside a wall
  while (unvisitedNodesStart.length || unvisitedNodesFinish.length) {
    if (unvisitedNodesStart.length) {
      let nextNodeStart = unvisitedNodesStart.shift();
      visitedNodesStart.push(nextNodeStart);
      if (unvisitedNodesFinish.includes(nextNodeStart)) {
        return [
          visitedNodesStart,
          visitedNodesFinish,
          true,
          trackStart,
          trackFinish,
          1
        ];
      }
      const neighbourNodes = getNeighbourNodes(nextNodeStart, grid).filter(
        (node) =>
          !unvisitedNodesStart.includes(node) &&
          !node.wallNode &&
          !visitedNodesStart.includes(node)
      );
      neighbourNodes.forEach((node) => {
        if (
          Math.abs(node.row - nextNodeStart.row) === 1 &&
          Math.abs(node.column - nextNodeStart.column) === 1
        ) {
          node.distance = nextNodeStart.distance + Math.sqrt(2);
        } else {
          node.distance = nextNodeStart.distance + 1;
        }
        trackStart.set(node, nextNodeStart);
        unvisitedNodesStart.push(node);
      });
    }
    if (unvisitedNodesFinish.length) {
      let nextNodeFinish = unvisitedNodesFinish.shift();
      visitedNodesFinish.push(nextNodeFinish);
      if (unvisitedNodesStart.includes(nextNodeFinish)) {
        return [
          visitedNodesStart,
          visitedNodesFinish,
          true,
          trackStart,
          trackFinish,
          0
        ];
      }
      const neighbourNodes = getNeighbourNodes(nextNodeFinish, grid).filter(
        (node) =>
          !unvisitedNodesFinish.includes(node) &&
          !node.wallNode &&
          !visitedNodesFinish.includes(node)
      );
      neighbourNodes.forEach((node) => {
        if (
          Math.abs(node.row - nextNodeFinish.row) === 1 &&
          Math.abs(node.column - nextNodeFinish.column) === 1
        ) {
          node.distance = nextNodeFinish.distance + Math.sqrt(2);
        } else {
          node.distance = nextNodeFinish.distance + 1;
        }
        trackFinish.set(node, nextNodeFinish);
        unvisitedNodesFinish.push(node);
      });
    }
  }
  return [
    visitedNodesStart,
    visitedNodesFinish,
    false,
    trackStart,
    trackFinish,
    -1
  ];
}

export function getFinalPathNodesBidirectional2(
  trackStart,
  trackFinish,
  nodeA,
  nodeB
) {
  const nodesInShortestPathOrder = [];
  let currentNode = nodeB;
  while (currentNode !== null) {
    nodesInShortestPathOrder.push(currentNode);
    // if(!trackFinish.has(currentNode))
    //     return nodesInShortestPathOrder;
    currentNode = trackFinish.get(currentNode);
    // console.log(currentNode);
  }
  currentNode = nodeA;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    // if(!trackStart.has(currentNode))
    //     return nodesInShortestPathOrder;
    currentNode = trackStart.get(currentNode);
    // console.log(currentNode);
  }
  return nodesInShortestPathOrder;
}

export function getFinalPathNodesBidirectional(
  trackStart,
  trackFinish,
  nodeA,
  nodeB
) {
  const nodesInShortestPathOrderStart = [];
  let currentNode = nodeB;
  while (currentNode !== null) {
    nodesInShortestPathOrderStart.unshift(currentNode);
    currentNode = trackFinish.get(currentNode);
  }
  const nodesInShortestPathOrderFinish = [];
  currentNode = nodeA;
  while (currentNode !== null) {
    nodesInShortestPathOrderFinish.unshift(currentNode);
    currentNode = trackStart.get(currentNode);
  }
  return [nodesInShortestPathOrderStart, nodesInShortestPathOrderFinish];
}
