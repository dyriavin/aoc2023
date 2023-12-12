const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8")
  .split(EOL)
  .map((line) => line.split(" ").map((v) => +v));

const problem1 = (res) => {
  let v = 0;
  for (let i = res.length - 1; i >= 0; i--) {
    v += res[i][res[i].length - 1];
  }
  return v;
};

const problem2 = (res) => {
  let v = 0;
  for (let i = res.length - 1; i >= 0; i--) {
    v = res[i][0] - v;
  }
  return v;
};

const nextVal = (val, mapper) => {
  const res = [val];
  let curr = val;

  while (!curr.every((v) => v === 0)) {
    const next = curr.slice(1).map((v, idx) => v - curr[idx]);
    res.push(next);
    curr = next;
  }
  return mapper(res);
};

const r = input.reduce((s, c) => s + nextVal(c, problem1), 0);
const d = input.reduce((s, c) => s + nextVal(c, problem2), 0);

console.log(r);
console.log(d);
