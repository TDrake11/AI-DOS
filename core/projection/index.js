import { existsSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, join } from 'node:path';

const LEGACY_ROOTS = new Set([
  '00-project',
  '01-goal',
  '02-rules',
  '03-development',
  '04-quality',
  '05-operations',
  '06-roadmap',
  '07-tasks',
  '08-qa',
  '09-prompts',
  '10-state',
]);

function cell(value) {
  return String(value ?? '—').replaceAll('|', '\\|').replaceAll(/\r?\n/g, '<br>');
}

function sorted(records, kind) {
  return records
    .filter((record) => record?.kind === kind)
    .sort((left, right) => String(left.id).localeCompare(String(right.id)));
}

function getState(records) {
  return records.find((record) => record?.kind === 'project.state');
}

export function renderProjectSummary(records, context = {}) {
  const profile = records.find((record) => record?.kind === 'project.profile');
  const state = getState(records);
  const executionProfile = context.executionProfile ?? profile?.executionProfile ?? 'unknown';
  const generatedAt = context.generatedAt ?? 'deterministic';

  return [
    '# AI-DOS Project Summary',
    '',
    `- Project: ${cell(profile?.name ?? profile?.id)}`,
    `- Project ID: ${cell(profile?.id)}`,
    `- Target version: ${cell(profile?.targetVersion)}`,
    `- Execution profile: ${cell(executionProfile)}`,
    `- Lifecycle status: ${cell(state?.status)}`,
    `- Generated at: ${cell(generatedAt)}`,
    '',
    'This file is generated from canonical AI-DOS records. Edit the source records, not this projection.',
    '',
  ].join('\n');
}

export function renderTaskStatus(records) {
  const state = getState(records);
  const tasks = sorted(records, 'task');
  const statuses = state?.taskStatuses ?? {};

  const lines = [
    '# AI-DOS Task Status',
    '',
    '| Task | Title | Status | Current |',
    '| --- | --- | --- | --- |',
  ];
  for (const task of tasks) {
    lines.push(`| ${cell(task.id)} | ${cell(task.title)} | ${cell(statuses[task.id] ?? 'UNKNOWN')} | ${task.id === state?.currentTaskId ? 'YES' : ''} |`);
  }
  if (tasks.length === 0) lines.push('| — | No tasks | — | — |');
  lines.push('', 'Generated projection; canonical lifecycle state is stored in `project.state.taskStatuses`.', '');
  return lines.join('\n');
}

export function renderEvidenceSummary(records) {
  const evidence = sorted(records, 'evidence');
  const lines = [
    '# AI-DOS Evidence Summary',
    '',
    '| Evidence | Task | Check kind | Check | Status | Command |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const record of evidence) {
    for (const check of record.checks ?? []) {
      lines.push(`| ${cell(record.id)} | ${cell(record.taskId)} | ${cell(check.kind)} | ${cell(check.name)} | ${cell(check.status)} | ${cell(check.command)} |`);
    }
  }
  if (evidence.length === 0) lines.push('| — | — | — | No evidence | — | — |');
  lines.push('', 'Generated projection; evidence is valid only when recorded in canonical evidence records.', '');
  return lines.join('\n');
}

function isInside(root, target) {
  const relativePath = relative(root, target);
  return relativePath !== '..'
    && !relativePath.startsWith('..\\')
    && !relativePath.startsWith('../')
    && !isAbsolute(relativePath);
}

function isLegacyOutput(root, target) {
  const relativePath = relative(root, target);
  const firstSegment = relativePath.split(/[\\/]/)[0];
  return LEGACY_ROOTS.has(firstSegment);
}

function unsafeOutput(root, output) {
  return output === root || !isInside(root, output) || isLegacyOutput(root, output);
}

function outputDiagnostic(message, output) {
  return { code: 'OUTPUT_PATH_UNSAFE', path: output, message };
}

export function writeProjections({ records, projectRoot, outputDir, context = {} }) {
  const root = resolve(projectRoot);
  if (typeof outputDir !== 'string' || outputDir.length === 0) {
    return { ok: false, files: [], diagnostics: [outputDiagnostic('Output must be a generated directory below the project root.', String(outputDir))] };
  }
  const output = resolve(root, outputDir);
  if (unsafeOutput(root, output)) {
    return { ok: false, files: [], diagnostics: [outputDiagnostic('Output must be a generated directory below the project root.', output)] };
  }

  try {
    mkdirSync(output, { recursive: true });
    const physicalOutput = realpathSync(output);
    if (unsafeOutput(root, physicalOutput)) {
      return { ok: false, files: [], diagnostics: [outputDiagnostic('Output resolves outside the generated directory.', output)] };
    }

    const contents = new Map([
      ['PROJECT_SUMMARY.md', renderProjectSummary(records, context)],
      ['TASK_STATUS.md', renderTaskStatus(records)],
      ['EVIDENCE_SUMMARY.md', renderEvidenceSummary(records)],
    ]);
    const files = [];
    for (const [name, content] of contents) {
      const target = join(output, name);
      if (existsSync(target) && unsafeOutput(root, realpathSync(target))) {
        return { ok: false, files: [], diagnostics: [outputDiagnostic('Projection target resolves to a protected path.', target)] };
      }
      writeFileSync(target, content, 'utf8');
      files.push(target);
    }
    return { ok: true, files, diagnostics: [] };
  } catch (error) {
    return { ok: false, files: [], diagnostics: [{ code: 'OUTPUT_ERROR', path: output, message: error.message }] };
  }
}
