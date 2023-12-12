const { EOL } = require("os");
const { readFileSync } = require("fs");

let visited = [];
const map = new Map([
  ["L", "7"],
  ["7", "L"],
  ["J", "F"],
  ["F", "J"],
]);
const illegalMap = new Map([
  ["| -1", { x: 0, y: 1 }],
  ["| 1", { x: 0, y: -1 }],
  ["- -1", { x: 1, y: 0 }],
  ["- 1", { x: -1, y: 0 }],
  ["J -1", { x: -1, y: 0 }],
  ["J 0", { x: 0, y: -1 }],
  ["L -1", { x: 1, y: 0 }],
  ["L 0", { x: 0, y: -1 }],
  ["F 1", { x: 1, y: 0 }],
  ["F 0", { x: 0, y: 1 }],
  ["7 1", { x: -1, y: 0 }],
  ["7 0", { x: 0, y: 1 }],
]);

let startingPos;
let input = readFileSync("input.txt", "utf-8")
  .split(EOL)
  .map((val, index) => {
    val = val.trim();
    visited.push(Array(val.length).fill(0));
    let temp = val.indexOf("S");
    if (temp > -1) {
      startingPos = {
        x: temp,
        y: index,
      };
    }
    return val.split("");
  });

function replaceStartAndGetNextTile(pos) {
  const toFindDuplicates = (arr) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

  let next;

  let adj = [];
  if (pos.y - 1 >= 0 && ["|", "7", "F"].includes(input[pos.y - 1][pos.x])) {
    adj.push(...["|", "7", "F"]);
    next = {
      x: pos.x,
      y: pos.y - 1,
    };
  }

  if (
    pos.y + 1 < input.length &&
    ["|", "J", "L"].includes(input[pos.y + 1][pos.x])
  ) {
    adj.push(...["|", "J", "L"]);
    next = {
      x: pos.x,
      y: pos.y + 1,
    };
  }

  if (
    pos.x + 1 < input[pos.y].length &&
    ["7", "J", "-"].includes(input[pos.y][pos.x + 1])
  ) {
    adj.push(...["7", "J", "-"]);
    next = {
      x: pos.x + 1,
      y: pos.y,
    };
  }

  if (pos.x - 1 >= 0 && ["L", "F", "-"].includes(input[pos.y][pos.x - 1])) {
    adj.push(...["L", "F", "-"]);
    next = {
      x: pos.x - 1,
      y: pos.y,
    };
  }

  input[pos.y][pos.x] = map.get(toFindDuplicates(adj)[0]);
  return next;
}

function problem1() {
  let curr = replaceStartAndGetNextTile(startingPos);
  let lastPos = startingPos;
  let counter = 0;
  let looped = false;
  visited[startingPos.y][startingPos.x] = 1;

  while (!looped) {
    if (visited[curr.y][curr.x] !== 0) {
      looped = true;
    } else {
      visited[curr.y][curr.x] = visited[lastPos.y][lastPos.x] + 1;
    }

    let next;

    if (input[curr.y][curr.x] === "-") {
      next = illegalMap.get(input[curr.y][curr.x] + " " + (lastPos.x - curr.x));
    } else {
      next = illegalMap.get(input[curr.y][curr.x] + " " + (lastPos.y - curr.y));
    }

    lastPos = curr;
    curr = {
      x: next.x + lastPos.x,
      y: next.y + lastPos.y,
    };
    counter++;
  }
  console.log("Part One: " + counter / 2);
}

function problem2() {
  let insideCount = 0;
  visited.forEach((row, y) => {
    let isInside = false;
    let formatMask = "";
    row.forEach((posVisited, x) => {
      let isEdge = posVisited !== 0;
      if (isEdge) {
        if (!(input[y][x] === "-")) {
          formatMask += input[y][x];
          switch (formatMask) {
            case "|":
              isInside = !isInside;
              formatMask = "";
              break;
            case "L7":
              isInside = !isInside;
              formatMask = "";
              break;
            case "FJ":
              isInside = !isInside;
              formatMask = "";
              break;
            default:
              if (formatMask.length === 2) {
                formatMask = "";
              }
          }
        }
      } else {
        if (isInside) {
          insideCount++;
        }
      }
    });
  });
  console.log("PartTwo: " + insideCount);
}

problem1();

problem2();
