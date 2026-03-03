import { computeAdjustedScore } from "../utils/ranking.js";

describe("computeAdjustedScore", () => {
  test("returns rawScore when totalSwipes is 0", () => {
    const result = computeAdjustedScore(10, 0);
    expect(result).toBe(10);
  });

  test("penalizes score when totalSwipes increases", () => {
    const resultLow = computeAdjustedScore(10, 1);
    const resultHigh = computeAdjustedScore(10, 100);

    expect(resultHigh).toBeLessThan(resultLow);
  });

  test("handles negative rawScore correctly", () => {
    const result = computeAdjustedScore(-10, 10);
    expect(result).toBeLessThan(0);
  });

  test("returns 0 when rawScore is 0", () => {
    const result = computeAdjustedScore(0, 100);
    expect(result).toBe(0);
  });
});