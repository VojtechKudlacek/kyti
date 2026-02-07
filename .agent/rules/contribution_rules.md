---
trigger: always_on
---

# Contribution Rules

> [!IMPORTANT]
> **All changes must be verified locally before pushing.**

## Package Management
- **ALWAYS** use `pnpm`.
- **NEVER** use `npm` or `yarn`.

## Code Quality
- **No Unused Exports**: Do not export functions, classes, or variables unless they are imported and used elsewhere.
- **No `any`**: Avoid using the `any` type in TypeScript. Use specific types or `unknown` if necessary.

## Verification Checklist
Always run the following checks:
- **Server**: `pnpm server:build && pnpm server:check`
- **Website**: `pnpm website:build && pnpm website:check`
