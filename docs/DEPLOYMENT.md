# Deployment

This project supports a single-server deployment and a separately hosted
client/API deployment.

## Production checklist

- Use a managed PostgreSQL database.
- Set a long, random `JWT_SECRET`.
- Set `DB_SSL=true` when required by the database provider.
- Set `CLIENT_ORIGIN` to the exact deployed client origin.
- Set `ALLOWED_DOMAINS` to the domains that may register.
- Do not seed demo accounts in a production database.
- Do not commit `.env` files or real credentials.
- Use HTTPS for the client and API.
- Set a platform health check to `GET /api/health`.

## Single-server deployment

The Express server serves `client/dist` when it exists:

```bash
npm ci
npm ci --prefix server
npm ci --prefix client
npm run db:setup
npm run build
npm start
```

The server listens on `PORT` and exposes both the client and API. For a hosted
database, set `DATABASE_URL` and the other server variables before running the
commands. The setup command is intended for a new database; review
`server/db/setup.js` before using it in an existing production environment.

## Separate client and API

Build the client with the API URL:

```text
VITE_API_URL=https://api.example.com/api
```

Set the API's `CLIENT_ORIGIN` to the deployed client URL, for example:

```text
CLIENT_ORIGIN=https://campusgigs.example.com
```

Build and publish `client/dist` to the static host. Deploy the `server`
directory as a Node.js service. The API health check is:

```text
https://api.example.com/api/health
```

## Docker database for local development

```bash
docker compose up -d
docker compose ps
npm run db:setup
```

Stop the container when finished:

```bash
docker compose down
```

The named Docker volume persists data. Use `docker compose down -v` only when
you intentionally want to delete the local database volume.
