const { EOL } = require("os");
const { readFileSync } = require("fs");

const inputString = readFileSync("input.txt", "utf8");
const inputSections = inputString.split(EOL + EOL);

const parseRules = (rulesString) => {
  const rules = {};
  const ruleLines = rulesString.split(EOL);

  for (const line of ruleLines) {
    const [ruleName, ruleContent] = line.slice(0, -1).split("{");
    const rulePairs = ruleContent.split(",").map((pair) => pair.split(":"));
    rules[ruleName] = rulePairs;
  }

  return rules;
};

const parseObjects = (objectsString) => {
  const objectLines = objectsString.split(EOL);
  const objects = objectLines.map((line) => {
    const objectPairs = line
      .slice(1, -1)
      .split(",")
      .map((pair) => {
        const [key, value] = pair.split("=");
        return [key, +value];
      });

    return Object.fromEntries(objectPairs);
  });

  return objects;
};

const check = function (rule) {
  return eval(rule);
};

const rulesSection = inputSections[0];
const objectsSection = inputSections[1];

const rules = parseRules(rulesSection);
const objects = parseObjects(objectsSection);

let sum = 0;

for (let o of objects) {
  let current = "in";

  while (current !== "A" && current !== "R") {
    for (let r of rules[current]) {
      if (r.length === 1) {
        current = r[0];
        break;
      }
      if (check.call(o, "this." + r[0])) {
        current = r[1];
        break;
      }
    }
  }

  if (current === "A") {
    sum += Object.values(o).reduce((s, c) => s + c, 0);
  }
}

console.log(sum);
