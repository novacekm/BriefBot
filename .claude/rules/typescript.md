---
globs:
  - "lib/**/*.ts"
  - "lib/**/*.tsx"
  - "app/**/*.ts"
  - "app/**/*.tsx"
  - "components/**/*.ts"
  - "components/**/*.tsx"
---

# TypeScript Rules

## Strict Type Safety

- Never use `any` - use `unknown` and narrow with type guards
- Always define explicit return types for exported functions
- Use discriminated unions for complex state
- Prefer `interface` for object shapes, `type` for unions/intersections

## Imports

- Use `@/` path alias for absolute imports
- Group imports: external → internal → types → styles
- Prefer named exports over default exports

## Patterns

- Use `satisfies` for type-safe object literals
- Prefer `const` assertions for literal types
- Use `as const` for immutable arrays and objects

## Error Handling

- Define typed error classes extending `Error`
- Use Result types (`{ success: true, data } | { success: false, error }`)
- Never throw from Server Actions - return error objects
