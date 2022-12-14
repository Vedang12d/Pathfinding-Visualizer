/* This file handles most animations and visual components
 * including navigation side bars. */
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Component } from "react";
import { getFinalPathNodes } from "../algorithms/commonFunctions";
import {
  aStarSearch,
  calcManhattanDistance,
  calcEuclideanDistance,
} from "../algorithms/aStarSearch";
import { breadthFirstSearch } from "../algorithms/breadthFirstSearch";
import { depthFirstSearch } from "../algorithms/depthFirstSearch";
import { bestFirstSearch } from "../algorithms/bestFirstSearch";
import {
  bidirectionalSearch,
  getFinalPathNodesBidirectional,
} from "../algorithms/bidirectional";
import { recursiveDivisionMaze } from "../mazeAlgo/recursiveDivision";
import { randomMaze } from "../mazeAlgo/randomMaze";
import { aldousBroder } from "../mazeAlgo/aldousBroder";
// import { Node } from "../grid/node/node";
import "../grid/node/node.css";
import "./features.css";
import "./navigation.css";

function getGridWithMaze(grid, walls) {
  const newGrid = grid.slice();
  walls.forEach((wall) => {
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      wallNode: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  });
  return newGrid;
}

export class Elements extends Component {
  constructor() {
    super();
    this.state = {
      algorithm: "select",
      maze: "select",
      animationSpeedFactor: 100,
      clickVisualise: true,
      clickClearBoard: true,
      flag: false,
    };
  }

  handleAlgorithm(event, algorithm) {
    this.setState({ algorithm: algorithm, flag: false });
  }

  handleMaze(event, maze) {
    this.setState({ maze: maze, flag: true });
  }

  visualizeBidirectional(
    visitedNodesStart,
    visitedNodesFinish,
    isShortestPath,
    finalPathNodes
  ) {
    const { animationSpeedFactor } = this.state;
    const len = Math.max(visitedNodesStart.length, visitedNodesFinish.length);
    for (let i = 0; i < len; i++) {
      const nodeA = visitedNodesStart[i];
      const nodeB = visitedNodesFinish[i];
      setTimeout(() => {
        if (nodeA)
          document.getElementById(
            `node${nodeA.row}-${nodeA.column}`
          ).className += " visitedNode";
        if (nodeB)
          document.getElementById(
            `node${nodeB.row}-${nodeB.column}`
          ).className += " visitedNode";
      }, (500 * i) / animationSpeedFactor);
      if (i === len - 1) {
        setTimeout(() => {
          if (isShortestPath) {
            const [startNodes, finishNodes] = finalPathNodes;
            let len = Math.max(startNodes.length, finishNodes.length);
            for (let i = 0; i < len; i++) {
              setTimeout(() => {
                if (i < startNodes.length) {
                  const currNode = startNodes[i];
                  const newClassName =
                    document.getElementById(
                      `node${currNode.row}-${currNode.column}`
                    ).className + " finalPathNode";
                  document.getElementById(
                    `node${currNode.row}-${currNode.column}`
                  ).className = newClassName;
                }
                if (i < finishNodes.length) {
                  const currNode2 = finishNodes[i];
                  const newClassName =
                    document.getElementById(
                      `node${currNode2.row}-${currNode2.column}`
                    ).className + " finalPathNode";
                  document.getElementById(
                    `node${currNode2.row}-${currNode2.column}`
                  ).className = newClassName;
                }
                if (i === len - 1) {
                  this.props.disableNodePlacement(false);
                  this.setState({ clickVisualise: true });
                  this.setState({ clickClearBoard: true });
                  Notify.success(
                    `Length of Path is ${
                      startNodes.length - 1 + finishNodes.length - 1
                    }`
                  );
                }
              }, 50 * i);
            }
          } else {
            this.props.disableNodePlacement(false);
            this.setState({ clickVisualise: true });
            this.setState({ clickClearBoard: true });
            Notify.failure("Path not found");
          }
        }, (500 * i) / animationSpeedFactor);
      }
    }
  }

