# Projection boundary

Projection renderers convert canonical records into deterministic Markdown
views for agents and humans. They do not mutate records or execute commands.

`writeProjections` writes only generated files below the project root and
rejects legacy source roots (`00-project` through `10-state`), outside paths,
and symlink-resolved targets that leave the safe output directory.
