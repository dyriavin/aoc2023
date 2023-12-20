const { EOL } = require("os");
const { readFileSync } = require("fs");

const inputString = readFileSync('input.txt', 'utf8');
const inputSections = inputString.split(EOL + EOL);

const parseRules = (rulesString) => {
  const rules = {};
  const ruleLines = rulesString.split(EOL);

  for (const line of ruleLines) {
    const [ruleName, ruleContent] = line.slice(0, -1).split('{');
    const rulePairs = ruleContent.split(',').map((pair) => pair.split(':'));
    rules[ruleName] = rulePairs;
  }

  return rules;
};

const rulesSection = inputSections[0];
const rules = parseRules(rulesSection);

const toCheckStack = [['in', { x: 1, m: 1, a: 1, s: 1 }, { x: 4000, m: 4000, a: 4000, s: 4000 }]];
let accepted = 0;

while (toCheckStack.length > 0) {
  const [current, min, max] = toCheckStack.pop();

  if (current === 'R') continue;

  if (current === 'A') {
    accepted += (max.x - min.x + 1) * (max.m - min.m + 1) * (max.a - min.a + 1) * (max.s - min.s + 1);
    continue;
  }

  const ruleList = rules[current];

  for (let r of ruleList) {
    if (r.length === 1) {
      toCheckStack.push([r[0], min, max]);
      break;
    }

    const condition = r[0];
    const property = condition.charAt(0);
    const comparisonOperator = condition.charAt(1);
    const value = +condition.slice(2);

    const newMin = { ...min };
    const newMax = { ...max };

    if (comparisonOperator === '<') {
      newMax[property] = value - 1;
      min[property] = value;
      toCheckStack.push([r[1], newMin, newMax]);
    } else if (comparisonOperator === '>') {
      newMin[property] = value + 1;
      max[property] = value;
      toCheckStack.push([r[1], newMin, newMax]);
    }
  }
}

console.log(accepted);
