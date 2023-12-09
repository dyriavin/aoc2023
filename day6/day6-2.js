const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8").split(EOL);

let min;
let maxT = 0;
let maxIdx = 0;
let i = 1;
let peak = false;
let v;

const [time, dist] = input
  .map((v) =>
    v
      .replace(/ +/g, "")
      .split(":")
      .slice(1)
      .map((x) => +x)
  )
  .map((x) => x[0]);

const mapper = (v) => Math.max(0, time - v) * v;

while ((v = mapper(i)) >= maxT) {
  if (v === maxT) peak = true;
  maxT = v;
  maxIdx = i;
  if (maxT >= dist && min === undefined) min = i;
  i++;
}

const r = (maxIdx - min) * 2 + (peak ? 0 : 1);

console.dir(r);
