# AI-DOS State Module

The state module owns task lifecycle transitions and project-level status derivation. It is intentionally pure:

- it does not read or write files;
- it does not validate the complete JSON Schema;
- it does not infer deployment capability;
- it returns structured diagnostics for expected invalid transitions;
- it returns a new state object instead of mutating the input.

Schema validation belongs to `core/validation`; persistence and Markdown projections are outside Phase 1.
