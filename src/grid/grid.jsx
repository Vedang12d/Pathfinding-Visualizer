/* Grid component and functionality */

import { Component } from "react";
import Node from "./node/node";
import { Elements } from "../visuals/elements";
import "./grid.css";

// const NUMGRID = getInitialNum(window.innerWidth -20, window.innerHeight-160);
const NUMCOLUMNS = 60;
const NUMROWS = 22;
// console.log(NUMGRID);

// function getInitialNum(width, height) {
//   let numColumns;
//   if (width > 1500) {
//     numColumns = Math.floor(width / 25);
//   } else if (width > 1250) {
//     numColumns = Math.floor(width / 22.5);
//   } else if (width > 1000) {
//     numColumns = Math.floor(width / 20);
//   } else if (width > 750) {
//     numColumns = Math.floor(width / 17.5);
//   } else if (width > 500) {
//     numColumns = Math.floor(width / 15);
//   } else if (width > 250) {
//     numColumns = Math.floor(width / 12.5);
//   } else if (width > 0) {
//     numColumns = Math.floor(width / 10);
//   }
//   let cellWidth = Math.floor(width / numColumns);
//   let numRows = Math.floor(height / cellWidth);
//   return [numRows, numColumns];
// }

export class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      startXY: [11, 15],
      finishXY: [11, 45],
      wallMode: false,
      changeStartNode: false,
      changeFinishNode: false,
      disablePlacement: false,
    };
    this.resetGrid = this.resetGrid.bind(this);
    this.disableNodePlacement = this.disableNodePlacement.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  changeState(newGrid) {
    this.setState({ grid: newGrid });
  }

  componentDidMount() {
    const grid = initialiseGrid(this.state.startXY, this.state.finishXY);
    this.setState({ grid: grid });
  }

  /* Add wall object to empty grid cells
   * Move start nodes or finish nodes */
  handleMouseDown(event, row, column) {
    // this.setState({disablePlacement: false});
    event.preventDefault();
    const { grid, startXY, finishXY, disablePlacement } = this.state;
    if (event.nativeEvent.which === 1) {
      if (
        !disablePlacement &&
        !(row === startXY[0] && column === startXY[1]) &&
        !(row === finishXY[0] && column === finishXY[1])
      ) {
        const newGrid = setWall(grid, row, column);
        this.setState({ grid: newGrid, wallMode: true });
      } else if (
        !disablePlacement &&
        row === startXY[0] &&
        column === startXY[1]
      ) {
        const newNode = {
          ...grid[row][column],
          startNode: false,
        };
        grid[row][column] = newNode;
        this.setState({ grid: grid, changeStartNode: true });
      } else if (
        !disablePlacement &&
        row === finishXY[0] &&
        column === finishXY[1]
      ) {
        const newNode = {
          ...grid[row][column],
          finishNode: false,
        };
        grid[row][column] = newNode;
        this.setState({ grid: grid, changeFinishNode: true });
      }
    }
    // this.disableNodePlacement(true);
  }

  /* Dragging while mouse is pressed enables fast placement of walls
   * Change appearance of node to start or finish nodes while hovering */
  handleMouseEnter(row, column) {
    // this.disableNodePlacement(true);
    const { grid, startXY, finishXY, disablePlacement } = this.state;
    if (
      !disablePlacement &&
      this.state.wallMode &&
      !(row === startXY[0] && column === startXY[1]) &&
      !(row === finishXY[0] && column === finishXY[1])
    ) {
      const newGrid = setWall(grid, row, column);
      this.setState({ grid: newGrid });
    } else if (
      !disablePlacement &&
      this.state.changeStartNode &&
      !grid[row][column].wallNode
    ) {
      document.getElementById(`node${row}-${column}`).className =
        "Node startNode";
      this.setState({ startXY: [row, column] });
    } else if (
      !disablePlacement &&
      this.state.changeFinishNode &&
      !grid[row][column].wallNode
    ) {
      document.getElementById(`node${row}-${column}`).className =
        "Node finishNode";
      this.setState({ finishXY: [row, column] });
    }
    // this.disableNodePlacement(false)
  }

  /* Revert appearance of nodes (if changed by the placement of a start or finish node) */
  handleMouseOut(row, column) {
    const { grid, changeStartNode, changeFinishNode, disablePlacement } =
      this.state;
    if (
      !disablePlacement &&
      (changeStartNode || changeFinishNode) &&
      !grid[row][column].wallNode
    ) {
      document.getElementById(`node${row}-${column}`).className = "Node";
    }
  }

  /* Lifting mouse button stops placement of walls
   * If a start or finish node is in a new location, set the grid cell to the new start or finish node */
  handleMouseUp(event) {
    event.preventDefault();
    // this.disableNodePlacement(true);
    const { grid, changeStartNode, changeFinishNode, disablePlacement } =
      this.state;
    if (!disablePlacement && changeStartNode) {
      const { startXY } = this.state;
      const newGrid = setStartNode(grid, startXY[0], startXY[1]);
      this.resetGrid(true);
      this.setState({ grid: newGrid, changeStartNode: false });
    } else if (!disablePlacement && changeFinishNode) {
      const { finishXY } = this.state;
      const newGrid = setFinishNode(grid, finishXY[0], finishXY[1]);
      this.resetGrid(true);
      this.setState({ grid: newGrid, changeFinishNode: false });
    } else if (this.state.wallMode) {
      this.setState({ wallMode: false });
    }
    // this.disableNodePlacement(false);
  }

  /* Prevents placement of start, finish or wall nodes during visualisation */
  disableNodePlacement(disablePlacement) {
    this.setState({ disablePlacement: disablePlacement });
  }

  /* Create grid using JSX */
  createGridElements() {
    const { grid } = this.state;
    return grid.map((rowNodes, index) => {
      return (
        <div className="row" key={index}>
          {rowNodes.map((node, index) => {
            const { row, column, startNode, finishNode, wallNode } = node;
            return (
              <Node
                key={index}
                row={row}
                column={column}
                startNode={startNode}
                finishNode={finishNode}
                wallNode={wallNode}
                onMouseDown={(event, row, column) =>
                  this.handleMouseDown(event, row, column)
                }
                onMouseEnter={(row, column) =>
                  this.handleMouseEnter(row, column)
                }
                onMouseOut={(row, column) => this.handleMouseOut(row, column)}
                onMouseUp={(event) => this.handleMouseUp(event)}
                onContextMenu={(event) =>
                  this.handleMouseDown(event, row, column)
                }
                width={window.innerWidth - 20}
                height={window.innerHeight - 160}
                numRows={NUMROWS}
                numColumns={NUMCOLUMNS}
              ></Node>
            );
          })}
        </div>
      );
    });
  }

  /* Reset state of the grid */
  resetGrid(keepWalls) {
    const { grid, startXY, finishXY } = this.state;
    const newGrid = [];
    for (let i = 0; i < NUMROWS; i++) {
      const rowNodes = [];
      for (let j = 0; j < NUMCOLUMNS; j++) {
        const node = grid[i][j];
        let newNode;
        if (node.wallNode && keepWalls) {
          newNode = {
            ...node,
            distance: Infinity,
            heuristic: 0,
            trackPrevNode: null,
          };
        } else {
          newNode = {
            row: i,
            column: j,
            startNode: i === startXY[0] && j === startXY[1],
            finishNode: i === finishXY[0] && j === finishXY[1],
            wallNode: false,
            visitedNode: false,
            distance: Infinity,
            heuristic: 0,
            trackPrevNode: null,
          };
        }

        if (i === startXY[0] && j === startXY[1]) {
          document.getElementById(`node${i}-${j}`).className = "Node startNode";
        } else if (i === finishXY[0] && j === finishXY[1]) {
          document.getElementById(`node${i}-${j}`).className =
            "Node finishNode";
        } else if (node.wallNode) {
          document.getElementById(`node${i}-${j}`).className = "Node wallNode";
        } else {
          document.getElementById(`node${i}-${j}`).className = "Node";
        }

        rowNodes.push(newNode);
      }

      newGrid.push(rowNodes);
    }

    this.setState({ grid: newGrid });
  }

  render() {
    return (
      <>
        <Elements
          grid={this.state.grid}
          startXY={this.state.startXY}
          finishXY={this.state.finishXY}
          resetGrid={this.resetGrid}
          disableNodePlacement={this.disableNodePlacement}
          changeState={this.changeState}
        ></Elements>
        <div className="grid">{this.createGridElements()}</div>
      </>
    );
  }
}

function initialiseGrid(startXY, finishXY) {
  const grid = [];
  for (let i = 0; i < NUMROWS; i++) {
    const rowNodes = [];
    for (let j = 0; j < NUMCOLUMNS; j++) {
      const node = {
        row: i,
        column: j,
        startNode: i === startXY[0] && j === startXY[1],
        finishNode: i === finishXY[0] && j === finishXY[1],
        wallNode: false,
        visitedNode: false,
        distance: Infinity,
        heuristic: 0,
        trackPrevNode: null,
      };

      rowNodes.push(node);
    }

    grid.push(rowNodes);
  }

  return grid;
}

function setWall(grid, row, column) {
  const node = grid[row][column];
  const newNode = {
    ...node,
    wallNode: !node.wallNode,
  };

  grid[row][column] = newNode;
  return grid;
}

function setStartNode(grid, row, column) {
  const node = grid[row][column];
  const newNode = {
    ...node,
    startNode: true,
  };

  grid[row][column] = newNode;
  return grid;
}

function setFinishNode(grid, row, column) {
  const node = grid[row][column];
  const newNode = {
    ...node,
    finishNode: true,
  };

  grid[row][column] = newNode;
  return grid;
}
