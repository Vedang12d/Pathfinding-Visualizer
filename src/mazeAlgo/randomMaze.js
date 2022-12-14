export function randomMaze(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let walls = [];
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      if (
        (row === startNode.row && column === startNode.column) ||
        (row === finishNode.row && column === finishNode.column)
      )
        continue;
      if (Math.random() < 0.33) {
        walls.push([row, column]);
      }
    }
  } 
  walls.sort(() => Math.random() - 0.5);
  return walls;
}
