const fs = require("fs");

const inputFilePath = "input.txt";

const calculateHash = (s) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash + s.charCodeAt(i)) * 17) & 255;
  }
  return hash;
};

fs.promises
  .readFile(inputFilePath, "utf8")
  .then((data) => {
    const input = data.split(",");
    const totalHash = input.reduce((sum, s) => sum + calculateHash(s), 0);
    console.log(totalHash);
  })
  .catch((error) => {
    console.error("Error reading the file:", error);
  });
