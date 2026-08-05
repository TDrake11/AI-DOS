# Read-order manifest

`read_order.manifest` is the deterministic entry point for an AI-DOS project.
It declares literal paths in the order an agent should read them, whether each
path is required, and where generated projections may be written.

The read plan resolves paths below the supplied project root only. Duplicate
entry IDs or paths are invalid. Missing required paths are errors; missing
optional paths are warnings. The module performs no network access and does
not discover files implicitly.
