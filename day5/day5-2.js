const { EOL } = require("os");
const { readFileSync } = require("fs");

const input = readFileSync("input.txt", "utf8");

const parts = input.split(EOL + EOL);

const seeds = parts
  .splice(0, 1)[0]
  .slice(7)
  .split(/ +/g)
  .map((x) => +x)
  .reduce((result, value, index, array) => {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, [])
  .map(([start, length]) => ({ start, end: start + length - 1 }));

const maps = parts.map((m) =>
  m
    .split(EOL)
    .slice(1)
    .map((l) => l.split(/ +/g).map((x) => +x))
    .map(([dest, source, interval]) => ({ dest, source, interval }))
    .sort((a, b) => a.source - b.source)
);

let iterableSeeds = seeds;

for (let map of maps) {
  const res = [];

  for (let item of iterableSeeds) {
    let curr = item.start;

    while (curr <= item.end) {
      const currentMap = map.find(
        ({ _, source, interval }) => source <= curr && curr < source + interval
      );

      if (currentMap) {
        const maxCovered = Math.min(
          item.end - currentMap.source + currentMap.dest,
          currentMap.dest + currentMap.interval - 1
        );
        const nextItem = {
          start: curr - currentMap.source + currentMap.dest,
          end: maxCovered,
        };
        res.push(nextItem);
        curr = Math.min(item.end + 1, curr + nextItem.end - nextItem.start + 1);
      } else {
        const nextMap = map.find(
          ({ _, source, interval }) =>
            curr < source && curr + interval >= source
        );
        if (!nextMap) {
          res.push({ start: curr, end: item.end });
          curr = item.end + 1;
        } else {
          res.push({ start: curr, end: nextMap.source - 1 });
          curr = nextMap.source;
        }
      }
    }
  }

  iterableSeeds = res;
}