  /* Animates nodes that have been visited
   * Animates shortest route after animating all visited nodes in order */
  visualiseAlgorithm(visitedNodes, finalPathNodes, finishNode) {
    const { animationSpeedFactor } = this.state;
    for (let i = 0; i < visitedNodes.length; i++) {
      if (i < visitedNodes.length - 1) {
        setTimeout(() => {
          const currNode = visitedNodes[i];
          const newClassName =
            document.getElementById(`node${currNode.row}-${currNode.column}`)
              .className + " visitedNode";
          document.getElementById(
            `node${currNode.row}-${currNode.column}`
          ).className = newClassName;
        }, (500 * i) / animationSpeedFactor);
      } else if (
        i === visitedNodes.length - 1 &&
        visitedNodes[i] === finishNode
      ) {
        setTimeout(() => {
          const currNode = visitedNodes[i];
          const newClassName =
            document.getElementById(`node${currNode.row}-${currNode.column}`)
              .className + " visitedNode";
          document.getElementById(
            `node${currNode.row}-${currNode.column}`
          ).className = newClassName;
        }, (500 * i) / animationSpeedFactor);
        setTimeout(() => {
          for (let i = 0; i < finalPathNodes.length; i++) {
            setTimeout(() => {
              const currNode = finalPathNodes[i];
              const newClassName =
                document.getElementById(
                  `node${currNode.row}-${currNode.column}`
                ).className + " finalPathNode";
              document.getElementById(
                `node${currNode.row}-${currNode.column}`
              ).className = newClassName;

              if (i === finalPathNodes.length - 1) {
                this.props.disableNodePlacement(false);
                this.setState({ clickVisualise: true });
                this.setState({ clickClearBoard: true });
                Notify.success(
                  `Length of Path is ${finalPathNodes.length - 1}`
                );
              }
            }, 50 * i);
          }
        }, (500 * i) / animationSpeedFactor);
      } else if (i === visitedNodes.length - 1) {
        setTimeout(() => {
          const currNode = visitedNodes[i];
          const newClassName =
            document.getElementById(`node${currNode.row}-${currNode.column}`)
              .className + " visitedNode";
          document.getElementById(
            `node${currNode.row}-${currNode.column}`
          ).className = newClassName;

          this.props.disableNodePlacement(false);
          this.setState({ clickVisualise: true });
          this.setState({ clickClearBoard: true });
          Notify.failure("Path not found");
        }, (500 * i) / animationSpeedFactor);
      }
    }
  }

  visualizeMaze(walls) {
    const { animationSpeedFactor } = this.state;
    const { grid } = this.props;
    for (let i = 0; i < walls.length; i++) {
      let wall = walls[i];
      let node = grid[wall[0]][wall[1]];
      setTimeout(() => {
        //Walls
        const newClass =
          document.getElementById(`node${node.row}-${node.column}`).className +
          " wallNode";
        document.getElementById(`node${node.row}-${node.column}`).className =
          newClass;
      }, (500 * i) / animationSpeedFactor);
      // if (i === walls.length - 1) {
      }
        setTimeout(() => {
          // this.props.resetGrid(false);
          let newGrid = getGridWithMaze(grid, walls);
          this.props.changeState(newGrid);
          this.props.disableNodePlacement(false);
          this.setState({ clickVisualise: true });
          this.setState({ clickClearBoard: true });
        }, (500 * walls.length) / animationSpeedFactor);
      // }
    // this.props.disableNodePlacement(false);
    // this.setState({ clickVisualise: true });
    // this.setState({ clickClearBoard: true });
  }

  executeMazefinder() {
    const { animationSpeedFactor, maze } = this.state;
    setTimeout(() => {
      const { grid, startXY, finishXY } = this.props;

      this.setState({ clickVisualise: false });
      this.setState({ clickClearBoard: false });
      //Clear grid
      this.props.resetGrid(false);

      const startNode = grid[startXY[0]][startXY[1]];
      const finishNode = grid[finishXY[0]][finishXY[1]];
      let walls;
      switch (maze) {
        case "recursive-division":
          walls = recursiveDivisionMaze(grid, startNode, finishNode);
          this.visualizeMaze(walls);
          break;
        case "random-maze":
          walls = randomMaze(grid, startNode, finishNode);
          this.visualizeMaze(walls);
          break;
        case "aldous-broder":
          walls = aldousBroder(grid, startNode, finishNode);
          this.visualizeMaze(walls);
          break;
        default:
          // this.props.resetGrid(false);
          this.props.disableNodePlacement(false);
          this.setState({ clickVisualise: true });
          this.setState({ clickClearBoard: true });
          break;
      }
    }, (500 * 20) / animationSpeedFactor);
  }

