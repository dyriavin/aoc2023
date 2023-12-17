const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8").split(EOL);

// Create a map of cells with their coordinates as keys
const map = input.reduce((cellMap, line, y) => {
  line.split("").forEach((cell, x) => {
    if (cell !== ".") {
      cellMap[`${x}/${y}`] = cell;
    }
  });
  return cellMap;
}, {});

const directions = {
  E: {
    "|": ["N", "S"],
    "/": ["N"],
    "\\": ["S"],
  },
  W: {
    "|": ["N", "S"],
    "/": ["S"],
    "\\": ["N"],
  },
  N: {
    "-": ["E", "W"],
    "/": ["E"],
    "\\": ["W"],
  },
  S: {
    "-": ["E", "W"],
    "/": ["W"],
    "\\": ["E"],
  },
};

const visited = new Set();
const toCheck = [[0, 0, "E"]];

while (toCheck.length > 0) {
  const [x, y, dir] = toCheck.pop();

  if (x < 0 || x >= input[0].length || y < 0 || y >= input.length) continue;

  if (visited.has(`${x}/${y}/${dir}`)) continue;

  visited.add(`${x}/${y}/${dir}`);

  const newDirs = directions[dir][map[`${x}/${y}`] || "."];

  if (!newDirs) {
    toCheck.push([
      x + (dir === "E" ? 1 : dir === "W" ? -1 : 0),
      y + (dir === "S" ? 1 : dir === "N" ? -1 : 0),
      dir,
    ]);
    continue;
  }

  for (let newDir of newDirs) {
    toCheck.push([
      x + (newDir === "E" ? 1 : newDir === "W" ? -1 : 0),
      y + (newDir === "S" ? 1 : newDir === "N" ? -1 : 0),
      newDir,
    ]);
  }
}

console.log(new Set([...visited].map((s) => s.slice(0, -2))).size);
