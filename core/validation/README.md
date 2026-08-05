# AI-DOS Validation Module

Phase 1 validation is intentionally dependency-free and schema-driven. It validates the JSON Schema keywords used by the Phase 1 registry:

- `type`, `const`, `enum`;
- `required`, `properties`, `additionalProperties`;
- `minLength`, `minItems`, `uniqueItems`, `items`, `pattern`;
- the `date-time` format used by evidence/state timestamps.

It also validates cross-record invariants that a single JSON Schema cannot express:

- placeholder values;
- duplicate record IDs;
- unknown task/sprint dependencies;
- circular task/sprint dependencies.

Diagnostics use stable `code` values and JSON paths. A full JSON Schema implementation, Markdown projection and richer conformance reporting are Phase 2 concerns.

The reproducible entry point is:

```text
node core/validate.js <record.json> [more-records.json]
```
