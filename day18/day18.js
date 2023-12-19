const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8")
  .split(EOL)
  .map((line) => line.split(" "))
  .map(([dir, steps, desc]) => [dir, +steps, desc]);

const dirMap = {
  L: [-1, 0],
  R: [1, 0],
  U: [0, -1],
  D: [0, 1],
};

const map = new Set();

let curr = [0, 0];

map.add(`${0}/${0}`);

for (let [dir, steps] of input) {
  const posArr = Array(steps)
    .fill()
    .map((_, i) => [
      dirMap[dir][0] * (i + 1) + curr[0],
      dirMap[dir][1] * (i + 1) + curr[1],
    ]);
  posArr.forEach((p) => map.add(`${p[0]}/${p[1]}`));
  curr = posArr.at(-1);
}

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;

[...map.values()].forEach((p) => {
  const [x, y] = p.split("/").map((dirMap) => +dirMap);

  minX = Math.min(minX, x);
  maxX = Math.max(maxX, x);
  minY = Math.min(minY, y);
  maxY = Math.max(maxY, y);
});

minX -= 1;
maxX += 1;
minY -= 1;
maxY += 1;

const outside = new Set();

const toExplore = [[minX, minY]];

while (toExplore.length > 0) {
  const [x, y] = toExplore.pop();

  const s = `${x}/${y}`;

  if (
    outside.has(s) ||
    map.has(s) ||
    x < minX ||
    x > maxX ||
    y < minY ||
    y > maxY
  )
    continue;

  outside.add(s);

  toExplore.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
}

console.log((maxX - minX + 1) * (maxY - minY + 1) - outside.size);