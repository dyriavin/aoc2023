const { EOL } = require("os");
const { readFileSync } = require("fs");
const input = readFileSync("input.txt", "utf8");

const transpose = (array) =>
  array[0]
    .split("")
    .map((_, colIndex) => array.map((row) => row[colIndex]).join(""));

const transposedLines = transpose(input.split(EOL));
const mapped = transposedLines.map((line) => {
  let current = line;
  for (let i = 0; i < line.length; i++) {
    if (line.at(i) === "O") {
      let char = i;
      while (char > 0 && current.at(char - 1) == ".") {
        char--;
      }
      if (char >= 0 && char < i)
        current =
          current.slice(0, char) +
          "O" +
          current.slice(char + 1, i) +
          "." +
          current.slice(i + 1);
    }
  }
  return current;
});
const res = mapped.reduce(
  (val, line) =>
    line
      .split("")
      .map((char, i) => (char === "O" ? line.length - i : 0))
      .reduce((sum, x) => sum + x, val),
  0
);

console.log(res);
