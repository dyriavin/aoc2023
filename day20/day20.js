const { EOL } = require("os");
const { readFileSync } = require("fs");

const inputText = readFileSync("input.txt", "utf8");

const modules = inputText.split(EOL).reduce((outputObj, line) => {
  const parts = line.split(" -> ");
  const isBroadcaster = parts[0] === "broadcaster";
  outputObj[isBroadcaster ? parts[0] : parts[0].slice(1)] = {
    type: isBroadcaster ? parts[0] : parts[0].charAt(0),
    connections: parts[1].split(", "),
  };
  outputObj[isBroadcaster ? parts[0] : parts[0].slice(1)].state =
    outputObj[isBroadcaster ? parts[0] : parts[0].slice(1)].type === "%" ? 0 : {};
  return outputObj;
}, {});

Object.entries(modules).forEach(([key, { connections }]) => {
  connections.forEach((destination) => {
    if (destination === "output" || !modules[destination]) return;
    if (!modules[destination].inputs) modules[destination].inputs = [];
    modules[destination].inputs.push(key);
    if (modules[destination].type === "&") modules[destination].state[key] = 0;
  });
});

const outputObj = {
  0: 0,
  1: 0,
};

let iterationCount = 0;
const processingQueue = [];

while (iterationCount < 1001) {
  if (processingQueue.length === 0) {
    iterationCount++;
    processingQueue.push(["broadcaster", 0, "button"]);
    continue;
  }

  const [module, frequency, from] = processingQueue.shift();

  outputObj[frequency] = outputObj[frequency] + 1;

  if (module === "output" || !modules[module]) {
    continue;
  }

  const currentModule = modules[module];

  if (currentModule.type === "broadcaster") {
    processingQueue.push(...currentModule.connections.map((connection) => [connection, frequency, module]));
    continue;
  }

  if (currentModule.type === "%" && frequency === 0) {
    currentModule.state = 1 - currentModule.state;
    processingQueue.push(...currentModule.connections.map((connection) => [connection, currentModule.state, module]));
    continue;
  }

  if (currentModule.type === "&") {
    currentModule.state[from] = frequency;
    const allHigh = currentModule.inputs.every((inputConnection) => currentModule.state[inputConnection] === 1);
    processingQueue.push(...currentModule.connections.map((connection) => [connection, allHigh ? 0 : 1, module]));
    continue;
  }
}

console.log(outputObj[0] * outputObj[1]);
