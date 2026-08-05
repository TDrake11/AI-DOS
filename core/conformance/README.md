# Conformance boundary

The conformance module is the project-level gate after the manifest read plan.
It validates every canonical record, checks profile capabilities, verifies the
canonical project/state relationship, and reports active, blocked, and
missing-evidence tasks.

Conformance is local and deterministic. It does not run commands, call a
network, or infer deployment success from a commit. A warning does not fail
the result; an invalid contract, missing required path, profile contradiction,
or missing required evidence does.
