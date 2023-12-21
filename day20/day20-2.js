const { EOL } = require("os");
const { readFileSync } = require("fs");

const parseInput = () => {
  const inputText = readFileSync("input.txt", "utf8");
  const inputLines = inputText.split(EOL);
  const parsedInput = inputLines.reduce((outputObj, line) => {
    const [moduleName, connectionStr] = line.split(" -> ");
    const isBroadcaster = moduleName === "broadcaster";
    outputObj[isBroadcaster ? moduleName : moduleName.slice(1)] = {
      type: isBroadcaster ? moduleName : moduleName.charAt(0),
      connections: connectionStr.split(", "),
    };
    outputObj[isBroadcaster ? moduleName : moduleName.slice(1)].state =
      outputObj[isBroadcaster ? moduleName : moduleName.slice(1)].type === "%"
        ? 0
        : {};
    return outputObj;
  }, {});

  parsedInput.rx = { connections: [] };

  Object.entries(parsedInput).forEach(([key, { connections }]) => {
    connections.forEach((destination) => {
      if (destination === "output" || !parsedInput[destination]) return;
      if (!parsedInput[destination].inputs)
        parsedInput[destination].inputs = [];
      parsedInput[destination].inputs.push(key);
      if (parsedInput[destination].type === "&")
        parsedInput[destination].state[key] = 0;
    });
  });

  return parsedInput;
};

console.log(
  parseInput().broadcaster.connections.reduce((product, sourceNode) => {
    const input = parseInput();
    let steps = 0;
    let toProcess = [];
    let moduleCount = 0;
    const endNode = input.rx.inputs[0];

    while (true) {
      if (toProcess.length === 0) {
        steps++;
        toProcess.push(["broadcaster", 0, "button"]);
        continue;
      }

      const [module, frequency, from] = toProcess.shift();

      if (module === endNode) {
        if (frequency === 1) {
          break;
        }
        continue;
      }

      const currentModule = input[module];

      if (currentModule.type === "broadcaster") {
        toProcess.push([sourceNode, frequency, module]);
        continue;
      }

      if (currentModule.type === "%" && frequency === 0) {
        currentModule.state = 1 - currentModule.state;
        toProcess.push(
          ...currentModule.connections.map((connection) => [
            connection,
            currentModule.state,
            module,
          ])
        );
        continue;
      }

      if (currentModule.type === "&") {
        currentModule.state[from] = frequency;
        const allHigh = currentModule.inputs.every(
          (inputConnection) => currentModule.state[inputConnection] === 1
        );
        toProcess.push(
          ...currentModule.connections.map((connection) => [
            connection,
            allHigh ? 0 : 1,
            module,
          ])
        );
        continue;
      }
    }

    // Technically the least common multiple (LCM)
    return product * steps;
  }, 1)
);
