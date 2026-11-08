# Contributing

## Local workflow

1. Create a branch for the change.
2. Install dependencies with `npm run install:all`.
3. Start PostgreSQL and initialize the database.
4. Run `npm run dev`.
5. Make the smallest change that addresses the issue.
6. Run the relevant tests and production build.
7. Update documentation when behavior or configuration changes.

## Validation commands

Run from the repository root:

```bash
npm run test:flow
npm run build
```

The flow test uses throw-away accounts and exercises the escrow and wallet
rules. It requires the API and PostgreSQL database to be available.

## Code guidelines

- Keep controllers focused on HTTP concerns and put domain logic in services.
- Reuse the existing database transaction helper for stateful operations.
- Preserve the API response shape used by the client.
- Validate user-controlled input at the API boundary.
- Do not log passwords, JWTs, database URLs, or payment data.
- Keep secrets in local environment files; commit only `.env.example` files.
- Update the relevant documentation when adding an endpoint or environment
  variable.

## Pull requests

Include:

- a short description of the behavior change
- the validation commands that were run
- database or environment changes, if any
- screenshots for meaningful UI changes

Do not include local `.env` files, database dumps, `node_modules`, or build
artifacts in commits.
