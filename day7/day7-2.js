const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8").split(EOL);

const isFive = (c) => c[0] === 5;
const isFour = (c) => c[0] === 4;
const isThreeTwo = (c) => c[0] === 3 && c[1] === 2;
const isThreeOne = (c) => c[0] === 3 && c[1] === 1;
const isTwoTwo = (c) => c[0] === 2 && c[1] === 2;
const isTwoOne = (c) => c[0] === 2 && c[1] === 1;
const isOne = (c) => c[0] === 1;

const cardRanks = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

const ranks = [
  isFive, // Checks if the first element is 5
  isFour, // Checks if the first element is 4
  isThreeTwo, // Checks if the first element is 3 and second is 2
  isThreeOne, // Checks if the first element is 3 and second is 1
  isTwoTwo, // Checks if the first element is 2 and second is 2
  isTwoOne, // Checks if the first element is 2 and second is 1
  isOne, // Checks if the first element is 1
];

const res = input.map((line) => line.split(" "));

const getRankVal = (r) => {
  const counts = r[0].split("").reduce((f, s) => {
    if (f[s] === undefined) f[s] = 0;
    f[s] += 1;
    return f;
  }, {});

  const j = counts["J"] || 0;

  delete counts["J"];

  const sorted = Object.values(counts).sort((a, b) => b - a);

  sorted[0] = (sorted[0] || 0) + j;

  return ranks.findIndex((fn) => fn(sorted));
};

const compareVal = (val1, val2) => {
  for (let i = 0; i < 5; i++) {
    if (cardRanks.indexOf(val1[i]) > cardRanks.indexOf(val2[i])) return -1;
    if (cardRanks.indexOf(val1[i]) < cardRanks.indexOf(val2[i])) return 1;
  }
};

res.sort((v1, v2) => {
  const r1 = getRankVal(v1);
  const r2 = getRankVal(v2);

  if (r1 == r2) return compareVal(v1[0], v2[0]);

  return r2 - r1;
});

const r = res.reduce((f, v, idx) => f + +v[1] * (idx + 1), 0);

console.dir(r);
