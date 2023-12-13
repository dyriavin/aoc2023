const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8").split(EOL);

const galaxyMap = input.reduce((accumulatedMap, line, rowIndex) => {
  accumulatedMap.push([]);
  return line.split("").reduce((rowCoordinates, cell, colIndex) => {
    if (cell === "#") rowCoordinates[rowIndex].push(colIndex);
    return rowCoordinates;
  }, accumulatedMap);
}, []);

const emptyRows = [];
const emptyCols = [];

for (let rowIndex = 0; rowIndex < galaxyMap.length; rowIndex++) {
  if (galaxyMap[rowIndex].length === 0) emptyRows.push(rowIndex);
}

for (let colIndex = 0; colIndex < input[0].length; colIndex++) {
  if (!galaxyMap.some((row) => row.includes(colIndex)))
    emptyCols.push(colIndex);
}

const scaleFactor = 1000000 - 1;
const adjustedCoordinates = galaxyMap.flatMap((rowCoordinates, originalY) =>
  rowCoordinates.map((originalX) => [
    originalX +
      emptyCols.filter((emptyCol) => emptyCol < originalX).length * scaleFactor,
    originalY +
      emptyRows.filter((emptyRow) => emptyRow < originalY).length * scaleFactor,
  ])
);

const totalManhattanDistance = adjustedCoordinates.reduce(
  (totalDistance, currentCoord, currentIndex) =>
    adjustedCoordinates
      .slice(currentIndex + 1)
      .reduce(
        (sum, otherCoord) =>
          sum +
          Math.abs(otherCoord[0] - currentCoord[0]) +
          Math.abs(otherCoord[1] - currentCoord[1]),
        totalDistance
      ),
  0
);

console.log(totalManhattanDistance);
