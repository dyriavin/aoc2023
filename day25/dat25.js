const fs = require("fs");

const { EOL } = require("os");
const parseInput = (input) =>
  input
    .split(EOL)
    .map((line) => {
      const [vertex, connections] = line.split(": ");
      return [vertex, connections.split(" ")];
    })
    .reduce(
      ([edges, vertices], [vertex, connections]) => {
        if (!vertices.has(vertex)) vertices.set(vertex, vertices.size);
        for (const connection of connections) {
          if (!vertices.has(connection))
            vertices.set(connection, vertices.size);
          edges.push([vertices.get(vertex), vertices.get(connection)]);
        }
        return [edges, vertices];
      },
      [[], new Map()]
    );

const findGroups = (numVertices, edges, targetGroups) => {
  for (let i = 0; i < edges.length; ++i) {
    const j = Math.floor(Math.random() * i + 1);
    const temp = edges[i];
    edges[i] = edges[j];
    edges[j] = temp;
  }

  let groupParents = [-1];
  let groupPromotions = [-1];
  let vertexGroups = new Uint16Array(numVertices);

  const union = (v1, v2) => {
    if (!vertexGroups[v1] && !vertexGroups[v2]) {
      const group = groupParents.length;
      groupParents.push(group);
      groupPromotions.push(1);
      vertexGroups[v1] = group;
      vertexGroups[v2] = group;
    } else if (!vertexGroups[v1]) {
      const group = (vertexGroups[v2] = getParent(v2));
      ++groupPromotions[group];
      vertexGroups[v1] = group;
    } else if (!vertexGroups[v2]) {
      const group = (vertexGroups[v1] = getParent(v1));
      ++groupPromotions[group];
      vertexGroups[v2] = group;
    } else {
      let group1 = getParent(v1);
      let group2 = getParent(v2);

      if (group1 !== group2) {
        if (groupPromotions[group1] > groupPromotions[group2]) {
          [group2, group1] = [group1, group2];
        }
        groupPromotions[group2] += groupPromotions[group1] + 1;
        groupParents[group1] = group2;
        vertexGroups[v1] = group2;
        vertexGroups[v2] = group2;
      } else {
        return false;
      }
    }
    return true;
  };

  const getParent = (vertex) => {
    if (vertexGroups[vertex] === 0) return -1;
    let group = vertexGroups[vertex];
    while (group !== groupParents[group]) group = groupParents[group];
    return group;
  };

  let edgeIdx = 0;
  while (numVertices > 2) {
    const [vertex1, vertex2] = edges[edgeIdx++];
    if (union(vertex1, vertex2)) --numVertices;
  }

  let removed = 0;
  for (const [vertex1, vertex2] of edges) {
    if (
      (vertexGroups[vertex1] = getParent(vertex1)) !==
      (vertexGroups[vertex2] = getParent(vertex2))
    )
      ++removed;
  }

  if (removed === targetGroups) return vertexGroups;
  return null;
};

const solve = ([edges, vertices]) => {
  while (true) {
    const groups = findGroups(vertices.size, edges, 3);
    if (groups !== null) {
      const firstGroupSize = groups.filter(
        (group) => group === groups[0]
      ).length;
      return firstGroupSize * (vertices.size - firstGroupSize);
    }
  }
};

const part1 = solve(parseInput(fs.readFileSync("./input.txt", "utf8")));

console.dir({
  part1,
});
