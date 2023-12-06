/**
 *  @see https://adventofcode.com/2023/day/2
 */

const blue = /\d+ blue/g;
const red = /\d+ red/g;
const green = /\d+ green/g;

const games = [];

const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8").split("\n");

input.forEach((line) => {
  const gameResult = {};
  const blues = line.match(blue);
  const reds = line.match(red);
  const greens = line.match(green);
  gameResult.blues = blues.map((line) => parseInt(line, 10));
  gameResult.reds = reds.map((line) => parseInt(line, 10));
  gameResult.greens = greens.map((line) => parseInt(line, 10));
  games.push(gameResult);
});

const gameMap = new Map();

const getMaxValuesForGame = (game) => {
  const key = JSON.stringify(game);
  if (gameMap.has(key)) {
    return gameMap.get(key);
  }

  const max = {};
  max.red = Math.max(...game.reds);
  max.green = Math.max(...game.greens);
  max.blue = Math.max(...game.blues);

  gameMap.set(key, max);

  return max;
};

const result = games.filter((game) => {
  const max = getMaxValuesForGame(game);
  return max.red <= 12 && max.green <= 13 && max.blue <= 14;
});

const result2 = games.map((game) => {
  const max = getMaxValuesForGame(game);
  return max.red * max.green * max.blue;
});

const sum = result.reduce((a, b) => a + games.indexOf(b) + 1, 0);
const sum2 = result2.reduce((a, b) => a + b, 0);
console.log(sum, sum2);
