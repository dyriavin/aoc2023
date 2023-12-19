const { EOL } = require("os");
const { readFileSync } = require("fs");

const inputString = readFileSync("input.txt", "utf8");
const inputLines = inputString.split(EOL);

const parseInput = (inputLines) => {
  return inputLines.map(
    (line) => line.replaceAll(/[\)\(#]/g, "").split(" ")[2]
  );
};

const data = parseInput(inputLines);

const calculateArea = (instructions) => {
  let current = [0, 0];
  let coordinatesArr = [0, 0];

  let perimeter = 0;

  const convertDirection = (code) => {
    switch (code) {
      case "0":
        return "R";
      case "1":
        return "D";
      case "2":
        return "L";
      case "3":
        return "U";
      default:
        return "";
    }
  };

  const move = (current, direction, distance) => {
    if (direction === "U") current[0] -= distance;
    if (direction === "D") current[0] += distance;
    if (direction === "L") current[1] -= distance;
    if (direction === "R") current[1] += distance;
  };

  const calculatePolygonArea = (coordinates) => {
    let x = coordinates;
    let area = 0;

    if (x.length % 2 !== 0) return;

    for (let i = 0; i < x.length - 2; i += 2) {
      area += x[i] * x[i + 3] - x[i + 2] * x[i + 1];
    }

    return Math.abs(area / 2);
  };

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    const dir = convertDirection(instruction.substring(5));
    const len = parseInt(instruction.substring(0, 5), 16);

    perimeter += len;

    move(current, dir, len);
    coordinatesArr.push(current[0], current[1]);
  }

  return calculatePolygonArea(coordinatesArr) + perimeter / 2 + 1;
};

console.log(calculateArea(data));
