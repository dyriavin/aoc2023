const fs = require("fs");

function isAdjacent(line, char) {
  const deltas = [-1, 0, 1];
  const symbols = ["%", "#", "*", "/", "@", "$", "&", "=", "+", "-"];

  for (const deltaLine of deltas) {
    for (const deltaChar of deltas) {
      if (
        !(
          line + deltaLine < 0 ||
          line + deltaLine >= lines.length ||
          char + deltaChar < 0 ||
          char + deltaChar >= lines[0].length
        )
      ) {
        if (symbols.includes(lines[line + deltaLine][char + deltaChar]))
          return true;
      }
    }
  }
  return false;
}

const file = fs.readFileSync("./input.txt", "utf-8");

const lines = file.trim().split("\n");

const nums = [];
let num = "";
let adjacent = false;

for (let line = 0; line < lines.length; line++) {
  for (let char = 0; char < lines[line].length; char++) {
    if (!isNaN(+lines[line][char])) {
      num += lines[line][char];
      adjacent = adjacent || isAdjacent(line, char);
    }
    if (isNaN(+lines[line][char]) || char == lines[line].length - 1) {
      if (num.length > 0) {
        if (adjacent) nums.push(+num);
        num = "";
        adjacent = false;
      }
    }
  }
}

console.log(nums.reduce((a, b) => a + b));
