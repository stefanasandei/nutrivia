export const calcDiscount = (points: number) => {
  // 5 points => 10% discount
  return Math.floor(points / 5) * 10;
};
