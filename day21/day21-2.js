const { readFileSync } = require("fs");
const { EOL } = require("os");


const inputText = readFileSync("input.txt", "utf8");
const inputLines = inputText.split(EOL);

let start;
const walls = new Set();


inputLines.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    const coordinates = `${x}/${y}`;
    if (char === "#") walls.add(coordinates);
    if (char === "S") start = [x, y];
  });
});

const gridLength = inputLines[0].length; 

const neighborOffsets = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];


const exploreSquare = (squareState, startX, startY, maxSteps) => {
  const visited = new Map();
  const toExplore = [[squareState, startX, startY]];

  while (toExplore.length > 0) {
    const [distance, x, y] = toExplore.shift();

    if (distance > maxSteps) continue;

    const currentLocation = `${x}/${y}`;
    const normalizedLocation = `${
      (gridLength + (x % gridLength)) % gridLength
    }/${(gridLength + (y % gridLength)) % gridLength}`;

    if (walls.has(normalizedLocation) || visited.has(currentLocation)) continue;

    visited.set(currentLocation, distance);

    toExplore.push(
      ...neighborOffsets.map(([dx, dy]) => [distance + 1, x + dx, y + dy])
    );
  }

  return visited;
};

const totalSteps = 26501365;

const x1 = totalSteps % gridLength;
const x2 = x1 + gridLength;
const x3 = x2 + gridLength;

const result1 = exploreSquare(x1 % 2, start[0], start[1], x1 + 1);
const result2 = exploreSquare(x2 % 2, start[0], start[1], x2 + 1);
const result3 = exploreSquare(x3 % 2, start[0], start[1], x3 + 1);

const [y1, y2, y3] = [result1, result2, result3].map(
  (result) => [...result].filter(([_, distance]) => distance % 2 === 0).length
);

const a = y1;
const b = y2 - y1;
const c = y3 - y2;

const x = (totalSteps - 65) / gridLength;

console.log(a + b * x + ((x * (x - 1)) / 2) * (c - b));
