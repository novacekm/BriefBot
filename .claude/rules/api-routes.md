---
globs:
  - "app/api/**/*.ts"
  - "app/api/**/*.tsx"
---

# API Route Rules

## Security First

- Always validate authentication with `auth()`
- Return 401 for unauthenticated requests
- Return 403 for unauthorized access (wrong user)
- Never expose internal error details to clients

## Input Validation

- Validate all request body with Zod schemas
- Sanitize file uploads (type, size, content)
- Rate limit sensitive endpoints (auth, upload)

## Response Format

- Use consistent response shapes: `{ success, data?, error? }`
- Include appropriate HTTP status codes
- Set proper CORS headers when needed

## Swiss Compliance (nFADP)

- Log access to PII for audit trails
- Support data export (DSGVO/nFADP right)
- Implement deletion endpoints for user data
- Never log sensitive document content

## Performance

- Use streaming for large responses
- Implement proper caching headers
- Consider background jobs for heavy processing
