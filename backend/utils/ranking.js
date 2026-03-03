export function computeAdjustedScore(rawScore, totalSwipes) {
    return rawScore / (1 + Math.log(1 + totalSwipes));
  }