  /* Series of function calls to execute the path finding algorithm then animating it */
  executePathfinder() {
    //Can't visualise during an already occurring visualisation
    if (this.state.clickVisualise) {
      const { grid, startXY, finishXY } = this.props;
      const { algorithm } = this.state;
      this.setState({ clickVisualise: false });
      this.setState({ clickClearBoard: false });
      //Clear grid
      this.props.resetGrid(true);
      const startNode = grid[startXY[0]][startXY[1]];
      const finishNode = grid[finishXY[0]][finishXY[1]];
      let visitedNodes, finalPathNodes;

      switch (algorithm) {
        case "bidirectional":
          // this.algoSentence = `Dijkstra's algorithm in optimal, single source shortest path algorithm | TC: O(ElogV) | SC: O(V)`;
          visitedNodes = bidirectionalSearch(grid, startNode, finishNode);
          const [
            visitedNodesStart,
            visitedNodesFinish,
            isShortestPath,
            trackStart,
            trackFinish,
            flag,
          ] = visitedNodes;
          if (flag === 1) {
            finalPathNodes = getFinalPathNodesBidirectional(
              trackStart,
              trackFinish,
              visitedNodesStart[visitedNodesStart.length - 1],
              visitedNodesStart[visitedNodesStart.length - 1]
            );
          } else if (flag === 0) {
            finalPathNodes = getFinalPathNodesBidirectional(
              trackStart,
              trackFinish,
              visitedNodesFinish[visitedNodesFinish.length - 1],
              visitedNodesFinish[visitedNodesFinish.length - 1]
            );
          }
          this.visualizeBidirectional(
            visitedNodesStart,
            visitedNodesFinish,
            isShortestPath,
            finalPathNodes
          );
          // visitedNodes = dijkstra(grid, startNode, finishNode);
          // finalPathNodes = getFinalPathNodes(finishNode);
          // this.visualiseAlgorithm(visitedNodesStart, finalPathNodes, finishNode);
          break;
        case "best-first-search":
          visitedNodes = bestFirstSearch(grid, startNode, finishNode);
          finalPathNodes = getFinalPathNodes(finishNode);
          this.visualiseAlgorithm(visitedNodes, finalPathNodes, finishNode);
          break;
        case "astar-euclidean":
          // this.algoSentence = `A* search algorithm finds the shortest path through the search space using heuristic function | TC: O(bᵈ) | SC: O(bᵈ)`;
          visitedNodes = aStarSearch(
            grid,
            startNode,
            finishNode,
            calcEuclideanDistance
          );
          finalPathNodes = getFinalPathNodes(finishNode);
          this.visualiseAlgorithm(visitedNodes, finalPathNodes, finishNode);
          break;
        case "astar-manhattan":
          // this.algoSentence = `A* search algorithm finds the shortest path through the search space using heuristic function | TC: O(bᵈ) | SC: O(bᵈ)`;
          visitedNodes = aStarSearch(
            grid,
            startNode,
            finishNode,
            calcManhattanDistance
          );
          finalPathNodes = getFinalPathNodes(finishNode);
          this.visualiseAlgorithm(visitedNodes, finalPathNodes, finishNode);
          break;
        case "bfs":
          visitedNodes = breadthFirstSearch(grid, startNode, finishNode);
          finalPathNodes = getFinalPathNodes(finishNode);
          this.visualiseAlgorithm(visitedNodes, finalPathNodes, finishNode);
          break;
        case "dfs":
          visitedNodes = depthFirstSearch(grid, startNode, finishNode);
          finalPathNodes = getFinalPathNodes(finishNode);
          this.visualiseAlgorithm(visitedNodes, finalPathNodes, finishNode);
          break;
        default:
          this.props.disableNodePlacement(false);
          this.setState({ clickVisualise: true });
          this.setState({ clickClearBoard: true });
          break;
        //Never reaches default case
      }
    }
  }

