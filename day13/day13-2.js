const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8")
  .split(EOL + EOL)
  .map((paragraph) => paragraph.split(EOL));

const transposeArray = (matrix) =>
  matrix[0]
    .split("")
    .map((_, colIndex) => matrix.map((row) => row[colIndex]).join(""));

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

const originalValues = [];

for (let paragraph of input) {
  let mirrorFound = false;
  for (let i = 0; i < paragraph.length - 1; i++) {
    if (!mirrorFound && isMirroredAfterIndex(i, paragraph)) {
      originalValues.push(100 * (i + 1));
      mirrorFound = true;
    }
  }
  const transposedParagraph = transposeArray(paragraph);
  for (let j = 0; j < transposedParagraph.length - 1; j++) {
    if (!mirrorFound && isMirroredAfterIndex(j, transposedParagraph)) {
      originalValues.push(j + 1);
      mirrorFound = true;
    }
  }
}

let totalSum = 0;
let index = 0;

for (let paragraph of input) {
  let mirrorFound = false;
  for (let rowIndex = 0; rowIndex < paragraph.length; rowIndex++) {
    for (let colIndex = 0; colIndex < paragraph[0].length; colIndex++) {
      const modifiedParagraph = paragraph.map((line) => line);
      modifiedParagraph[rowIndex] =
        modifiedParagraph[rowIndex].slice(0, colIndex) +
        (modifiedParagraph[rowIndex][colIndex] === "." ? "#" : ".") +
        modifiedParagraph[rowIndex].slice(colIndex + 1);

      for (let i = 0; i < modifiedParagraph.length - 1; i++) {
        if (
          !mirrorFound &&
          100 * (i + 1) !== originalValues[index] &&
          isMirroredAfterIndex(i, modifiedParagraph)
        ) {
          totalSum += 100 * (i + 1);
          mirrorFound = true;
        }
      }
      const transposedModifiedParagraph = transposeArray(modifiedParagraph);
      for (let j = 0; j < transposedModifiedParagraph.length - 1; j++) {
        if (
          !mirrorFound &&
          j + 1 !== originalValues[index] &&
          isMirroredAfterIndex(j, transposedModifiedParagraph)
        ) {
          totalSum += j + 1;
          mirrorFound = true;
        }
      }
    }
  }
  index++;
}

console.log(totalSum);
