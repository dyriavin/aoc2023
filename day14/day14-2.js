const { EOL } = require("os");
const { readFileSync } = require("fs");

const inputLines = readFileSync("input.txt", "utf8").split(EOL);

const transposeArray = (array) =>
  array[0]
    .split("")
    .map((_, colIndex) => array.map((row) => row[colIndex]).join(""));

const rotateArray = (array) =>
  array[0]
    .split("")
    .map((_, index) =>
      array.map((row) => row[row.length - 1 - index]).join("")
    );

let transposedLines = transposeArray(inputLines);
const seenPatterns = [];
let iteration = 0;
let scoreWeights = [];

while (!seenPatterns.includes(transposedLines.join(""))) {
  if (iteration % 4 === 0) {
    seenPatterns.push(transposedLines.join(""));
  }

  transposedLines = transposedLines.map((line) => {
    let updatedLine = line;
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      if (line[charIndex] === "O") {
        let newPosition = charIndex;
        while (newPosition > 0 && updatedLine[newPosition - 1] === ".") {
          newPosition--;
        }
        if (newPosition >= 0 && newPosition < charIndex)
          updatedLine =
            updatedLine.slice(0, newPosition) +
            "O" +
            updatedLine.slice(newPosition + 1, charIndex) +
            "." +
            updatedLine.slice(charIndex + 1);
      }
    }
    return updatedLine;
  });

  iteration++;
  transposedLines = rotateArray(transposedLines);

  if (iteration % 4 === 0) {
    scoreWeights.push(
      transposedLines.reduce(
        (total, line) =>
          total +
          line
            .split("")
            .reduce(
              (sum, char, index) =>
                sum + (char === "O" ? line.length - index : 0),
              0
            ),
        0
      )
    );
  }
}

const cycleLength =
  scoreWeights.length - seenPatterns.indexOf(transposedLines.join(""));
const stepsBeforeCycle = iteration / 4 - cycleLength;
const finalResult = scoreWeights.slice(stepsBeforeCycle - 1)[
  (1000000000 - stepsBeforeCycle) % cycleLength
];

console.log(finalResult);