  render() {
    return (
      <div>
        <div className="navBar">
          <div className="navBarHeader">
            {
              // eslint-disable-next-line
            }<a
              className="navBarTitle"
              href=""
              onClick={() => {
                window.location.reload();
              }}
            >
              Pathfinding Visualizer
            </a>
          </div>
          <div className="dropDown">
            <button className="dropBtn">
              Algorithms
              <i className="down arrow"></i>
            </button>
            <div id="dropDownContent" className="dropDownContent">
              <a
                href="#greedy"
                onClick={(event) => {
                  this.handleAlgorithm(event, "best-first-search");
                }}
              >
                Greedy Best First Search
              </a>
              <a
                href="#aStarE"
                onClick={(event) => {
                  this.handleAlgorithm(event, "astar-euclidean");
                }}
              >
                A* (Euclidean)
              </a>
              <a
                href="#aStarM"
                onClick={(event) => {
                  this.handleAlgorithm(event, "astar-manhattan");
                }}
              >
                A* (Manhattan)
              </a>
              <div className="divider-dash"></div>
              <a
                href="#bidirectional"
                onClick={(event) => {
                  this.handleAlgorithm(event, "bidirectional");
                }}
              >
                Bidirectional BFS
              </a>
              <a
                href="#bfs"
                onClick={(event) => {
                  this.handleAlgorithm(event, "bfs");
                }}
              >
                Breadth First Search
              </a>
              <a
                href="#dfs"
                onClick={(event) => {
                  this.handleAlgorithm(event, "dfs");
                }}
              >
                Depth First Search
              </a>
            </div>
          </div>
          <div className="dropDown">
            <button className="dropBtn">
              Mazes
              <i className="down arrow"></i>
            </button>
            <div id="dropDownContent" className="dropDownContent">
              <a
                href="#recDiv"
                onClick={(event) => {
                  this.handleMaze(event, "recursive-division");
                }}
              >
                Recursive Division
              </a>
              <a
                href="#random"
                onClick={(event) => {
                  this.handleMaze(event, "random-maze");
                }}
              >
                Random Maze
              </a>
              <a
                href="#aldous"
                onClick={(event) => {
                  this.handleMaze(event, "aldous-broder");
                }}
              >
                Aldous Broder
              </a>
            </div>
          </div>
          <div className="visualize">
            <a
              href="#visualize"
              onClick={() => {
                this.props.disableNodePlacement(true);
                if (this.state.flag) {
                  this.executeMazefinder();
                  this.state.clickClearBoard && this.props.resetGrid(false);
                }
                else this.executePathfinder();
              }}
            >
              Visualize
            </a>
          </div>
          <div className="clearGrid">
            <a
              href="#clear"
              onClick={() => {
                this.state.clickClearBoard && this.props.resetGrid(false);
              }}
            >
              Clear Board
            </a>
          </div>
          <div className="clearPath">
            <a
              href="#clear"
              onClick={() => {
                this.state.clickClearBoard && this.props.resetGrid(true);
              }}
            >
              Clear Path
            </a>
          </div>
        </div>
        <div className="features">
          <div className="infoSegment">
            <div className="nodeInfo">
              <i className="icon startIcon"></i>
              <a href="start">Source Node</a>
            </div>
          </div>
          <div>
            <div className="nodeInfo">
              <i className="icon finishIcon"></i>
              <a href="finish">Target Node</a>
            </div>
          </div>
          <div className="divider"></div>
          <div className="infoSegment">
            <div className="nodeInfo">
              <i className="wallIcon"></i>
              <a href="wall">Wall Node</a>
            </div>
          </div>
          <div>
            <div className="nodeInfo">
              <i className="unvisitedIcon"></i>
              <a href="unvisited">Unvisited Node</a>
            </div>
          </div>
          <div className="divider"></div>
          <div className="infoSegment">
            <div className="nodeInfo">
              <i className="visitedIcon"></i>
              <a href="wall">Visited Node</a>
            </div>
          </div>
          <div>
            <div className="nodeInfo">
              <i className="finalPathIcon"></i>
              <a href="weight">Shortest-path Node</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
