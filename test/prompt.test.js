import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const goalPrompt = readFileSync('09-prompts/GOAL_PROMPT.md', 'utf8');
const reviewPrompt = readFileSync('09-prompts/REVIEW_PROMPT.md', 'utf8');
const bugfixPrompt = readFileSync('09-prompts/BUGFIX_PROMPT.md', 'utf8');

test('goal prompt is a thin manifest-first orchestrator', () => {
  assert.match(goalPrompt, /\.ai-dos\/manifest\.json/);
  assert.match(goalPrompt, /core\/conformance\.js/);
  assert.match(goalPrompt, /core\/project\.js/);
  assert.match(goalPrompt, /project\.state\.taskStatuses/);
  assert.match(goalPrompt, /MANUAL_ACTION_QUEUE/);
  assert.doesNotMatch(goalPrompt, /Confirm deployment was triggered/);
  assert.doesNotMatch(goalPrompt, /all tasks in 07-tasks/);
});

test('review prompt delegates policy to canonical rules and conformance', () => {
  assert.match(reviewPrompt, /core\/conformance\.js/);
  assert.match(reviewPrompt, /execution profile/);
  assert.match(reviewPrompt, /structured evidence/);
  assert.doesNotMatch(reviewPrompt, /deploy and production-test when required/);
});

test('bugfix prompt follows profile applicability instead of assuming production', () => {
  assert.match(bugfixPrompt, /manifest/);
  assert.match(bugfixPrompt, /structured evidence/);
  assert.match(bugfixPrompt, /execution profile/);
  assert.doesNotMatch(bugfixPrompt, /monitor deployment and retest production/);
});
