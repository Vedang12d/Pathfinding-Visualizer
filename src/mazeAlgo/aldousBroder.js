export function aldousBroder(oldGrid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  const height = oldGrid[0].length,
  width = oldGrid.length;
  let grid = new Array(width);
  for (let i = 0; i < width; i++) {
    grid[i] = new Array(height).fill(1);
  }
  let remaining = (width * height) / 4;
  let x = Math.floor(Math.random() * width),
    y = Math.floor(Math.random() * height);
  grid[x][y] = 0;
  remaining -= 1;
  while (remaining > 0) {
    const dir = Math.floor(Math.random() * 4);
    if (dir === 0) {
      if (check(height, width, x, y - 2)) {
        y -= 2;
        if (grid[x][y] !== 0) {
          remaining -= 1;
          grid[x][y] = 0;
          grid[x][y + 1] = 0;
        }
      }
    } else if (dir === 1) {
      if (check(height, width, x, y + 2)) {
        y += 2;
        if (grid[x][y] !== 0) {
          remaining -= 1;
          grid[x][y] = 0;
          grid[x][y - 1] = 0;
        }
      }
    } else if (dir === 2) {
      if (check(height, width, x + 2, y)) {
        x += 2;
        if (grid[x][y] !== 0) {
          remaining -= 1;
          grid[x][y] = 0;
          grid[x - 1][y] = 0;
        }
      }
    } else if (dir === 3) {
      if (check(height, width, x - 2, y)) {
        x -= 2;
        if (grid[x][y] !== 0) {
          remaining -= 1;
          grid[x][y] = 0;
          grid[x + 1][y] = 0;
        }
      }
    }
  }
  //   return walls;
//   console.log(grid);
  let walls = [];
  grid[startNode.row][startNode.column] = 1;
  grid[finishNode.row][finishNode.column] = 1;
  for(let row=0;row<width;row++){
    for(let col=0;col<height;col++){
        if(!grid[row][col])
            walls.push([row,col]);
    }
  }
  return walls;
}

function check(height, width, x, y) {
  if (x >= 0 && y >= 0 && x < width && y < height) return true;
  return false;
}
