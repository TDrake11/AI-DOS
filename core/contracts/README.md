# AI-DOS Contract Registry

The Phase 1 canonical record format is JSON. Each record has:

- `kind`: stable record type;
- `schemaVersion`: contract version, currently `1.0`;
- `id`: stable project-defined identity;
- `extensions`: explicit namespace for compatible project or adapter fields.

`contract-schemas.json` is the machine-readable schema registry. `vocabulary.json` is the source for shared statuses and applicability values. Consumers must reject unknown `kind` or `schemaVersion`; they must not silently reinterpret a record.

The schemas intentionally do not describe every project-specific business field. Project-specific additions belong under `extensions` until a future contract version promotes them to a shared field.
