import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const packageManifest = JSON.parse(readFileSync('package.json', 'utf8'));
const compatibility = JSON.parse(readFileSync('core/contracts/compatibility.json', 'utf8'));
const projectState = JSON.parse(readFileSync('10-state/PROJECT_STATE.json', 'utf8'));

test('framework release metadata is aligned for the Phase 2 minor release', () => {
  assert.equal(packageManifest.version, '1.1.0');
  assert.equal(compatibility.frameworkVersion, packageManifest.version);
  assert.equal(projectState.ai_dos_version, packageManifest.version);
  assert.equal(compatibility.contractVersion, '1.0');
});
