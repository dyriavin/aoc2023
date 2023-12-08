const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8");

const cards = input.split(EOL).map((l) =>
  l
    .slice(8)
    .split(" | ")
    .map((val) =>
      val
        .split(" ")
        .filter((x) => x !== "")
        .map((x) => +x)
    )
);

console.log(
  cards.reduce((points, [winning, actual]) => {
    const matches = actual.filter((x) => winning.includes(x)).length;

    return points + (matches == 0 ? 0 : 2 ** (matches - 1));
  }, 0)
);
