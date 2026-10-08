import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Only trusted, repository-authored snippets. NOT a sandbox for learner code.
const root = new URL('../../../', import.meta.url);
const tasks = JSON.parse(await readFile(new URL('content/lessons/js-01/exercises.json', root), 'utf8')).tasks;
function output(code) {
  const lines = [];
  vm.runInNewContext(code, { console: { log: (...args) => lines.push(args.join(' ')) } }, { timeout: 500 });
  return lines.join('\n');
}
const trace = tasks[0];
const variants = [
  trace.starter_code,
  trace.starter_code.replace('score = 1;', 'score = 0;'),
  trace.starter_code.replace('console.log', 'bonus = score + 2;\nconsole.log'),
];
variants.forEach((code, i) => assert.equal(output(code), trace.checks[i].expected_stdout));
assert.equal(output('"use strict"; let apples=3; let saved=apples; apples=apples+2; console.log(apples,saved);'), '5 3');
for (const test of tasks[1].checks) {
  assert.equal(test.input.hours * 60 + test.input.minutes, test.expected);
}
console.log('JS 01: 3 trace variants, 1 worked example, 3 duration fixtures passed.');
