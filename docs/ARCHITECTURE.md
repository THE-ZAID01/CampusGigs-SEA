# Architecture

## Runtime components

```text
React/Vite client
        |
        | /api proxy in development
        v
Express API
        |
        v
PostgreSQL
```

The client is a single-page React application. Vite serves it during
development and proxies `/api` to the Express server. In production, the
client is built into `client/dist`; Express serves those static files and
continues to expose the API under `/api`.

## Client

- `client/src/App.jsx` defines routes and protected-route behavior.
- `client/src/api/axios.js` centralizes the API base URL, JWT header, and token
  storage.
- `client/src/context/AuthContext.jsx` owns login, logout, and current-user
  state.
- `client/src/pages` contains route-level screens.
- `client/src/components` contains reusable interface elements such as the
  shell, gig cards, modal, trust card, charts, and status stepper.

## Server

- `server/src/routes/index.js` maps HTTP routes to controllers.
- Controllers validate request-level input and shape responses.
- Services contain domain operations shared by controllers.
- `server/src/config/db.js` owns the PostgreSQL pool and transaction helper.
- `server/src/middleware/auth.js` verifies JWTs and attaches the user identity.
- `server/src/middleware/error.js` converts expected and unexpected failures to
  JSON responses.

## Data and transaction boundaries

The database schema contains users, gigs, bids, and wallet transactions. The
escrow service performs state transitions in one transaction and locks the
affected rows before checking balances or changing ownership/status. This
prevents:

- accepting two bids for the same gig
- spending the same wallet balance twice
- releasing escrow twice
- losing the owner's funds when a freelancer leaves

## Escrow invariants

1. A gig has at most one accepted bid.
2. The held amount is the accepted bid amount, never the gig's maximum budget.
3. A held amount is deducted from the owner's available balance.
4. Only the owner can request a revision or approve delivery.
5. Only the assigned freelancer can deliver or leave.
6. Approval releases escrow once and marks the gig completed.
7. Leaving an active gig reopens it and refunds the owner in full.

## Request flow

1. The client sends a request with a JWT when the endpoint is protected.
2. Authentication middleware verifies the token.
3. The controller validates the actor and input.
4. A service performs the domain operation, using `withTx` for stateful
   escrow/wallet changes.
5. The controller returns a mapped response or the error middleware returns a
   JSON error.
