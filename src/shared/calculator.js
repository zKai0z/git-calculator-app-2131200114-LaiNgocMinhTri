// Pure calculator logic (CommonJS). Easy to test.

function compute(a, b, op) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b === 0 ? null : a / b;
  return b;
}

function roundTo(value, decimals) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

function formatNumber(n) {
  if (!Number.isFinite(n)) return 'Error';
  const rounded = roundTo(n, 10);
  const asFixed = rounded.toFixed(10).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  if (asFixed.replace('-', '').length > 14) {
    return rounded.toExponential(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e');
  }
  return asFixed;
}

function symbolForOp(op) {
  return ({ '+': '+', '-': '−', '*': '×', '/': '÷' })[op] || op;
}

module.exports = { compute, formatNumber, symbolForOp };