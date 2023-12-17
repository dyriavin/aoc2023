const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8").split(EOL);

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

let max = 0;

const check = (sx, sy, d) => {
  const visited = new Set();
  const toCheck = [[sx, sy, d]];

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

  return new Set([...visited].map((s) => s.slice(0, -2))).size;
};

for (let sx = 0; sx < input[0].length; sx++) {
  max = Math.max(max, check(sx, 0, "S"), check(sx, input.length - 1, "N"));
}

for (let sy = 0; sy < input.length; sy++) {
  max = Math.max(max, check(0, sy, "E"), check(input[0].length - 1, sy, "W"));
}

console.log(max);
