const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8");

const val = input.split(EOL + EOL);

const dir = val[0].split("");
const GCD = (a, b) => {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};
const least = (a, b) => (a * b) / GCD(a, b);

const map = val[1].split(EOL).reduce((m, l) => {
  m[l.slice(0, 3)] = { L: l.slice(7, 10), R: l.slice(12, 15) };
  return m;
}, {});

let pnts = Object.keys(map).filter((p) => p.endsWith("A"));

let res = [];

for (let p of pnts) {
  let steps = 0;
  let v = [];
  let curr = p;

  while (true) {
    const off = steps % dir.length;

    if (off === 0) {
      if (v.find((v) => v === off + curr)) break;
      v.push(off + curr);
    }

    curr = map[curr][dir[steps % dir.length]];
    steps++;
  }

  res.push(steps);
}

const calcLeastRec = (args) => {
  if (args.length === 2) {
    return least(args[0], args[1]);
  } else {
    let first = args[0];
    args.shift();
    return least(first, calcLeastRec(args));
  }
};

const r = calcLeastRec(res.map((x) => x - dir.length));

console.dir(r);
