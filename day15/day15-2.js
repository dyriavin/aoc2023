const fs = require("fs");

const inputFilePath = "input.txt";

const calculateHash = (s) => {
  return s
    .split("")
    .reduce((sum, c) => ((sum + c.charCodeAt(0)) * 17) & 255, 0);
};

const processInput = (input) => {
  const hashTable = new Map();

  for (const s of input) {
    const lastChar = s.charAt(s.length - 1);
    const isAdd = s.includes("=");
    let n;

    if (isAdd) {
      n = s.split("=")[0];
    } else {
      n = s.slice(0, -1);
    }

    const b = calculateHash(n);
    const v = hashTable.get(b);

    if (!v) {
      if (isAdd) hashTable.set(b, [[n, parseInt(lastChar)]]);
    } else {
      const i = v.findIndex(([oN]) => oN === n);
      if (i > -1) {
        if (isAdd) {
          v[i] = [n, parseInt(lastChar)];
        } else {
          v.splice(i, 1);
          hashTable.set(b, v);
        }
      } else {
        if (isAdd) v.push([n, parseInt(lastChar)]);
      }
    }
  }

  return hashTable;
};

const processData = async () => {
  try {
    const data = await fs.readFileSync(inputFilePath, "utf8");
    const input = data.split(",");

    const hashTable = processInput(input);

    const result = [...hashTable.entries()].reduce(
      (sum, [idx, vals]) =>
        vals.reduce((s, [n, v], i) => s + (idx + 1) * v * (i + 1), sum),
      0
    );

    console.log(result);
  } catch (error) {
    console.error("Error reading the file:", error);
  }
};

processData();
