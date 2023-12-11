const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8");

const val = input.split(EOL + EOL);

const dir = val[0].split("");

let res = 0;
let curr = "AAA";

const map = val[1].split(EOL).reduce((f, s) => {
  f[s.slice(0, 3)] = { L: s.slice(7, 10), R: s.slice(12, 15) };
  return f;
}, {});

while (curr !== "ZZZ") {
  curr = map[curr][dir[res % dir.length]];
  res++;
}

console.dir(res);
