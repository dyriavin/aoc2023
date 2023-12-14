const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8")
  .split(EOL)
  .map((line) => {
    const [pattern, numbers] = line.split(" ");
    return [pattern, numbers.split(",").map(Number)];
  });

const memo = {};

const countVariations = (pattern, blockSize) => {
  const k = pattern + "/" + blockSize.join(",");
  if (memo[k] !== undefined) return memo[k];
  switch (true) {
    case pattern.length <
      blockSize.reduce((m, x) => m + x, 0) + blockSize.length - 1:
      memo[k] = 0;
      return memo[k];
    case pattern.at(0) == ".":
      memo[k] = countVariations(pattern.slice(1), blockSize);
      return memo[k];
    case pattern.at(-1) == ".":
      memo[k] = countVariations(pattern.slice(0, -1), blockSize);
      return memo[k];
    case blockSize.length == 1 &&
      pattern.indexOf("?") == -1 &&
      pattern.indexOf(".") == -1 &&
      blockSize[0] == pattern.length:
      memo[k] = 1;
      return memo[k];
    case blockSize.length == 0 && pattern.indexOf("#") == -1:
      memo[k] = 1;
      return memo[k];
    case blockSize.length == 0 && pattern.indexOf("#") > -1:
      memo[k] = 0;
      return memo[k];
    case pattern.startsWith("#".repeat(blockSize[0]) + "."):
      memo[k] = countVariations(
        pattern.slice(blockSize[0] + 1),
        blockSize.slice(1)
      );
      return memo[k];
    case pattern
      .slice(0, blockSize[0])
      .split("")
      .every((memo) => ["#", "?"].includes(memo)) &&
      [".", "?"].includes(pattern.at(blockSize[0])):
      const a = countVariations(
        pattern.slice(blockSize[0] + 1),
        blockSize.slice(1)
      );
      const b =
        pattern.at(0) == "?" ? countVariations(pattern.slice(1), blockSize) : 0;
      memo[k] = a + b;
      return memo[k];
    case pattern
      .slice(0, blockSize[0])
      .split("")
      .every((memo) => ["#", "?"].includes(memo)) &&
      pattern.at(blockSize[0]) == "#":
      memo[k] =
        pattern.at(0) == "?" ? countVariations(pattern.slice(1), blockSize) : 0;
      return memo[k];
    case pattern
      .slice(0, blockSize[0])
      .split("")
      .every((memo) => ["#", "?"].includes(memo)) && blockSize.length == 1:
      const l = countVariations(
        pattern.slice(blockSize[0]),
        blockSize.slice(1)
      );
      const r =
        pattern.at(0) == "?" ? countVariations(pattern.slice(1), blockSize) : 0;
      memo[k] = l + r;
      return memo[k];
    case pattern.at(0) == "?":
      memo[k] = countVariations(pattern.slice(1), blockSize);
      return memo[k];
    case pattern.indexOf(".") < blockSize[0]:
      memo[k] = 0;
      return memo[k];
    default:
        memo[k] = countVariations(
            pattern.slice(0, blockSize[0]),
            blockSize.slice(1)
        );
        return memo[k];
  }
};

let total = 0;

for (const [pattern, blockSize] of input) {
  const x = countVariations(pattern, blockSize);
  total += x;
}

console.log(total);
