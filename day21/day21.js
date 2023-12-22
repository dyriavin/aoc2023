const fs = require("fs");
const { EOL } = require("os");

const inputText = fs.readFileSync("input.txt", "utf8");
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

const maxSteps = 64;

const visited = new Map();
const toExplore = [[0, ...start]];

const neighborOffsets = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

while (toExplore.length > 0) {
  const [distance, x, y] = toExplore.shift();

  if (distance > maxSteps) continue;

  const currentLocation = `${x}/${y}`;

  if (walls.has(currentLocation) || visited.has(currentLocation)) continue;

  visited.set(currentLocation, distance);

  toExplore.push(
    ...neighborOffsets.map(([dx, dy]) => [distance + 1, x + dx, y + dy])
  );
}

const evenStepsCount = [...visited].filter(
  ([_, distance]) => distance % 2 === 0
).length;

console.log(evenStepsCount);
