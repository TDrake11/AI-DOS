import {
  CONTRACT_KINDS,
  getSchema,
} from '../contracts/index.js';

const DEPENDENCY_KINDS = new Set(['task', 'sprint']);
const PLACEHOLDER_PATTERN = /<[^>\r\n]+>/;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function typeMatches(value, expected) {
  if (expected === 'null') return value === null;
  if (expected === 'array') return Array.isArray(value);
  if (expected === 'object') return isObject(value);
  if (expected === 'integer') return Number.isInteger(value);
  return typeof value === expected;
}

function addDiagnostic(diagnostics, code, path, details = {}) {
  diagnostics.push({ code, path, ...details });
}

function validateSchema(value, schema, path, diagnostics) {
  if (Object.hasOwn(schema, 'const') && value !== schema.const) {
    addDiagnostic(diagnostics, 'CONST_VALUE', path, { expected: schema.const, value });
    return;
  }

  if (schema.enum && !schema.enum.includes(value)) {
    addDiagnostic(diagnostics, 'ENUM_VALUE', path, { expected: schema.enum, value });
    return;
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => typeMatches(value, type))) {
      addDiagnostic(diagnostics, 'TYPE_VALUE', path, { expected: types, value });
      return;
    }
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      addDiagnostic(diagnostics, 'MIN_LENGTH', path, { minimum: schema.minLength });
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      addDiagnostic(diagnostics, 'PATTERN_VALUE', path, { pattern: schema.pattern, value });
    }
    if (schema.format === 'date-time' && (Number.isNaN(Date.parse(value)) || !value.includes('T'))) {
      addDiagnostic(diagnostics, 'FORMAT_VALUE', path, { format: schema.format, value });
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      addDiagnostic(diagnostics, 'MIN_ITEMS', path, { minimum: schema.minItems });
    }
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) {
        addDiagnostic(diagnostics, 'UNIQUE_ITEMS', path);
      }
    }
    if (schema.items) {
      value.forEach((item, index) => validateSchema(item, schema.items, `${path}[${index}]`, diagnostics));
    }
  }

  if (isObject(value)) {
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) {
        addDiagnostic(diagnostics, 'REQUIRED_FIELD', `${path}.${required}`, { field: required });
      }
    }

    const properties = schema.properties ?? {};
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(properties, key)) {
        if (schema.additionalProperties === false) {
          addDiagnostic(diagnostics, 'ADDITIONAL_PROPERTY', `${path}.${key}`, { field: key });
        }
        continue;
      }
      validateSchema(value[key], properties[key], `${path}.${key}`, diagnostics);
    }

    if (isObject(schema.additionalProperties)) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(properties, key)) {
          validateSchema(value[key], schema.additionalProperties, `${path}.${key}`, diagnostics);
        }
      }
    }
  }
}

function findPlaceholders(value, path, diagnostics) {
  if (typeof value === 'string') {
    if (PLACEHOLDER_PATTERN.test(value)) {
      addDiagnostic(diagnostics, 'PLACEHOLDER_VALUE', path, { value });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => findPlaceholders(item, `${path}[${index}]`, diagnostics));
    return;
  }

  if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      findPlaceholders(child, `${path}.${key}`, diagnostics);
    }
  }
}

export function validateRecord(record) {
  if (!isObject(record)) {
    return {
      ok: false,
      diagnostics: [{ code: 'TYPE_VALUE', path: '$', expected: ['object'], value: record }],
    };
  }

  if (!CONTRACT_KINDS.includes(record.kind)) {
    return {
      ok: false,
      diagnostics: [{ code: 'UNKNOWN_CONTRACT_KIND', path: '$.kind', value: record.kind }],
    };
  }

  const diagnostics = [];
  validateSchema(record, getSchema(record.kind), '$', diagnostics);
  findPlaceholders(record, '$', diagnostics);

  return { ok: diagnostics.length === 0, diagnostics };
}

function collectDependencyEdges(records, ids, diagnostics) {
  const edges = new Map();

  records.forEach((record, index) => {
    if (!DEPENDENCY_KINDS.has(record?.kind) || typeof record.id !== 'string') return;
    const dependencies = Array.isArray(record.dependencies) ? record.dependencies : [];
    edges.set(record.id, []);
    dependencies.forEach((dependency, dependencyIndex) => {
      if (!ids.has(dependency)) {
        addDiagnostic(
          diagnostics,
          'UNKNOWN_DEPENDENCY',
          `$[${index}].dependencies[${dependencyIndex}]`,
          { recordId: record.id, dependency },
        );
        return;
      }
      edges.get(record.id).push(dependency);
    });
  });

  return edges;
}

function findDependencyCycles(edges, diagnostics) {
  const visiting = new Set();
  const visited = new Set();
  const stack = [];

  function visit(id) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      const cycleStart = stack.indexOf(id);
      const cycle = [...stack.slice(cycleStart), id];
      addDiagnostic(diagnostics, 'DEPENDENCY_CYCLE', '$.dependencies', { ids: cycle });
      return;
    }

    visiting.add(id);
    stack.push(id);
    for (const dependency of edges.get(id) ?? []) visit(dependency);
    stack.pop();
    visiting.delete(id);
    visited.add(id);
  }

  for (const id of edges.keys()) visit(id);
}

export function validateRecords(records) {
  if (!Array.isArray(records)) {
    return {
      ok: false,
      diagnostics: [{ code: 'TYPE_VALUE', path: '$', expected: ['array'], value: records }],
    };
  }

  const diagnostics = [];
  const ids = new Map();

  records.forEach((record, index) => {
    const result = validateRecord(record);
    diagnostics.push(...result.diagnostics.map((diagnostic) => ({
      ...diagnostic,
      path: diagnostic.path.replace('$', `$[${index}]`),
    })));

    if (typeof record?.id !== 'string') return;
    if (ids.has(record.id)) {
      addDiagnostic(diagnostics, 'DUPLICATE_ID', `$[${index}].id`, {
        id: record.id,
        firstIndex: ids.get(record.id),
      });
    } else {
      ids.set(record.id, index);
    }
  });

  const edges = collectDependencyEdges(records, new Set(ids.keys()), diagnostics);
  findDependencyCycles(edges, diagnostics);

  return { ok: diagnostics.length === 0, diagnostics };
}
