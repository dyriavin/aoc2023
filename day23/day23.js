const fs = require("fs");
const { EOL } = require("os");

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const allowedSteps = [".^", ".>", ".v", ".<"];

const generateHash = (row, col) => [row, col].join(",");

const parseInput = (input) => input.split(EOL).map((line) => line.split(""));

const solveFlood = (grid) => {
  const routes = [],
    bfsQueue = [];
  bfsQueue.push([0, 1, 0, [generateHash(0, 1)]]);
  while (bfsQueue.length) {
    const [row, col, steps, seen] = bfsQueue.pop();
    for (let i = 0; i < 4; i++) {
      const [dr, dc] = directions[i];
      const newRow = row + dr,
        newCol = col + dc;
      if (newRow == grid.length - 1 && grid[newRow][newCol] == ".") {
        routes.push(steps + 1);
      } else if (
        newRow >= 0 &&
        newCol >= 0 &&
        allowedSteps[i].includes(grid[newRow][newCol]) &&
        !seen.includes(generateHash(newRow, newCol))
      ) {
        bfsQueue.push([newRow, newCol, steps + 1, seen.concat([generateHash(newRow, newCol)])]);
      }
    }
  }
  return routes.reduce((maxSteps, currentSteps) => Math.max(maxSteps, currentSteps), 0);
};

const solveGraph = (grid) => {
  const nodes = [
    generateHash(0, 1),
    generateHash(grid.length - 1, grid[grid.length - 1].indexOf(".")),
  ];
  const nodeDistances = [];
  const isValid = (row, col) =>
    row >= 0 &&
    row < grid.length &&
    col > 0 &&
    col < grid[0].length &&
    grid[row][col] != "#";
  for (let i = 0; i < nodes.length; i++) {
    nodeDistances[i] = {};
    const [row, col] = nodes[i].split(",").map(Number);
    const walk = (r, c, step, lastDirection) => {
      if (!isValid(r, c)) return;
      const validDirections = directions.reduce(
        (count, [dr, dc]) => count + (isValid(r + dr, c + dc) ? 1 : 0),
        0
      );
      if (step > 0 && (validDirections > 2 || r < 1 || r >= grid.length - 1)) {
        if (!nodes.includes(generateHash(r, c))) nodes.push(generateHash(r, c));
        nodeDistances[i][nodes.indexOf(generateHash(r, c))] = step;
        return;
      }
      for (let s = 0; s < 4; s++)
        if ((s + 2) % 4 != lastDirection)
          walk(r + directions[s][0], c + directions[s][1], step + 1, s);
    };
    walk(row, col, 0, -1);
  }

  let maxDistance = 0;
  const explore = (distance, node, previousNodes) => {
    if (node == 1) {
      maxDistance = Math.max(maxDistance, distance);
      return;
    }
    previousNodes.push(node);
    for (let nextNode in nodeDistances[node]) {
      nextNode = Number(nextNode);
      if (previousNodes.includes(nextNode)) continue;
      explore(distance + nodeDistances[node][nextNode], nextNode, [...previousNodes]);
    }
  };
  explore(0, 0, []);
  return maxDistance;
};

const part1Solution = () =>
  solveFlood(parseInput(fs.readFileSync("input.txt", "utf8")));

const part2Solution = () =>
  solveGraph(parseInput(fs.readFileSync("input.txt", "utf8")));

console.dir({ part1: part1Solution(), part2: part2Solution() }, { depth: null });
