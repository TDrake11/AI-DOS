import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { buildReadPlan, loadManifest } from '../manifest/index.js';
import { validateRecords } from '../validation/index.js';

const ACTIVE_STATUSES = new Set([
  'IN_PROGRESS',
  'PARTIAL',
  'READY_FOR_DEPLOY',
  'DEPLOYING',
  'VERIFYING_PRODUCTION',
]);
const BLOCKED_STATUSES = new Set(['WAITING_MANUAL', 'BLOCKED_DEPENDENCY', 'FAILED']);

function diagnostic(code, path, details = {}, severity = 'error') {
  return { code, path, severity, ...details };
}

function isError(diagnosticEntry) {
  return diagnosticEntry.severity !== 'warning';
}

function readCanonicalRecords(plan, diagnostics) {
  const records = [];

  for (const entry of plan.entries.filter(({ role }) => role === 'canonical_record')) {
    if (!entry.exists) continue;

    let parsed;
    try {
      parsed = JSON.parse(readFileSync(entry.absolutePath, 'utf8'));
    } catch (error) {
      diagnostics.push(diagnostic('RECORD_INPUT_ERROR', entry.path, { message: error.message }));
      continue;
    }

    const loaded = Array.isArray(parsed) ? parsed : [parsed];
    loaded.forEach((record, index) => {
      if (entry.recordKind && record?.kind !== entry.recordKind) {
        diagnostics.push(diagnostic(
          'MANIFEST_RECORD_KIND_MISMATCH',
          `${entry.path}[${index}].kind`,
          { expected: entry.recordKind, value: record?.kind },
        ));
      }
      records.push(record);
    });
  }

  return records;
}

function resolveExecutionProfile(profile, diagnostics) {
  if (profile.executionProfile) return profile.executionProfile;

  const { deployment, productionVerification } = profile.capabilities;
  const inferred = deployment === 'REQUIRED' && productionVerification === 'REQUIRED'
    ? 'production_required'
    : deployment === 'NOT_APPLICABLE' && productionVerification === 'NOT_APPLICABLE'
      ? 'not_applicable'
      : 'deployment_optional';
  diagnostics.push(diagnostic(
    'PROFILE_INFERRED',
    '$.executionProfile',
    { value: inferred },
    'warning',
  ));
  return inferred;
}

function validateProfileCapabilities(profile, executionProfile, diagnostics) {
  const capabilities = profile.capabilities;
  const allowed = {
    production_required: [['REQUIRED'], ['REQUIRED']],
    deployment_optional: [['OPTIONAL', 'NOT_APPLICABLE'], ['OPTIONAL', 'NOT_APPLICABLE']],
    not_applicable: [['NOT_APPLICABLE'], ['NOT_APPLICABLE']],
  }[executionProfile];

  if (!allowed) return;
  const actual = [capabilities.deployment, capabilities.productionVerification];
  if (!actual.every((value, index) => allowed[index].includes(value))) {
    diagnostics.push(diagnostic('PROFILE_CAPABILITY_MISMATCH', '$.capabilities', {
      executionProfile,
      expected: allowed,
      value: capabilities,
    }));
  }
}

function requiredEvidenceKinds(task) {
  const kinds = [];
  if (task.applicability.tests === 'REQUIRED') kinds.push('TEST');
  if (task.applicability.deployment === 'REQUIRED') kinds.push('DEPLOY');
  if (task.applicability.productionVerification === 'REQUIRED') kinds.push('PRODUCTION');
  return kinds;
}

function findMissingEvidence(tasks, evidenceRecords, diagnostics) {
  const passedChecks = new Map();
  for (const evidence of evidenceRecords) {
    const passed = new Set(
      evidence.checks
        .filter(({ status }) => status === 'PASS')
        .map(({ kind }) => kind),
    );
    passedChecks.set(evidence.taskId, new Set([...(passedChecks.get(evidence.taskId) ?? []), ...passed]));
  }

  const missingTaskIds = [];
  for (const task of tasks) {
    const required = requiredEvidenceKinds(task);
    const passed = passedChecks.get(task.id) ?? new Set();
    const missing = required.filter((kind) => !passed.has(kind));
    if (missing.length === 0) continue;

    missingTaskIds.push(task.id);
    diagnostics.push(diagnostic('MISSING_REQUIRED_EVIDENCE', `$.tasks.${task.id}`, {
      taskId: task.id,
      missingKinds: missing,
    }));
  }

  return missingTaskIds;
}

export function conformProject({ manifestPath, projectRoot = dirname(manifestPath) }) {
  const loaded = loadManifest(manifestPath);
  if (!loaded.ok) {
    return {
      ok: false,
      diagnostics: loaded.diagnostics,
      summary: {
        recordCount: 0,
        activeTaskIds: [],
        blockedTaskIds: [],
        missingEvidenceTaskIds: [],
        readEntryIds: [],
      },
    };
  }

  const plan = buildReadPlan(loaded.manifest, projectRoot);
  const diagnostics = [...plan.diagnostics];
  const records = readCanonicalRecords(plan, diagnostics);
  const validation = validateRecords(records);
  diagnostics.push(...validation.diagnostics);

  const profiles = records.filter(({ kind }) => kind === 'project.profile');
  const states = records.filter(({ kind }) => kind === 'project.state');
  const tasks = records.filter(({ kind }) => kind === 'task');
  const evidence = records.filter(({ kind }) => kind === 'evidence');
  const profile = profiles[0];
  const state = states[0];

  if (profiles.length === 0) diagnostics.push(diagnostic('MISSING_PROJECT_PROFILE', '$.records'));
  if (states.length === 0) diagnostics.push(diagnostic('MISSING_PROJECT_STATE', '$.records'));

  let executionProfile;
  if (profile) {
    executionProfile = resolveExecutionProfile(profile, diagnostics);
    validateProfileCapabilities(profile, executionProfile, diagnostics);
  }

  if (profile && state && profile.id !== state.projectId) {
    diagnostics.push(diagnostic('PROJECT_ID_MISMATCH', '$.project.state.projectId', {
      expected: profile.id,
      value: state.projectId,
    }));
  }

  const missingEvidenceTaskIds = findMissingEvidence(tasks, evidence, diagnostics);
  const taskStatuses = state?.taskStatuses ?? {};
  const activeTaskIds = tasks
    .map(({ id }) => id)
    .filter((id) => ACTIVE_STATUSES.has(taskStatuses[id]));
  const blockedTaskIds = tasks
    .map(({ id }) => id)
    .filter((id) => BLOCKED_STATUSES.has(taskStatuses[id]));

  const summary = {
    executionProfile,
    recordCount: records.length,
    taskCount: tasks.length,
    activeTaskIds,
    blockedTaskIds,
    missingEvidenceTaskIds,
    readEntryIds: plan.entries.map(({ id }) => id),
  };

  return {
    ok: diagnostics.every((entry) => !isError(entry)),
    diagnostics,
    summary,
  };
}
