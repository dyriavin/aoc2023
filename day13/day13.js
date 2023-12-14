const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8")
  .split(EOL + EOL)
  .map((paragraph) => paragraph.split(EOL));

const transposeArray = (array) =>
  array[0]
    .split("")
    .map((_, colIndex) => array.map((row) => row[colIndex]).join(""));

const isMirroredAfterIndex = (index, matrix) => {
  return matrix
    .slice(0, index + 1)
    .reverse()
    .every((line, reverseIndex) => {
      return (
        line === matrix[reverseIndex + index + 1] ||
        line === undefined ||
        matrix[reverseIndex + index + 1] === undefined
      );
    });
};

let totalScore = 0;

for (let paragraph of input) {
  let mirrorFound = false;
  for (let i = 0; i < paragraph.length - 1; i++) {
    if (!mirrorFound && isMirroredAfterIndex(i, paragraph)) {
      totalScore += 100 * (i + 1);
      mirrorFound = true;
    }
  }
  const transposedParagraph = transposeArray(paragraph);
  for (let j = 0; j < transposedParagraph.length - 1; j++) {
    if (!mirrorFound && isMirroredAfterIndex(j, transposedParagraph)) {
      totalScore += j + 1;
      mirrorFound = true;
    }
  }
}

console.log(totalScore);
