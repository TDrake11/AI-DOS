# AI-DOS Phase 1 Migration Guide

## 1. Purpose

This guide moves a project from the current Markdown-first AI-DOS layout to Phase 1 canonical JSON records. It is intentionally manual and reversible. No existing project file is deleted or rewritten by the Phase 1 core.

## 2. Migration boundary

Phase 1 migrates the contract data needed for context, planning, manual actions, evidence and state. It does not migrate prompts into a renderer, generate Markdown projections, install adapters or change the project source code.

## 3. Preconditions

- Node.js 20 or newer is available.
- `00-project/PROJECT_INFO.md` and `TECH_STACK.md` have real project values, not placeholders.
- Active roadmap and task files are distinguishable from `07-tasks/examples/`.
- No real secrets are present in Markdown records to be copied.

## 4. Steps

### Step 1 — Inventory

Read the project context, roadmap, active sprint/task files, Manual Action Queue and current state. Record every active task ID and dependency. Do not treat example tasks as active work.

### Step 2 — Create project profile

Create a `project.profile` JSON record from `PROJECT_INFO.md` and `TECH_STACK.md`:

- use a stable project ID such as `PROJECT:EXAMPLE`;
- copy repository type, primary branch and target version;
- set `capabilities.deployment` and `capabilities.productionVerification` explicitly;
- place provider-specific or project-specific fields under `extensions`;
- replace every placeholder before validation.

### Step 3 — Create roadmap and sprint records

Create one `roadmap` record and one `sprint` record per active sprint. Preserve sprint order through `sprintIds`. Map entry/exit criteria and release criteria as arrays of measurable statements.

### Step 4 — Create task records

Create one `task` record per active task:

- preserve the existing ID where it is unique and stable;
- copy title, category, priority, objective, acceptance criteria and verification;
- copy dependencies without inventing missing edges;
- set applicability for tests, deployment and production verification;
- keep example tasks outside the active record set.

Do not copy lifecycle status into the task record. Capture it in the `project.state.taskStatuses` map in Step 6.

### Step 5 — Create Manual Action and evidence records

Convert each active Manual Action into one `manual_action` record. Extract verification commands/results from task, QA and operations records into `evidence` records. Never copy passwords, tokens, private keys or secret values.

### Step 6 — Build canonical state

Create `project.state` from the task records and the legacy task statuses. The state map must contain exactly one status for every active task ID. Set `currentTaskId` only when an agent is actively working. Keep the legacy `10-state/TASK_STATUS.md` unchanged until a later projection workflow is available.

### Step 7 — Validate

Validate all records together so duplicate IDs and dependency cycles are detected across files:

```text
node core/validate.js project.profile.json roadmap.json sprint.json task-001.json state.json
```

Expected result:

```json
{
  "ok": true,
  "diagnostics": []
}
```

Do not proceed when diagnostics contain `PLACEHOLDER_VALUE`, `DUPLICATE_ID`, `UNKNOWN_DEPENDENCY` or `DEPENDENCY_CYCLE`.

### Step 8 — Dual-read handoff

Until Phase 2 projection exists, agents should read canonical JSON for machine state and the existing Markdown files for policy/context. If they disagree, stop the affected task and record the conflict as a Manual Action or migration issue; do not silently choose a value.

## 5. Rollback

To roll back a Phase 1 migration, remove only the newly created canonical record files and retain the original Markdown files. Do not use rollback to erase evidence or hide a failed migration; record the reason in the project changelog.

## 6. Future version migration

For a newer contract major:

1. read the compatibility matrix;
2. run the old validator and save evidence;
3. copy records to a migration workspace;
4. transform fields explicitly and preserve old IDs;
5. validate with the new contract;
6. review changed semantics with a human;
7. update project state only after the new records pass.

Never silently upgrade a record by changing only `schemaVersion`.
