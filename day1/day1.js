/**
 * @see https://adventofcode.com/2023/day/1
 */

const fs = require("fs");

const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const firstAndLast = (arr) => {
  const first = arr[0];
  const last = arr[arr.length - 1];

  return [first, last];
};

const strLineToNumber = (line) => {
  const intArr = line
    .split("")
    .map((str) => parseInt(str, 10))
    .filter((num) => !isNaN(num));

  const digit = parseInt(firstAndLast(intArr).join(""), 10) || 0;

  return digit;
};

const spelledToNumber = (line) => {
  numbers.forEach((num, index) => {
    let lastPos = num + (index + 1) + num;
    line = line.replaceAll(num, lastPos);
  });
  const v = line.split("").filter((num) => /\d/.test(num));
  const digit = parseInt(firstAndLast(v).join(""), 10) || 0;
  return digit;
};

const input = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map(strLineToNumber);

const input2 = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map(spelledToNumber);

const result1 = input.reduce((acc, curr) => acc + curr, 0);
const result2 = input2.reduce((acc, curr) => acc + curr, 0);


console.dir(result1, { depth: null });
console.dir(result2, { depth: null });
