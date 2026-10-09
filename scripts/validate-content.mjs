import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async path => readFile(new URL(path, root), 'utf8');
const course = JSON.parse(await read('content/course.json'));
assert.equal(course.schema_version, 1);
assert.equal(course.lessons.length, 23);
assert.equal(new Set(course.lessons.map(x => x.lesson_id)).size, 23);
const earlier = new Set();
for (const lesson of course.lessons) {
  assert.ok(lesson.prerequisites.every(id => earlier.has(id)));
  earlier.add(lesson.lesson_id);
  assert.ok(['prepared', 'planned'].includes(lesson.status));
  if (lesson.status === 'planned') continue;
  const body = await read(lesson.lesson_path);
  const exercises = JSON.parse(await read(lesson.exercises_path));
  assert.ok(body.includes('lesson_id: ' + lesson.lesson_id));
  assert.ok(body.includes('version: ' + lesson.revision));
  assert.equal(exercises.lesson_id, lesson.lesson_id);
  assert.equal(exercises.revision, lesson.revision);
  assert.equal(exercises.schema_version, 1);
  assert.equal(new Set(exercises.tasks.map(t => t.task_id)).size, exercises.tasks.length);
  for (const task of exercises.tasks) {
    for (const key of ['task_id', 'kind', 'required', 'prompt', 'constraints', 'answer_format', 'starter_code', 'checks', 'feedback_visibility', 'hints', 'rubric']) assert.ok(key in task);
    assert.ok(task.checks.length >= 2 && task.checks.length <= 3);
    assert.equal(task.rubric.length, 5);
    assert.deepEqual(task.hints.map(h => h.level), [1, 2, 3]);
  }
  for (const reinforcement of lesson.reinforcements ?? []) {
    assert.equal(reinforcement.status, 'prepared');
    const reinforcementBody = await read(reinforcement.lesson_path);
    const reinforcementExercises = JSON.parse(await read(reinforcement.exercises_path));
    assert.ok(reinforcementBody.includes('reinforcement_id: ' + reinforcement.reinforcement_id));
    assert.ok(reinforcementBody.includes('version: ' + reinforcement.revision));
    assert.equal(reinforcementExercises.reinforcement_id, reinforcement.reinforcement_id);
    assert.equal(reinforcementExercises.revision, reinforcement.revision);
    assert.equal(new Set(reinforcementExercises.tasks.map(t => t.task_id)).size, reinforcementExercises.tasks.length);
    for (const task of reinforcementExercises.tasks) {
      for (const key of ['task_id', 'kind', 'required', 'prompt', 'constraints', 'answer_format', 'starter_code', 'checks', 'feedback_visibility', 'hints', 'rubric']) assert.ok(key in task);
      assert.ok(task.checks.length >= 2 && task.checks.length <= 3);
      assert.equal(task.rubric.length, 5);
      assert.deepEqual(task.hints.map(h => h.level), [1, 2, 3]);
    }
  }
}
await import('../content/lessons/js-01/checks.mjs');
await import('../content/lessons/js-01/reinforcements/js-01-r1/checks.mjs');
console.log('Catalog and prepared content structure passed.');
