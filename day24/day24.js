const { readFileSync } = require("fs");
const { EOL } = require("os");

const data = readFileSync("./input.txt")
  .toString()
  .trim()
  .split(EOL)
  .map((line) =>
    line
      .split(" @ ")
      .flatMap((term) => term.split(", "))
      .map((x) => parseInt(x))
  );

const part1 = data
  .flatMap((pointA, i) =>
    data.filter((_, j) => j > i).map((pointB) => [pointA, pointB])
  )
  .map(
    ([{ 0: x1, 1: y1, 3: vx1, 4: vy1 }, { 0: x2, 1: y2, 3: vx2, 4: vy2 }]) => [
      ((vy1 / vx1) * x1 - (vy2 / vx2) * x2 + y2 - y1) / (vy1 / vx1 - vy2 / vx2),
      ((vx1 / vy1) * y1 - (vx2 / vy2) * y2 + x2 - x1) / (vx1 / vy1 - vx2 / vy2),
      x1,
      vx1,
      x2,
      vx2,
    ]
  )
  .map(([fx, fy, x1, vx1, x2, vx2]) => [
    fx,
    fy,
    (fx - x1) / vx1,
    (fx - x2) / vx2,
  ])
  .filter(
    ([fx, fy, t1, t2]) =>
      [fx, fy].every((f) => f >= 200000000000000 && f <= 400000000000000) &&
      t1 > 0 &&
      t2 > 0
  ).length;
const part2 = data
  .flatMap((d1, i) =>
    data
      .filter((_, j) => j > i)
      .flatMap((d2, j) =>
        data.filter((_, k) => k > i && k > j).map((d3) => [d1, d2, d3])
      )
  )
  .reduce(
    (
      answer,
      [
        [xi, yi, zi, ui, vi, wi],
        [xj, yj, zj, uj, vj, wj],
        [xk, yk, zk, uk, vk, wk],
      ]
    ) =>
      answer > 0
        ? answer
        : [
            [...Array(6).keys()]
              .reduce(
                (aug, idx) =>
                  [
                    aug.findIndex(
                      (row, rowIdx) => rowIdx >= idx && row[idx] !== 0
                    ),
                  ].map((nzIdx) =>
                    nzIdx === -1
                      ? aug
                      : Object.assign(aug, {
                          [idx]: aug[nzIdx],
                          [nzIdx]: aug[idx],
                        }).map((row, rowIdx) =>
                          rowIdx === idx
                            ? row.map((n) => n / aug[idx][idx])
                            : row.map(
                                (n, colIdx) =>
                                  n -
                                  (aug[idx][colIdx] / aug[idx][idx]) *
                                    aug[rowIdx][idx]
                              )
                        )
                  )[0],
                [
                  [
                    0,
                    wj - wi,
                    vi - vj,
                    0,
                    zi - zj,
                    yj - yi,
                    vi * zi - wi * yi - vj * zj + wj * yj,
                  ],
                  [
                    wi - wj,
                    0,
                    uj - ui,
                    zj - zi,
                    0,
                    xi - xj,
                    wi * xi - ui * zi - wj * xj + uj * zj,
                  ],
                  [
                    vj - vi,
                    ui - uj,
                    0,
                    yi - yj,
                    xj - xi,
                    0,
                    ui * yi - vi * xi - uj * yj + vj * xj,
                  ],
                  [
                    0,
                    wk - wi,
                    vi - vk,
                    0,
                    zi - zk,
                    yk - yi,
                    vi * zi - wi * yi - vk * zk + wk * yk,
                  ],
                  [
                    wi - wk,
                    0,
                    uk - ui,
                    zk - zi,
                    0,
                    xi - xk,
                    wi * xi - ui * zi - wk * xk + uk * zk,
                  ],
                  [
                    vk - vi,
                    ui - uk,
                    0,
                    yi - yk,
                    xk - xi,
                    0,
                    ui * yi - vi * xi - uk * yk + vk * xk,
                  ],
                ]
              )
              .map((row) => row[row.length - 1]),
          ].map(([x0, y0, z0, u0, v0, w0]) =>
            [
              [
                (xi - x0) / (u0 - ui),
                (yi - y0) / (v0 - vi),
                (zi - z0) / (w0 - wi),
              ],
              [
                (xj - x0) / (u0 - uj),
                (yj - y0) / (v0 - vj),
                (zj - z0) / (w0 - wj),
              ],
              [
                (xk - x0) / (u0 - uk),
                (yk - y0) / (v0 - vk),
                (zk - z0) / (w0 - wk),
              ],
            ].every((hit) =>
              hit
                .filter((h) => !Number.isNaN(h))
                .every((h, _, all) => h === all[0])
            )
              ? x0 + y0 + z0
              : answer
          )[0],
    0
  );

console.dir({
  part1,
  part2,
});
