const { EOL } = require("os");
const { readFileSync } = require("fs");
const input = readFileSync("input.txt", "utf8").split(EOL);

const [times, distances] = input.map((l) =>
  l
    .split(/ +/g)
    .slice(1)
    .map((x) => +x)
);

const mapper = (total, c) => Math.max(0, total - c) * c;

const r = times
  .map((t, raceIndex) =>
    Array(t + 1)
      .fill()
      .map((_, i) => mapper(t, i))
      .filter((v) => v > distances[raceIndex])
  )
  .reduce((l, r) => l * r.length, 1);

console.dir(r, { depth: null });
