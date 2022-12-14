# [Pathfinding Visualizer](https://pathfinder-290rq6e97-vedang12d.vercel.app/)

Inspired by [Clement Mihailescu's Pathfinding Visualizer](https://clementmihailescu.github.io/Pathfinding-Visualizer/)
Visualzation tool for Informed and Uninformed Search Algorithms

## Images

## Features

### Uninformed Search Algorithms
1) Depth-first search(DFS) : The algorithm starts at the source node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.

2) Breadth-first search(BFS) : It starts at the source node and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. It uses the opposite strategy of depth-first search, which instead explores the node branch as far as possible before being forced to backtrack and expand other nodes.

3) Bidirectional BFS: It runs two simultaneous Breadth-first searches, one from source node towards destination node and other from destination node towrds the source node.

### Informed Search Algorithms
1) A* search: A* search evaluates nodes by combining the cost to reach the node, and the cost to get from the node to the goal. It always provides the shortest path between two nodes.

2) Greedy Best-first search: Greedy best-first search tries to expand the node that is closest to the goal, on the grounds that this is likely to lead to a solution quickly. Unlike A* algorithms it doesn't always provides optimal path.

### Maze Generation Algorithms
1) Random Maze - It's just a simple algorithm which creates walls based on the output of a random function.

2) Recursive Division - It bisects the grid with a wall, either horizontally or vertically and adds a single passage through the wall. Recursively repeats this with the areas on either side of the wall until the maze reaches the desired resolution.

3) Aldous Broder - It chooses random vertex and chooses a connected neighbor of the vertex and travels to it. If the neighbor has not yet been visited, add the traveled edge to the spanning tree. Repeats this for its neighbours.

## Getting Started/Installation
Pretty much the same as the standard react application, so all the usual react-scripts are available to your disposal. So, over here I restricted myself to the instructions to only the essentials.
### 1. Clone the repository or download the zip
```
git clone https://github.com/Vedang12d/Pathfinding-Visualizer.git
```

## 2. Install the dependencies
```
npm install
```

## 3. Start the application
```
npm start
```
Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.
