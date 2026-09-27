export function generatePNR() {
  const prefix = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
  const random9 = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `${prefix}${random9.substring(1)}`;
}
