# Review Prompt

```text
Review the implementation against the active task contract, acceptance
criteria, Definition of Done, applicable rules, execution profile and evidence.

Read the canonical manifest and run conformance before reviewing the diff:

node core/conformance.js --manifest .ai-dos/manifest.json

Inspect correctness, security, authorization, data integrity, regression risk,
performance, accessibility and maintainability. Identify only actionable
findings, fix approved issues, rerun relevant checks, update structured evidence
and canonical state, and leave generated Markdown as a projection of canonical data.
If human-only access is required, record a precise Manual Action and continue
independent review work.
```
