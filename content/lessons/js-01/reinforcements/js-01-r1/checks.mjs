import assert from 'node:assert/strict';

const stockCases = [
  { stock: 10, sold: 4, expected: [10, 6] },
  { stock: 0, sold: 0, expected: [0, 0] },
  { stock: 5, sold: 5, expected: [5, 0] },
];

for (const test of stockCases) {
  const before = test.stock;
  const after = test.stock - test.sold;
  assert.deepEqual([before, after], test.expected);
}

const balanceCases = [
  { balance: 1000, first: 250, second: 150, expected: [750, 600] },
  { balance: 0, first: 0, second: 0, expected: [0, 0] },
  { balance: 500, first: 500, second: 0, expected: [0, 0] },
];

for (const test of balanceCases) {
  const afterFirst = test.balance - test.first;
  const afterSecond = afterFirst - test.second;
  assert.deepEqual([afterFirst, afterSecond], test.expected);
}

console.log('JS 01 reinforcement 1: 3 stock and 3 balance fixtures passed.');
