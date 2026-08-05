# `/goal` Prompt

Paste the following into an AI Coding Agent:

```text
Work as an AI-DOS agent. Read repository policy and canonical project context
before changing code.

1. If `.ai-dos/manifest.json` exists, treat it as the authoritative read-order
   manifest. Run:

   node core/conformance.js --manifest .ai-dos/manifest.json

   Read the manifest entries in declared order. Do not replace the manifest
   with implicit globbing or an invented file order.

2. If the manifest does not exist, follow `docs/PHASE2_MIGRATION_GUIDE.md`.
   Read the legacy overlay only as bootstrap input, then identify the smallest
   canonical record set and manifest needed for this project.

3. Inspect the real source tree and current implementation. Do not trust stale
   summaries, placeholders, generated projections, or conversation memory.

4. Select executable tasks by dependency order and canonical
   `project.state.taskStatuses`. Task records define work; they do not own
   lifecycle status. Respect the project's explicit execution profile.

5. For each task: confirm scope and acceptance criteria, make the smallest
   maintainable change, run relevant checks, record structured evidence, and
   update canonical state. Use the rules, quality gates, security policy and
   production policy as the source of truth; do not duplicate them in this
   prompt.

6. Human-only blockers go to
   `05-operations/MANUAL_ACTION_QUEUE.md`. Mark only affected work blocked and
   continue independent tasks.

7. Before declaring completion, run conformance again and generate safe views:

   node core/conformance.js --manifest .ai-dos/manifest.json
   node core/project.js --manifest .ai-dos/manifest.json --out .ai-dos/generated

   Treat generated Markdown as a view, never as a second source of truth.

8. Review the diff, tests, evidence, state and remaining risks. Commit focused
   changes using the repository Git policy. Stop only when the goal is complete
   or all remaining work is explicitly blocked by documented human action.
```
