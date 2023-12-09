const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8");

const parts = input.split(EOL + EOL);

const seeds = parts
  .splice(0, 1)[0]
  .slice(7)
  .split(/ +/g)
  .map((x) => +x);

const values = parts.map((v) =>
  v
    .split(EOL)
    .slice(1)
    .map((l) => l.split(/ +/g).map((x) => +x))
);

let ids = [...seeds];

for (let map of values) {
  ids = ids.map((v) => {
    const mapping = map.find(
      ([_, source, interval]) => source <= v && v < source + interval
    );

    if (!mapping) return v;

    return v - mapping[1] + mapping[0];
  });
}
