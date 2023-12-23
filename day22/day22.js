const fs = require("fs");

let inputContent = fs.readFileSync("input.txt", "utf8");

function parseLine(line) {
  let points = line.split("~").map((point) => point.split(",").map(Number));
  return [
    { x: points[0][0], y: points[0][1], z: points[0][2] },
    { x: points[1][0], y: points[1][1], z: points[1][2] },
  ];
}

function doBricksOverlap(brickA, brickB) {
  let overlapX = brickA[1].x >= brickB[0].x && brickA[0].x <= brickB[1].x;
  let overlapY = brickA[1].y >= brickB[0].y && brickA[0].y <= brickB[1].y;
  let overlapZ = brickA[1].z >= brickB[0].z && brickA[0].z <= brickB[1].z;
  return overlapX && overlapY && overlapZ;
}

function tryDropBrick(existingBricks, currentBrick) {
  let dropDistance = 0;
  while (currentBrick[0].z - dropDistance > 1) {
    let movedBrick = [
      {
        x: currentBrick[0].x,
        y: currentBrick[0].y,
        z: currentBrick[0].z - (dropDistance + 1),
      },
      {
        x: currentBrick[1].x,
        y: currentBrick[1].y,
        z: currentBrick[1].z - (dropDistance + 1),
      },
    ];

    if (
      existingBricks.some((existingBrick) =>
        doBricksOverlap(movedBrick, existingBrick)
      )
    )
      break;

    dropDistance++;
  }

  return [
    {
      x: currentBrick[0].x,
      y: currentBrick[0].y,
      z: currentBrick[0].z - dropDistance,
    },
    {
      x: currentBrick[1].x,
      y: currentBrick[1].y,
      z: currentBrick[1].z - dropDistance,
    },
  ];
}

function dropBricks(bricksInAir) {
  let settledBricks = [];
  let droppedCount = 0;

  let sortedBricks = bricksInAir.sort((a, b) => a[0].z - b[0].z);

  while (sortedBricks.length > 0) {
    let brick = sortedBricks.shift();
    if (brick[0].z === 1) {
      settledBricks.push(brick);
    } else {
      let newBrickPosition = tryDropBrick(settledBricks, brick);
      if (newBrickPosition[0].z !== brick[0].z) droppedCount++;
      settledBricks.push(newBrickPosition);
    }
  }

  return [settledBricks, droppedCount];
}

function settleBricks(bricksInAir) {
  let settledBricks = bricksInAir.sort((a, b) => a[0].z - b[0].z);
  let droppedBricks;

  do {
    let result = dropBricks(settledBricks);
    settledBricks = result[0];
    droppedBricks = result[1];
  } while (droppedBricks > 0);

  return settledBricks;
}

let parsedBricks = inputContent.split("\n").map(parseLine);
let settledBricks = settleBricks(parsedBricks);

let stableBricksCount = 0,
  totalDroppedBricks = 0;
for (let i = 0; i < settledBricks.length; i++) {
  let remainingBricks = [
    ...settledBricks.slice(0, i),
    ...settledBricks.slice(i + 1),
  ];
  let dropResult = dropBricks(remainingBricks);
  if (dropResult[1] === 0) stableBricksCount++;
  totalDroppedBricks += dropResult[1];
}

console.log("first:", stableBricksCount);
console.log("second:", totalDroppedBricks);
