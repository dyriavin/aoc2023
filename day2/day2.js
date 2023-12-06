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

const result = games.filter((game) => {
  const maxRed = Math.max(...game.reds);
  const maxGreen = Math.max(...game.greens);
  const maxBlue = Math.max(...game.blues);
  return maxRed <= 12 && maxGreen <= 13 && maxBlue <= 14;
});

const sum = result.reduce((a, b) => a + games.indexOf(b) + 1, 0);
console.log(sum);
